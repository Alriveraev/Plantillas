<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {

        $avatarUrl = null;

        if ($this->profile?->avatar_path) {
            $avatarUrl = route('users.avatar', ['user' => $this->id]);
        } else {
            $name = urlencode($this->name);
            $avatarUrl = "https://ui-avatars.com/api/?name={$name}&background=0D8ABC&color=fff";
        }

        return [
            'id' => $this->id,
            'email' => $this->email,
            'role' => $this->role?->label,
            'role_name' => $this->role?->name,

            // Datos del Perfil (Objeto anidado o plano, como prefieras)
            'profile' => [
                'first_name' => $this->profile?->first_name,
                'second_name' => $this->profile?->second_name,
                'third_name' => $this->profile?->third_name,
                'first_surname' => $this->profile?->first_surname,
                'second_surname' => $this->profile?->second_surname,
                'third_surname' => $this->profile?->third_surname,
                'full_name' => $this->profile?->full_name, // Usando el accessor
                'phone' => $this->profile?->phone,
                'gender' => $this->profile?->gender?->name, // 'Masculino'
                'gender_id' => $this->profile?->gender_id, // Para el select del frontend
                'avatar' => $avatarUrl, // Si implementaste avatar
            ],
            'permissions' => $this->role?->permissions->pluck('key') ?? [],
            'security' => [
                'two_factor_enabled' => $this->hasEnabledTwoFactorAuthentication(),
                'email_verified' => !is_null($this->email_verified_at),
            ],
        ];
    }
}
