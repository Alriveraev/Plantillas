import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .email({ message: "El correo electronico no es valido" })
    .min(1, { message: "El correo electronico es requerido" }),
  password: z
    .string()
    .min(1, "La contraseña es requerida")
    .max(8, "La contraseña debe tener como máximo 8 caracteres"),
  rememberMe: z.boolean().optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;
