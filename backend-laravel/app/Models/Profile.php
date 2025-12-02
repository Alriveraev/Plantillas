<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Profile extends Model
{
    use HasUuids;

    protected $fillable = [
        'user_id',
        'gender_id',
        'first_name',
        'second_name',
        'third_name',
        'first_surname',
        'second_surname',
        'third_surname',
        'phone'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function gender()
    {
        return $this->belongsTo(Gender::class);
    }

    // Accessor: Nombre completo concatenado
    public function getFullNameAttribute()
    {
        return trim("{$this->first_name} {$this->second_name} {$this->first_surname} {$this->second_surname}");
    }
}
