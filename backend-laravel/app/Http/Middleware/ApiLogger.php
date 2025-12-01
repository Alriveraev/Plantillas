<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Models\AuditLog;
use Illuminate\Support\Facades\Log;

class ApiLogger
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // 1. Guardamos el tiempo de inicio en el REQUEST (no en $this)
        // para que persista hasta el método terminate.
        if (!defined('LARAVEL_START')) {
            $request->attributes->set('start_time', microtime(true));
        }

        return $next($request);
    }

    /**
     * Handle tasks after the response has been sent to the browser.
     * (Terminable Middleware)
     */
    public function terminate(Request $request, Response $response): void
    {
        // Filtro de ruido (Opcional: ignorar OPTIONS o rutas de debug)
        if ($request->method() === 'OPTIONS') {
            return;
        }

        try {
            // 2. Calcular duración
            // Usamos LARAVEL_START (precisión de boot) o nuestro atributo personalizado
            $startTime = $request->attributes->get('start_time', constant('LARAVEL_START'));
            $duration = round((microtime(true) - $startTime) * 1000, 2);

            // 3. Limpiar datos sensibles
            $payload = $request->all();
            $hiddenKeys = ['password', 'password_confirmation', 'google2fa_secret', 'code'];

            foreach ($hiddenKeys as $key) {
                if (isset($payload[$key])) {
                    $payload[$key] = '[REDACTED]';
                }
            }

            // 4. Guardar Log
            // Usamos $request->user('sanctum') para intentar obtener el usuario
            // incluso si la ruta falló, siempre que el token/cookie fuera válido.
            AuditLog::create([
                'user_id'     => $request->user('sanctum')?->id,
                'method'      => $request->method(),
                'url'         => $request->path(),
                'status_code' => $response->getStatusCode(),
                'ip_address'  => $request->ip(),
                'user_agent'  => $request->userAgent(),
                'payload'     => count($payload) > 0 ? $payload : null,
                'duration_ms' => $duration
            ]);
        } catch (\Exception $e) {
            // Fallback al log de archivo si la DB falla
            Log::error('AuditLog Error: ' . $e->getMessage());
        }
    }
}
