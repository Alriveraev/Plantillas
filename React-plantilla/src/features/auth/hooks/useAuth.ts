import { useAuthStore } from "../store/authStore";
import { UserRole } from "@/api/types";

export const useAuth = () => {
  const { user, status } = useAuthStore();

  const isAuthenticated = status === "authenticated";
  const isLoading = status === "checking";

  /**
   * Verifica si el usuario tiene un permiso (string exacto).
   */
  const hasPermission = (permission: string): boolean => {
    if (!user || !user.permissions) return false;
    return user.permissions.includes(permission);
  };

  /**
   * Verifica si el usuario tiene un rol.
   */
  const hasRole = (role: UserRole): boolean => {
    // Como el backend envía role_name para el enum, asegúrate que user.role sea el key
    // O usa user.role_name si así lo definiste en la interfaz
    return user?.role === role;
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    hasPermission,
    hasRole,
    isAdmin: user?.role === UserRole.ADMIN,
    isUser: user?.role === UserRole.USER,
  };
};
