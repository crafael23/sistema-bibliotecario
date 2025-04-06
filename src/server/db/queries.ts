import { and, eq, gte, lte, sql } from "drizzle-orm";
import { db } from "./index";
import { libro, reservacion, usuario, libroCopia } from "./schema";
import { z } from "zod";
import { cifraridentidad } from "~/lib/random-utils";

// export async function getBooks() {
//   const books = await db
//     .select({
//       id: libro.groupId,
//       nombre: libro.nombre,
//       categoria: libro.categoria,
//       estado: libro.estado,
//       cantidad: sql<number>`cast(count(${libro.id}) as integer)`,
//     })
//     .from(libro)
//     .groupBy(libro.groupId, libro.nombre, libro.categoria, libro.estado)
//     .orderBy(libro.nombre);
//   return books;
// }
//
// export async function getHistorialPrestamosUsuario(userId: string, mes: Date) {
//   const startOfMonth = new Date(mes.getFullYear(), mes.getMonth(), 1);
//   const endOfMonth = new Date(mes.getFullYear(), mes.getMonth() + 1, 0);
//
//   const reservas = await db
//     .select({
//       id: reservacion.id,
//       fechaPrestamo: reservacion.fechaInicio,
//       estado: reservacion.estado,
//       libro: libro.nombre,
//       utilizado: sql<number>`${reservacion.fechaFin}-${reservacion.fechaInicio}`,
//     })
//     .from(reservacion)
//     .innerJoin(libro, eq(reservacion.libroId, sql`CAST(${libro.id} AS text)`))
//     .where(
//       and(
//         eq(reservacion.usuarioId, userId),
//         gte(reservacion.fechaInicio, startOfMonth.toISOString()),
//         lte(reservacion.fechaFin, endOfMonth.toISOString()),
//       ),
//     );
//   return reservas;
// }
//
export const libroSchema = z.object({
  id: z.string(),
  nombre: z.string(),
  categoria: z.string(),
  estado: z.enum(["disponible", "reservado", "prestado", "mantenimiento"]),
  groupId: z.string(),
});

export type libroType = z.infer<typeof libroSchema>;
//
// export async function insertarLibro(nuevoLibro: libroType) {
//   console.log("insertando libro");
//   await db.insert(libro).values({
//     id: nuevoLibro.id,
//     nombre: nuevoLibro.nombre,
//     categoria: nuevoLibro.categoria,
//     estado: nuevoLibro.estado,
//     groupId: Number(nuevoLibro.groupId),
//   });
// }

export async function getUsuario(userId: string) {
  return (
    await db.select().from(usuario).where(eq(usuario.clerkId, userId)).limit(1)
  )[0];
}

export async function nuevoUsuarioUpdate(
  userId: string,
  numero: string,
  direccion: string,
  identidad: string,
) {
  await db
    .update(usuario)
    .set({
      telefono: numero,
      direccion: direccion,
      identidad: cifraridentidad(identidad),
      nuevo: false,
    })
    .where(eq(usuario.clerkId, userId));
  return;
}

export async function getCategorias() {
  const data = await db
    .select({ categoria: libro.categoria })
    .from(libro)
    .groupBy(libro.categoria);
  return data.map((item) => item.categoria);
}

export async function getLibroWithCopias(libroId: number) {
  // First get the libro details
  const libroData = await db.query.libro.findFirst({
    where: (libro, { eq }) => eq(libro.id, libroId),
    with: {
      copias: true,
    },
  });

  return libroData;
}
