import { useFormik } from "formik";
import { toFormikValidationSchema } from "@/shared/utils/formik-zod";
import { Loader2, Mail, Lock, PawPrint } from "lucide-react";
import { Link } from "react-router";
import type { LoginFormData } from "../schemas";
import { loginSchema } from "../schemas";
import { useLogin } from "../hooks/useLogin";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { FormError } from "@/shared/components/forms";
import { PasswordInput } from "@/components/password-input";
import { GoogleButton } from "./SocialButton";

export const LoginForm = () => {
  const { mutate: login, isPending } = useLogin();

  const formik = useFormik<LoginFormData>({
    initialValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    validate: toFormikValidationSchema(loginSchema),
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: (values) => {
      login({ ...values, email: values.email.trim() });
    },
  });

  return (
    <div className="relative min-h-screen w-full flex flex-col lg:grid lg:grid-cols-2">
      {/* --- SECCIÓN DE BRANDING --- 
        Móvil: Actúa como fondo completo o cabecera
        Desktop: Ocupa la mitad izquierda
      */}
      <div className="relative flex h-40 flex-col justify-center bg-teal-900 p-8 text-white lg:h-full lg:justify-between lg:p-10">
        {/* Patrón de fondo */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-white via-teal-900 to-teal-950 pointer-events-none" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-2 text-xl font-bold tracking-tight justify-center lg:justify-start">
          <PawPrint className="h-7 w-7" />
          <span>VetCare Pro</span>
        </div>

        {/* Cita (Solo visible en Desktop para no saturar móvil) */}
        <div className="relative z-10 hidden max-w-md lg:block">
          <blockquote className="space-y-2">
            <p className="text-2xl font-medium leading-relaxed">
              "Gestión clínica eficiente, pacientes más felices. Bienvenido de
              nuevo a tu espacio de trabajo."
            </p>
          </blockquote>
        </div>

        {/* Footer (Solo Desktop) */}
        <div className="relative z-10 hidden text-xs text-teal-400 lg:block">
          © 2025 VetCare System Inc.
        </div>
      </div>

      {/* --- SECCIÓN DEL FORMULARIO --- 
        Móvil: Se superpone un poco o llena el espacio restante con fondo gris
        Desktop: Fondo blanco plano
      */}
      <div className="flex flex-1 items-center justify-center bg-teal-900 px-4 pb-12 pt-4 lg:bg-white lg:p-8 lg:pb-8 lg:pt-8">
        {/* Contenedor del Formulario (Tarjeta en Móvil / Plano en Desktop) */}
        <div className="w-full max-w-[400px] rounded-xl bg-white p-6 shadow-2xl ring-1 ring-gray-900/5 lg:bg-transparent lg:p-0 lg:shadow-none lg:ring-0">
          <div className="mb-6 flex flex-col space-y-2 text-center lg:text-left">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              Bienvenido
            </h1>
            <p className="text-sm text-muted-foreground">
              Ingresa tus credenciales para acceder.
            </p>
          </div>

          <form onSubmit={formik.handleSubmit} className="space-y-4">
            {/* Botón Social */}
            <GoogleButton />

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-muted-foreground">
                  O usa tu email
                </span>
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
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
                  disabled={isPending}
                  {...formik.getFieldProps("email")}
                  className={`pl-9 ${
                    formik.touched.email && formik.errors.email
                      ? "border-red-500 bg-red-50"
                      : ""
                  }`}
                />
              </div>
              <FormError name="email" formik={formik} />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="relative">
                <div className="absolute left-3 top-3 text-muted-foreground z-10">
                  <Lock className="h-4 w-4" />
                </div>
                <PasswordInput
                  id="password"
                  placeholder="Contraseña"
                  disabled={isPending}
                  {...formik.getFieldProps("password")}
                  className={`pl-9 ${
                    formik.touched.password && formik.errors.password
                      ? "border-red-500 bg-red-50"
                      : ""
                  }`}
                />
              </div>
              <FormError name="password" formik={formik} />
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="rememberMe"
                  checked={formik.values.rememberMe}
                  onCheckedChange={(c) => formik.setFieldValue("rememberMe", c)}
                  className="data-[state=checked]:bg-teal-600 border-gray-300"
                />
                <Label
                  htmlFor="rememberMe"
                  className="text-sm font-normal cursor-pointer"
                >
                  Recordarme
                </Label>
              </div>
              <Link
                to="/forgot-password"
                className="text-sm font-medium text-teal-600 hover:underline"
              >
                ¿Olvidaste tu clave?
              </Link>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full bg-teal-600 hover:bg-teal-700 text-white"
              disabled={isPending}
            >
              {isPending ? (
                <Loader2 className="animate-spin h-4 w-4" />
              ) : (
                "Iniciar Sesión"
              )}
            </Button>
          </form>

          {/* <div className="mt-4 text-center text-sm text-muted-foreground">
            ¿No tienes cuenta?{" "}
            <Link to="/register" className="font-semibold text-teal-600 hover:underline">
              Regístrate
            </Link>
          </div> */}
        </div>
      </div>
    </div>
  );
};
