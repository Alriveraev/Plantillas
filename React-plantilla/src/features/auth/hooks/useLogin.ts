import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { AxiosError } from "axios";
import { authService } from "../services/auth.service";
import { useAuthStore } from "../store/authStore";
import type { LoginRequest } from "@/api/types";
import { toast } from "sonner";

interface ErrorResponse {
  message: string;
}

export const useLogin = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  return useMutation({
    mutationFn: (credentials: LoginRequest) => authService.login(credentials),

    onSuccess: (data) => {
      if (data.require_2fa) {
        toast.info("Se requiere código de verificación.");
        navigate("/auth/verify-2fa");
        return;
      }

      if (data.user) {
        setAuth(data.user);
        toast.success(
          `Hola ${data?.user?.profile?.first_name}, has iniciado sesión correctamente.`
        );
        navigate("/dashboard");
      }
    },

    onError: (error: AxiosError<ErrorResponse>) => {
      if (error.response?.status !== 422) {
        toast.error(error.response?.data?.message || "Error al iniciar sesión");
      }
    },
  });
};
