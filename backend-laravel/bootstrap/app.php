<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use App\Http\Middleware\DecryptHybridPayload; // <--- 1. IMPORTANTE: Importamos la clase

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // Habilitar soporte para Sanctum SPA (Cookies)
        $middleware->statefulApi();

        // 2. IMPORTANTE: Configuramos la pila API
        // Usamos 'prepend' para el Decrypt (se ejecuta PRIMERO)
        // Usamos 'append' para el Logger (se ejecuta al final)
        $middleware->api(
            prepend: [
                DecryptHybridPayload::class, // <-- AQUÍ ESTÁ LA MAGIA (Desencripta antes de validar)
            ],
            append: [
                \App\Http\Middleware\ApiLogger::class,
            ]
        );

        // Registrar Alias de Middlewares
        $middleware->alias([
            'active' => \App\Http\Middleware\EnsureUserIsActive::class,
            '2fa' => \App\Http\Middleware\EnsureTwoFactorIsEnabled::class,
        ]);
    })

    ->withExceptions(function (Exceptions $exceptions) {

        // 1. Forzar JSON siempre en rutas API
        $exceptions->shouldRenderJsonWhen(function (Request $request, Throwable $e) {
            if ($request->is('api/*')) {
                return true;
            }
            return $request->expectsJson();
        });

        // 2. Personalizar Error 404 (Not Found)
        $exceptions->render(function (NotFoundHttpException $e, Request $request) {
            if ($request->is('api/*')) {
                return response()->json([
                    'message' => 'El recurso solicitado no existe.',
                    'error_code' => 'NOT_FOUND',
                    'status' => 404
                ], 404);
            }
        });

        // 3. Personalizar Errores HTTP Generales (403, 401, etc.)
        $exceptions->render(function (HttpException $e, Request $request) {
            if ($request->is('api/*')) {
                $statusCode = $e->getStatusCode();

                $message = $e->getMessage();

                if (empty($message)) {
                    $message = match ($statusCode) {
                        403 => 'No tienes permisos para realizar esta acción.',
                        401 => 'No autenticado.',
                        default => 'Ocurrió un error en la solicitud.',
                    };
                }

                return response()->json([
                    'message' => $message,
                    'error_code' => $statusCode === 403 ? 'FORBIDDEN' : 'HTTP_ERROR',
                    'status' => $statusCode
                ], $statusCode);
            }
        });
    })->create();
