import { Navigate, Outlet } from "react-router";
import { useAuth } from "@/features/auth/hooks";

interface RoleGuardProps {
  allowedRoles: Array<"admin" | "user">;
}

export const RoleGuard = ({ allowedRoles }: RoleGuardProps) => {
  const { user } = useAuth();

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};
