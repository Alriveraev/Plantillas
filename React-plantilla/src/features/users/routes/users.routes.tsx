import { type RouteObject, Outlet } from "react-router"; // 1. Importamos Outlet
import { lazyImport } from "@/routes/utils/lazyImport";
import { ROUTE_PATHS } from "@/routes/paths";
import { UserRole } from "@/api/types";

// Importación dinámica de componentes
const UsersPage = lazyImport(() => import("../pages/UsersPage"), "UsersPage");
const UserDetailPage = lazyImport(
  () => import("../pages/UserDetailPage"),
  "UserDetailPage"
);

export const usersRoutes: RouteObject[] = [
  {
    path: ROUTE_PATHS.USERS,
    element: <Outlet />,
    handle: {
      title: "Usuarios",
      icon: "users",
      requiresAuth: true,
      roles: [UserRole.ADMIN, UserRole.MODERATOR],
      permissions: ["users.view", "users.detail"],
      description: "Gestión de usuarios del sistema",
    },
    children: [
      {
        index: true,
        element: <UsersPage />,
      },
      {
        path: ROUTE_PATHS.USER_DETAIL,
        element: <UserDetailPage />,
        handle: {
          index: false,
          title: "Detalle de Usuario",
          description: "Información detallada del usuario",
          breadcrumb: "Detalle",
          requiresAuth: true,
          hideInMenu: true,
        },
      },
    ],
  },
];
