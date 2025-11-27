import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  KeyRound,
  Smartphone,
  AlertTriangle,
  Lock,
} from "lucide-react";
import { PasswordInput } from "@/components/password-input";

type ActionType = "change-method" | "change-device" | "view-backup-codes";

interface VerifyPasswordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVerified: () => void;
  actionType: ActionType;
  isLoading?: boolean;
}

const actionConfig: Record<
  ActionType,
  { title: string; description: string; icon: React.ElementType }
> = {
  "change-method": {
    title: "Verificar identidad",
    description:
      "Para cambiar tu método de autenticación, confirma tu contraseña actual.",
    icon: ShieldCheck,
  },
  "change-device": {
    title: "Confirmar cambio",
    description:
      "Ingresa tu contraseña para autorizar el cambio de dispositivo.",
    icon: Smartphone,
  },
  "view-backup-codes": {
    title: "Revelar códigos",
    description:
      "Por seguridad, confirma tu contraseña para ver los códigos de respaldo.",
    icon: KeyRound,
  },
};

export const VerifyPasswordModal = ({
  open,
  onOpenChange,
  onVerified,
  actionType,
  isLoading,
}: VerifyPasswordModalProps) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const config = actionConfig[actionType];
  const Icon = config.icon;

  const handleVerify = async () => {
    if (!password) {
      setError("La contraseña es requerida");
      return;
    }
    setError("");
    onVerified();
  };

  const handleClose = (isOpen: boolean) => {
    if (!isOpen) {
      setPassword("");
      setError("");
    }
    if (!isLoading) {
      onOpenChange(isOpen);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && password && !isLoading) {
      handleVerify();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className="sm:max-w-[420px] p-6 gap-6 rounded-xl border-stone-200 dark:border-stone-800"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400">
              <Icon className="h-5 w-5" />
            </div>
            <DialogTitle className="text-xl font-semibold text-stone-900 dark:text-stone-50">
              {config.title}
            </DialogTitle>
          </div>
          <DialogDescription className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed ml-1">
            {config.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <PasswordInput
              id="verify-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              autoFocus
            />

            {/* Mensaje de error separado */}
            {error && (
              <div className="flex items-center gap-2 text-xs text-red-600 font-medium animate-in fade-in slide-in-from-top-1 dark:text-red-400 mt-1.5">
                <AlertTriangle className="h-3.5 w-3.5" />
                {error}
              </div>
            )}
          </div>

          {/* Mensaje de contexto sutil */}
          <div className="flex gap-2 items-start text-xs text-stone-500 dark:text-stone-400 px-1 bg-stone-50 p-2 rounded-md border border-stone-100 dark:bg-stone-900 dark:border-stone-800">
            <Lock className="h-3.5 w-3.5 mt-0.5 shrink-0 text-stone-400" />
            <p>
              Esta verificación adicional protege tu cuenta de cambios no
              autorizados.
            </p>
          </div>
        </div>

        {/* Footer arreglado: Botones alineados y del mismo ancho */}
        <DialogFooter className="flex-col sm:justify-between sm:space-x-0 ">
          <div className="flex flex-col-reverse sm:flex-row gap-3 w-full">
            <Button
              variant="outline"
              onClick={() => handleClose(false)}
              disabled={isLoading}
              className="flex-1 border-stone-200 text-stone-700 hover:bg-stone-50 hover:text-stone-900 dark:border-stone-700 dark:text-stone-300 dark:hover:bg-stone-800"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleVerify}
              disabled={!password || isLoading}
              className="flex-1 bg-teal-600 hover:bg-teal-700 text-white shadow-sm"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                  <span>Verificando...</span>
                </span>
              ) : (
                "Confirmar"
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
