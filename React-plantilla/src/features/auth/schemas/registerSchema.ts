import { z } from "zod";

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, { message: "El nombre es requerido" }) // 2. Valida que no esté vacío
      .min(2, { message: "El nombre debe tener al menos 2 caracteres" }), // 3. Valida longitud mínima

    email: z
      .string()
      .trim() // 1. Limpia espacios (crucial en emails copiados/pegados)
      .min(1, { message: "El correo electrónico es requerido" }) // 2. Primero verifica vacío
      .email({ message: "Debe ser un correo electrónico válido" }), // 3. Luego verifica formato

    password: z
      .string()
      // Nota: No usamos trim() en password porque los espacios pueden ser parte de la clave,
      // aunque es raro, es mejor respetar lo que el usuario escribe ahí.
      .min(1, { message: "La contraseña es requerida" })
      .min(8, { message: "La contraseña debe tener al menos 8 caracteres" }),

    passwordConfirmation: z
      .string()
      .min(1, { message: "Debe confirmar la contraseña" }),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Las contraseñas no coinciden",
    path: ["passwordConfirmation"], // Esto pone el error rojo debajo del segundo input
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
