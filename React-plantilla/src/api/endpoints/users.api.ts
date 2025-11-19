import { apiClient } from "../client";
import type {
  ApiResponse,
  PaginatedResponse,
  QueryParams,
  CreateUserRequest,
  UpdateUserRequest,
  UserDetail,
} from "../types";

export const usersApi = {
  getAll: async (
    params?: QueryParams
  ): Promise<PaginatedResponse<UserDetail>> => {
    const { data } = await apiClient.get<
      ApiResponse<PaginatedResponse<UserDetail>>
    >("/users", {
      params,
    });
    return data.data;
  },

  getById: async (id: string): Promise<UserDetail> => {
    const { data } = await apiClient.get<ApiResponse<UserDetail>>(
      `/users/${id}`
    );
    return data.data;
  },

  create: async (userData: CreateUserRequest): Promise<UserDetail> => {
    const { data } = await apiClient.post<ApiResponse<UserDetail>>(
      "/users",
      userData
    );
    return data.data;
  },

  update: async (
    id: string,
    userData: UpdateUserRequest
  ): Promise<UserDetail> => {
    const { data } = await apiClient.patch<ApiResponse<UserDetail>>(
      `/users/${id}`,
      userData
    );
    return data.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/users/${id}`);
  },
};
