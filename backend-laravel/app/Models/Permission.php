<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Permission extends Model
{
    use HasUuids;

    protected $fillable = ['key', 'description']; // 'key' ej: 'users.create'

    public function roles()
    {
        return $this->belongsToMany(Role::class);
    }
}
