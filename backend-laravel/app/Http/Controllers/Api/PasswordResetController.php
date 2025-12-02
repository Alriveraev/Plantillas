<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Support\Str;
use App\Models\User; // Necesario para buscar al usuario

class PasswordResetController extends Controller
{
    /**
     * Paso 1: Enviar Link
     */
    public function sendResetLink(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $status = Password::sendResetLink(
            $request->only('email')
        );

        if ($status === Password::RESET_LINK_SENT) {
            return response()->json(['message' => __($status)]);
        }

        throw ValidationException::withMessages(['email' => [__($status)]]);
    }

    /**
     * Paso Intermedio: Verificar si el token es válido (Para UX del Frontend)
     * React llama a esto al cargar la página de reset.
     */
    public function verifyToken(Request $request)
    {
        // Validamos que vengan los datos
        $request->validate([
            'email' => 'required|email',
            'token' => 'required'
        ]);

        // Buscamos al usuario (si no existe, el token es inválido por definición)
        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['valid' => false, 'message' => 'Usuario no encontrado.'], 404);
        }

        // Usamos el Facade de Password para verificar criptográficamente el token
        // y su fecha de expiración automáticamente.
        if (Password::tokenExists($user, $request->token)) {
            return response()->json(['valid' => true, 'message' => 'Token válido.']);
        }

        return response()->json(['valid' => false, 'message' => 'El enlace ha caducado o es inválido.'], 400);
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
            function ($user, string $password) {
                $user->forceFill([
                    'password' => Hash::make($password)
                ])->setRememberToken(Str::random(60));

                $user->save();

                event(new PasswordReset($user));
            }
        );

        if ($status === Password::PASSWORD_RESET) {
            return response()->json(['message' => __($status)]);
        }

        throw ValidationException::withMessages(['email' => [__($status)]]);
    }
}
