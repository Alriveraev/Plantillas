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
|
| Estructura diseñada para SPA (React) con Laravel Sanctum.
| Requiere axios.defaults.withCredentials = true en el Frontend.
|
*/

// ==============================================================================
// 1. ZONA PÚBLICA (GUEST)
// ==============================================================================
// Middleware 'guest': Solo accesible si NO estás logueado.
// Middleware 'throttle:login': Protección contra fuerza bruta.
Route::middleware(['guest', 'throttle:login'])->group(function () {

    // Login: Crea la sesión y establece la cookie.
    Route::post('/login', [AuthController::class, 'login'])->name('login');

    // Recuperación de contraseña (funciona con seguridad basada en email y token)
    Route::post('/forgot-password', [PasswordResetController::class, 'sendResetLink']);
    Route::post('/reset-password', [PasswordResetController::class, 'reset']);
    Route::post('/reset-password/verify-token',  [PasswordResetController::class, 'verifyToken']);
});

// ==============================================================================
// 2. ZONA PROTEGIDA (SESIÓN ACTIVA)
// ==============================================================================
// Middleware 'auth:sanctum': Verifica que la cookie de sesión sea válida.
// Middleware 'active': (Personalizado) Verifica que el usuario no esté baneado.
Route::middleware(['auth:sanctum', 'active', 'throttle:api'])->group(function () {

    // --------------------------------------------------------------------------
    // 2.1 Acciones permitidas ANTES de verificar 2FA
    // --------------------------------------------------------------------------

    // Permitimos Logout siempre (por si el usuario se atasca en el 2FA)
    Route::post('/logout', [AuthController::class, 'logout']);

    // Ruta para enviar el código de 6 dígitos.
    // Tiene un throttle estricto (ej: 5 intentos por minuto) para evitar adivinanzas.
    Route::middleware(['throttle:two-factor'])->post('/2fa/verify', [AuthController::class, 'verifyTwoFactor']);


    // ==========================================================================
    // 3. ZONA DE ALTA SEGURIDAD (REQUIERE 2FA COMPLETADO)
    // ==========================================================================
    // Middleware '2fa':
    // - Si el usuario NO tiene 2FA activado -> Pasa.
    // - Si el usuario SÍ tiene 2FA activado -> Verifica la sesión '2fa_verified'.
    Route::middleware(['2fa'])->group(function () {

        // ----------------------------------------------------------------------
        // 3.1 Gestión de Seguridad (FIX: Movido dentro de '2fa')
        // ----------------------------------------------------------------------
        Route::prefix('user/security')->group(function () {
            // Habilitar: Si no tengo 2FA, entro directo.
            Route::post('/2fa/enable', [TwoFactorManageController::class, 'enable']);

            // Confirmar: Paso final de habilitación.
            Route::post('/2fa/confirm', [TwoFactorManageController::class, 'confirm']);

            // Deshabilitar: AHORA ESTÁ SEGURO. Solo alguien verificado puede apagarlo.
            Route::post('/2fa/disable', [TwoFactorManageController::class, 'disable']);

            // Cerrar otras sesiones.
            Route::post('/logout-others', [AuthController::class, 'logoutOthers']);
            Route::get('/sessions', [ProfileController::class, 'sessions']);
        });

        // ----------------------------------------------------------------------
        // 3.2 Gestión del Usuario (Mi Perfil)
        // ----------------------------------------------------------------------
        Route::prefix('user')->group(function () {
            Route::get('/me', [AuthController::class, 'user']);

            Route::prefix('profile')->group(function () {
                Route::post('/info', [ProfileController::class, 'update']);
                Route::put('/password', [ProfileController::class, 'updatePassword']);
            });
        });

        // ----------------------------------------------------------------------
        // 3.3 Gestión del Sistema (Admin/Recursos)
        // ----------------------------------------------------------------------
        Route::apiResource('users', UserController::class);
        Route::get('/users/{user}/avatar', [UserController::class, 'getAvatar'])->name('users.avatar');
    });
});
