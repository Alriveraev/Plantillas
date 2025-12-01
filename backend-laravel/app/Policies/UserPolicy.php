<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy
{
    /**
     * ¿Quién puede ver la LISTA de usuarios?
     */
    public function viewAny(User $user): bool
    {
        // Admin y Moderator tienen este permiso.
        // El filtro de "qué usuarios ven" se hace en el Controller.
        return $user->hasPermission('users.view');
    }

    /**
     * ¿Quién puede ver el PERFIL de un usuario específico?
     */
    public function view(User $user, User $model): bool
    {
        // 1. Siempre permitir que el usuario vea su propio perfil
        if ($user->id === $model->id) {
            return true;
        }

        // 2. Si no tiene el permiso base de ver detalles, adiós.
        // (Nota: Usamos 'users.detail' como definimos en el Seeder)
        if (!$user->hasPermission('users.detail')) {
            return false;
        }

        // 3. REGLA DE NEGOCIO: Restricción para Moderadores
        // "Un moderador NO puede ver el perfil de un Admin ni de otro Moderador"
        if ($user->role?->name === 'moderator') {
            // Si el perfil que intenta ver es Admin o Moderator...
            if (in_array($model->role?->name, ['admin', 'moderator'])) {
                return false;
            }
        }

        return true;
    }

    public function create(User $user): bool
    {
        // Solo Admin tiene este permiso en el Seeder
        return $user->hasPermission('users.create');
    }

    public function update(User $user, User $model): bool
    {
        // Solo Admin tiene este permiso.
        // Mantenemos tu lógica extra de seguridad por si acaso:
        if ($model->role?->name === 'admin' && $user->role?->name !== 'admin') {
            return false;
        }

        return $user->hasPermission('users.update');
    }

    public function delete(User $user, User $model): bool
    {
        // Solo Admin tiene este permiso.
        // Evitamos el auto-suicidio de la cuenta.
        return $user->hasPermission('users.delete') && $user->id !== $model->id;
    }
}
