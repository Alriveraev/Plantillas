import { useState } from "react";
import { useFormik } from "formik";
import { useSearchParams, useNavigate } from "react-router"; // React Router
import { toFormikValidationSchema } from "@/shared/utils/formik-zod";
import { Loader2, AlertCircle } from "lucide-react";
import { resetPasswordSchema } from "../schemas";
import { authService } from "@/features/auth/services/auth.service"; // Tu servicio

// UI Components
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/password-input"; // Tu componente reutilizado
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FormError } from "@/shared/components/forms";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const ResetPasswordForm = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  // Capturamos token y email de la URL
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  // Si faltan datos en la URL, mostramos error
  const isInvalidLink = !token || !email;

  const formik = useFormik({
    initialValues: {
      password: "",
      password_confirmation: "",
    },
    validate: toFormikValidationSchema(resetPasswordSchema),
    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: async (values, { setSubmitting }) => {
      if (isInvalidLink) return;

      setServerError(null);
      try {
        // Llamamos al servicio con el payload correcto (definido en auth.types.ts)
        await authService.resetPassword({
          token: token!,
          email: email!,
          password: values.password,
          password_confirmation: values.password_confirmation,
        });

        // Redireccionar al login con un estado o mensaje toast (opcional)
        navigate("/login", { replace: true });
        // Aquí podrías disparar un toast: "Contraseña actualizada exitosamente"
      } catch (error) {
        setServerError(
          "El enlace ha expirado o es inválido. Solicita uno nuevo."
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  if (isInvalidLink) {
    return (
      <Card className="w-full max-w-md border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600">Enlace inválido</CardTitle>
          <CardDescription>
            No pudimos verificar la información de restablecimiento.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            className="w-full"
            onClick={() => navigate("/forgot-password")}
          >
            Solicitar nuevo enlace
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Nueva contraseña</CardTitle>
        <CardDescription>
          Crea una contraseña segura para tu cuenta.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          {/* Alerta de Error del Servidor */}
          {serverError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{serverError}</AlertDescription>
            </Alert>
          )}

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <PasswordInput
              id="password"
              placeholder="Nueva contraseña"
              disabled={formik.isSubmitting}
              {...formik.getFieldProps("password")}
              className={
                formik.touched.password && formik.errors.password
                  ? "border-red-500"
                  : ""
              }
            />
            <FormError name="password" formik={formik} />
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="password_confirmation">Confirmar contraseña</Label>
            <PasswordInput
              id="password_confirmation"
              placeholder="Repite la contraseña"
              disabled={formik.isSubmitting}
              {...formik.getFieldProps("password_confirmation")}
              className={
                formik.touched.password_confirmation &&
                formik.errors.password_confirmation
                  ? "border-red-500"
                  : ""
              }
            />
            <FormError name="password_confirmation" formik={formik} />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Actualizando...
              </>
            ) : (
              "Cambiar contraseña"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
