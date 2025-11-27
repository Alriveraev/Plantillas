import { useCallback, useState } from "react";
import { useFormik } from "formik";
import { toFormikValidationSchema } from "@/shared/utils/formik-zod";
import { KeyRound, Sparkles, Check, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import type { ChangePasswordFormData } from "../schemas";
import { changePasswordSchema } from "../schemas";
import { useChangePassword } from "../hooks";

// UI Components
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/password-input";
import { FormError } from "@/shared/components/forms";
import { cn } from "@/lib/utils";

interface ChangePasswordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ChangePasswordModal = ({
  open,
  onOpenChange,
}: ChangePasswordModalProps) => {
  const { mutate: changePassword, isPending } = useChangePassword();

  // Estado para controlar externamente la visibilidad de la nueva contraseña
  const [showNewPassword, setShowNewPassword] = useState(false);

  const formik = useFormik<ChangePasswordFormData>({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validate: toFormikValidationSchema(changePasswordSchema),
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: (values) => {
      changePassword(
        {
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
          newPasswordConfirmation: values.confirmPassword,
        },
        {
          onSuccess: () => {
            handleClose();
            toast.success("Contraseña actualizada correctamente");
          },
        }
      );
    },
  });

  const generateSecurePassword = useCallback(() => {
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";

    let password = "";
    // Garantizar al menos uno de cada tipo
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += symbols[Math.floor(Math.random() * symbols.length)];

    const allChars = uppercase + lowercase + numbers + symbols;
    // Rellenar hasta 12 caracteres
    for (let i = password.length; i < 12; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }

    // Mezclar caracteres
    password = password
      .split("")
      .sort(() => Math.random() - 0.5)
      .join("");

    formik.setFieldValue("newPassword", password);
    formik.setFieldValue("confirmPassword", "");
    navigator.clipboard.writeText(password);
    toast.success("Contraseña copiada al portapapeles");

    // LÓGICA CLAVE: Forzamos que se muestre la contraseña al generarla
    setShowNewPassword(true);
  }, [formik]);

  const handleClose = () => {
    formik.resetForm();
    setShowNewPassword(false); // Reseteamos la visibilidad al cerrar
    onOpenChange(false);
  };

  // Validaciones visuales en tiempo real
  const checkRequirement = (regex: RegExp) =>
    regex.test(formik.values.newPassword);
  const isLengthValid = formik.values.newPassword.length >= 8;

  return (
    <Dialog open={open} onOpenChange={(val) => !isPending && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100 dark:bg-teal-900/30">
              <KeyRound className="h-5 w-5 text-teal-600 dark:text-teal-400" />
            </div>
            <DialogTitle className="text-xl text-teal-950 dark:text-white">
              Cambiar contraseña
            </DialogTitle>
          </div>
          <DialogDescription>
            Por seguridad, se cerrará tu sesión en otros dispositivos al
            realizar este cambio.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={formik.handleSubmit} className="space-y-5 py-2">
          {/* Contraseña Actual */}
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Contraseña actual</Label>
            <PasswordInput
              id="currentPassword"
              placeholder="Ingresa tu contraseña actual"
              autoComplete="current-password"
              disabled={isPending}
              {...formik.getFieldProps("currentPassword")}
            />
            <FormError name="currentPassword" formik={formik} />
          </div>

          <div
            className="border-t border-border/50 my-3
          "
          />

          {/* Nueva Contraseña (CONTROLADA) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="newPassword">Nueva contraseña</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-auto p-0 text-xs font-medium text-teal-600 hover:text-teal-700 hover:bg-transparent cursor-pointer"
                onClick={generateSecurePassword}
                disabled={isPending}
              >
                <Sparkles className="h-3 w-3 mr-1.5" />
                Generar constraseña segura
              </Button>
            </div>

            {/* Input controlado por el estado del modal */}
            <PasswordInput
              id="newPassword"
              placeholder="Nueva contraseña segura"
              autoComplete="new-password"
              disabled={isPending}
              showPassword={showNewPassword}
              onTogglePassword={setShowNewPassword}
              {...formik.getFieldProps("newPassword")}
            />
            <FormError name="newPassword" formik={formik} />
          </div>

          {/* Confirmación */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar nueva contraseña</Label>
            <PasswordInput
              id="confirmPassword"
              placeholder="Repite la nueva contraseña"
              autoComplete="new-password"
              disabled={isPending}
              {...formik.getFieldProps("confirmPassword")}
            />
            <FormError name="confirmPassword" formik={formik} />
          </div>

          {/* Requisitos Visuales */}
          <div className="rounded-lg border bg-stone-50 dark:bg-muted/30 p-4 space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <ShieldCheck className="h-4 w-4" />
              Requisitos de seguridad
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <RequirementItem
                isValid={isLengthValid}
                text="Mínimo 8 caracteres"
              />
              <RequirementItem
                isValid={checkRequirement(/[A-Z]/)}
                text="Una mayúscula"
              />
              <RequirementItem
                isValid={checkRequirement(/[a-z]/)}
                text="Una minúscula"
              />
              <RequirementItem
                isValid={checkRequirement(/\d/)}
                text="Un número"
              />
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isPending || !formik.isValid || !formik.dirty}
              className="bg-teal-600 hover:bg-teal-700 text-white"
            >
              {isPending ? "Actualizando..." : "Actualizar contraseña"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Subcomponente para los items de la lista de requisitos
const RequirementItem = ({
  isValid,
  text,
}: {
  isValid: boolean;
  text: string;
}) => (
  <div
    className={cn(
      "flex items-center text-xs transition-colors duration-200",
      isValid ? "text-emerald-600 font-medium" : "text-muted-foreground/70"
    )}
  >
    {isValid ? (
      <Check className="mr-1.5 h-3.5 w-3.5" />
    ) : (
      <div className="mr-1.5 h-3.5 w-3.5 rounded-full border border-muted-foreground/30" />
    )}
    {text}
  </div>
);
