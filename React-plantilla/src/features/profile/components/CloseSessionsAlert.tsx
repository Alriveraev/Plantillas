import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useCloseSessions } from "../hooks";
import { LogOut, AlertTriangle } from "lucide-react";

interface CloseSessionsAlertProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sessionCount: number;
}

export const CloseSessionsAlert = ({
  open,
  onOpenChange,
  sessionCount,
}: CloseSessionsAlertProps) => {
  const { mutate: closeSessions, isPending } = useCloseSessions();

  const handleConfirm = (e: React.MouseEvent<HTMLButtonElement>) => {
    // 1. Prevenir que el modal se cierre automáticamente al hacer clic
    e.preventDefault();

    closeSessions(undefined, {
      onSuccess: () => {
        // 2. Cerrar manualmente solo cuando la respuesta sea exitosa
        onOpenChange(false);
      },
    });
  };

  return (
    <AlertDialog
      open={open}
      onOpenChange={(val) => {
        // Bloquear cierre si está cargando (para cambios de estado controlados)
        if (!isPending) onOpenChange(val);
      }}
    >
      <AlertDialogContent
        className="sm:max-w-[420px] p-6 gap-6 rounded-xl border-stone-200 dark:border-stone-800"
        // CORRECCIÓN: Eliminamos onInteractOutside porque AlertDialog ya bloquea clics fuera por defecto.
        // Mantenemos onEscapeKeyDown para evitar cerrar con ESC mientras carga.
        onEscapeKeyDown={(e) => isPending && e.preventDefault()}
      >
        <AlertDialogHeader className="space-y-3">
          <div className="flex items-center gap-3">
            {/* Icono de advertencia en rojo suave */}
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400">
              <LogOut className="h-5 w-5" />
            </div>
            <div>
              <AlertDialogTitle className="text-xl font-semibold text-stone-900 dark:text-stone-50">
                ¿Cerrar todas las sesiones?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-stone-500 dark:text-stone-400 text-sm mt-0.5">
                Se cerrarán{" "}
                <span className="font-medium text-stone-700 dark:text-stone-300">
                  {sessionCount} sesiones
                </span>{" "}
                en otros dispositivos.
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>

        <div className="space-y-4">
          {/* Aviso visual */}
          <div className="rounded-lg border border-red-100 bg-red-50/50 p-3 flex gap-3 dark:bg-destructive dark:border-red-900/30">
            <AlertTriangle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
            <div className="text-sm text-stone-600 dark:text-white">
              <p className="font-semibold text-stone-800 dark:text-white mb-1">
                Acción necesaria
              </p>
              <p className="text-xs text-red-700/80 dark:text-white leading-relaxed">
                Tendrás que volver a iniciar sesión manualmente en todos tus
                otros dispositivos (celular, tablet, etc).
              </p>
            </div>
          </div>
        </div>

        <AlertDialogFooter className="gap-2 sm:gap-4">
          <AlertDialogCancel
            disabled={isPending}
            className="border-stone-200 text-stone-700 hover:bg-stone-50 hover:text-stone-900 dark:border-stone-700 dark:text-stone-300 dark:hover:bg-stone-800 mt-0"
          >
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isPending}
            className="bg-destructive text-white hover:bg-destructive dark:bg-destructive0 dark:hover:bg-destructive shadow-sm border-0"
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Cerrando...
              </span>
            ) : (
              "Sí, cerrar sesiones"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
