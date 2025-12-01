import axios, { AxiosError } from "axios";
import type { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { env } from "@/config/env";
import { APP_CONSTANTS } from "@/config/constants";
import { useAuthStore } from "@/features/auth/store/authStore";

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: env.apiUrl,
      timeout: APP_CONSTANTS.REQUEST_TIMEOUT,
      headers: {
        "Content-Type": "application/json",
        // 🔥 CAMBIO 1: Indispensable para Laravel.
        // Si no lo pones, Laravel te responderá con HTML (redirección al login) en vez de JSON cuando haya error.
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
      // 🔥 CAMBIO 2 (Ya lo tenías): Permite enviar la cookie HttpOnly automáticamente
      withCredentials: true,
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // Laravel Sanctum busca automáticamente la cookie 'XSRF-TOKEN'
        // y la pone en la cabecera 'X-XSRF-TOKEN'.
        // Axios hace esto por defecto cuando withCredentials es true,
        // así que NO necesitas hacer nada aquí.
        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      }
    );

    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config;

        // Si recibimos un 401 (No autenticado)
        if (error.response?.status === 401) {
          // Evitamos bucles infinitos si el error viene del mismo endpoint de login
          if (
            originalRequest?.url?.includes("/login") ||
            originalRequest?.url?.includes("/sanctum/csrf-cookie")
          ) {
            return Promise.reject(error);
          }

          // Limpiamos el store de Zustand y redirigimos (opcional)
          useAuthStore.getState().clearAuth();

          // Opcional: forzar recarga o redirección
          // window.location.href = "/auth/login";
        }

        // Manejo del 419 (Token CSRF expirado o faltante)
        if (error.response?.status === 419) {
          // Aquí podrías intentar refrescar el token CSRF automáticamente
          // pero generalmente es mejor dejar que falle y el usuario reintente.
          console.error("CSRF Token Mismatch");
        }

        return Promise.reject(error);
      }
    );
  }

  public getInstance(): AxiosInstance {
    return this.client;
  }

  // Helper para inicializar la protección CSRF antes del login
  public async getCsrfCookie() {
    return this.client.get("/sanctum/csrf-cookie");
  }
}

export const apiClient = new ApiClient(); // Exportamos la clase o la instancia según prefieras
export const api = apiClient.getInstance(); // Exportación rápida para usar directamente
