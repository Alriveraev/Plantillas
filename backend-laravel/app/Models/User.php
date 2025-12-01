<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, HasUuids;

    protected $fillable = [
        'name', 'email', 'password', 'role_id', 'is_active',
        'google2fa_secret', 'two_factor_confirmed_at',
        'last_login_at', 'last_ip'
    ];

    protected $hidden = [
        'password', 'remember_token', 'google2fa_secret',
    ];

    protected function casts(): array
    {
        return [
            'password' => 'hashed',
            'is_active' => 'boolean',
            'two_factor_confirmed_at' => 'datetime',
            'last_login_at' => 'datetime',
        ];
    }

    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    // Helper: Verifica si el usuario tiene el 2FA completamente activado
    public function hasEnabledTwoFactorAuthentication(): bool
    {
        return !is_null($this->two_factor_confirmed_at);
    }

    // Helper: Verifica permiso a través del Rol
    public function hasPermission(string $permissionKey): bool
    {
        return $this->role?->permissions->contains('key', $permissionKey) ?? false;
    }
}
