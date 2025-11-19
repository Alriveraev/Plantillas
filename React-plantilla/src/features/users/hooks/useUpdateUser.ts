import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usersApi } from "@/api/endpoints";
import { APP_CONSTANTS } from "@/config/constants";
import type { UpdateUserRequest } from "@/api/types";
import { toast } from "sonner";

export const useUpdateUser = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: UpdateUserRequest) =>
      usersApi.update(userId, userData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [APP_CONSTANTS.QUERY_KEYS.USERS],
      });
      queryClient.invalidateQueries({
        queryKey: [APP_CONSTANTS.QUERY_KEYS.USER, userId],
      });
      toast("Usuario actualizado", {
        description: "El usuario ha sido actualizado exitosamente.",
      });
    },
    onError: (error: any) => {
      toast.error("Error al actualizar usuario", {
        description:
          error.response?.data?.message ||
          "Ocurrió un error al actualizar el usuario",
      });
    },
  });
};
