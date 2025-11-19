import { useFormik } from "formik";
import { toFormikValidationSchema } from "@/shared/utils/formik-zod";
import type { LoginFormData } from "../schemas";
import { loginSchema } from "../schemas";
import { useLogin } from "../hooks";
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

export const LoginForm = () => {
  const { mutate: login, isPending } = useLogin();

  const formik = useFormik<LoginFormData>({
    initialValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    validate: toFormikValidationSchema(loginSchema),
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: (values) => {
      console.log(values);
      login(values);
    },
  });
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-xl"> Bienvenido de nuevo</CardTitle>
        <CardDescription>
          Inicia sesión con tu cuenta de Google
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <Field>
            <Button variant="outline" type="button">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path
                  d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                  fill="currentColor"
                />
              </svg>
              Inicia sesión con Google
            </Button>
          </Field>
          <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card my-6">
            O ingresa tus credenciales para acceder
          </FieldSeparator>
          <div className="space-y-2">
            <Input
              id="email"
              type="email"
              label="Correo Electrónico"
              placeholder="correo@ejemplo.com"
              {...formik.getFieldProps("email")}
            />
            <FormError name="email" formik={formik} />
          </div>

          <div className="space-y-2">
            <Input
              id="password"
              type="password"
              label="Contraseña"
              placeholder="••••••••"
              {...formik.getFieldProps("password")}
            />
            <FormError name="password" formik={formik} />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="rememberMe"
              className="text-black"
              checked={formik.values.rememberMe}
              onCheckedChange={(checked) =>
                formik.setFieldValue("rememberMe", checked)
              }
            />
            <Label
              htmlFor="rememberMe"
              className="text-sm font-normal cursor-pointer"
            >
              Recordarme
            </Label>
          </div>

          <Button
            type="submit"
            variant="outline"
            className="w-full text-black"
            disabled={isPending}
          >
            {isPending ? "Iniciando sesión..." : "Iniciar Sesión"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
