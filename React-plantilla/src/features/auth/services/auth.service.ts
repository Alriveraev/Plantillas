import { api, getCsrfCookie } from "@/api/client/axios.client";
import type {
  LoginCredentials,
  LoginResponse,
  Verify2FAPayload,
  ResetPasswordRequest,
} from "@/api/types"; // Asume tipos

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
   */
  forgotPassword: async (email: string) => {
    await getCsrfCookie();
    return api.post("/forgot-password", { email });
  },

  /**
   * Resetear Contraseña (Con token del email)
   */
  resetPassword: async (payload: ResetPasswordRequest) => {
    await getCsrfCookie();
    return api.post("/reset-password", payload);
  },
};
