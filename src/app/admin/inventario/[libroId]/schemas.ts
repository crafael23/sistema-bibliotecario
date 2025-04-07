import { z } from "zod";
import { estadoLibroEnum } from "~/server/db/schema";

// Schema for editing a libro
export const libroEditSchema = z.object({
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
  description: z
    .string()
    .max(500, { message: "La descripción no debe exceder 500 caracteres" }),
  publisher: z.string().max(100),
  edition: z.coerce.number().int().positive(),
  coverImageUrl: z.string().optional(), // Optional for updates
  coverImageKey: z.string().optional(), // For uploadthing
});

// Schema for editing a libro copy
export const libroCopiaEditSchema = z.object({
  localizacion: z
    .string()
    .min(5, { message: "La localización debe tener al menos 5 caracteres" })
    .regex(/^\d{3}-\d{3}-\d{3}$/, {
      message: "Formato incorrecto. Debe ser: 000-000-000",
    }),
  estado: z.enum(estadoLibroEnum.enumValues, {
    errorMap: () => ({ message: "Estado inválido" }),
  }),
});

// Schema for adding a new copy
export const newLibroCopiaSchema = z.object({
  localizacion: z
    .string()
    .min(5, { message: "La localización debe tener al menos 5 caracteres" })
    .regex(/^\d{3}-\d{3}-\d{3}$/, {
      message: "Formato incorrecto. Debe ser: 000-000-000",
    }),
});
