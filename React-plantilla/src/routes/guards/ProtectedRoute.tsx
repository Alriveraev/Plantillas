import { Navigate, Outlet, useLocation, useMatches } from "react-router";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { LoadingScreen } from "@/shared/components/LoadingScreen"; // Ajusta si tu componente se llama diferente
import { ForbiddenPage } from "@/shared/components/ForbiddenPage";
import type { RouteHandle } from "@/routes/types";

export const ProtectedRoute = () => {
  const { isAuthenticated, user, isLoading, hasRole, hasPermission } = useAuth();
  const matches = useMatches();
  const location = useLocation();

  // 1. Esperar a que se verifique la sesión (cookie check)
  if (isLoading) {
    return <LoadingScreen />;
  }

  // 2. Verificar Autenticación Básica
  if (!isAuthenticated || !user) {
    // Redirigir al login guardando la ubicación intentada para volver después
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Validar Permisos y Roles (RBAC)
  // Recorremos todas las rutas activas (Padre -> Hijo -> Nieto)
  // Si CUALQUIERA tiene restricciones que no cumplimos, bloqueamos el acceso.
  for (const match of matches) {
    const handle = match.handle as RouteHandle | undefined;

    if (handle) {
      // A. Validar Roles (Si la ruta define roles, el usuario debe tener al menos uno)
      if (handle.roles?.length) {
        const isRoleAllowed = handle.roles.some((role) => hasRole(role));
        if (!isRoleAllowed) {
          return <ForbiddenPage />;
        }
      }

      // B. Validar Permisos (Si la ruta define permisos, el usuario debe tener TODOS)
      // Nota: Puedes cambiar .every() por .some() si prefieres que baste con tener uno de los permisos.
      if (handle.permissions?.length) {
        const isPermitted = handle.permissions.every((permission) =>
          hasPermission(permission)
        );
        if (!isPermitted) {
          return <ForbiddenPage />;
        }
      }
    }
  }

  // Si pasa todas las aduanas, renderizamos el contenido
  return <Outlet />;
};