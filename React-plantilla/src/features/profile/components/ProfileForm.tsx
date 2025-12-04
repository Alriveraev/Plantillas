import { useState } from "react";
import { useFormik } from "formik";
import { toFormikValidationSchema } from "@/shared/utils/formik-zod";
import { profileSchema, type ProfileFormData } from "../schemas/profileSchema";
import { useUpdateProfile } from "../hooks/useUpdateProfile";
import type { User } from "@/api/types";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormError } from "@/shared/components/forms";

// Icons & Utils
import {
  Loader2,
  User as UserIcon,
  Mail,
  Phone,
  Calendar,
  Edit3,
  X,
  Save,
  Check,
  Hash,
  Fingerprint,
} from "lucide-react";
import { formatDate } from "@/shared/utils/date";

interface ProfileFormProps {
  user: User;
}

export const ProfileForm = ({ user }: ProfileFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const { mutate: updateProfile, isPending } = useUpdateProfile();

  // Acceso seguro al perfil (puede venir undefined si el usuario es nuevo)
  const p = user.profile || {};

  const formik = useFormik<ProfileFormData>({
    enableReinitialize: true, // Actualiza el form si 'user' cambia en tiempo real
    initialValues: {
      email: user.email,
      first_name: p.first_name || "",
      second_name: p.second_name || "",
      third_name: p.third_name || "",
      first_surname: p.first_surname || "",
      second_surname: p.second_surname || "",
      third_surname: p.third_surname || "",
      phone: p.phone || "",
      // Aseguramos que sea string para el Select
      gender_id: p.gender_id ? String(p.gender_id) : "", 
    },
    validationSchema: toFormikValidationSchema(profileSchema),
    validateOnBlur: true,
    validateOnChange: true, // Validación inmediata al corregir
    onSubmit: (values, { setErrors }) => {
      updateProfile(values, {
        onSuccess: () => {
          setIsEditing(false);
        },
        onError: (error: any) => {
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

  const displayFullName = p.full_name || user.name;

  // --- MODO VISTA (Lectura) ---
  if (!isEditing) {
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        {/* Header con botón de editar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="text-xs bg-teal-50 text-teal-700 border-teal-200"
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
        <div className="grid gap-4 md:grid-cols-2">
          {/* Nombre */}
          <div className="md:col-span-2 flex items-start gap-4 p-4 rounded-lg bg-stone-50 border border-stone-100">
            <div className="p-2 rounded-full bg-white shadow-sm">
              <UserIcon className="h-5 w-5 text-stone-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-stone-500">
                Nombre Completo
              </p>
              <p className="text-base font-semibold text-stone-900 truncate">
                {displayFullName}
              </p>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-start gap-4 p-4 rounded-lg bg-stone-50 border border-stone-100">
            <div className="p-2 rounded-full bg-white shadow-sm">
              <Mail className="h-5 w-5 text-stone-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-stone-500">
                Correo Electrónico
              </p>
              <p className="text-sm font-semibold text-stone-900 truncate">
                {user.email}
              </p>
            </div>
          </div>

          {/* Teléfono */}
          <div className="flex items-start gap-4 p-4 rounded-lg bg-stone-50 border border-stone-100">
            <div className="p-2 rounded-full bg-white shadow-sm">
              <Phone className="h-5 w-5 text-stone-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-stone-500">Teléfono</p>
              <p className="text-sm font-semibold text-stone-900">
                {p.phone || "No registrado"}
              </p>
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        {/* Info Footer */}
        <div className="flex items-center gap-2 text-sm text-stone-500">
          <Calendar className="h-4 w-4" />
          <span>
            Miembro desde {user.createdAt ? formatDate(user.createdAt) : "N/A"}
          </span>
        </div>
      </div>
    );
  }

  // --- MODO EDICIÓN (Formulario) ---
  return (
    <form
      onSubmit={formik.handleSubmit}
      className="space-y-6 animate-in fade-in duration-300"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-stone-500">
          Editando información personal
        </h3>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleCancel}
          disabled={isPending}
          className="gap-2 text-stone-500 hover:text-stone-900"
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
              className={formik.errors.first_name ? "border-red-500" : ""}
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
              className={formik.errors.first_surname ? "border-red-500" : ""}
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

        {/* Fila 3: Género y Teléfono */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="gender_id" className="flex items-center gap-2">
                <Fingerprint className="h-4 w-4 text-stone-400"/>
                Género
            </Label>
            <Select
              disabled={isPending}
              onValueChange={(value) => formik.setFieldValue("gender_id", value)}
              value={formik.values.gender_id}
            >
              <SelectTrigger 
                className={formik.errors.gender_id ? "border-red-500" : ""}
              >
                <SelectValue placeholder="Seleccionar..." />
              </SelectTrigger>
              <SelectContent>
                {/* Ajusta estos valores a los ID de tu base de datos */}
                <SelectItem value="1">Masculino</SelectItem>
                <SelectItem value="2">Femenino</SelectItem>
                <SelectItem value="3">Otro</SelectItem>
              </SelectContent>
            </Select>
            <FormError name="gender_id" formik={formik} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Hash className="h-4 w-4 text-stone-400" />
              Teléfono
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+52 55..."
              disabled={isPending}
              {...formik.getFieldProps("phone")}
            />
            <FormError name="phone" formik={formik} />
          </div>
        </div>

        <Separator className="my-2" />

        {/* Fila 4: Email (Critical Data) */}
        <div className="space-y-2 bg-amber-50/50 p-4 rounded-md border border-amber-100">
          <Label htmlFor="email" className="flex items-center gap-2 text-amber-900">
            <Mail className="h-4 w-4 text-amber-600" />
            Correo Electrónico (Cuenta)
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="correo@ejemplo.com"
            disabled={isPending}
            {...formik.getFieldProps("email")}
            className="bg-white"
          />
          <FormError name="email" formik={formik} />
          <p className="text-xs text-amber-600/80">
            Nota: Cambiar tu email cerrará tu sesión actual y requerirá verificación.
          </p>
        </div>
      </div>

      <Separator />

      {/* Footer Acciones */}
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
          className="bg-teal-600 hover:bg-teal-700 text-white min-w-[140px]"
          disabled={isPending || !formik.dirty}
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Guardando...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Guardar Cambios
            </>
          )}
        </Button>
      </div>
    </form>
  );
};