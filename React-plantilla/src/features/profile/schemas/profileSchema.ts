import { z } from "zod";

export const profileSchema = z.object({
  name: z
    .string()
    .trim() // Buena práctica: elimina espacios al inicio/final
    .min(1, "El nombre es requerido")
    .min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z
    .string()
    .trim() // Crucial para emails copiados/pegados
    .min(1, "El correo electrónico es requerido")
    .email("Debe ser un correo electrónico válido"),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      // No usamos trim() en passwords porque el espacio puede ser un caracter válido
      .min(1, "La contraseña actual es requerida"),
    newPassword: z
      .string()
      .min(1, "La nueva contraseña es requerida")
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Debe contener al menos una mayúscula, una minúscula y un número"
      ),
    confirmPassword: z.string().min(1, "Debe confirmar la nueva contraseña"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export const verifyCodeSchema = z.object({
  code: z
    .string()
    .trim() // Importante: a veces se copian espacios al pegar códigos
    .length(6, "El código debe tener 6 dígitos")
    .regex(/^\d+$/, "El código solo debe contener números"),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
export type VerifyCodeFormData = z.infer<typeof verifyCodeSchema>;
