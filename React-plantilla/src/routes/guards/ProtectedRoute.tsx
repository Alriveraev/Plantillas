import { Navigate, Outlet } from "react-router";
import { useAuth } from "@/features/auth/hooks";
import { LoadingScreen } from "@/shared/components";

export const ProtectedRoute = () => {
  const { isAuthenticated, user } = useAuth();

  // Show loading while checking auth state
/*   if (isAuthenticated === undefined) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  } */

  return <Outlet />;
};
