<?php

namespace App\Providers;

use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;
use App\Models\User;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Super Admin (hardcoded email o rol específico) tiene acceso total
        Gate::before(function (User $user, string $ability) {
            if ($user->role?->name === 'admin') {
                return true;
            }
        });

        // 1. Límite Global de API (General)
        // Permite 60 peticiones por minuto por usuario (o por IP si es invitado).
        RateLimiter::for('api', function (Request $request) {
            return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
        });

        // 2. Límite de Login (Anti-Fuerza Bruta)
        // Permite solo 5 intentos por minuto.e
        // Bloquea por IP para detener bots que prueban muchas cuentas desde el mismo sitio.
        RateLimiter::for('login', function (Request $request) {
            return Limit::perMinute(5)
                ->by($request->ip())
                ->response(function (Request $request, array $headers) {
                    return response()->json([
                        'message' => 'Demasiados intentos de inicio de sesión. Por favor, inténtalo de nuevo en un minuto.',
                        'error_code' => 'TOO_MANY_ATTEMPTS'
                    ], 429, $headers);
                });
        });
        // 3. Límite de 2FA (Crítico)
        // Permite solo 3 intentos por minuto para el código de 6 dígitos.
        // Usamos el ID del usuario porque en este punto ya tenemos sesión (aunque no verificada).
        RateLimiter::for('two-factor', function (Request $request) {
            return Limit::perMinute(3)->by($request->user()?->id ?: $request->ip());
        });

        // 4. Límite de Registro/Creación (Anti-Spam)
        RateLimiter::for('registration', function (Request $request) {
            return Limit::perMinute(3)->by($request->ip());
        });
    }
}
