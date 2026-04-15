<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\MassPrunable;
use App\Traits\BelongsToBusiness; // <-- AGREGAR

class AuditLog extends Model
{
    use HasUuids, MassPrunable, BelongsToBusiness; // <-- AGREGAR TRAIT

    protected $fillable = [
        'business_id', // <-- AGREGAR
        'user_id',
        'method',
        'url',
        'status_code',
        'ip_address',
        'user_agent',
        'payload',
        'duration_ms'
    ];

    protected $casts = [
        'payload' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function prunable()
    {
        return static::where('created_at', '<=', now()->subMonth());
    }
}
