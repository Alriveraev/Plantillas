import { api } from "@/api/client/axios.client";
import type { User } from "@/api/types/auth.types";

// ==========================================
// Interfaces de Tipado
// ==========================================

export interface UpdatePasswordData {
  current_password: string;
  password: string;
  password_confirmation: string;
}

export interface TwoFactorEnableResponse {
  message: string;
  secret: string;
  qr_code_url: string; // URL otpauth:// para generar el QR
}

export interface TwoFactorConfirmResponse {
  message: string;
  recovery_codes: string[]; // Array de strings para mostrar al usuario
}

export interface PasswordConfirmationPayload {
  password: string;
}

// ==========================================
// Servicio Profile (Perfil + Seguridad)
// ==========================================

export const profileService = {
  /**
   * Actualizar Avatar (y resto de datos requeridos por validación)
   */
  updateAvatar: async (file: File, currentUser: User) => {
    const formData = new FormData();

    // 1. Datos obligatorios
    formData.append("email", currentUser.email);

    // 2. Datos del Perfil (Mapeo seguro)
    const p = (currentUser.profile as any) || {};

    formData.append(
      "first_name",
      p.first_name || currentUser.name.split(" ")[0]
    );
    formData.append("second_name", p.second_name || "");
    formData.append("third_name", p.third_name || "");
    formData.append(
      "first_surname",
      p.first_surname || p.last_name || "Apellido"
    );
    formData.append("second_surname", p.second_surname || "");
    formData.append("phone", p.phone || "");

    if (p.gender_id) {
      formData.append("gender_id", p.gender_id);
    }

    // 3. El archivo
    formData.append("avatar", file);

    const { data } = await api.post<{ user: User; message: string }>(
      "/user/profile/info",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    return data;
  },

  /**
   * Actualizar Información de Texto
   */
  updateInfo: async (data: Partial<User> & any) => {
    const { data: response } = await api.post<{ user: User; message: string }>(
      "/user/profile/info",
      data
    );
    return response;
  },

  /**
   * Actualizar Contraseña
   */
  updatePassword: async (data: UpdatePasswordData) => {
    const { data: response } = await api.put<{ message: string }>(
      "/user/profile/password",
      data
    );
    return response;
  },

  // ============================================================
  // SEGURIDAD: 2FA (Doble Factor)
  // ============================================================

  /**
   * Paso 1: Habilitar 2FA
   * Obtiene el secreto y la URL del QR para mostrar al usuario.
   */
  enableTwoFactor: async () => {
    const { data } = await api.post<TwoFactorEnableResponse>(
      "/user/security/2fa/enable"
    );
    return data;
  },

  /**
   * Paso 2: Confirmar 2FA
   * Envía el código TOTP para activar definitivamente el 2FA.
   * Retorna los códigos de recuperación.
   */
  confirmTwoFactor: async (code: string) => {
    const { data } = await api.post<TwoFactorConfirmResponse>(
      "/user/security/2fa/confirm",
      { code }
    );
    return data;
  },

  /**
   * Desactivar 2FA
   * Requiere la contraseña actual del usuario por seguridad.
   */
  disableTwoFactor: async (password: string) => {
    const { data } = await api.post<{ message: string }>(
      "/user/security/2fa/disable",
      { password }
    );
    return data;
  },

  /**
   * Regenerar Códigos de Recuperación
   * Útil si el usuario los perdió o gastó.
   * (Asegúrate de agregar la ruta en api.php si decides usarla: POST /user/security/2fa/regenerate)
   */
  regenerateRecoveryCodes: async (password: string) => {
    const { data } = await api.post<TwoFactorConfirmResponse>(
      "/user/security/2fa/regenerate-codes",
      { password }
    );
    return data;
  },

  // ============================================================
  // SEGURIDAD: Gestión de Sesiones
  // ============================================================

  /**
   * Cerrar sesión en otros dispositivos
   * Invalida todas las sesiones excepto la actual. Requiere password.
   */
  logoutOtherSessions: async (password: string) => {
    const { data } = await api.post<{ message: string }>(
      "/user/security/logout-others",
      { password }
    );
    return data;
  },
};
