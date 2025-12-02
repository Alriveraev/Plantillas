import { useState } from "react";
import { useFormik } from "formik";
import { toFormikValidationSchema } from "@/shared/utils/formik-zod";
import { Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Link } from "react-router"; // O tu router de preferencia
import { forgotPasswordSchema } from "../schemas";
import { authService } from "@/features/auth/services/auth.service"; // Tu servicio

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { FormError } from "@/shared/components/forms";

export const ForgotPasswordForm = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: { email: "" },
    validate: toFormikValidationSchema(forgotPasswordSchema),
    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: async (values, { setSubmitting }) => {
      setError(null);
      try {
        await authService.forgotPassword(values.email);
        setIsSuccess(true);
      } catch {
        setError(
          "No se pudo enviar el correo. Verifica tu email o intenta más tarde."
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  // Vista de éxito (Correo enviado)
  if (isSuccess) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-6 w-6 text-green-600" />
          </div>
          <CardTitle>¡Correo enviado!</CardTitle>
          <CardDescription>
            Hemos enviado un enlace de recuperación a{" "}
            <strong>{formik.values.email}</strong>.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-center">
          <Button variant="ghost" asChild>
            <Link to="/login">
              <ArrowLeft className="mr-2 h-4 w-4" /> Volver al inicio
            </Link>
          </Button>
        </CardFooter>
      </Card>
    );
  }

  // Vista del Formulario
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Recuperar contraseña</CardTitle>
        <CardDescription>
          Ingresa tu correo y te enviaremos un enlace para restablecer tu
          cuenta.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Correo Electrónico</Label>
            <Input
              id="email"
              type="email"
              placeholder="nombre@ejemplo.com"
              disabled={formik.isSubmitting}
              {...formik.getFieldProps("email")}
              className={
                formik.touched.email && formik.errors.email
                  ? "border-red-500"
                  : ""
              }
            />
            <FormError name="email" formik={formik} />
          </div>

          {error && (
            <div className="text-sm text-red-500 font-medium text-center bg-red-50 p-2 rounded">
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              "Enviar enlace"
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button
          variant="link"
          size="sm"
          asChild
          className="text-muted-foreground"
        >
          <Link to="/login">
            <ArrowLeft className="mr-2 h-4 w-4" /> Volver a iniciar sesión
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
