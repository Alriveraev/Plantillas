import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usersApi } from "@/api/endpoints";
import { APP_CONSTANTS } from "@/config/constants";
import { toast } from "sonner";

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => usersApi.delete(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [APP_CONSTANTS.QUERY_KEYS.USERS],
      });
      toast("Usuario eliminado", {
        description: "El usuario ha sido eliminado exitosamente.",
      });
    },
    onError: (error: any) => {
      toast.error("Error al eliminar usuario", {
        description:
          error.response?.data?.message ||
          "Ocurrió un error al eliminar el usuario",
      });
    },
  });
};
