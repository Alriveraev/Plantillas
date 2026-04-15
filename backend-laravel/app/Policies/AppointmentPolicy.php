<?php

namespace App\Policies;

use App\Models\Appointment;
use App\Models\User;

class AppointmentPolicy
{
    public function before(User $user, string $ability): bool|null
    {
        if (is_null($user->business_id)) return true; // SuperAdmin lo puede todo
        return null;
    }

    public function view(User $user, Appointment $appointment): bool {
        return $user->business_id === $appointment->business_id;
    }

    public function update(User $user, Appointment $appointment): bool {
        // Ejemplo: Si el usuario es el barbero/doctor asignado a esa cita, o si tiene permiso global
        if ($user->hasPermission('appointments.update_all')) {
             return $user->business_id === $appointment->business_id;
        }
        return $user->business_id === $appointment->business_id
            && $appointment->staff_member_id === $user->staffMember?->id;
    }

    public function delete(User $user, Appointment $appointment): bool {
        return $user->business_id === $appointment->business_id && $user->hasPermission('appointments.delete');
    }
}
