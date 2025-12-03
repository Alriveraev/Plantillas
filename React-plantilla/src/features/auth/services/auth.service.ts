import { api, getCsrfCookie } from "@/api/client/axios.client";
import type {
  LoginCredentials,
  LoginResponse,
  Verify2FAPayload,
  ResetPasswordRequest,
} from "@/api/types";

export const authService = {
  /**
   * Iniciar Sesión
   * 1. Pide Cookie CSRF
   * 2. Envía credenciales
   */
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    await getCsrfCookie(); // Vital en SPA
    const { data } = await api.post<LoginResponse>("/login", credentials);
    return data;
  },

  /**
   * Cerrar Sesión
   */
  logout: async (): Promise<void> => {
    await api.post("/logout");
  },

  /**
   * Obtener Usuario Actual (Persistencia de Sesión)
   */
  getMe: async () => {
    const { data } = await api.get("/user/me");
    return data;
  },

  /**
   * Verificar Código 2FA (Paso 2 del Login)
   */
  verify2FA: async (payload: Verify2FAPayload) => {
    const { data } = await api.post("/2fa/verify", payload);
    return data;
  },

  /**
   * Recuperación de Contraseña (Forgot Password)
   * Envía el link al correo del usuario.
   */
  forgotPassword: async (email: string) => {
    await getCsrfCookie();
    return api.post("/forgot-password", { email });
  },

  /**
   * Verificar validez del Token de Reset (Paso previo al formulario)
   * Se llama al entrar a la página de Reset para ver si el link es válido.
   */
  verifyResetToken: async (token: string, email: string) => {
    // Agregamos CSRF aquí también para evitar fallos si la ruta tiene middleware web
    await getCsrfCookie();
    return api.post("/reset-password/verify-token", { token, email });
  },

  /**
   * Resetear Contraseña (Acción final)
   */
  resetPassword: async (payload: ResetPasswordRequest) => {
    await getCsrfCookie();
    return api.post("/reset-password", payload);
  },
};