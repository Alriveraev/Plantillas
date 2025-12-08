import { useMutation } from "@tanstack/react-query";
import { profileService } from "@/features/profile/services/profile.service";
import type { UpdatePasswordData } from "@/features/profile/services/profile.service";

import { toast } from "sonner";

export const useChangePassword = () => {
  return useMutation({
    mutationFn: (data: UpdatePasswordData) =>
      profileService.updatePassword(data),
    onSuccess: (data) => {
      toast.success(data.message || "Contraseña actualizada correctamente");
    },
    onError: (error: any) => {
      // Manejo robusto de errores de Laravel (422 o 403)
      const message =
        error.response?.data?.message || "Error al actualizar la contraseña";
      toast.error("Error de seguridad", {
        description: message,
      });
    },
  });
};
