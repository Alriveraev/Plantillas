import { z } from "zod";

export const profileSchema = z.object({
  name: z
    .string()
    .min(1, "El nombre es requerido")
    .min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z
    .string()
    .min(1, "El correo electrónico es requerido")
    .email("Debe ser un correo electrónico válido"),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "La contraseña actual es requerida"),
    newPassword: z
      .string()
      .min(1, "La nueva contraseña es requerida")
      .min(6, "La contraseña debe tener al menos 6 caracteres"),
    newPasswordConfirmation: z
      .string()
      .min(1, "Debe confirmar la nueva contraseña"),
  })
  .refine((data) => data.newPassword === data.newPasswordConfirmation, {
    message: "Las contraseñas no coinciden",
    path: ["newPasswordConfirmation"],
  });

export type ProfileFormData = z.infer<typeof profileSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
