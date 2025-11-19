import { Users, UserCheck, UserPlus, DollarSign } from "lucide-react";
import { StatsCard, RecentActivity, ActivityChart } from "../components";
import { useDashboardStats } from "../hooks";
import { LoadingScreen } from "@/shared/components";

export const DashboardPage = () => {
  const { data: stats, isLoading } = useDashboardStats();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Resumen general del sistema</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Usuarios"
          value={stats?.totalUsers || 0}
          icon={Users}
          description="Usuarios registrados"
        />
        <StatsCard
          title="Usuarios Activos"
          value={stats?.activeUsers || 0}
          icon={UserCheck}
          description="Usuarios activos"
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Nuevos Usuarios"
          value={stats?.newUsers || 0}
          icon={UserPlus}
          description="Este mes"
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="Ingresos"
          value={`$${stats?.totalRevenue || 0}`}
          icon={DollarSign}
          description="Total del mes"
          trend={{ value: 5, isPositive: false }}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4">
          <ActivityChart />
        </div>
        <div className="col-span-3">
          <RecentActivity />
        </div>
      </div>
    </div>
  );
};
