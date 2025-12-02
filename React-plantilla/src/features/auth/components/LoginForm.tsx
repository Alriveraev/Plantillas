import { useFormik } from "formik";
import { toFormikValidationSchema } from "@/shared/utils/formik-zod";
import { Loader2 } from "lucide-react";
import { Link } from "react-router";
import type { LoginFormData } from "../schemas";
import { loginSchema } from "../schemas";
import { useLogin } from "../hooks/useLogin";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Field, FieldSeparator } from "@/components/ui/field";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
    validateOnChange: false,
    onSubmit: (values) => {
      const sanitizedValues = {
        ...values,
        email: values.email.trim(),
      };
      login(sanitizedValues);
    },
  });

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Bienvenido de nuevo</CardTitle>
        <CardDescription>Inicia sesión en tu cuenta</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <Field>
            <GoogleButton />
          </Field>

          <FieldSeparator className="my-6">
            O ingresa tus credenciales
          </FieldSeparator>

          {/* Input Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Correo Electrónico</Label>
            <Input
              id="email"
              type="email"
              autoComplete="username"
              placeholder="correo@ejemplo.com"
              disabled={isPending}
              {...formik.getFieldProps("email")}
              className={
                formik.touched.email && formik.errors.email
                  ? "border-red-500"
                  : ""
              }
            />
            <FormError name="email" formik={formik} />
          </div>

          {/* Input Password */}
          <div className="space-y-2">
            <PasswordInput
              id="password"
              label="Contraseña"
              placeholder="Ingresa tu clave"
              autoComplete="current-password"
              disabled={isPending}
              className={
                formik.touched.password && formik.errors.password
                  ? "border-red-500"
                  : ""
              }
              {...formik.getFieldProps("password")}
            />
            <FormError name="password" formik={formik} />
          </div>

          {/* --- BLOQUE MODIFICADO: Remember Me + Forgot Password --- */}
          <div className="flex items-center justify-between">
            {/* Checkbox a la izquierda */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="rememberMe"
                checked={formik.values.rememberMe}
                onCheckedChange={(checked) =>
                  formik.setFieldValue("rememberMe", checked)
                }
                disabled={isPending}
              />
              <Label
                htmlFor="rememberMe"
                className="text-sm font-normal cursor-pointer select-none"
              >
                Recordarme
              </Label>
            </div>

            {/* Enlace a la derecha */}
            <Link
              to="/forgot-password"
              className="text-sm font-medium text-primary hover:underline hover:text-primary/80"
              tabIndex={isPending ? -1 : 0}
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
          {/* ------------------------------------------------------- */}

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={isPending || !formik.isValid}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verificando...
              </>
            ) : (
              "Iniciar Sesión"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};