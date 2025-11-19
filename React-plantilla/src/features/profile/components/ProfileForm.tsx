import { useFormik } from "formik";
import { toFormikValidationSchema } from "@/shared/utils/formik-zod";
import type { ProfileFormData } from "../schemas";
import { profileSchema } from "../schemas";

import { useUpdateProfile } from "../hooks";
import type { User } from "@/api/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormError } from "@/shared/components/forms";

interface ProfileFormProps {
  user: User;
}

export const ProfileForm = ({ user }: ProfileFormProps) => {
  const { mutate: updateProfile, isPending } = useUpdateProfile();

  const formik = useFormik<ProfileFormData>({
    initialValues: {
      name: user.name,
      email: user.email,
    },
    validationSchema: toFormikValidationSchema(profileSchema),
    onSubmit: (values) => {
      updateProfile(values);
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

      <Button type="submit" disabled={isPending}>
        {isPending ? "Guardando..." : "Guardar Cambios"}
      </Button>
    </form>
  );
};
