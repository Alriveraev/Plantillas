import { useAuthStore } from "@/features/auth/store/authStore"; // Ajusta la ruta a tu store
import { UserRole } from "@/api/types";

export const useAuth = () => {
  const { user, token, status } = useAuthStore();

  const isAuthenticated = status === "authenticated";
  const isLoading = status === "checking";

  /**
   * Verifica si el usuario tiene un permiso (string exacto).
   * Ejemplo: hasPermission("users.view")
   */
  const hasPermission = (permission: string): boolean => {
    if (!user || !user.permissions) return false;
    return user.permissions.includes(permission);
  };

  /**
   * Verifica si el usuario tiene un rol.
   */
  const hasRole = (role: UserRole): boolean => {
    return user?.role === role;
  };

  return {
    user,
    token,
    isAuthenticated,
    isLoading,

    // Helpers RBAC
    hasPermission,
    hasRole,

    // Helpers de conveniencia
    isAdmin: user?.role === UserRole.ADMIN,
    isUser: user?.role === UserRole.USER,
  };
};
