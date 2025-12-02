import { useMutation } from "@tanstack/react-query";
import { profileService } from "@/features/profile/services/profile.service";
import { useAuthStore } from "@/features/auth/store/authStore";
import { toast } from "sonner";

export const useUpdateProfile = () => {
  const { setAuth } = useAuthStore();

  return useMutation({
    mutationFn: profileService.updateInfo,
    onSuccess: (data) => {
      // Actualizamos el usuario en el store con la respuesta fresca del backend
      setAuth(data.user);
      toast.success("Perfil actualizado", {
        description: "Tus datos personales han sido guardados.",
      });
    },
    onError: (error: any) => {
      // El manejo de errores 422 se hace en el formulario, 
      // aquí capturamos otros errores si es necesario.
      if (error.response?.status !== 422) {
        toast.error("Error al actualizar", {
          description: error.response?.data?.message || "Ocurrió un error inesperado.",
        });
      }
    },
  });
};