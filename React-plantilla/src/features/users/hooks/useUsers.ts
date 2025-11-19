import { useQuery } from "@tanstack/react-query";
import { usersApi } from "@/api/endpoints";
import { APP_CONSTANTS } from "@/config/constants";
import type { QueryParams } from "@/api/types";

export const useUsers = (params?: QueryParams) => {
  return useQuery({
    queryKey: [APP_CONSTANTS.QUERY_KEYS.USERS, params],
    queryFn: () => usersApi.getAll(params),
  });
};
