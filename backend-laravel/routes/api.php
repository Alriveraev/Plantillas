<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\TwoFactorManageController;
use App\Http\Controllers\Api\UserController;

// 1. Públicas
Route::middleware(['throttle:login'])->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
});
// 2. Autenticadas (Sanctum) - Requiere Cookie de Sesión

Route::middleware(['auth:sanctum', 'active', 'throttle:api'])->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);

    // Verificar 2FA (Paso 2 del Login)
    Route::middleware(['throttle:two-factor'])->post('/2fa/verify', [AuthController::class, 'verifyTwoFactor']);

    // Gestión de Configuración 2FA (Usuario decide activar/desactivar)
    Route::prefix('user/security')->group(function () {
        Route::post('/2fa/enable', [TwoFactorManageController::class, 'enable']);
        Route::post('/2fa/confirm', [TwoFactorManageController::class, 'confirm']);
        Route::post('/2fa/disable', [TwoFactorManageController::class, 'disable']);
        Route::post('/logout-others', [AuthController::class, 'logoutOthers']);
    });

    // 3. Zona de Alta Seguridad (Requiere haber pasado el 2FA si está activo)
    Route::middleware(['2fa'])->group(function () {

        Route::get('/me', [AuthController::class, 'user']);

        // CRUDs del sistema
        Route::apiResource('users', UserController::class);
    });
});
