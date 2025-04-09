import { and, eq, gte, lte, sql, or } from "drizzle-orm";
import { db } from "./index";
import { libro, reservacion, usuario, libroCopia, multa } from "./schema";
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

export async function getLibrosPaginated(
  cursor?: number,
  pageSize = 5,
  orderBy: "asc" | "desc" = "asc",
) {
  // For cursor-based pagination, we need to use > or < for the next page,
  // but = for the exact cursor when navigating back to a specific page
  const whereCondition =
    cursor !== undefined
      ? orderBy === "asc"
        ? cursor === 0
          ? undefined // First page special case
          : gte(libro.id, cursor)
        : cursor === 0
          ? undefined // First page special case
          : lte(libro.id, cursor)
      : undefined;

  const libros = await db
    .select({
      id: libro.id,
      codigo: libro.codigo,
      nombre: libro.nombre,
      categoria: libro.categoria,
      autor: libro.autor,
      isbn: libro.isbn,
      edicion: libro.edicion,
      descripcion: libro.descripcion,
      editorial: libro.editorial,
      urlImagenPortada: libro.urlImagenPortada,
      copias: sql<number>`CAST(COUNT(${libroCopia.id}) AS INTEGER)`,
    })
    .from(libro)
    .leftJoin(libroCopia, eq(libro.id, libroCopia.libroId))
    .where(whereCondition)
    .groupBy(
      libro.id,
      libro.codigo,
      libro.nombre,
      libro.categoria,
      libro.autor,
      libro.isbn,
      libro.edicion,
      libro.descripcion,
      libro.editorial,
      libro.urlImagenPortada,
    )
    .limit(pageSize + 1) // Get one extra to determine if there are more results
    .orderBy(orderBy === "asc" ? sql`${libro.id} asc` : sql`${libro.id} desc`);

  // Check if there are more results
  const hasNextPage = libros.length > pageSize;

  // Remove the extra item if it exists
  const results = hasNextPage ? libros.slice(0, pageSize) : libros;

  // Get the new cursor from the last item
  const lastItem = results.length > 0 ? results[results.length - 1] : null;
  const nextCursor = lastItem ? lastItem.id : null;

  return {
    libros: results,
    nextCursor,
    hasNextPage,
  };
}

export async function searchLibros(searchTerm: string) {
  const searchPattern = `%${searchTerm.toLowerCase()}%`;

  const libros = await db
    .select({
      id: libro.id,
      codigo: libro.codigo,
      nombre: libro.nombre,
      categoria: libro.categoria,
      autor: libro.autor,
      isbn: libro.isbn,
      edicion: libro.edicion,
      descripcion: libro.descripcion,
      editorial: libro.editorial,
      urlImagenPortada: libro.urlImagenPortada,
      copias: sql<number>`CAST(COUNT(${libroCopia.id}) AS INTEGER)`,
    })
    .from(libro)
    .leftJoin(libroCopia, eq(libro.id, libroCopia.libroId))
    .where(
      or(
        sql`LOWER(${libro.nombre}) LIKE ${searchPattern}`,
        sql`LOWER(${libro.autor}) LIKE ${searchPattern}`,
        sql`LOWER(${libro.categoria}) LIKE ${searchPattern}`,
      ),
    )
    .groupBy(
      libro.id,
      libro.codigo,
      libro.nombre,
      libro.categoria,
      libro.autor,
      libro.isbn,
      libro.edicion,
      libro.descripcion,
      libro.editorial,
      libro.urlImagenPortada,
    )
    .orderBy(sql`${libro.nombre} asc`);

  return {
    libros: libros,
    isSearchResult: true,
  };
}

export async function getReservacionesByUsuario(userId: string) {
  const reservaciones = await db
    .select({
      id: reservacion.id,
      codigoReferencia: reservacion.codigoReferencia,
      estado: reservacion.estado,
      libroId: reservacion.libroId,
      libroNombre: libro.nombre,
      libroAutor: libro.autor,
      libroCodigo: libro.codigo,
      fechaReserva: sql<string>`CURRENT_DATE`,
      fechaVencimiento: sql<string>`CURRENT_DATE + INTERVAL '14 days'`,
    })
    .from(reservacion)
    .innerJoin(libro, eq(reservacion.libroId, libro.id))
    .where(eq(reservacion.usuarioId, userId))
    .orderBy(sql`${reservacion.id} DESC`);

  return reservaciones;
}

export async function getMultasByUsuario(userId: string) {
  const multas = await db
    .select({
      id: multa.id,
      prestamoId: multa.prestamoId,
      monto: multa.monto,
      estado: multa.estado,
      categoriaMulta: multa.categoriaMulta,
      fechaEmision: sql<string>`CURRENT_DATE`,
      libroNombre: libro.nombre,
      libroCodigo: libro.codigo,
    })
    .from(multa)
    .innerJoin(libro, eq(multa.prestamoId, libro.id))
    .where(eq(multa.usuarioId, userId))
    .orderBy(sql`${multa.id} DESC`);

  return multas.map((multa) => ({
    ...multa,
    libro: {
      nombre: multa.libroNombre,
      codigo: multa.libroCodigo,
    },
  }));
}

export async function updateUsuarioPerfil(
  userId: string,
  data: {
    nombre?: string;
    email?: string;
    telefono?: string;
    direccion?: string;
    avatarUrl?: string;
  },
) {
  await db
    .update(usuario)
    .set({
      ...data,
      ...(data.nombre ? { nombre: data.nombre } : {}),
      ...(data.email ? { email: data.email } : {}),
      ...(data.telefono ? { telefono: data.telefono } : {}),
      ...(data.direccion ? { direccion: data.direccion } : {}),
    })
    .where(eq(usuario.clerkId, userId));

  return await getUsuario(userId);
}

export async function updateUsuario(
  clerkId: string,
  data: {
    nombre: string;
    email: string;
    telefono: string | null;
    direccion: string | null;
    avatarUrl: string;
  },
) {
  await db
    .update(usuario)
    .set({
      nombre: data.nombre,
      email: data.email,
      telefono: data.telefono,
      direccion: data.direccion,
    })
    .where(eq(usuario.clerkId, clerkId));
}
