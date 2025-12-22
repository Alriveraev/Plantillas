import axios, { AxiosError } from "axios";
import type { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { toast } from "sonner";
import { env } from "@/config/env";
import { APP_CONSTANTS } from "@/config/constants";
import { useAuthStore } from "@/features/auth/store/authStore";
// Asegúrate de que la ruta de importación sea correcta según tu estructura
import { encryptHybridGCM, generateSecurityHeader } from "@/lib/encryption";

const API_URL = env.apiUrl || "http://localhost:8000/api";

// --- HELPER MANUAL PARA LEER COOKIES ---
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
      withCredentials: true,
      xsrfCookieName: "XSRF-TOKEN",
      xsrfHeaderName: "X-XSRF-TOKEN",
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.client.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        // 1. EXCEPCIÓN CSRF (Ya la tienes)
        if (config.url?.includes("sanctum/csrf-cookie")) {
          return config;
        }

        // 2. INYECCIÓN CSRF MANUAL (Ya lo tienes)
        if (config.method !== "get") {
          const token = getCookie("XSRF-TOKEN");
          if (token) config.headers["X-XSRF-TOKEN"] = decodeURIComponent(token);
        }

        // 🔥 FIX PARA LOGOUT (Y POSTS VACÍOS)
        // Si es un POST/PUT pero no lleva datos (como el logout),
        // le asignamos un objeto vacío para forzar que el sistema de encriptación se active.
        if (config.method !== "get" && !config.data) {
          config.data = {};
        }

        // 3. ENCRIPTACIÓN DE BODY (POST, PUT, PATCH)
        if (
          config.method !== "get" &&
          config.data &&
          !(config.data instanceof FormData)
        ) {
          const envelope = await encryptHybridGCM(config.data);

          config.data = envelope;
        }

        // --- 3. FIRMA DE PETICIONES GET (VISUALIZACIÓN) ---
        if (config.method === "get") {
          const securityToken = await generateSecurityHeader();

          if (securityToken) {
            config.headers["X-Secure-Auth"] = securityToken;
          }
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError<any>) => {
        const { response, config } = error;

        // Si el error fue por cancelación manual (seguridad), lo ignoramos o mostramos alerta
        if (axios.isCancel(error)) {
          toast.error(error.message);
          return Promise.reject(error);
        }

        if (!response) {
          toast.error(
            "Error de conexión. Verifica tu internet o el estado del servidor."
          );
          return Promise.reject(error);
        }

        const status = response.status;
        const data = response.data;
        const errorMessage = data?.message || "Ocurrió un error inesperado.";

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
            // Aquí caerán los errores de encriptación del backend
            toast.warning(errorMessage);
            break;
          case 404:
            if (!config?.url?.includes("sanctum/csrf-cookie")) {
              toast.error("Recurso no encontrado.");
            }
            break;
          case 419:
            toast.error(
              "La sesión de seguridad expiró. Intenta recargar la página."
            );
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
    const rootUrl = API_URL.replace(/\/api\/?$/, "");
    // Esta petición entrará en la excepción del interceptor y pasará limpia
    return this.client.get(`${rootUrl}/sanctum/csrf-cookie`, {
      baseURL: undefined,
    });
  }
}

export const apiClientInstance = new ApiClient();
export const api = apiClientInstance.getInstance();
export const getCsrfCookie = () => apiClientInstance.getCsrfCookie();
