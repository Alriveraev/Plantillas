import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { authApi } from "@/api/endpoints";
import { useAuthStore } from "../store";
import { toast } from "sonner"
export const useLogout = () => {
  const navigate = useNavigate();
  const { clearAuth } = useAuthStore();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      clearAuth();
      toast("/*  */Sesión cerrada",{
        description: "Has cerrado sesión correctamente.",
      });
      navigate("/login");
    },
    onError: () => {
      // Clear auth even if API call fails
      clearAuth();
      navigate("/login");
    },
  });
};
