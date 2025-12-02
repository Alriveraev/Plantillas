import { createBrowserRouter, Navigate, type RouteObject } from "react-router"; // O react-router-dom
import { RootLayout, PublicLayout, PrivateLayout } from "@/layouts";
import { ProtectedRoute } from "./guards/ProtectedRoute";
import { NotFound, RouteErrorBoundary } from "@/shared/components";
import { ROUTES } from "./paths";

// --- Importar Rutas por Feature ---
import { authRoutes } from "@/features/auth/routes/auth.routes";
import { dashboardRoutes } from "@/features/dashboard/routes/dashboard.routes";
import { usersRoutes } from "@/features/users/routes/users.routes";
import { profileRoutes } from "@/features/profile/routes/profile.routes";

// --- AGREGACIÓN DE RUTAS ---

// Mantenemos esta exportación para que tu Sidebar/Breadcrumbs sigan funcionando
export const publicRoutes: RouteObject[] = [
  ...authRoutes, // Spread operator para fusionar las rutas de Auth
];

// Mantenemos esta exportación también
export const privateRoutes: RouteObject[] = [
  ...dashboardRoutes,
  ...usersRoutes,
  ...profileRoutes,
];

// --- CONFIGURACIÓN PRINCIPAL ---

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

      // Layout Público
      {
        element: <PublicLayout />,
        errorElement: <RouteErrorBoundary />,
        children: publicRoutes, // Usamos la variable que acabamos de componer arriba
      },

      // Layout Privado (Protegido)
      {
        element: <ProtectedRoute />,
        errorElement: <RouteErrorBoundary />,
        children: [
          {
            element: <PrivateLayout />,
            children: privateRoutes, // Usamos la variable compuesta arriba
          },
        ],
      },

      // 404
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);
