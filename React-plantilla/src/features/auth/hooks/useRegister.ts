import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { authApi } from "@/api/endpoints";
import { useAuthStore } from "../store";
import type { RegisterRequest } from "@/api/types";
import { toast } from "sonner";

export const useRegister = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  return useMutation({
    mutationFn: (userData: RegisterRequest) => authApi.register(userData),
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      toast("¡Cuenta creada!", {
        description: "Tu cuenta ha sido creada exitosamente.",
      });
      navigate("/dashboard");
    },
    onError: (error: any) => {
      toast.error("Error al registrarse", {
        description:
          error.response?.data?.message ||
          "Ocurrió un error al crear tu cuenta",
      });
    },
  });
};
