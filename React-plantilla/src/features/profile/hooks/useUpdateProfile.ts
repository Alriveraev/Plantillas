import { useMutation, useQueryClient } from "@tanstack/react-query";
import { profileApi } from "@/api/endpoints";
import type { UpdateProfileRequest } from "@/api/endpoints";

import { APP_CONSTANTS } from "@/config/constants";
import { useAuthStore } from "@/features/auth/store";
import { toast } from "sonner";

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { updateUser } = useAuthStore();

  return useMutation({
    mutationFn: (profileData: UpdateProfileRequest) =>
      profileApi.update(profileData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [APP_CONSTANTS.QUERY_KEYS.PROFILE],
      });
      updateUser(data);
      toast("Perfil actualizado", {
        description: "Tu perfil ha sido actualizado exitosamente.",
      });
    },
    onError: (error: any) => {
      toast.error("Error al actualizar perfil", {
        description:
          error.response?.data?.message ||
          "Ocurrió un error al actualizar tu perfil",
      });
    },
  });
};
