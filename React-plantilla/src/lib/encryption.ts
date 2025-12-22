// src/utils/encryption.ts

// Utilidad para convertir Base64 a ArrayBuffer
function str2ab(str: string): ArrayBuffer {
  const binaryString = window.atob(str);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

// Utilidad para convertir ArrayBuffer a Base64
function ab2str(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

// Importar la llave pública PEM a formato usable por el navegador
async function importPublicKey(pem: string): Promise<CryptoKey> {
  const pemHeader = "-----BEGIN PUBLIC KEY-----";
  const pemFooter = "-----END PUBLIC KEY-----";
  const pemContents = pem
    .replace(pemHeader, "")
    .replace(pemFooter, "")
    .replace(/\s/g, "");

  const binaryDer = str2ab(pemContents);

  return window.crypto.subtle.importKey(
    "spki",
    binaryDer,
    {
      name: "RSA-OAEP",
      // 🔥 CAMBIO CRÍTICO: Usamos SHA-1 para coincidir con PHP OpenSSL Default
      // Si pones SHA-256 aquí, PHP fallará al desencriptar.
      hash: "SHA-1",
    },
    true,
    ["encrypt"]
  );
}

export const encryptHybridGCM = async (data: any) => {
  const pem = import.meta.env.VITE_RSA_PUBLIC_KEY;
  if (!pem) throw new Error("Falta VITE_RSA_PUBLIC_KEY");

  try {
    // 1. Preparar Payload con Anti-Replay
    const payload = JSON.stringify({
      data: data,
      timestamp: Date.now(), // Para validar ventana de tiempo (ej. 1 min)
      nonce: crypto.randomUUID(), // Para evitar duplicados
    });
    const encodedPayload = new TextEncoder().encode(payload);

    // 2. Generar llave AES-GCM (256 bits) al vuelo
    const aesKey = await window.crypto.subtle.generateKey(
      { name: "AES-GCM", length: 256 },
      true,
      ["encrypt", "decrypt"]
    );

    // 3. Generar IV (12 bytes es el estándar para GCM)
    const iv = window.crypto.getRandomValues(new Uint8Array(12));

    // 4. Encriptar Datos con AES-GCM
    // WebCrypto concatena automáticamente el Auth Tag al final del ciphertext
    const encryptedContent = await window.crypto.subtle.encrypt(
      { name: "AES-GCM", iv: iv },
      aesKey,
      encodedPayload
    );

    // 5. Encriptar la llave AES con RSA-OAEP
    const publicKey = await importPublicKey(pem);
    const rawAesKey = await window.crypto.subtle.exportKey("raw", aesKey);

    const encryptedAesKey = await window.crypto.subtle.encrypt(
      { name: "RSA-OAEP" },
      publicKey,
      rawAesKey
    );

    return {
      payload: ab2str(encryptedContent), // Ciphertext + Tag
      enc_key: ab2str(encryptedAesKey), // Llave AES protegida
      iv: ab2str(iv), // Vector de inicialización
    };
  } catch (error) {
    console.error("Encryption Failed:", error);
    return null;
  }
};


// Agrega esta nueva función al final de tu archivo encryption.ts

export const generateSecurityHeader = async () => {
  // Encriptamos un objeto vacío solo para llevar el Timestamp y Nonce
  // Reutilizamos la lógica de encryptHybridGCM pero con data null
  const securePacket = await encryptHybridGCM({ _auth: true });
  
  if (!securePacket) return null;

  // Convertimos el objeto { payload, enc_key, iv } a un string JSON base64
  // para que pueda viajar en el Header HTTP sin romperse.
  const jsonString = JSON.stringify(securePacket);
  return window.btoa(jsonString); // Base64 encoding
};