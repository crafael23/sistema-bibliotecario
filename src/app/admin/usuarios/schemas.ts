import { z } from "zod";

// Schema for usuario form data
export const usuarioFormSchema = z.object({
  nombre: z
    .string()
    .min(2, { message: "El nombre debe tener al menos 2 caracteres" })
    .max(100),
  email: z.string().email({ message: "Email inválido" }),
  telefono: z
    .string()
    .min(8, { message: "El teléfono debe tener al menos 8 caracteres" })
    .max(15)
    .optional(),
  direccion: z
    .string()
    .max(200, { message: "La dirección no debe exceder 200 caracteres" })
    .optional(),
  identidad: z
    .string()
    .min(5, { message: "La identidad debe tener al menos 5 caracteres" })
    .max(20)
    .optional(),
  tipoDeUsuario: z.enum(
    ["externos", "estudiantes", "docentes", "bibliotecarios"],
    {
      required_error: "Seleccione un tipo de usuario",
    },
  ),
  nuevo: z.boolean().default(true),
});

// Schema for pagination parameters
export const usuarioPaginationParamsSchema = z.object({
  cursor: z.string().optional(),
  pageSize: z.number().optional().default(5),
  orderBy: z.enum(["asc", "desc"]).optional().default("asc"),
});

// Schema for search parameters
export const usuarioSearchParamsSchema = z.object({
  searchTerm: z.string().min(1),
});
