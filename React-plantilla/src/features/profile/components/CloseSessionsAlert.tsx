import { useFormik } from "formik";
import { z } from "zod";
import { toFormikValidationSchema } from "@/shared/utils/formik-zod";
import { LogOut, AlertTriangle, Loader2 } from "lucide-react";
import { useCloseSessions } from "../hooks/useCloseSessions";

// UI Components
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
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/password-input"; // Tu componente existente
import { FormError } from "@/shared/components/forms"; // Tu componente de error

// Schema de validación
const closeSessionsSchema = z.object({
  password: z.string().min(1, "La contraseña es obligatoria para confirmar"),
});

interface CloseSessionsAlertProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sessionCount?: number; // Opcional por si no tienes el dato exacto
}

export const CloseSessionsAlert = ({
  open,
  onOpenChange,
  sessionCount,
}: CloseSessionsAlertProps) => {
  const { mutate: closeSessions, isPending } = useCloseSessions();

  const handleClose = () => {
    formik.resetForm();
    onOpenChange(false);
  };

  const formik = useFormik({
    initialValues: {
      password: "",
    },
    validate: toFormikValidationSchema(closeSessionsSchema),
    onSubmit: (values) => {
      closeSessions(values.password, {
        onSuccess: () => {
          handleClose();
        },
        onError: () => {
          // Opcional: Limpiar el campo si falla
          formik.setFieldValue("password", "");
        },
      });
    },
  });

  return (
    <AlertDialog
      open={open}
      onOpenChange={(val) => {
        // Prevenir cierre accidental si está cargando
        if (!isPending) {
          if (!val) handleClose();
          else onOpenChange(val);
        }
      }}
    >
      <AlertDialogContent
        className="sm:max-w-[420px] p-6 gap-6"
        onEscapeKeyDown={(e) => isPending && e.preventDefault()}
      >
        <AlertDialogHeader className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400">
              <LogOut className="h-5 w-5" />
            </div>
            <div>
              <AlertDialogTitle className="text-xl font-semibold">
                ¿Cerrar todas las sesiones?
              </AlertDialogTitle>
              <AlertDialogDescription className="mt-1">
                Se cerrarán{" "}
                <span className="font-medium text-foreground">
                  {sessionCount
                    ? `${sessionCount} sesiones`
                    : "todas las sesiones"}
                </span>{" "}
                activas en otros dispositivos.
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>

        {/* Formulario envolvente */}
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          {/* Alerta Informativa */}
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 flex gap-3 dark:border-amber-900/50 dark:bg-amber-950/30">
            <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-500 shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-amber-900 dark:text-amber-200">
                Confirmación requerida
              </p>
              <p className="text-amber-800/80 dark:text-amber-300/80 text-xs mt-0.5">
                Por seguridad, ingresa tu contraseña para confirmar esta acción.
              </p>
            </div>
          </div>

          {/* Input de Contraseña */}
          <div className="space-y-2">
            <Label htmlFor="closeSessionPassword">Contraseña actual</Label>
            <PasswordInput
              id="closeSessionPassword"
              placeholder="Ingresa tu contraseña"
              autoComplete="current-password"
              disabled={isPending}
              {...formik.getFieldProps("password")}
            />
            <FormError name="password" formik={formik} />
          </div>

          <AlertDialogFooter className="mt-2">
            <AlertDialogCancel
              disabled={isPending}
              type="button"
              onClick={handleClose}
            >
              Cancelar
            </AlertDialogCancel>

            {/* Usamos Button normal en lugar de AlertDialogAction para controlar el submit */}
            <Button
              type="submit"
              variant="destructive"
              disabled={isPending || !formik.isValid || !formik.dirty}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Cerrando...
                </>
              ) : (
                "Sí, cerrar sesiones"
              )}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};
