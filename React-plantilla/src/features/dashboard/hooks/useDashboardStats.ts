import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/client/axios.client";
import { APP_CONSTANTS } from "@/config/constants";

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  newUsers: number;
  totalRevenue: number;
}

const fetchDashboardStats = async (): Promise<DashboardStats> => {
  const { data } = await api.get("/dashboard/stats");
  return data.data;
};

export const useDashboardStats = () => {
  return useQuery({
    queryKey: [APP_CONSTANTS.QUERY_KEYS.DASHBOARD, "stats"],
    queryFn: fetchDashboardStats,
  });
};
