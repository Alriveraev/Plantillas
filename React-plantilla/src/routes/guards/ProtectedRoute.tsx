import { Navigate, Outlet, useLocation, useMatches } from "react-router";
import { useAuth } from "@/features/auth/hooks";
import { LoadingScreen } from "@/shared/components";
import type { RouteHandle } from "@/routes/types";
import { ForbiddenPage } from "@/shared/components/ForbiddenPage";

export const ProtectedRoute = () => {
  const { isAuthenticated, user, isLoading, hasRole, hasPermission } =
    useAuth();
  const matches = useMatches();
  const location = useLocation();
/* 
  if (isLoading) return <LoadingScreen />;

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Buscamos si alguna ruta activa tiene restricciones en su 'handle'
  const routeWithHandle = matches.find(
    (match) =>
      match.handle &&
      ((match.handle as RouteHandle).roles ||
        (match.handle as RouteHandle).permissions)
  );

  if (routeWithHandle) {
    const handle = routeWithHandle.handle as RouteHandle;

    // 1. Validar Roles (Basta con tener uno de la lista)
    if (handle.roles?.length) {
      const isRoleAllowed = handle.roles.some((role) => hasRole(role));
      if (!isRoleAllowed) return <ForbiddenPage />;
    }

    // 2. Validar Permisos (Debe tener TODOS los permisos listados)
    // Comparamos el string del handle contra el array de strings del usuario
    if (handle.permissions?.length) {
      const isPermitted = handle.permissions.every((permission) =>
        hasPermission(permission)
      );
      if (!isPermitted) return <ForbiddenPage />;
    }
  }
 */
  return <Outlet />;
};
