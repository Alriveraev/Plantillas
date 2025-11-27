import { useMutation } from "@tanstack/react-query";
import type { ChangePasswordRequest } from "@/api/endpoints";
import { profileApi } from "@/api/endpoints";
import { toast } from "sonner";

export const useChangePassword = () => {
  return useMutation({
    mutationFn: (data: ChangePasswordRequest) =>
      profileApi.changePassword(data),
    onSuccess: () => {
      toast("Contraseña actualizada", {
        description: "Tu contraseña ha sido cambiada exitosamente.",
      });
    },
    onError: (error: any) => {
      toast.error("Error al Cambiar contraseña", {
        description:
          error.response?.data?.message || "La contraseña actual es incorrecta",
      });
    },
  });
};
