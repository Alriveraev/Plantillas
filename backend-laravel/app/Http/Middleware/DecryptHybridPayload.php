<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;

class DecryptHybridPayload
{
    public function handle(Request $request, Closure $next)
    {
        // =================================================================
        // 🕵️ SECCIÓN 1: DETECCIÓN DE DATOS DE SEGURIDAD
        // =================================================================

        $securityData = null;

        // CASO A: Petición GET (Busca en Header)
        if ($request->isMethod('GET')) {
            $headerToken = $request->header('X-Secure-Auth');
            if ($headerToken) {
                // Decodificamos el Base64 que viene del Frontend
                $securityData = json_decode(base64_decode($headerToken), true);
            }
        }
        // CASO B: Petición POST/PUT/PATCH (Busca en Body)
        else {
            if ($request->has(['payload', 'enc_key', 'iv'])) {
                $securityData = $request->only(['payload', 'enc_key', 'iv']);
            }
        }

        // =================================================================
        // 🔒 SECCIÓN 2: MODO ESTRICTO (FAIL CLOSED)
        // =================================================================

        // Métodos que REQUIEREN llave de seguridad obligatoria
        $methodsRequiringEncryption = ['POST', 'PUT', 'PATCH', 'GET'];

        // Si el método actual requiere seguridad...
        if (in_array($request->method(), $methodsRequiringEncryption)) {

            // Excepción opcional: Rutas públicas (si necesitas excluir alguna)
            // if ($request->is('api/public/*')) return $next($request);

            // ... y NO encontramos los datos de seguridad -> ¡BLOQUEAR!
            if (!$securityData) {
                Log::warning('⛔ Intento de acceso sin llave detectado: ' . $request->method() . ' ' . $request->path());

                return response()->json([
                    'message' => 'Acceso Denegado',
                    'error' => 'SECURE_AUTH_REQUIRED'
                ], 403);
            }
        }

        // =================================================================
        // 🔓 SECCIÓN 3: LÓGICA DE DESENCRIPTACIÓN UNIFICADA
        // =================================================================

        if ($securityData) {
            try {
                $privateKeyPath = storage_path('app/security/private_key.pem');

                if (!file_exists($privateKeyPath)) {
                    throw new \Exception("No se encuentra la llave privada en el servidor.");
                }

                $privateKey = file_get_contents($privateKeyPath);

                // --- 1. DESENCRIPTAR LLAVE AES (RSA-OAEP) ---
                // Nota: Usamos $securityData[...] en lugar de $request->input(...)
                $encryptedKey = base64_decode($securityData['enc_key']);
                $aesKey = null;

                $rsaSuccess = openssl_private_decrypt(
                    $encryptedKey,
                    $aesKey,
                    $privateKey,
                    OPENSSL_PKCS1_OAEP_PADDING
                );

                if (!$rsaSuccess) throw new \Exception("Fallo RSA-OAEP decrypt.");

                // --- 2. PREPARAR GCM ---
                $fullPayload = base64_decode($securityData['payload']);
                $tagLength = 16;

                if (strlen($fullPayload) <= $tagLength) {
                    throw new \Exception("Payload corrupto o demasiado corto.");
                }

                $ciphertextLength = strlen($fullPayload) - $tagLength;
                $ciphertext = substr($fullPayload, 0, $ciphertextLength);
                $tag = substr($fullPayload, -$tagLength);
                $iv = base64_decode($securityData['iv']);

                // --- 3. DESENCRIPTAR DATOS (AES-GCM) ---
                $decryptedJson = openssl_decrypt(
                    $ciphertext,
                    'aes-256-gcm',
                    $aesKey,
                    OPENSSL_RAW_DATA,
                    $iv,
                    $tag
                );

                if ($decryptedJson === false) {
                    throw new \Exception("Fallo de integridad (Tag inválido). Datos modificados.");
                }

                // --- 4. VALIDAR REPLAY ATTACK ---
                $data = json_decode($decryptedJson, true);

                if (!$data) throw new \Exception("JSON inválido.");

                // Validar Timestamp (60s)
                $timestamp = $data['timestamp'] ?? 0;
                if (abs(time() * 1000 - $timestamp) > 60000) {
                    throw new \Exception("Token expirado.");
                }

                // Validar Nonce
                $nonce = $data['nonce'] ?? '';
                $cacheKey = 'nonce_' . $nonce;
                if (Cache::has($cacheKey)) {
                    throw new \Exception("Petición duplicada.");
                }
                Cache::put($cacheKey, true, 60);

                // --- 5. INYECTAR DATOS ---

                // Si es POST/PUT, inyectamos los datos al Request para el controlador
                // Si es GET, solo validamos que el token fuera correcto (paso anterior)
                if (!$request->isMethod('GET') && isset($data['data']) && is_array($data['data'])) {
                    $request->merge($data['data']);

                    // Limpiar basura del body
                    $request->request->remove('payload');
                    $request->request->remove('enc_key');
                    $request->request->remove('iv');
                }
            } catch (\Exception $e) {
                Log::error('🛡️ Seguridad Rechazada: ' . $e->getMessage());

                return response()->json([
                    'message' => 'Solicitud rechazada por seguridad.',
                    'debug_error' => app()->hasDebugModeEnabled() ? $e->getMessage() : 'INTEGRITY_CHECK_FAILED'
                ], 403);
            }
        }

        return $next($request);
    }
}
