import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usersApi } from "@/api/endpoints";
import { APP_CONSTANTS } from "@/config/constants";
import type { CreateUserRequest } from "@/api/types";
import { toast } from "sonner";

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: CreateUserRequest) => usersApi.create(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [APP_CONSTANTS.QUERY_KEYS.USERS],
      });
      toast("Usuario creado", {
        description: "El usuario ha sido creado exitosamente.",
      });
    },
    onError: (error: any) => {
      toast.error("Error al crear usuario", {
        description:
          error.response?.data?.message ||
          "Ocurrió un error al crear el usuario",
      });
    },
  });
};
