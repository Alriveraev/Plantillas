import { useState } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldOff, AlertTriangle } from "lucide-react";

interface Disable2FAAlertProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export const Disable2FAAlert = ({
  open,
  onOpenChange,
  onConfirm,
  isLoading,
}: Disable2FAAlertProps) => {
  const [confirmText, setConfirmText] = useState("");
  const [code, setCode] = useState("");

  const isConfirmEnabled = confirmText === "DESACTIVAR" && code.length === 6;

  const handleConfirm = () => {
    if (isConfirmEnabled) {
      onConfirm();
    }
  };

  const handleClose = (open: boolean) => {
    if (!open) {
      setConfirmText("");
      setCode("");
    }
    onOpenChange(open);
  };

  return (
    <AlertDialog open={open} onOpenChange={handleClose}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-destructive">
            <ShieldOff className="h-5 w-5" />
            Desactivar Autenticación de dos factores
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-4">
              <p>
                Estás a punto de desactivar la Autenticación de dos factores en
                tu cuenta.
              </p>

              {/* Warning Box */}
              <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-4">
                <div className="flex gap-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-yellow-800 dark:text-yellow-200 text-sm">
                      Advertencia de seguridad
                    </p>
                    <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                      Tu cuenta quedará menos protegida contra accesos no
                      autorizados. Cualquier persona con tu contraseña podrá
                      acceder a tu cuenta.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4 py-4">
          {/* Code Input */}
          <div className="space-y-2">
            <Label htmlFor="disable-code">Código de autenticación</Label>
            <Input
              id="disable-code"
              type="text"
              inputMode="numeric"
              placeholder="000000"
              value={code}
              onChange={(e) =>
                setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              maxLength={6}
              className="text-center text-lg tracking-widest font-mono"
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              Ingresa el código de 6 dígitos de tu aplicación autenticadora
            </p>
          </div>

          {/* Confirm Text Input */}
          <div className="space-y-2">
            <Label htmlFor="confirm-text">
              Escribe{" "}
              <span className="font-mono font-bold text-destructive">
                DESACTIVAR
              </span>{" "}
              para confirmar
            </Label>
            <Input
              id="confirm-text"
              type="text"
              placeholder="DESACTIVAR"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value.toUpperCase())}
              className="font-mono"
              disabled={isLoading}
            />
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancelar</AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={!isConfirmEnabled || isLoading}
          >
            {isLoading ? "Desactivando..." : "Desactivar 2FA"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
