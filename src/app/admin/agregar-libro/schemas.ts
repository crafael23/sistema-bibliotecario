import { z } from "zod";

// Schema for the form data
export const libroFormSchema = z.object({
  title: z
    .string()
    .min(2, { message: "El título debe tener al menos 2 caracteres" })
    .max(100),
  author: z
    .string()
    .min(2, { message: "El autor debe tener al menos 2 caracteres" })
    .max(100),
  isbn: z
    .string()
    .min(10, { message: "El ISBN debe tener al menos 10 caracteres" })
    .max(17, { message: "El ISBN no debe exceder 17 caracteres" })
    .regex(/^(?:\d[- ]?){9}[\dXx]$|^(?:\d[- ]?){12}\d$/, {
      message: "Formato de ISBN inválido (10 o 13 dígitos)",
    }),
  category: z.string({ required_error: "Seleccione una categoría" }),
  copies: z.coerce
    .number()
    .int()
    .positive({ message: "Debe ser un número entero positivo" }),
  description: z
    .string()
    .max(500, { message: "La descripción no debe exceder 500 caracteres" })
    .optional(),
  publisher: z.string().max(100).optional(),
  edition: z.coerce.number().int().positive().optional(),
  coverImageUrl: z.string().optional(), // Accept any string for URL
  coverImageKey: z.string().optional(), // UploadThing file key for deletion if needed
});

// Schema for libro copy location
export const libroCopiaLocationSchema = z.object({
  localizacion: z
    .string()
    .min(5, { message: "La localización debe tener al menos 5 caracteres" }),
});
