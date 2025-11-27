import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { User } from "@/api/types";
import { APP_CONSTANTS } from "@/config/constants";

// Definimos los posibles estados de autenticación
type AuthStatus = "checking" | "authenticated" | "unauthenticated";

interface AuthState {
  user: User | null;
  token: string | null;
  status: AuthStatus; // Reemplazamos el boolean simple por un estado más descriptivo
  isAuthenticated: boolean; // Mantenemos este por conveniencia (derivado)

  // Acciones
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  updateUser: (user: Partial<User>) => void;
  checkAuthStatus: () => void; // Nueva acción para validar al inicio
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      status: "checking", // ⚠️ Importante: Empezamos en "checking"
      isAuthenticated: false,

      setAuth: (user, token) => {
        // No necesitamos localStorage.setItem manual, 'persist' lo hace
        set({
          user,
          token,
          status: "authenticated",
          isAuthenticated: true,
        });
      },

      clearAuth: () => {
        // No necesitamos localStorage.removeItem manual
        set({
          user: null,
          token: null,
          status: "unauthenticated",
          isAuthenticated: false,
        });
      },

      updateUser: (userData) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        })),

      // Acción opcional para verificar token al montar la app
      // Útil si quieres validar contra el backend que el token no expiró
      checkAuthStatus: () => {
        const { token } = get();
        if (token) {
          // Aquí podrías agregar lógica extra, por ahora asumimos que si hay token, es válido
          set({ status: "authenticated", isAuthenticated: true });
        } else {
          set({ status: "unauthenticated", isAuthenticated: false });
        }
      },
    }),
    {
      name: APP_CONSTANTS.USER_KEY, // Nombre de la key en localStorage
      storage: createJSONStorage(() => localStorage),
      // onRehydrateStorage es un ciclo de vida útil de persist
      onRehydrateStorage: () => (state) => {
        // Cuando Zustand termina de leer localStorage, ejecutamos esto:
        if (state?.token) {
          state.status = "authenticated";
          state.isAuthenticated = true;
        } else {
          state.status = "unauthenticated";
          state.isAuthenticated = false;
        }
      },
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        // No persistimos 'status' ni 'isAuthenticated', queremos recalcularlos al recargar
      }),
    }
  )
);
