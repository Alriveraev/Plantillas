import { useFormik } from "formik";
import { toFormikValidationSchema } from "@/shared/utils/formik-zod";
import type { CreateUserFormData } from "../schemas";
import { createUserSchema } from "../schemas";

import { useCreateUser } from "../hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormError } from "@/shared/components/forms";

interface CreateUserFormProps {
  onSuccess?: () => void;
}

export const CreateUserForm = ({ onSuccess }: CreateUserFormProps) => {
  const { mutate: createUser, isPending } = useCreateUser();

  const formik = useFormik<CreateUserFormData>({
    initialValues: {
      name: "",
      email: "",
      password: "",
      role: "user",
    },
    validationSchema: toFormikValidationSchema(createUserSchema),
    onSubmit: (values) => {
      createUser(values, {
        onSuccess: () => {
          formik.resetForm();
          onSuccess?.();
        },
      });
    },
  });

  return (
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
        <Label htmlFor="role">Rol</Label>
        <Select
          value={formik.values.role}
          onValueChange={(value) => formik.setFieldValue("role", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona un rol" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="user">Usuario</SelectItem>
            <SelectItem value="admin">Administrador</SelectItem>
          </SelectContent>
        </Select>
        <FormError name="role" formik={formik} />
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Creando..." : "Crear Usuario"}
      </Button>
    </form>
  );
};
