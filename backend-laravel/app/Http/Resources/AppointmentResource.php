<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AppointmentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'status' => $this->status,
            'start_at' => $this->start_at->toIso8601String(),
            'end_at' => $this->end_at->toIso8601String(),
            'total_price' => (float) $this->total_price,
            'notes' => $this->notes,
            // Relaciones cargadas de forma segura
            'customer' => [
                'id' => $this->customer->id,
                'name' => $this->customer->full_name,
            ],
            'service' => [
                'id' => $this->service->id,
                'name' => $this->service->name,
                'duration' => $this->service->duration_minutes,
            ],
            'staff' => [
                'id' => $this->staffMember->id,
                'name' => $this->staffMember->user->name,
            ]
        ];
    }
}
