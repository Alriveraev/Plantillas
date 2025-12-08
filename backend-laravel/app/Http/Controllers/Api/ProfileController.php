<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Profile\UpdatePasswordRequest;
use App\Http\Requests\Profile\UpdateProfileRequest;
use App\Http\Resources\UserResource;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    public function sessions(Request $request)
    {
        if (config('session.driver') !== 'database') {
            return response()->json(['message' => 'El driver de sesión no es base de datos.'], 500);
        }

        $sessions = DB::table('sessions')
            ->where('user_id', Auth::id())
            ->orderBy('last_activity', 'desc')
            ->get()
            ->map(function ($session) use ($request) {
                return (object) [
                    'agent' => $this->createAgent($session),
                    'ip_address' => $session->ip_address,
                    'is_current_device' => $session->id === $request->session()->getId(),
                    'last_active' => Carbon::createFromTimestamp($session->last_activity)->diffForHumans(),
                ];
            });

        return response()->json([
            'sessions' => $sessions
        ]);
    }

    /**
     * Helper simple para parsear User Agent (Para que diga "Chrome en Windows")
     */
    protected function createAgent($session)
    {
        $agent = $session->user_agent;
        $platform = 'Desconocido';
        $browser = 'Desconocido';

        // Detectar Plataforma
        if (preg_match('/windows|win32/i', $agent)) $platform = 'Windows';
        elseif (preg_match('/macintosh|mac os x/i', $agent)) $platform = 'macOS';
        elseif (preg_match('/linux/i', $agent)) $platform = 'Linux';
        elseif (preg_match('/android/i', $agent)) $platform = 'Android';
        elseif (preg_match('/iphone|ipad|ipod/i', $agent)) $platform = 'iOS';

        // Detectar Navegador
        if (preg_match('/MSIE/i', $agent) && !preg_match('/Opera/i', $agent)) $browser = 'Internet Explorer';
        elseif (preg_match('/Firefox/i', $agent)) $browser = 'Firefox';
        elseif (preg_match('/Chrome/i', $agent)) $browser = 'Chrome';
        elseif (preg_match('/Safari/i', $agent)) $browser = 'Safari';
        elseif (preg_match('/Opera/i', $agent)) $browser = 'Opera';
        elseif (preg_match('/Edg/i', $agent)) $browser = 'Edge';

        return [
            'platform' => $platform,
            'browser' => $browser,
            'string' => "$browser en $platform" // Formato listo para el Frontend
        ];
    }
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
