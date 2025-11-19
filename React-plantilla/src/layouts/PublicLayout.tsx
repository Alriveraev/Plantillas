import { Navigate, Outlet } from "react-router";
import { useAuth } from "@/features/auth/hooks";

export const PublicLayout = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-background w-full">
      <Outlet />
    </div>
  );
};
