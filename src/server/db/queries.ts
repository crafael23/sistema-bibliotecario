import { sql } from "drizzle-orm";
import { db } from "./index";
import { libro } from "./schema";

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
