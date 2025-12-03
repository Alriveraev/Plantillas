import { useState } from "react";
import { useFormik } from "formik";
import { toFormikValidationSchema } from "@/shared/utils/formik-zod";
import {
  Loader2,
  ArrowLeft,
  Mail,
  PawPrint,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router";
import { forgotPasswordSchema } from "../schemas";
import { authService } from "@/features/auth/services/auth.service";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormError } from "@/shared/components/forms";
import { toast } from "sonner";

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
        // Éxito real: El backend envió el correo
        setIsSuccess(true);
        toast.success("Si el correo existe, se ha enviado el enlace.");
      } catch (err: any) {
        const status = err.response?.status;

        if (status === 404 || status === 422) {
          setIsSuccess(true);
        } else {
          // Solo mostramos error real si es fallo del servidor (500) o de red
          setError(
            "Ocurrió un problema de conexión. Por favor intenta más tarde."
          );
        }
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="relative min-h-screen w-full flex flex-col lg:grid lg:grid-cols-2">
      {/* --- SECCIÓN 1: BRANDING (Top en Móvil / Izquierda en Desktop) --- */}
      <div className="relative flex h-40 flex-col justify-center bg-teal-900 p-8 text-white lg:h-full lg:justify-between lg:p-10">
        {/* Patrón de fondo */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-teal-900 to-teal-950 pointer-events-none" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-2 text-xl font-bold tracking-tight justify-center lg:justify-start">
          <PawPrint className="h-7 w-7" />
          <span>VetCare Pro</span>
        </div>

        {/* Cita (Solo Desktop) */}
        <div className="relative z-10 hidden max-w-md lg:block">
          <blockquote className="space-y-2">
            <p className="text-2xl font-medium leading-relaxed">
              "La seguridad de tus datos clínicos es nuestra prioridad."
            </p>
            <footer className="text-sm text-teal-200 mt-4">
              &mdash; Seguridad VetCare
            </footer>
          </blockquote>
        </div>

        {/* Footer (Solo Desktop) */}
        <div className="relative z-10 hidden text-xs text-teal-400 lg:block">
          © 2025 VetCare System Inc.
        </div>
      </div>

      {/* --- SECCIÓN 2: FORMULARIO (Abajo en Móvil / Derecha en Desktop) --- */}
      <div className="flex flex-1 items-center justify-center bg-teal-900 px-4 pb-12 pt-4 lg:bg-white lg:p-8 lg:pb-8 lg:pt-8">
        {/* Contenedor Adaptable: Tarjeta en Móvil / Plano en Desktop */}
        <div className="w-full max-w-[400px] rounded-xl bg-white p-6 shadow-2xl ring-1 ring-gray-900/5 lg:bg-transparent lg:p-0 lg:shadow-none lg:ring-0">
          {/* Header del Formulario */}
          <div className="mb-6 flex flex-col space-y-2 text-center lg:text-left">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              {isSuccess ? "Proceso completado" : "Recuperar acceso"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {isSuccess
                ? "Revisa las instrucciones a continuación."
                : "Ingresa tu correo para recibir instrucciones."}
            </p>
          </div>

          {/* CONTENIDO DINÁMICO: ÉXITO vs FORMULARIO */}
          {isSuccess ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="rounded-lg border border-green-100 bg-green-50 p-6 text-center">
                <CheckCircle2 className="mx-auto h-12 w-12 text-green-600 mb-2" />
                <p className="text-sm text-green-800 font-medium">
                  Solicitud procesada correctamente.
                </p>
                <p className="text-xs text-green-700 mt-3 leading-relaxed">
                  Si existe una cuenta asociada a{" "}
                  <strong>{formik.values.email}</strong>, recibirás un enlace de
                  recuperación en tu bandeja de entrada en unos instantes.
                </p>
              </div>

              <Button
                asChild
                className="w-full bg-gray-900 hover:bg-gray-800 text-white h-11"
              >
                <Link to="/login">Volver al Login</Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-6">
              <form onSubmit={formik.handleSubmit}>
                <div className="grid gap-4">
                  {/* Input Email */}
                  <div className="grid gap-2">
                    <Label htmlFor="email" className="sr-only">
                      Email
                    </Label>
                    <div className="relative">
                      <div className="absolute left-3 top-3 text-muted-foreground">
                        <Mail className="h-4 w-4" />
                      </div>
                      <Input
                        id="email"
                        type="email"
                        placeholder="nombre@ejemplo.com"
                        autoCapitalize="none"
                        autoComplete="email"
                        disabled={formik.isSubmitting}
                        {...formik.getFieldProps("email")}
                        className={`pl-9 h-11 bg-gray-50/50 border-gray-200 focus:bg-white transition-all ${
                          formik.touched.email && formik.errors.email
                            ? "border-red-500 bg-red-50"
                            : ""
                        }`}
                      />
                    </div>
                    <FormError name="email" formik={formik} />
                  </div>

                  {/* Error General (Solo conexión/servidor) */}
                  {error && (
                    <div className="text-sm font-medium text-red-500 flex items-center gap-2 p-2 bg-red-50 rounded">
                      <span className="h-1.5 w-1.5 rounded-full bg-red-500 shrink-0" />
                      {error}
                    </div>
                  )}

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={formik.isSubmitting}
                    className="h-11 bg-teal-600 hover:bg-teal-700 text-white group"
                  >
                    {formik.isSubmitting ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        Enviar instrucciones
                        <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </Button>
                </div>
              </form>

              {/* Back Link */}
              <div className="flex items-center justify-center lg:justify-start">
                <Link
                  to="/login"
                  className="flex items-center text-sm text-muted-foreground hover:text-teal-600 font-medium transition-colors"
                >
                  <ArrowLeft className="mr-2 h-3 w-3" /> Regresar al inicio de
                  sesión
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
