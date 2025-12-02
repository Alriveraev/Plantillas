import axios, { AxiosError } from "axios";
import type { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { toast } from "sonner";
import { env } from "@/config/env";
import { APP_CONSTANTS } from "@/config/constants";
import { useAuthStore } from "@/features/auth/store/authStore";

const API_URL = env.apiUrl || "http://localhost:8000/api";

// --- HELPER MANUAL PARA LEER COOKIES ---
// A veces axios automático falla leyendo la cookie recién llegada.
// Esto asegura que la leamos directamente del navegador.
function getCookie(name: string): string | undefined {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
}

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      timeout: APP_CONSTANTS.REQUEST_TIMEOUT,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
      withCredentials: true, // Vital para cookies
      // Configuración explícita para que Axios sepa qué buscar
      xsrfCookieName: "XSRF-TOKEN",
      xsrfHeaderName: "X-XSRF-TOKEN",
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // 🔥 FIX CRÍTICO: Inyección Manual del Token CSRF
        // Si es una petición que modifica datos (POST, PUT, DELETE, PATCH)
        // leemos la cookie manualmente y la forzamos en la cabecera.
        if (config.method !== "get") {
          const token = getCookie("XSRF-TOKEN");
          if (token) {
            // Decodificamos porque Laravel la envía URL-encoded
            config.headers["X-XSRF-TOKEN"] = decodeURIComponent(token);
          }
        }
        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      }
    );

    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError<any>) => {
        const { response, config } = error;

        if (!response) {
          toast.error(
            "Error de conexión. Verifica tu internet o el estado del servidor."
          );
          return Promise.reject(error);
        }

        const status = response.status;
        const data = response.data;
        const errorMessage = data?.message || "Ocurrió un error inesperado.";

        // 🔥 FIX: Lista de peticiones que NO deben mostrar alerta si dan 401
        // Agregamos '/user/me' para que la carga inicial de la app sea silenciosa si es invitado.
        const isSilentRequest =
          config?.url?.includes("/login") ||
          config?.url?.includes("/sanctum/csrf-cookie") ||
          config?.url?.includes("/user/me");

        switch (status) {
          case 401:
            if (!isSilentRequest) {
              useAuthStore.getState().clearAuth();
              toast.error("Tu sesión ha expirado.");
            }
            break;
          case 403:
            toast.warning(errorMessage);
            break;
          case 404:
            if (!config?.url?.includes("sanctum/csrf-cookie")) {
              toast.error("Recurso no encontrado.");
            }
            break;
          case 419:
            // Si falla el CSRF, intentamos refrescar la página o avisar
            toast.error("La sesión de seguridad expiró. Intenta de nuevo.");
            break;
          case 422:
            console.warn("Error de validación:", data.errors);
            break;
          case 429:
            toast.error("Demasiados intentos. Espera un momento.");
            break;
          case 500:
          case 503:
            toast.error("Error interno del servidor.");
            break;
          default:
            toast.error(errorMessage);
        }

        return Promise.reject(error);
      }
    );
  }

  public getInstance(): AxiosInstance {
    return this.client;
  }

  public async getCsrfCookie() {
    // Apuntamos a la raíz del servidor http://localhost:8000 quitando '/api'
    const rootUrl = API_URL.replace(/\/api\/?$/, "");
    return this.client.get(`${rootUrl}/sanctum/csrf-cookie`, {
      baseURL: undefined,
    });
  }
}

export const apiClientInstance = new ApiClient();
export const api = apiClientInstance.getInstance();
export const getCsrfCookie = () => apiClientInstance.getCsrfCookie();