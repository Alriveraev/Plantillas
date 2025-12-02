import { create } from "zustand";
import type { User } from "@/api/types";
import { authService } from "../services/auth.service";
export type AuthStatus = "checking" | "authenticated" | "unauthenticated";
interface AuthState {
  user: User | null;
  status: AuthStatus;
  isAuthenticated: boolean;

  setAuth: (user: User) => void;
  clearAuth: () => void;
  updateUser: (user: Partial<User>) => void;
  checkAuthStatus: () => Promise<void>;
}

const SESSION_FLAG_KEY = "auth_session_active";

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  status: "checking",
  isAuthenticated: false,

  setAuth: (user) => {
    localStorage.setItem(SESSION_FLAG_KEY, "true");
    set({
      user,
      status: "authenticated",
      isAuthenticated: true,
    });
  },

  clearAuth: () => {
    localStorage.removeItem(SESSION_FLAG_KEY);
    set({
      user: null,
      status: "unauthenticated",
      isAuthenticated: false,
    });
  },

  updateUser: (userData) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...userData } : null,
    })),

  checkAuthStatus: async () => {
    const hasSessionFlag = localStorage.getItem(SESSION_FLAG_KEY) === "true";

    if (!hasSessionFlag) {
      set({
        user: null,
        status: "unauthenticated",
        isAuthenticated: false,
      });
      return;
    }

    try {
      set({ status: "checking" });

      const response = await authService.getMe();

      const responseData = response as User | { data: User };

      const user = "data" in responseData ? responseData.data : responseData;

      set({
        user,
        status: "authenticated",
        isAuthenticated: true,
      });
    } catch {
      get().clearAuth();
    }
  },
}));
