<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Auth; // <-- IMPORTAMOS LA FACADE AUTH
use App\Models\Business;

trait BelongsToBusiness
{
    protected static function bootBelongsToBusiness()
    {
        // Filtra las consultas para que el usuario solo vea la info de su sucursal
        static::addGlobalScope('business', function (Builder $builder) {
            // Usamos Auth:: en lugar de auth()->
            if (Auth::check() && Auth::user()->business_id) {
                $builder->where('business_id', Auth::user()->business_id);
            }
        });

        // Al crear un nuevo registro (ej. una Cita), le asigna el negocio automáticamente
        static::creating(function ($model) {
            if (Auth::check() && Auth::user()->business_id && empty($model->business_id)) {
                $model->business_id = Auth::user()->business_id;
            }
        });
    }

    public function business()
    {
        return $this->belongsTo(Business::class);
    }
}
