import { apiClient } from "../client";
import type {
  ApiResponse,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
} from "../types";

export const authApi = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const { data } = await apiClient.post<ApiResponse<AuthResponse>>(
      "/auth/login",
      credentials
    );
    return data.data;
  },

  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    const { data } = await apiClient.post<ApiResponse<AuthResponse>>(
      "/auth/register",
      userData
    );
    return data.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post("/auth/logout");
  },

  me: async (): Promise<AuthResponse["user"]> => {
    const { data } = await apiClient.get<ApiResponse<AuthResponse["user"]>>(
      "/auth/me"
    );
    return data.data;
  },

  refreshToken: async (): Promise<{ token: string }> => {
    const { data } = await apiClient.post<ApiResponse<{ token: string }>>(
      "/auth/refresh"
    );
    return data.data;
  },
};
