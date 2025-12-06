<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Crypt; // Para encriptar secretos
use Illuminate\Support\Str; // Para generar códigos aleatorios
use Illuminate\Validation\ValidationException;
use PragmaRX\Google2FA\Google2FA;

class TwoFactorManageController extends Controller
{
    /**
     * 1. Activar (Paso 1): Generar Secreto y QR
     * El usuario ve el código QR pero aún no está confirmado.
     */
    public function enable(Request $request)
    {
        $user = $request->user();
        $google2fa = new Google2FA();

        // Generamos una nueva clave secreta
        $secret = $google2fa->generateSecretKey();

        // IMPORTANTE: Encriptamos el secreto antes de guardarlo en DB.
        // Esto protege al usuario si alguien accede a la base de datos directamente.
        $user->forceFill([
            'google2fa_secret' => Crypt::encryptString($secret),
            'two_factor_confirmed_at' => null, // Aún no confirmado
            'two_factor_recovery_codes' => null,
        ])->save();

        // Generamos la URL para el QR.
        // Nota: Para React, es mejor enviar el texto "otpauth" y que el frontend genere el QR
        // usando una librería como 'qrcode.react' o 'qrious'.
        $qrCodeUrl = $google2fa->getQRCodeUrl(
            config('app.name'),
            $user->email,
            $secret
        );

        return response()->json([
            'message' => 'Escanea este código QR con tu aplicación de autenticación.',
            'secret' => $secret, // Para entrada manual
            'qr_code_url' => $qrCodeUrl // String otpauth://...
        ]);
    }

    /**
     * 2. Confirmar (Paso 2): Validar código inicial y Generar Recovery Codes
     * Aquí es donde el 2FA se vuelve oficial.
     */
    public function confirm(Request $request)
    {
        $request->validate(['code' => 'required|string']);

        $user = $request->user();
        $google2fa = new Google2FA();

        // Desencriptamos el secreto para verificar
        try {
            $secret = Crypt::decryptString($user->google2fa_secret);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error de seguridad. Reinicia el proceso.'], 500);
        }

        // Verificamos el código que ingresó el usuario
        $valid = $google2fa->verifyKey($secret, $request->code);

        if ($valid) {
            // 1. Generamos los códigos de recuperación (Salvavidas)
            $recoveryCodes = $this->generateRecoveryCodes();

            // 2. Guardamos todo encriptado
            $user->forceFill([
                'two_factor_confirmed_at' => now(),
                'two_factor_recovery_codes' => Crypt::encryptString(json_encode($recoveryCodes)),
            ])->save();

            // 3. Auto-verificamos esta sesión para que no le pida código inmediatamente
            $request->session()->put('auth.2fa_verified', true);

            return response()->json([
                'message' => 'Autenticación de dos pasos activada exitosamente.',
                'recovery_codes' => $recoveryCodes, // IMPORTANTE: El frontend debe mostrar esto al usuario para que lo guarde
                'instruction' => 'Guarda estos códigos de recuperación en un lugar seguro. Los necesitarás si pierdes tu teléfono.'
            ]);
        }

        return response()->json(['message' => 'El código proporcionado es incorrecto.'], 422);
    }

    /**
     * 3. Desactivar 2FA
     * Requiere confirmar contraseña actual por seguridad.
     */
    public function disable(Request $request)
    {
        $request->validate(['password' => 'required']);

        $user = $request->user();

        // Verificación estricta de contraseña
        if (!Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'password' => ['La contraseña es incorrecta.'],
            ]);
        }

        // Limpiamos todos los datos de 2FA
        $user->forceFill([
            'google2fa_secret' => null,
            'two_factor_confirmed_at' => null,
            'two_factor_recovery_codes' => null,
        ])->save();

        // Removemos la marca de verificado de la sesión
        $request->session()->forget('auth.2fa_verified');

        return response()->json(['message' => 'La autenticación de dos pasos ha sido desactivada.']);
    }

    /**
     * 4. Regenerar Códigos de Recuperación
     * Útil si el usuario gastó sus códigos o cree que fueron comprometidos.
     */
    public function regenerateRecoveryCodes(Request $request)
    {
        $request->validate(['password' => 'required']);

        $user = $request->user();

        if (!Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'password' => ['La contraseña es incorrecta.'],
            ]);
        }

        if (!$user->two_factor_confirmed_at) {
            return response()->json(['message' => 'El 2FA no está activado.'], 400);
        }

        $recoveryCodes = $this->generateRecoveryCodes();

        $user->forceFill([
            'two_factor_recovery_codes' => Crypt::encryptString(json_encode($recoveryCodes)),
        ])->save();

        return response()->json([
            'message' => 'Nuevos códigos de recuperación generados.',
            'recovery_codes' => $recoveryCodes
        ]);
    }

    /**
     * Helper Privado: Genera array de 8 códigos aleatorios
     */
    private function generateRecoveryCodes(): array
    {
        // Genera 8 códigos, cada uno de 10 caracteres alfanuméricos, separados por guión para legibilidad
        // Ejemplo: ABCD-12345
        return collect(range(1, 8))->map(function () {
            return Str::upper(Str::random(10)) . '-' . Str::random(5); // Formato largo seguro
        })->toArray();
    }
}
