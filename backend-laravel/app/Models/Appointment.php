<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use App\Traits\BelongsToBusiness;

class Appointment extends Model
{
    use HasUuids, BelongsToBusiness;

    protected $fillable = [
        'business_id', 'customer_id', 'staff_member_id', 'service_id',
        'start_at', 'end_at', 'status', 'total_price', 'notes'
    ];

    protected $casts = [
        'start_at' => 'datetime',
        'end_at' => 'datetime',
        'total_price' => 'decimal:2',
    ];

    public function customer() { return $this->belongsTo(Customer::class); }
    public function staffMember() { return $this->belongsTo(StaffMember::class); }
    public function service() { return $this->belongsTo(Service::class); }
}
