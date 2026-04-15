<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy
{
    /**
     * Intercepta TODO antes de evaluar las demás reglas.
     * Si es el SuperAdmin dueño del SaaS (business_id es null), lo dejamos pasar siempre.
     */
    public function before(User $user, string $ability): bool|null
    {
        if (is_null($user->business_id)) {
            return true;
        }

        return null; // Deja que las reglas de abajo decidan
    }

    /**
     * ¿Quién puede ver la LISTA de usuarios?
     */
    public function viewAny(User $user): bool
    {
        // Admin y Moderator tienen este permiso.
        // El filtro de "qué usuarios de qué negocio se muestran" ya lo hace mágicamente
        // tu controlador gracias al Trait BelongsToBusiness y su Global Scope.
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

        // 2. REGLA SAAS: Para ver a otro usuario, AMBOS deben pertenecer al mismo negocio
        if ($user->business_id !== $model->business_id) {
            return false;
        }

        // 3. Si no tiene el permiso base de ver detalles, adiós.
        if (!$user->hasPermission('users.detail')) {
            return false;
        }

        // 4. REGLA DE NEGOCIO: Restricción para Moderadores
        // "Un moderador NO puede ver el perfil de un Admin ni de otro Moderador"
        if ($user->role?->name === 'moderator') {
            if (in_array($model->role?->name, ['admin', 'moderator'])) {
                return false;
            }
        }

        return true;
    }

    /**
     * ¿Quién puede crear nuevos usuarios?
     */
    public function create(User $user): bool
    {
        // Solo Admin tiene este permiso en el Seeder
        return $user->hasPermission('users.create');
    }

    /**
     * ¿Quién puede actualizar a un usuario específico?
     */
    public function update(User $user, User $model): bool
    {
        // 1. REGLA SAAS: Solo puedes editar usuarios que pertenezcan a tu mismo negocio
        if ($user->business_id !== $model->business_id) {
            return false;
        }

        // 2. Mantenemos tu lógica extra de seguridad:
        // Un usuario de menor rango no puede editar a un admin.
        if ($model->role?->name === 'admin' && $user->role?->name !== 'admin') {
            return false;
        }

        return $user->hasPermission('users.update');
    }

    /**
     * ¿Quién puede eliminar a un usuario específico?
     */
    public function delete(User $user, User $model): bool
    {
        // 1. REGLA SAAS: Solo puedes borrar usuarios que pertenezcan a tu mismo negocio
        if ($user->business_id !== $model->business_id) {
            return false;
        }

        // 2. Solo quien tenga el permiso, y evitamos el auto-suicidio de la cuenta.
        return $user->hasPermission('users.delete') && $user->id !== $model->id;
    }
}
