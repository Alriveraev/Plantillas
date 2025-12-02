<?php

namespace App\Http\Requests\Profile;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            // Datos de Usuario (Tabla users)
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('users')->ignore($this->user()->id),
            ],

            // Datos de Perfil (Tabla profiles)
            'first_name' => ['required', 'string', 'max:50'],
            'second_name' => ['nullable', 'string', 'max:50'],
            'third_name' => ['nullable', 'string', 'max:50'],

            'first_surname' => ['required', 'string', 'max:50'],
            'second_surname' => ['nullable', 'string', 'max:50'],
            'third_surname' => ['nullable', 'string', 'max:50'],

            'phone' => [
                'nullable',
                'string',
                'max:20',
                // El teléfono debe ser único en la tabla profiles, ignorando el perfil actual
                Rule::unique('profiles', 'phone')->ignore($this->user()->profile?->id)
            ],

            'gender_id' => ['nullable', 'exists:genders,id'],
            'avatar' => [
                'nullable',
                'image',            // Debe ser imagen (jpg, png, bmp, gif, svg, or webp)
                'mimes:jpeg,png,jpg,webp', // Formatos permitidos
                'max:2048'          // Máximo 2MB (Para no llenar tu disco)
            ],

        ];
    }
}
