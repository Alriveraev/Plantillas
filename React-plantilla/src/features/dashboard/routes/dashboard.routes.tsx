import { type RouteObject } from "react-router";
import { lazyImport } from "@/routes/utils/lazyImport";
import { ROUTE_PATHS } from "@/routes/paths";

const DashboardPage = lazyImport(
  () => import("../pages/DashboardPage"),
  "DashboardPage"
);

export const dashboardRoutes: RouteObject[] = [
  {
    path: ROUTE_PATHS.DASHBOARD,
    element: <DashboardPage />,
    handle: {
      title: "Dashboard",
      description: "Panel de control principal",
      breadcrumb: "Inicio",
      icon: "dashboard",
      requiresAuth: true,
      analytics: {
        category: "navigation",
        action: "view_dashboard",
      },
    },
  },
];
