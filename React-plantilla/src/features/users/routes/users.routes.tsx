import { type RouteObject } from "react-router";
import { lazyImport } from "@/routes/utils/lazyImport";
import { ROUTE_PATHS } from "@/routes/paths";
import { UserRole } from "@/api/types";

const UsersPage = lazyImport(() => import("../pages/UsersPage"), "UsersPage");
const UserDetailPage = lazyImport(
  () => import("../pages/UserDetailPage"),
  "UserDetailPage"
);

export const usersRoutes: RouteObject[] = [
  {
    path: ROUTE_PATHS.USERS,
    handle: {
      title: "Usuarios",
      icon: "users",
      requiresAuth: true,
      roles: [UserRole.ADMIN, UserRole.MODERATOR],
      permissions: ["view_users"],
    },
    children: [
      {
        index: true,
        element: <UsersPage />,
        handle: {
          title: "Listado de Usuarios",
          description: "Gestión de usuarios del sistema",
          breadcrumb: "Listado",
        },
      },
      {
        path: ROUTE_PATHS.USER_DETAIL,
        element: <UserDetailPage />,
        handle: {
          title: "Detalle de Usuario",
          description: "Información detallada del usuario",
          breadcrumb: "Detalle",
          // Hereda roles del padre, pero podemos ser explícitos si queremos
          requiresAuth: true,
        },
      },
    ],
  },
];
