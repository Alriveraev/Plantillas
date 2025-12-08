import { useMutation } from "@tanstack/react-query";
import { profileService } from "@/features/profile/services/profile.service"; 
import { toast } from "sonner";

export const useCloseSessions = () => {
  return useMutation({
    mutationFn: (password: string) =>
      profileService.logoutOtherSessions(password),
    onSuccess: () => {
      toast.success("Sesiones cerradas", {
        description:
          "Se han cerrado las sesiones en todos los demás dispositivos.",
      });
    },
    onError: (error: any) => {
      toast.error("Error de seguridad", {
        description:
          error.response?.data?.message || "La contraseña es incorrecta.",
      });
    },
  });
};
