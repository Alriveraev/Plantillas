<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'avatar' => "https://ui-avatars.com/api/?name=" . urlencode($this->name), // Placeholder

            // Rol y Permisos planos para fácil consumo en React
            'role' => $this->role?->label,
            'role_name' => $this->role?->name,
            'permissions' => $this->role?->permissions->pluck('key') ?? [],

            // Estado de seguridad (Booleano, nunca enviamos el secreto)
            'two_factor_enabled' => $this->hasEnabledTwoFactorAuthentication(),

            'created_at' => $this->created_at->toIso8601String(),
        ];
    }
}
