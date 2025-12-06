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

    use HasApiTokens, HasFactory, Notifiable, HasUuids;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role_id',
        'is_active',
        'google2fa_secret',
        'two_factor_confirmed_at',
        'two_factor_recovery_codes', // <--- AGREGAR ESTO QUE FALTABA
        'last_login_at',
        'last_ip'
    ];

    protected $hidden = [
        'password',
        'remember_token',
        'google2fa_secret',
        'two_factor_recovery_codes' // <--- OCULTAR ESTO POR SEGURIDAD
    ];

    // Usamos la propiedad $casts estándar para asegurar compatibilidad
    protected $casts = [
        'password' => 'hashed',
        'is_active' => 'boolean',
        'two_factor_confirmed_at' => 'datetime',
        'last_login_at' => 'datetime',
    ];



    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    public function profile()
    {
        return $this->hasOne(Profile::class);
    }

    // Helper Robustecido
    public function hasEnabledTwoFactorAuthentication(): bool
    {
        return !is_null($this->two_factor_confirmed_at);
    }

    // Helper: Verifica permiso a través del Rol
    public function hasPermission(string $permissionKey): bool
    {
        return $this->role?->permissions->contains('key', $permissionKey) ?? false;
    }


    protected static function booted()
    {
        static::created(function ($user) {
            $user->profile()->create([
                'first_name' => $user->name, // Fallback inicial
                'first_surname' => '',
            ]);
        });
    }
}
