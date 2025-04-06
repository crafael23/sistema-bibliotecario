import { z } from "zod";

export const formSchema = z.object({
  telefono: z.string().min(8, {
    message: "El número de teléfono debe tener al menos 8 dígitos.",
  }),
  direccion: z.string().min(10, {
    message: "La dirección debe tener al menos 10 caracteres.",
  }),
  identidad: z.string().min(13, {
    message: "El número de identidad debe tener al menos 5 caracteres.",
  }),
});

export type FormValues = z.infer<typeof formSchema>;
