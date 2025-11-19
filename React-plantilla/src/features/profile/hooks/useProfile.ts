import { useQuery } from "@tanstack/react-query";
import { profileApi } from "@/api/endpoints";
import { APP_CONSTANTS } from "@/config/constants";

export const useProfile = () => {
  return useQuery({
    queryKey: [APP_CONSTANTS.QUERY_KEYS.PROFILE],
    queryFn: () => profileApi.get(),
  });
};
