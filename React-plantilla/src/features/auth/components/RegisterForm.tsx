import { useFormik } from "formik";
import { toFormikValidationSchema } from "@/shared/utils/formik-zod";
import { Loader2 } from "lucide-react";
import { registerSchema } from "../schemas";
import type { RegisterFormData } from "../schemas";
import { useRegister } from "../hooks";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldSeparator } from "@/components/ui/field";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FormError } from "@/shared/components/forms";
import { PasswordInput } from "@/components/password-input";
import { GoogleButton } from "./SocialButton"; // Reutilizamos el botón del Login

export const RegisterForm = () => {
  const { mutate: register, isPending } = useRegister();

  const formik = useFormik<RegisterFormData>({
    initialValues: {
      name: "",
      email: "",
      password: "",
      passwordConfirmation: "",
    },
    validate: toFormikValidationSchema(registerSchema),
    validateOnBlur: true,
    validateOnChange: false, // Optimización igual que en Login
    onSubmit: (values) => {
      // Saneamiento básico
      const sanitizedValues = {
        ...values,
        email: values.email.trim(),
      };
      register(sanitizedValues);
    },
  });

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Crear Cuenta</CardTitle>
        <CardDescription>Ingresa tus datos para registrarte</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          {/* Botón Social */}
          <Field>
            <GoogleButton  />
          </Field>

          <FieldSeparator className="my-6">
            O regístrate con tu email
          </FieldSeparator>

          {/* Nombre Completo */}
          <div className="space-y-2">
            <Input
              id="name"
              label="Nombre Completo"
              type="text"
              placeholder="Juan Pérez"
              autoComplete="name"
              disabled={isPending}
              {...formik.getFieldProps("name")}
            />
            <FormError name="name" formik={formik} />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Input
              id="email"
              type="email"
              label="Correo Electrónico"
              placeholder="correo@ejemplo.com"
              autoComplete="email"
              disabled={isPending}
              {...formik.getFieldProps("email")}
            />
            <FormError name="email" formik={formik} />
          </div>

          {/* Contraseña */}
          <div className="space-y-2">
            <PasswordInput
              id="password"
              label="Contraseña"
              placeholder="••••••••"
              autoComplete="new-password"
              disabled={isPending}
              {...formik.getFieldProps("password")}
            />
            <FormError name="password" formik={formik} />
          </div>

          {/* Confirmar Contraseña */}
          <div className="space-y-2">
            <PasswordInput
              id="passwordConfirmation"
              label="Confirmar Contraseña"
              placeholder="••••••••"
              autoComplete="new-password"
              disabled={isPending}
              {...formik.getFieldProps("passwordConfirmation")}
            />
            <FormError name="passwordConfirmation" formik={formik} />
          </div>

          {/* Botón Submit */}
          <Button
            type="submit"
            className="w-full"
            disabled={isPending || !formik.isValid}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creando cuenta...
              </>
            ) : (
              "Crear Cuenta"
            )}
          </Button>
        </form>
      </CardContent>

    
    </Card>
  );
};
