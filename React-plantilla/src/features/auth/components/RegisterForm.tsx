import { useFormik } from "formik";
import { toFormikValidationSchema } from "@/shared/utils/formik-zod";
import { registerSchema } from "../schemas";
import type{ RegisterFormData } from "../schemas";

import { useRegister } from "../hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FormError } from "@/shared/components/forms";

export const RegisterForm = () => {
  const { mutate: register, isPending } = useRegister();

  const formik = useFormik<RegisterFormData>({
    initialValues: {
      name: "",
      email: "",
      password: "",
      passwordConfirmation: "",
    },
    validationSchema: toFormikValidationSchema(registerSchema),
    onSubmit: (values) => {
      register(values);
    },
  });

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Crear Cuenta</CardTitle>
        <CardDescription>
          Completa el formulario para registrarte
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre Completo</Label>
            <Input
              id="name"
              type="text"
              placeholder="Juan Pérez"
              {...formik.getFieldProps("name")}
            />
            <FormError name="name" formik={formik} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Correo Electrónico</Label>
            <Input
              id="email"
              type="email"
              placeholder="correo@ejemplo.com"
              {...formik.getFieldProps("email")}
            />
            <FormError name="email" formik={formik} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...formik.getFieldProps("password")}
            />
            <FormError name="password" formik={formik} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="passwordConfirmation">Confirmar Contraseña</Label>
            <Input
              id="passwordConfirmation"
              type="password"
              placeholder="••••••••"
              {...formik.getFieldProps("passwordConfirmation")}
            />
            <FormError name="passwordConfirmation" formik={formik} />
          </div>

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Creando cuenta..." : "Crear Cuenta"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
