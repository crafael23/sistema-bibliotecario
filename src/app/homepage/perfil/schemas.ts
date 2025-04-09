import { z } from "zod";
import { tipoDeUsuarioEnum } from "~/server/db/schema";

const phoneRegex = /^[0-9]{8,15}$/;
const identityRegex = /^[0-9]{13}$/;

export const userProfileSchema = z.object({
  nombre: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(50, "El nombre no puede exceder los 50 caracteres")
    .regex(
      /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
      "El nombre solo puede contener letras y espacios",
    ),
  email: z
    .string()
    .email("Email inválido")
    .min(5, "El email debe tener al menos 5 caracteres")
    .max(100, "El email no puede exceder los 100 caracteres"),
  telefono: z
    .string()
    .nullable()
    .refine(
      (val) => !val || phoneRegex.test(val),
      "El número de teléfono debe tener entre 8 y 15 dígitos",
    ),
  direccion: z
    .string()
    .nullable()
    .refine(
      (val) => !val || val.length >= 10,
      "La dirección debe tener al menos 10 caracteres",
    )
    .refine(
      (val) => !val || val.length <= 200,
      "La dirección no puede exceder los 200 caracteres",
    ),
  avatarUrl: z
    .string()
    .url("URL de avatar inválida")
    .refine(
      (val) => val.startsWith("http") || val.startsWith("/"),
      "La URL del avatar debe comenzar con http:// o https:// o ser una ruta relativa",
    ),
});

// Schema for form submission (without email)
export const userProfileFormSchema = userProfileSchema.omit({ email: true });

export type UserProfileData = z.infer<typeof userProfileSchema>;
export type UserProfileFormData = z.infer<typeof userProfileFormSchema>;

export type TipoDeUsuario = (typeof tipoDeUsuarioEnum.enumValues)[number];

export const getUserTypeLabel = (type: TipoDeUsuario): string => {
  switch (type) {
    case "estudiantes":
      return "Estudiante";
    case "docentes":
      return "Docente";
    case "bibliotecarios":
      return "Bibliotecario";
    default:
      return "Usuario Externo";
  }
};
