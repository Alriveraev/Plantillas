import { useState } from "react";
import { useFormik } from "formik";
import { toFormikValidationSchema } from "@/shared/utils/formik-zod";
import { Loader2, ArrowLeft, Mail, PawPrint, CheckCircle2, ChevronRight } from "lucide-react";
import { Link } from "react-router";
import { forgotPasswordSchema } from "../schemas";
import { authService } from "@/features/auth/services/auth.service";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
      } catch (err) {
        setError("No pudimos verificar este correo. Inténtalo de nuevo.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="w-full h-screen lg:grid lg:grid-cols-2 overflow-hidden">
      
      {/* 1. LADO IZQUIERDO: Branding & Visual (Oculto en móviles) */}
      <div className="hidden lg:flex flex-col justify-between bg-teal-900 text-white p-10 relative">
        {/* Patrón de fondo abstracto (CSS puro) */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-teal-900 to-teal-950" />
        
        {/* Logo Brand */}
        <div className="relative z-10 flex items-center gap-2 text-lg font-bold tracking-tight">
          <PawPrint className="h-6 w-6" /> VetCare Pro
        </div>

        {/* Mensaje Inspirador / Testimonio */}
        <div className="relative z-10 max-w-md">
          <blockquote className="space-y-2">
            <p className="text-2xl font-medium leading-relaxed">
              "La seguridad de tus datos clínicos es nuestra prioridad. Recupera tu acceso y continúa cuidando de tus pacientes."
            </p>
            <footer className="text-sm text-teal-200 mt-4">
              &mdash; Equipo de Seguridad VetCare
            </footer>
          </blockquote>
        </div>

        {/* Footer pequeño */}
        <div className="relative z-10 text-xs text-teal-400">
          © 2025 VetCare System Inc.
        </div>
      </div>

      {/* 2. LADO DERECHO: Formulario Funcional */}
      <div className="flex items-center justify-center p-8 bg-white dark:bg-zinc-950">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[380px]">
          
          {/* Header del Formulario */}
          <div className="flex flex-col space-y-2 text-left">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              {isSuccess ? "Revisa tu correo" : "Recuperar acceso"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {isSuccess 
                ? `Hemos enviado un enlace de recuperación a ${formik.values.email}`
                : "Ingresa tu correo asociado para recibir las instrucciones."
              }
            </p>
          </div>

          {/* VISTA DE ÉXITO */}
          {isSuccess ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="rounded-lg border border-green-100 bg-green-50 p-6 text-center">
                <CheckCircle2 className="mx-auto h-12 w-12 text-green-600 mb-2" />
                <p className="text-sm text-green-800 font-medium">
                  El correo ha sido enviado exitosamente.
                </p>
              </div>
              
              <Button asChild className="w-full bg-gray-900 hover:bg-gray-800 text-white h-11">
                <Link to="/login">
                  Volver al Login
                </Link>
              </Button>
            </div>
          ) : (
            /* VISTA DEL FORMULARIO */
            <div className="grid gap-6">
              <form onSubmit={formik.handleSubmit}>
                <div className="grid gap-4">
                  
                  {/* Input Group */}
                  <div className="grid gap-2">
                    <Label htmlFor="email" className="sr-only">Email</Label>
                    <div className="relative">
                      <div className="absolute left-0 top-0 bottom-0 flex items-center justify-center pl-3 text-muted-foreground">
                        <Mail className="h-4 w-4" />
                      </div>
                      <Input
                        id="email"
                        placeholder="nombre@ejemplo.com"
                        type="email"
                        autoCapitalize="none"
                        autoComplete="email"
                        autoCorrect="off"
                        disabled={formik.isSubmitting}
                        {...formik.getFieldProps("email")}
                        // Diseño "Clean": Borde suave, enfoque claro
                        className={`pl-9 h-11 bg-gray-50/50 border-gray-200 focus:bg-white transition-all ${
                          formik.touched.email && formik.errors.email ? "border-red-500 bg-red-50/10" : ""
                        }`}
                      />
                    </div>
                    <FormError name="email" formik={formik} />
                  </div>

                  {/* Error General */}
                  {error && (
                    <div className="text-sm font-medium text-red-500 flex items-center gap-2">
                      <span className="h-1 w-1 rounded-full bg-red-500" />
                      {error}
                    </div>
                  )}

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

              {/* Footer Links */}
              <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                 <Link 
                    to="/login" 
                    className="flex items-center hover:text-teal-600 font-medium transition-colors"
                  >
                    <ArrowLeft className="mr-2 h-3 w-3" /> Regresar al inicio de sesión
                  </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};