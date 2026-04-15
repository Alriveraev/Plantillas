<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Business extends Model
{
    use HasUuids;

    protected $fillable = [
        'name',
        'slug',
        'email',
        'phone',
        'timezone',
        'currency',
        'is_active'
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    // Relaciones (Todo lo que le pertenece a esta clínica/barbería)
    public function users() { return $this->hasMany(User::class); }
    public function services() { return $this->hasMany(Service::class); }
    public function customers() { return $this->hasMany(Customer::class); }
    public function staffMembers() { return $this->hasMany(StaffMember::class); }
    public function appointments() { return $this->hasMany(Appointment::class); }
}
