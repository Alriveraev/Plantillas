<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use App\Traits\BelongsToBusiness;

class Schedule extends Model
{
    use HasUuids, BelongsToBusiness;

    protected $fillable = [
        'business_id',
        'staff_member_id', // Si es null, representa el horario general de la tienda
        'day_of_week', // 0 = Domingo, 1 = Lunes...
        'start_time',
        'end_time'
    ];

    public function staffMember()
    {
        return $this->belongsTo(StaffMember::class);
    }
}
