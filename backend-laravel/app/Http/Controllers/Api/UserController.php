<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Http\Resources\UserResource;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function index()
    {
        // 1. Barrera de Entrada:
        // Solo pasan Admin y Moderator (porque tienen 'users.view' en el Seeder).
        // User y Guest reciben 403 aquí.
        Gate::authorize('viewAny', User::class);

        $currentUser = Auth::user();

        // Iniciamos la consulta
        $query = User::with('role')->latest();

        // 2. Lógica de Negocio: FILTRO PARA MODERADORES
        // Si el rol es 'moderator', filtramos la consulta SQL
        if ($currentUser->role->name === 'moderator') {
            $query->whereHas('role', function ($q) {
                // Solo mostrar roles 'user' y 'guest'
                $q->whereIn('name', ['user', 'guest']);
            });

            // Opcional: ¿El moderador puede verse a sí mismo en la lista?
            // Si NO quieres que se vea a sí mismo, descomenta esto:
            $query->where('id', '!=', $currentUser->id);
        }

        return UserResource::collection($query->paginate(10));
    }

    // Para el detalle individual (usando tu permiso 'users.detail')
    public function show(string $id)
    {
        $currentUser = Auth::user();

        // Verificación manual segura
        // Si NO tiene permiso de ver detalle Y NO es él mismo -> 403
        if (!$currentUser->hasPermission('users.detail') && $currentUser->id !== $id) {
            return response()->json([
                'message' => 'No tienes permisos para ver este perfil.',
                'error_code' => 'FORBIDDEN',
                'status' => 403
            ], 403);
        }

        $user = User::findOrFail($id);

        // EXTRA: Seguridad para Moderadores en el show()
        // Si un Moderador intenta ver el ID de un Admin copiando el link,
        // debemos bloquearlo también aquí.
        if ($currentUser->role->name === 'moderator') {
            // Si el usuario que intentan ver es Admin o Moderator...
            if (in_array($user->role->name, ['admin', 'moderator']) && $user->id !== $currentUser->id) {
                return response()->json([
                    'message' => 'No tienes permisos para ver este perfil.',
                    'error_code' => 'FORBIDDEN',
                    'status' => 403
                ], 403);
            }
        }

        return new UserResource($user->load('role'));
    }
}
