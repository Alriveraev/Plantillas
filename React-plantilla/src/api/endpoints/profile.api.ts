import { api } from "@/api/client/axios.client";
import type { ApiResponse, User } from "../types";

export interface UpdateProfileRequest {
  name?: string;
  email?: string;
  avatar?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  newPasswordConfirmation: string;
}

export const profileApi = {
  get: async (): Promise<User> => {
    const { data } = await api.get<ApiResponse<User>>("/profile");
    return data.data;
  },

  update: async (profileData: UpdateProfileRequest): Promise<User> => {
    const { data } = await api.patch<ApiResponse<User>>(
      "/profile",
      profileData
    );
    return data.data;
  },

  changePassword: async (
    passwordData: ChangePasswordRequest
  ): Promise<void> => {
    await api.post("/profile/change-password", passwordData);
  },

  uploadAvatar: async (file: File): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append("avatar", file);

    const { data } = await api.post<ApiResponse<{ url: string }>>(
      "/profile/avatar",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return data.data;
  },
};
