import { and, eq, gte, lte, sql } from "drizzle-orm";
import { db } from "./index";
import { libro, reservacion } from "./schema";

export async function getBooks() {
  const books = await db
    .select({
      id: libro.groupId,
      nombre: libro.nombre,
      categoria: libro.categoria,
      estado: libro.estado,
      cantidad: sql<number>`cast(count(${libro.id}) as integer)`,
    })
    .from(libro)
    .groupBy(libro.groupId, libro.nombre, libro.categoria, libro.estado)
    .orderBy(libro.nombre);
  return books;
}

export async function getHistorialPrestamosUsuario(userId: string, mes: Date) {
  const startOfMonth = new Date(mes.getFullYear(), mes.getMonth(), 1);
  const endOfMonth = new Date(mes.getFullYear(), mes.getMonth() + 1, 0);

  const reservas = await db
    .select({
      id: reservacion.id,
      fechaPrestamo: reservacion.fechaInicio,
      estado: reservacion.estado,
      libro: libro.nombre,
      utilizado: sql<number>`${reservacion.fechaFin}-${reservacion.fechaInicio}`,
    })
    .from(reservacion)
    .innerJoin(libro, eq(reservacion.libroId, sql`CAST(${libro.id} AS text)`))
    .where(
      and(
        eq(reservacion.usuarioId, userId),
        gte(reservacion.fechaInicio, startOfMonth.toISOString()),
        lte(reservacion.fechaFin, endOfMonth.toISOString()),
      ),
    );
  return reservas;
}
