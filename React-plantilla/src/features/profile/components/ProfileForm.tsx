import { useState } from "react";
import { useFormik } from "formik";
import { toFormikValidationSchema } from "@/shared/utils/formik-zod";
import { profileSchema, type ProfileFormData } from "../schemas/profileSchema"; // Asegúrate de la ruta
import { useUpdateProfile } from "../hooks/useUpdateProfile";
import type { User } from "@/api/types";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormError } from "@/shared/components/forms"; // Tu componente de error
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import {
  User as UserIcon,
  Mail,
  Phone,
  Calendar,
  Edit3,
  X,
  Save,
  Check,
  Hash,
} from "lucide-react";
import { formatDate } from "@/shared/utils/date"; // Tu utilidad de fecha

interface ProfileFormProps {
  user: User;
}

export const ProfileForm = ({ user }: ProfileFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const { mutate: updateProfile, isPending } = useUpdateProfile();

  // Acceso seguro a profile (puede venir undefined al principio)
  const p = user.profile || {};

  const formik = useFormik<ProfileFormData>({
    enableReinitialize: true, // Importante para actualizar si user cambia
    initialValues: {
      email: user.email,
      first_name: p.first_name || "",
      second_name: p.second_name || "",
      third_name: p.third_name || "",
      first_surname: p.first_surname || "",
      second_surname: p.second_surname || "",
      third_surname: p.third_surname || "",
      phone: p.phone || "",
      gender_id: "", // Si usas select de género, conéctalo aquí
    },
    validationSchema: toFormikValidationSchema(profileSchema),
    onSubmit: (values, { setErrors }) => {
      // Limpiamos valores vacíos para enviar null o string vacío según prefieras
      updateProfile(values, {
        onSuccess: () => {
          setIsEditing(false);
        },
        onError: (error: any) => {
          // Manejo de errores 422 desde Laravel
          if (error.response?.status === 422) {
            const serverErrors = error.response.data.errors;
            const formikErrors: Record<string, string> = {};
            Object.keys(serverErrors).forEach((key) => {
              formikErrors[key] = serverErrors[key][0];
            });
            setErrors(formikErrors);
          }
        },
      });
    },
  });

  const handleCancel = () => {
    formik.resetForm();
    setIsEditing(false);
  };

  // Helper para mostrar nombre completo en modo lectura
  const displayFullName = p.full_name || user.name;

  // --- MODO VISTA ---
  if (!isEditing) {
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        {/* Header con botón de editar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="text-xs bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-900/20 dark:text-teal-300 dark:border-teal-800"
            >
              <Check className="h-3 w-3 mr-1" />
              Verificado
            </Badge>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="gap-2"
          >
            <Edit3 className="h-4 w-4" />
            Editar Perfil
          </Button>
        </div>

        {/* Información del perfil */}
        <div className="space-y-4">
          {/* Nombre */}
          <div className="flex items-start gap-4 p-4 rounded-lg bg-stone-50 border border-stone-100 dark:bg-stone-900/50 dark:border-stone-800">
            <div className="p-2 rounded-full bg-white shadow-sm dark:bg-stone-800">
              <UserIcon className="h-5 w-5 text-stone-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-stone-500 dark:text-stone-400">
                Nombre Completo
              </p>
              <p className="text-base font-semibold text-stone-900 dark:text-stone-100 truncate">
                {displayFullName}
              </p>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-start gap-4 p-4 rounded-lg bg-stone-50 border border-stone-100 dark:bg-stone-900/50 dark:border-stone-800">
            <div className="p-2 rounded-full bg-white shadow-sm dark:bg-stone-800">
              <Mail className="h-5 w-5 text-stone-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-stone-500 dark:text-stone-400">
                Correo Electrónico
              </p>
              <p className="text-base font-semibold text-stone-900 dark:text-stone-100 truncate">
                {user.email}
              </p>
            </div>
          </div>

          {/* Teléfono */}
          {p.phone && (
            <div className="flex items-start gap-4 p-4 rounded-lg bg-stone-50 border border-stone-100 dark:bg-stone-900/50 dark:border-stone-800">
              <div className="p-2 rounded-full bg-white shadow-sm dark:bg-stone-800">
                <Phone className="h-5 w-5 text-stone-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-stone-500 dark:text-stone-400">
                  Teléfono
                </p>
                <p className="text-base font-semibold text-stone-900 dark:text-stone-100">
                  {p.phone}
                </p>
              </div>
            </div>
          )}
        </div>

        <Separator className="my-6" />

        {/* Info adicional */}
        <div className="flex items-center gap-2 text-sm text-stone-500 dark:text-stone-400">
          <Calendar className="h-4 w-4" />
          <span>
            Miembro desde {user.createdAt ? formatDate(user.createdAt) : "N/A"}
          </span>
        </div>
      </div>
    );
  }

  // --- MODO EDICIÓN ---
  return (
    <form
      onSubmit={formik.handleSubmit}
      className="space-y-6 animate-in fade-in duration-300"
    >
      {/* Header con acciones */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-stone-500">
          Editando información
        </h3>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleCancel}
          disabled={isPending}
          className="gap-2 text-stone-500 hover:text-stone-900 dark:hover:text-stone-100"
        >
          <X className="h-4 w-4" />
          Cancelar
        </Button>
      </div>

      <div className="space-y-4">
        {/* Fila 1: Nombres */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="first_name">Primer Nombre *</Label>
            <Input
              id="first_name"
              placeholder="Ej: Juan"
              disabled={isPending}
              {...formik.getFieldProps("first_name")}
            />
            <FormError name="first_name" formik={formik} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="second_name">Segundo Nombre</Label>
            <Input
              id="second_name"
              placeholder="Ej: Carlos"
              disabled={isPending}
              {...formik.getFieldProps("second_name")}
            />
            <FormError name="second_name" formik={formik} />
          </div>
        </div>

        {/* Fila 2: Apellidos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="first_surname">Primer Apellido *</Label>
            <Input
              id="first_surname"
              placeholder="Ej: Pérez"
              disabled={isPending}
              {...formik.getFieldProps("first_surname")}
            />
            <FormError name="first_surname" formik={formik} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="second_surname">Segundo Apellido</Label>
            <Input
              id="second_surname"
              placeholder="Ej: Gómez"
              disabled={isPending}
              {...formik.getFieldProps("second_surname")}
            />
            <FormError name="second_surname" formik={formik} />
          </div>
        </div>

        {/* Fila 3: Terceros Nombres/Apellidos (Opcionales del backend) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label
              htmlFor="third_name"
              className="text-xs text-muted-foreground"
            >
              Tercer Nombre (Opcional)
            </Label>
            <Input
              id="third_name"
              disabled={isPending}
              {...formik.getFieldProps("third_name")}
            />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="third_surname"
              className="text-xs text-muted-foreground"
            >
              Tercer Apellido (Opcional)
            </Label>
            <Input
              id="third_surname"
              disabled={isPending}
              {...formik.getFieldProps("third_surname")}
            />
          </div>
        </div>

        <Separator />

        {/* Fila 4: Contacto */}
        <div className="space-y-2">
          <Label htmlFor="email" className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-stone-400" />
            Correo Electrónico *
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="correo@ejemplo.com"
            disabled={isPending}
            {...formik.getFieldProps("email")}
          />
          <FormError name="email" formik={formik} />
          <p className="text-xs text-stone-400">
            Cambiar tu email requerirá verificarlo de nuevo.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="flex items-center gap-2">
            <Hash className="h-4 w-4 text-stone-400" />
            Teléfono
          </Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+52 55 1234 5678"
            disabled={isPending}
            {...formik.getFieldProps("phone")}
          />
          <FormError name="phone" formik={formik} />
        </div>
      </div>

      <Separator />

      {/* Acciones Footer */}
      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
          disabled={isPending}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={isPending || !formik.dirty}
          className="gap-2"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Guardar Cambios
            </>
          )}
        </Button>
      </div>
    </form>
  );
};
