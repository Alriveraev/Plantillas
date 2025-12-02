import { z } from "zod";

// Validacion para pedir el correo
export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .email({ message: "El formato del correo no es válido" })
    .min(1, { message: "El correo electrónico es requerido" }),
});

// Validación para cambiar la contraseña
export const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Mínimo 8 caracteres"),
    password_confirmation: z.string().min(8, "Mínimo 8 caracteres"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Las contraseñas no coinciden",
    path: ["password_confirmation"],
  });
