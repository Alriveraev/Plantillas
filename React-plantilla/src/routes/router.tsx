import { createBrowserRouter, Navigate, type RouteObject } from "react-router";
import { RootLayout, PublicLayout, PrivateLayout } from "@/layouts";
import { ProtectedRoute } from "./guards/ProtectedRoute";
import { NotFound, RouteErrorBoundary } from "@/shared/components";
import { lazyImport } from "./utils/lazyImport";
import { ROUTES, ROUTE_PATHS } from "./paths";
import { UserRole } from "@/api/types";

// --- Lazy Loading Definitions ---
const LoginPage = lazyImport(
  () => import("@/features/auth/pages/LoginPage"),
  "LoginPage"
);
const RegisterPage = lazyImport(
  () => import("@/features/auth/pages/RegisterPage"),
  "RegisterPage"
);
const DashboardPage = lazyImport(
  () => import("@/features/dashboard/pages/DashboardPage"),
  "DashboardPage"
);
const UsersPage = lazyImport(
  () => import("@/features/users/pages/UsersPage"),
  "UsersPage"
);
const UserDetailPage = lazyImport(
  () => import("@/features/users/pages/UserDetailPage"),
  "UserDetailPage"
);
const ProfilePage = lazyImport(
  () => import("@/features/profile/pages/ProfilePage"),
  "ProfilePage"
);

// --- Rutas Públicas ---
const publicRoutes: RouteObject[] = [
  {
    path: ROUTE_PATHS.LOGIN,
    element: <LoginPage />,
    handle: {
      title: "Iniciar Sesión",
      description: "Ingresa a tu cuenta",
      hideBreadcrumb: true,
      layout: "minimal",
    },
  },
  {
    path: ROUTE_PATHS.REGISTER,
    element: <RegisterPage />,
    handle: {
      title: "Registrarse",
      description: "Crea una nueva cuenta",
      hideBreadcrumb: true,
      layout: "minimal",
    },
  },
];

// --- Rutas Privadas ---
export const privateRoutes: RouteObject[] = [
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
          // El hijo mantiene metadata específica para breadcrumbs o títulos internos
          title: "Listado de Usuarios",/*  */
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
          // No necesitamos repetir el icono aquí, ya lo tiene el padre
          requiresAuth: true,
          roles: [UserRole.ADMIN, UserRole.MODERATOR],
          permissions: ["view_users"],
        },
      },
    ],
  },
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

// --- Configuración Principal ---
export const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <RootLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        index: true,
        element: <Navigate to={ROUTES.DASHBOARD} replace />,
      },
      {
        element: <PublicLayout />,
        errorElement: <RouteErrorBoundary />,
        children: publicRoutes,
      },
      {
        element: <ProtectedRoute />,
        errorElement: <RouteErrorBoundary />,
        children: [
          {
            element: <PrivateLayout />,
            children: privateRoutes,
          },
        ],
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);