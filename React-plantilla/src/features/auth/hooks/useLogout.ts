import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { authService } from "../services/auth.service";
import { useAuthStore } from "../store/authStore";
import { toast } from "sonner";

export const useLogout = () => {
  const navigate = useNavigate();
  const { clearAuth } = useAuthStore();
  const queryClient = useQueryClient(); // Para limpiar caché

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      clearAuth(); // Limpia estado de Zustand
      queryClient.clear(); // Limpia caché de React Query (usuario, datos, etc.)

      toast.success("Sesión cerrada", {
        description: "Has cerrado sesión correctamente.",
      });

      navigate("/login");
    },
    onError: () => {
      clearAuth();
      queryClient.clear();
      navigate("/login");
    },
  });
};
