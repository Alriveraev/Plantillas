import axios, { AxiosError } from "axios";
import type { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { env } from "@/config/env";
import { APP_CONSTANTS } from "@/config/constants";
import { useAuthStore } from "@/features/auth/store/authStore"; // Ajusta la ruta a tu store

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: env.apiUrl,
      timeout: APP_CONSTANTS.REQUEST_TIMEOUT,
      headers: {
        "Content-Type": "application/json",
      },
      // 🔥 CAMBIO CRÍTICO: Esto permite enviar/recibir cookies del backend
      withCredentials: true,
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // 🗑️ ELIMINADO: Ya no leemos el token ni lo inyectamos manualmente.
        // El navegador inyectará la cookie HttpOnly automáticamente.
        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config;

        if (error.response?.status === 401) {
          if (originalRequest?.url?.includes("/auth/login")) {
            return Promise.reject(error);
          }

          // Si el backend dice 401, limpiamos el estado visual del usuario
          useAuthStore.getState().clearAuth();

          // Opcional: Redirigir si es crítico
          // window.location.href = "/login";
        }

        return Promise.reject(error);
      }
    );
  }

  public getInstance(): AxiosInstance {
    return this.client;
  }
}

export const apiClient = new ApiClient().getInstance();
