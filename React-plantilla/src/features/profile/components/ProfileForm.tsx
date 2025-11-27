import { useState } from 'react';
import { useFormik } from 'formik';
import { toFormikValidationSchema } from '@/shared/utils/formik-zod';
import type { ProfileFormData } from '../schemas';
import { profileSchema } from '../schemas';
import { useUpdateProfile } from '../hooks';
import type { User } from '@/api/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormError } from '@/shared/components/forms';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  User as UserIcon,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit3,
  X,
  Save,
  Check,
} from 'lucide-react';
import { formatDate } from '@/shared/utils/date';

interface ProfileFormProps {
  user: User & {
    phone?: string;
    location?: string;
    bio?: string;
    createdAt?: string;
  };
}

export const ProfileForm = ({ user }: ProfileFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const { mutate: updateProfile, isPending } = useUpdateProfile();

  const formik = useFormik<ProfileFormData>({
    initialValues: {
      name: user.name,
      email: user.email,
    },
    validationSchema: toFormikValidationSchema(profileSchema),
    onSubmit: (values) => {
      updateProfile(values, {
        onSuccess: () => {
          setIsEditing(false);
        },
      });
    },
  });

  const handleCancel = () => {
    formik.resetForm();
    setIsEditing(false);
  };

  const hasChanges =
    formik.values.name !== user.name || formik.values.email !== user.email;

  // Modo Vista
  if (!isEditing) {
    return (
      <div className="space-y-6">
        {/* Header con botón de editar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
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
          <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50 border">
            <div className="p-2 rounded-full bg-primary/10">
              <UserIcon className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-muted-foreground">
                Nombre Completo
              </p>
              <p className="text-base font-semibold text-foreground truncate">
                {user.name}
              </p>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50 border">
            <div className="p-2 rounded-full bg-primary/10">
              <Mail className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-muted-foreground">
                Correo Electrónico
              </p>
              <p className="text-base font-semibold text-foreground truncate">
                {user.email}
              </p>
            </div>
          </div>

          {/* Teléfono (opcional) */}
          {user.phone && (
            <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50 border">
              <div className="p-2 rounded-full bg-primary/10">
                <Phone className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-muted-foreground">
                  Teléfono
                </p>
                <p className="text-base font-semibold text-foreground">
                  {user.phone}
                </p>
              </div>
            </div>
          )}

          {/* Ubicación (opcional) */}
          {user.location && (
            <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50 border">
              <div className="p-2 rounded-full bg-primary/10">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-muted-foreground">
                  Ubicación
                </p>
                <p className="text-base font-semibold text-foreground">
                  {user.location}
                </p>
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* Info adicional */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>
            Miembro desde{' '}
            {user.createdAt ? formatDate(user.createdAt, 'MMMM yyyy') : 'N/A'}
          </span>
        </div>
      </div>
    );
  }

  // Modo Edición
  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      {/* Header con indicador de cambios */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {hasChanges && (
            <Badge variant="secondary" className="text-xs bg-yellow-500/10 text-yellow-700">
              Cambios sin guardar
            </Badge>
          )}
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleCancel}
          className="gap-2 text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
          Cancelar
        </Button>
      </div>

      {/* Campos de edición */}
      <div className="space-y-4">
        {/* Nombre */}
        <div className="space-y-2">
          <Label htmlFor="name" className="flex items-center gap-2">
            <UserIcon className="h-4 w-4 text-muted-foreground" />
            Nombre Completo
          </Label>
          <Input
            id="name"
            type="text"
            placeholder="Juan Pérez"
            className={
              formik.values.name !== user.name
                ? 'border-yellow-500 focus-visible:ring-yellow-500'
                : ''
            }
            {...formik.getFieldProps('name')}
          />
          <FormError name="name" formik={formik} />
          {formik.values.name !== user.name && (
            <p className="text-xs text-muted-foreground">
              Valor anterior: <span className="line-through">{user.name}</span>
            </p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email" className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            Correo Electrónico
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="correo@ejemplo.com"
            className={
              formik.values.email !== user.email
                ? 'border-yellow-500 focus-visible:ring-yellow-500'
                : ''
            }
            {...formik.getFieldProps('email')}
          />
          <FormError name="email" formik={formik} />
          {formik.values.email !== user.email && (
            <p className="text-xs text-muted-foreground">
              Valor anterior: <span className="line-through">{user.email}</span>
            </p>
          )}
        </div>
      </div>

      <Separator />

      {/* Acciones */}
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
          disabled={isPending}
          className="flex-1 sm:flex-none"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={isPending || !hasChanges}
          className="flex-1 sm:flex-none gap-2"
        >
          {isPending ? (
            <>
              <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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

      {/* Hint */}
      {!hasChanges && (
        <p className="text-xs text-center text-muted-foreground">
          Modifica algún campo para habilitar el botón de guardar
        </p>
      )}
    </form>
  );
};