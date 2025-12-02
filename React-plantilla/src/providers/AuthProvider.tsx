import { useEffect, useRef } from "react";
import { useAuthStore } from "@/features/auth/store/authStore";
import { LoadingScreen } from "@/shared/components/LoadingScreen";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { checkAuthStatus, status } = useAuthStore();
  const initialized = useRef(false);

  useEffect(() => {
    // Evitamos doble ejecución en modo desarrollo (Strict Mode)
    if (initialized.current) return;
    initialized.current = true;

    // Ejecutamos la verificación UNA SOLA VEZ al montar la aplicación.
    // No dependemos de variables de estado aquí para evitar bucles.
    checkAuthStatus();
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  // Bloqueamos la renderización de la app hasta saber si es User o Guest
  if (status === "checking") {
    return <LoadingScreen />;
  }

  return <>{children}</>;
};