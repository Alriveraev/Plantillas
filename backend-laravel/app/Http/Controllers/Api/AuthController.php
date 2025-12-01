<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use PragmaRX\Google2FA\Google2FA;

class AuthController extends Controller
{
    /**
     * Paso 1: Login Inicial
     * Verifica usuario y contraseña. Si el 2FA está activo, detiene el proceso
     * pidiendo el código. Si no, completa el login.
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        // Intentamos autenticar con credenciales básicas
        if (!Auth::attempt($request->only('email', 'password'), $request->boolean('remember'))) {
            return response()->json([
                'message' => 'Credenciales incorrectas.'
            ], 401);
        }

        $user = Auth::user();

        // 1. Kill Switch: Verificar si el usuario está baneado/inactivo
        if (!$user->is_active) {
            Auth::guard('web')->logout();
            $request->session()->invalidate();
            return response()->json([
                'message' => 'Tu cuenta ha sido desactivada. Contacta al administrador.'
            ], 403);
        }

        // ---------------------------------------------------------
        // VALIDACIÓN 2: Correo Verificado (NUEVO)
        // ---------------------------------------------------------
        if (!$user->email_verified_at) {
            $this->forceLogout($request); // Importante: Cerrar sesión porque Auth::attempt ya la había iniciado

            return response()->json([
                'message' => 'Debes verificar tu correo electrónico antes de iniciar sesión.',
                'error_code' => 'EMAIL_NOT_VERIFIED', // Útil para que el frontend muestre un botón de "Reenviar correo"
                // 'resend_link' => route('verification.send') // Opcional si implementas la ruta
            ], 403);
        }

        // 3. Lógica de 2FA (Opcional)
        // Solo si el usuario configuró y confirmó el 2FA anteriormente
        if ($user->two_factor_confirmed_at) {
            // Marcamos en la sesión que estamos en proceso de 2FA
            $request->session()->put('auth.2fa_pending', true);

            return response()->json([
                'message' => 'Credenciales correctas. Se requiere código de verificación.',
                'require_2fa' => true,
                // NO enviamos el UserResource completo aquí por seguridad
            ]);
        }

        // 4. Si no tiene 2FA, completamos el login inmediatamente
        $this->completeLogin($request, $user);

        return response()->json([
            'message' => 'Bienvenido al sistema.',
            'require_2fa' => false,
            'user' => new UserResource($user->load('role.permissions')),
        ]);
    }

    /**
     * Paso 2: Verificación de Código 2FA
     * Este endpoint se llama solo si el login anterior devolvió { require_2fa: true }
     */
    public function verifyTwoFactor(Request $request)
    {
        $request->validate([
            'code' => ['required', 'string', 'size:6'], // Códigos TOTP estándar
        ]);

        $user = Auth::user();

        // Seguridad: Si el usuario no tiene 2FA activo en DB, no debería estar aquí.
        if (!$user || !$user->two_factor_confirmed_at) {
            return response()->json(['message' => 'Doble factor no configurado.'], 400);
        }

        $google2fa = new Google2FA();

        // Verificamos el código contra el secreto desencriptado del usuario
        // El parámetro '1' permite un desfase de tiempo de +/- 30 segundos (window)
        $valid = $google2fa->verifyKey($user->google2fa_secret, $request->code, 1);

        if ($valid) {
            // Validación Exitosa
            $request->session()->forget('auth.2fa_pending');
            $request->session()->put('auth.2fa_verified', true);

            // Completamos auditoría y regeneración de sesión
            $this->completeLogin($request, $user);

            return response()->json([
                'message' => 'Verificación exitosa.',
                'user' => new UserResource($user->load('role.permissions')),
            ]);
        }

        return response()->json(['message' => 'El código proporcionado es inválido o ha expirado.'], 422);
    }

    /**
     * Cerrar Sesión (Logout)
     */
    public function logout(Request $request)
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['message' => 'Sesión cerrada correctamente.']);
    }

    /**
     * Obtener usuario autenticado (/me)
     */
    public function user(Request $request)
    {
        return new UserResource($request->user()->load('role.permissions'));
    }

    /**
     * Seguridad: Cerrar sesiones en OTROS dispositivos
     * Útil si el usuario sospecha que le robaron la clave.
     */
    public function logoutOthers(Request $request)
    {
        $request->validate(['password' => 'required']);

        $user = $request->user();

        if (!Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'password' => ['La contraseña es incorrecta.'],
            ]);
        }

        // Esta función de Laravel invalida todas las sesiones en la tabla 'sessions'
        // que pertenezcan a este usuario, EXCEPTO la actual.
        Auth::logoutOtherDevices($request->password);

        return response()->json(['message' => 'Se han cerrado las sesiones en todos los demás dispositivos.']);
    }

    /**
     * Helper Privado: Finaliza el proceso de login
     * Se usa tanto en login directo como después del 2FA.
     */
    private function completeLogin(Request $request, User $user): void
    {
        // 1. Regenerar ID de sesión para prevenir Session Fixation
        $request->session()->regenerate();

        // 2. Auditoría: Guardamos cuándo y desde dónde entró
        // Usamos forceFill para asegurar que se guarde aunque no esté en $fillable
        $user->forceFill([
            'last_login_at' => now(),
            'last_ip' => $request->ip(),
        ])->save();
    }


    /**
     * Cierra la sesión y limpia cookies (Usado para logout y bloqueos de seguridad)
     */
    private function forceLogout(Request $request): void
    {
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
    }
}
