import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email({ message: "El formato del correo no es válido" })
    .min(1, { message: "El correo electrónico es requerido" }),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
  rememberMe: z.boolean().optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;
