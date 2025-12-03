<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Cache; // Importar Cache
use App\Models\User;

class PasswordResetController extends Controller
{
    public function sendResetLink(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        // Intentamos enviar el link.
        // Laravel maneja internamente si el usuario existe o no.
        $status = Password::sendResetLink(
            $request->only('email')
        );

        // SIN IMPORTAR el resultado ($status), siempre retornamos éxito al frontend.
        // Así el atacante siempre ve un 200 OK.
        return response()->json([
            'status' => 'success',
            'message' => 'Si el correo existe, se ha enviado el enlace.'
        ]);
    }

    /**
     * Paso Intermedio: Verificar Token
     * AHORA: Solo permite verificar una vez.
     */
    public function verifyToken(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'token' => 'required'
        ]);

        // 1. Generamos una llave única para el Cache basada en el token
        // Usamos hash para que la llave sea segura y corta
        $cacheKey = 'reset_token_viewed_' . md5($request->token);

        // 2. Verificamos si este token ya fue "visto" o verificado antes
        if (Cache::has($cacheKey)) {
            return response()->json([
                'valid' => false,
                'message' => 'Este enlace ya ha sido utilizado o verificado anteriormente.'
            ], 400);
        }

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['valid' => false, 'message' => 'El enlace no es válido.'], 400);
        }

        // 3. Verificamos si es válido en la base de datos
        if (Password::tokenExists($user, $request->token)) {

            // 4. IMPORTANTE: Marcamos el token como "usado" en el Cache por 60 minutos.
            // Esto impide que verifyToken se llame de nuevo con éxito,
            // pero MANTIENE el token en la BD para que la función reset() pueda usarlo.
            Cache::put($cacheKey, true, now()->addMinutes(60));

            return response()->json(['valid' => true, 'message' => 'Token válido.']);
        }

        return response()->json(['valid' => false, 'message' => 'El enlace ha caducado o no es válido.'], 400);
    }

    /**
     * Paso 2: Resetear Password
     */
    public function reset(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|confirmed|min:8',
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, string $password) use ($request) { // Pasamos $request al closure
                $user->forceFill([
                    'password' => Hash::make($password)
                ])->setRememberToken(Str::random(60));

                $user->save();

                event(new PasswordReset($user));

                // Opcional: Limpiar el cache una vez reseteado exitosamente,
                // aunque no es estrictamente necesario ya que expira solo.
                Cache::forget('reset_token_viewed_' . md5($request->token));
            }
        );

        if ($status === Password::PASSWORD_RESET) {
            return response()->json(['message' => __($status)]);
        }

        throw ValidationException::withMessages(['email' => [__($status)]]);
    }
}
