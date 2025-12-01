<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use PragmaRX\Google2FA\Google2FA;

class TwoFactorManageController extends Controller
{
    // 1. Activar (Generar QR)
    public function enable(Request $request)
    {
        $user = $request->user();
        $google2fa = new Google2FA();
        $secret = $google2fa->generateSecretKey();

        // Guardamos secreto, pero dejamos confirmed_at en null
        $user->forceFill([
            'google2fa_secret' => $secret,
            'two_factor_confirmed_at' => null
        ])->save();

        $qrCodeUrl = $google2fa->getQRCodeUrl(config('app.name'), $user->email, $secret);

        return response()->json([
            'secret' => $secret,
            'qr_code_url' => $qrCodeUrl
        ]);
    }

    // 2. Confirmar (Validar código inicial)
    public function confirm(Request $request)
    {
        $request->validate(['code' => 'required']);
        $user = $request->user();

        $google2fa = new Google2FA();

        if ($google2fa->verifyKey($user->google2fa_secret, $request->code)) {
            $user->forceFill(['two_factor_confirmed_at' => now()])->save();
            $request->session()->put('auth.2fa_verified', true); // Auto-verificar esta sesión

            return response()->json(['message' => '2FA Activado correctamente']);
        }

        return response()->json(['message' => 'Código incorrecto'], 422);
    }

    // 3. Desactivar
    public function disable(Request $request)
    {
        $request->validate(['password' => 'required']);
        $user = $request->user();

        if (!Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Contraseña incorrecta'], 422);
        }

        $user->forceFill([
            'google2fa_secret' => null,
            'two_factor_confirmed_at' => null
        ])->save();

        return response()->json(['message' => '2FA Desactivado']);
    }
}
