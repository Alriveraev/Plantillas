import { useFormik } from "formik";
import { toFormikValidationSchema } from "@/shared/utils/formik-zod";
import { Loader2 } from "lucide-react";
import type { LoginFormData } from "../schemas";
import { loginSchema } from "../schemas";
import { useLogin } from "../hooks";

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
// Asegúrate que la ruta de importación sea correcta según tu estructura
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
            <GoogleButton/>
          </Field>

          <FieldSeparator className="my-6">
            O ingresa tus credenciales
          </FieldSeparator>

          {/* Input Email */}
          <div className="space-y-2">
            <Input
              id="email"
              type="email"
              label="Correo Electrónico"
              autoComplete="username"
              placeholder="correo@ejemplo.com"
              disabled={isPending}
              {...formik.getFieldProps("email")}
            />
            <FormError name="email" formik={formik} />
          </div>

          <div className="space-y-2">
            <PasswordInput
              id="password"
              label="Contraseña"
              placeholder="Ingresa tu clave"
              autoComplete="current-password"
              disabled={isPending}
              {...formik.getFieldProps("password")}
            />
            <FormError name="password" formik={formik} />
          </div>

          {/* Checkbox Remember Me */}
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
              Recordarme en este dispositivo
            </Label>
          </div>

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
