import { useAuthStore } from "../store";

export const useAuth = () => {
  const { user, isAuthenticated, token } = useAuthStore();

  return {
    user,
    isAuthenticated,
    token,
    isAdmin: user?.role === "admin",
    isUser: user?.role === "user",
  };
};
