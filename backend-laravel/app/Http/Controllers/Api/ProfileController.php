<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Profile\UpdatePasswordRequest;
use App\Http\Requests\Profile\UpdateProfileRequest;
use App\Http\Resources\UserResource;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;

class ProfileController extends Controller
{
    /**
     * Actualizar Información General y Avatar
     */
    public function update(UpdateProfileRequest $request)
    {
        $user = Auth::user();

        DB::transaction(function () use ($user, $request) {

            if ($request->email !== $user->email) {
                $user->email_verified_at = null; // Invalidamos verificación si cambia email
            }

            $user->update([
                'email' => $request->email,
                'name' => trim("{$request->first_name} {$request->first_surname}")
            ]);

            $profile = $user->profile()->firstOrCreate(['user_id' => $user->id]);

            if ($request->hasFile('avatar')) {
                if ($profile->avatar_path && Storage::disk('local')->exists($profile->avatar_path)) {
                    Storage::disk('local')->delete($profile->avatar_path);
                }

                $path = $request->file('avatar')->store('avatars', 'local');
                $profile->avatar_path = $path;
            }

            $profile->update([
                'first_name' => $request->first_name,
                'second_name' => $request->second_name,
                'third_name' => $request->third_name,
                'first_surname' => $request->first_surname,
                'second_surname' => $request->second_surname,
                'third_surname' => $request->third_surname,
                'phone' => $request->phone,
                'gender_id' => $request->gender_id,
            ]);
        });

        return response()->json([
            'message' => 'Perfil actualizado correctamente.',
            'user' => new UserResource($user->fresh(['profile.gender', 'role'])),
        ]);
    }

    /**
     * Actualizar Contraseña
     */
    public function updatePassword(UpdatePasswordRequest $request)
    {
        $user = Auth::user();

        $user->update([
            'password' => Hash::make($request->password),
        ]);

        return response()->json([
            'message' => 'Contraseña actualizada correctamente.',
        ]);
    }
}
