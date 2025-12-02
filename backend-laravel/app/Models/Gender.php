<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Gender extends Model
{
    use HasUuids;
    protected $fillable = ['name', 'key'];
}
