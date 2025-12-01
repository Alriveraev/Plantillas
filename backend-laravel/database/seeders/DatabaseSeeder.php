<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;
use App\Models\Permission;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Tus Permisos Exactos
        $permissions = [
            'users.view' => Permission::create(['key' => 'users.view', 'description' => 'Ver lista de usuarios']),
            'users.detail' => Permission::create(['key' => 'users.detail', 'description' => 'Ver detalles de un usuario']),
            'users.create' => Permission::create(['key' => 'users.create', 'description' => 'Crear nuevos usuarios']),
            'users.update' => Permission::create(['key' => 'users.update', 'description' => 'Editar usuarios existentes']),
            'users.delete' => Permission::create(['key' => 'users.delete', 'description' => 'Eliminar usuarios']),
            'roles.manage' => Permission::create(['key' => 'roles.manage', 'description' => 'Gestionar roles y permisos']),
        ];

        // 2. Crear Roles (Strings en minúscula para coincidir con tu lógica)
        $adminRole = Role::create(['name' => 'admin', 'label' => 'Administrador']);
        $modRole = Role::create(['name' => 'moderator', 'label' => 'Moderador']);
        $userRole = Role::create(['name' => 'user', 'label' => 'Usuario']);
        $guestRole = Role::create(['name' => 'guest', 'label' => 'Invitado']);

        // 3. ASIGNACIÓN DE PERMISOS

        // A. ADMIN: Tiene acceso TOTAL
        // Le damos todos los permisos que creaste
        $adminRole->permissions()->attach(Permission::all());

        // B. MODERATOR: Puede ver lista y ver detalles (pero NO crear ni borrar)
        $modRole->permissions()->attach([
            $permissions['users.view']->id,   // Vital para el index
            $permissions['users.detail']->id, // Vital para el show
        ]);

        // C. USER y GUEST: NO les damos 'users.view' ni 'users.detail'.
        // (No asignamos nada)

        // 4. Usuarios de prueba
        $this->createUser('Super Admin', 'admin@admin.com', $adminRole, true);
        $this->createUser('Moderator User', 'mod@mod.com', $modRole, true);
        $this->createUser('Normal User', 'user@user.com', $userRole, false); // No verificado
        $this->createUser('Guest User', 'guest@guest.com', $guestRole, false);
    }

    private function createUser($name, $email, $role, $isActive = true)
    {
        User::create([
            'name' => $name,
            'email' => $email,
            'password' => Hash::make('password123'),
            'role_id' => $role->id,
            'is_active' => true,
            'email_verified_at' =>  $isActive ? now() : null,
        ]);
    }
}
