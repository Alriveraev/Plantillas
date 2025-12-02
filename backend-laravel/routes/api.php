<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PasswordResetController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\TwoFactorManageController;
use App\Http\Controllers\Api\UserController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// ==============================================================================
// 1. ZONA PÚBLICA (GUEST)
// ==============================================================================
Route::middleware(['throttle:login'])->group(function () {
    Route::post('/login', [AuthController::class, 'login'])->name('login');
    Route::post('/forgot-password', [PasswordResetController::class, 'sendResetLink']);
    Route::post('/reset-password', [PasswordResetController::class, 'reset']);
});

// ==============================================================================
// 2. ZONA PROTEGIDA (REQUIRERE LOGIN + COOKIE)
// ==============================================================================
Route::middleware(['auth:sanctum', 'active', 'throttle:api'])->group(function () {

    // 2.1 Autenticación Básica
    Route::post('/logout', [AuthController::class, 'logout']);

    // 2.2 Verificación de Segundo Factor (Paso intermedio del login)
    // Tiene un throttle estricto (3 intentos/min)
    Route::middleware(['throttle:two-factor'])->post('/2fa/verify', [AuthController::class, 'verifyTwoFactor']);

    // 2.3 Configuración de Seguridad (El usuario gestiona su propia seguridad)
    // URL Final: /api/user/security/...
    Route::prefix('user/security')->group(function () {
        Route::post('/2fa/enable', [TwoFactorManageController::class, 'enable']);
        Route::post('/2fa/confirm', [TwoFactorManageController::class, 'confirm']);
        Route::post('/2fa/disable', [TwoFactorManageController::class, 'disable']);
        Route::post('/logout-others', [AuthController::class, 'logoutOthers']);
    });

    // ==========================================================================
    // 3. ZONA DE ALTA SEGURIDAD (REQUIERE 2FA VERIFICADO)
    // ==========================================================================
    Route::middleware(['2fa'])->group(function () {

        // 3.1 Gestión del Propio Usuario (Mi Perfil)
        // URL Final: /api/user/...
        Route::prefix('user')->group(function () {

            // Obtener mis datos
            Route::get('/me', [AuthController::class, 'user']);

            // Actualizar mi perfil
            // URL Final: /api/user/profile/info y /api/user/profile/password
            Route::prefix('profile')->group(function () {
                Route::post('/info', [ProfileController::class, 'update']);
                Route::put('/password', [ProfileController::class, 'updatePassword']);
            });
        });

        // 3.2 Gestión del Sistema (Admin/Moderator)
        // URL Final: /api/users/...

        // CRUD Completo de Usuarios (Index, Store, Show, Update, Destroy)
        Route::apiResource('users', UserController::class);

        // Ruta específica para obtener el avatar privado de un usuario por ID
        // URL: /api/users/{uuid}/avatar
        Route::get('/users/{user}/avatar', [UserController::class, 'getAvatar'])->name('users.avatar');
    });
});
