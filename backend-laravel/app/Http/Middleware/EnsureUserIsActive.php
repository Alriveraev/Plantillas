<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsActive
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user) {
            $isUserInactive = !$user->is_active;
            $isBusinessInactive = $user->business_id && $user->business && !$user->business->is_active;

            if ($isUserInactive || $isBusinessInactive) {
                Auth::guard('web')->logout();
                $request->session()->invalidate();
                $request->session()->regenerateToken();

                $message = $isBusinessInactive
                    ? 'La suscripción del negocio está inactiva.'
                    : 'Tu cuenta ha sido desactivada. Contacta al soporte.';

                return response()->json(['message' => $message, 'action' => 'logout_required'], 403);
            }
        }
        return $next($request);
    }
}
