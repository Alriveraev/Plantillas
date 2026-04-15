<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreAppointmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // La autorización real ya la manejas en las Rutas/Policies
    }

    public function rules(): array
    {
        return [
            'customer_id' => ['required', 'uuid', 'exists:customers,id'],
            'staff_member_id' => ['required', 'uuid', 'exists:staff_members,id'],
            'service_id' => ['required', 'uuid', 'exists:services,id'],
            'start_at' => ['required', 'date', 'after_or_equal:now'],
            'notes' => ['nullable', 'string', 'max:500'],
        ];
    }
}
