import { type RouteObject } from "react-router";
import { lazyImport } from "@/routes/utils/lazyImport";
import { ROUTE_PATHS } from "@/routes/paths";

const ProfilePage = lazyImport(() => import("../pages/ProfilePage"), "ProfilePage");

export const profileRoutes: RouteObject[] = [
  {
    path: ROUTE_PATHS.PROFILE,
    element: <ProfilePage />,
    handle: {
      title: "Mi Perfil",
      description: "Configuración de tu perfil personal",
      breadcrumb: "Perfil",
      icon: "user-circle",
      requiresAuth: true,
    },
  },
];