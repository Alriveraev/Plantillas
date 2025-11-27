import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/api/client";
import { toast } from "sonner";

interface TwoFactorSetup {
  qrCode: string;
  secret: string;
}

interface TwoFactorStatus {
  isEnabled: boolean;
  enabledAt?: string;
}

const twoFactorApi = {
  getStatus: async (): Promise<TwoFactorStatus> => {
    const { data } = await apiClient.get("/profile/2fa/status");
    return data.data;
  },

  setup: async (): Promise<TwoFactorSetup> => {
    const { data } = await apiClient.post("/profile/2fa/setup");
    return data.data;
  },

  verify: async (code: string): Promise<{ backupCodes: string[] }> => {
    const { data } = await apiClient.post("/profile/2fa/verify", { code });
    return data.data;
  },

  disable: async (code: string): Promise<void> => {
    await apiClient.post("/profile/2fa/disable", { code });
  },

  regenerateBackupCodes: async (): Promise<{ backupCodes: string[] }> => {
    const { data } = await apiClient.post("/profile/2fa/backup-codes");
    return data.data;
  },
};

export const useTwoFactorStatus = () => {
  return useQuery({
    queryKey: ["2fa-status"],
    queryFn: twoFactorApi.getStatus,
  });
};

export const useTwoFactorSetup = () => {
  return useMutation({
    mutationFn: twoFactorApi.setup,
    onError: () => {
      toast.error("Error", {
        description: "No se pudo iniciar la configuración de 2FA",
      });
    },
  });
};

export const useTwoFactorVerify = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: twoFactorApi.verify,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["2fa-status"] });
      toast("2FA Activado", {
        description: "La Autenticación de dos factores ha sido activada.",
      });
    },
    onError: () => {
      toast.error("Código inválido", {
        description: "El código ingresado no es correcto",
      });
    },
  });
};

export const useTwoFactorDisable = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: twoFactorApi.disable,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["2fa-status"] });
      toast("La Autenticación de dos factores ha sido desactivada.");
    },
    onError: () => {
      toast.error("No se pudo desactivar 2FA");
    },
  });
};

export const useCloseSessions = () => {
  return useMutation({
    mutationFn: async () => {
      await apiClient.post("/profile/sessions/close-all");
    },
    onSuccess: () => {
      toast("Todas las sesiones han sido cerradas excepto la actual.");
    },
    onError: () => {
      toast.error("No se pudieron cerrar las sesiones");
    },
  });
};
