import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { authApi } from "@/api/endpoints";
import { useAuthStore } from "../store";
import type { LoginRequest } from "@/api/types";
import { toast } from "sonner"

export const useLogin = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  return useMutation({
    mutationFn: (credentials: LoginRequest) => authApi.login(credentials),
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      toast( "¡Bienvenido!",{
        description: `Hola ${data.user.name}, has iniciado sesión correctamente.`,
      });
      navigate("/dashboard");
    },
    onError: (error: any) => {
      toast.error("Error al iniciar sesión", /*  */{
        description: error.response?.data?.message || "Credenciales inválidas",
      });
    },
  });
};
