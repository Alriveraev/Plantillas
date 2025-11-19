import { useQuery } from "@tanstack/react-query";
import { usersApi } from "@/api/endpoints";
import { APP_CONSTANTS } from "@/config/constants";

export const useUser = (id: string) => {
  return useQuery({
    queryKey: [APP_CONSTANTS.QUERY_KEYS.USER, id],
    queryFn: () => usersApi.getById(id),
    enabled: !!id,
  });
};
