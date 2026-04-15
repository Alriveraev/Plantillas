<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class TimeOff extends Model
{
    use HasUuids;

    protected $fillable = [
        'staff_member_id',
        'start_at',
        'end_at',
        'reason'
    ];

    protected $casts = [
        'start_at' => 'datetime',
        'end_at' => 'datetime',
    ];

    public function staffMember()
    {
        return $this->belongsTo(StaffMember::class);
    }
}
