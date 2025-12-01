<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureTwoFactorIsEnabled
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        // Si no hay user logueado, pasamos (Auth middleware lo atrapará después)
        if (!$user) {
            return $next($request);
        }

        // Lógica: Si el usuario TIENE activado el 2FA en DB,
        // Y NO tiene la marca de verificado en la sesión actual: Bloquear.
        if ($user->hasEnabledTwoFactorAuthentication() && !$request->session()->has('auth.2fa_verified')) {
            return response()->json([
                'message' => 'Se requiere verificación de dos pasos.',
                'require_2fa' => true
            ], 403);
        }

        return $next($request);
    }
}
