import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { AxiosError } from "axios";
import { authService } from "../services/auth.service"; // Tu servicio
import { useAuthStore } from "../store/authStore";
import type { LoginCredentials } from "@/api/types"; // Usamos tus tipos
import { toast } from "sonner";

interface ErrorResponse {
  message: string;
}

export const useLogin = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  return useMutation({
    // Usamos el servicio oficial
    mutationFn: (credentials: LoginCredentials) => authService.login(credentials),

    onSuccess: (data) => {
      // CASO 1: El backend pide 2FA
      // No hacemos nada aquí, el componente LoginForm detectará esto
      // y cambiará la vista.
      if (data.require_2fa) {
        return;
      }

      // CASO 2: Login Exitoso directo (Sin 2FA)
      if (data.user) {
        setAuth(data.user);
        toast.success(
          `Hola ${data?.user?.profile?.first_name || 'Usuario'}, has iniciado sesión correctamente.`
        );
        navigate("/dashboard");
      }
    },

    onError: (error: AxiosError<ErrorResponse>) => {
      // Ignoramos 422 si lo usas para validaciones de formulario específicas en Formik
      if (error.response?.status !== 422) {
        toast.error(error.response?.data?.message || "Error al iniciar sesión");
      }
    },
  });
};