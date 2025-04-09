"use server";

import { db } from "~/server/db";
import { libro, libroCopia } from "~/server/db/schema";
import { sql, eq, and } from "drizzle-orm";
import { z } from "zod";
import { cache } from "react";
import type { SQL } from "drizzle-orm";
import { auth, currentUser } from "@clerk/nextjs/server";
import { updateUsuario } from "~/server/db/queries";
import { usuario } from "~/server/db/schema";
import { reservacion } from "~/server/db/schema";
import { multa } from "~/server/db/schema";
import { revalidatePath } from "next/cache";

// Schema for pagination parameters
const paginationParamsSchema = z
  .object({
    cursor: z.number().optional(),
    pageSize: z.number().min(1).max(100).default(10),
    orderBy: z.string().optional(),
    category: z.string().optional(),
    searchTerm: z.string().optional(),
  })
  .strict();

// Schema for book search parameters
const searchParamsSchema = z
  .object({
    searchTerm: z.string().min(1),
    category: z.string().optional(),
  })
  .strict();

export type PaginationParams = z.infer<typeof paginationParamsSchema>;
export type SearchParams = z.infer<typeof searchParamsSchema>;

// Cache the getCategorias function for 1 hour
export const getCategorias = cache(async () => {
  try {
    const categorias = await db
      .select({
        categoria: libro.categoria,
        count: sql<number>`CAST(COUNT(${libro.id}) AS INTEGER)`,
      })
      .from(libro)
      .groupBy(libro.categoria)
      .orderBy(libro.categoria);

    return [
      {
        categoria: "Todas las categorías",
        count: categorias.reduce((acc, curr) => acc + curr.count, 0),
      },
      ...categorias,
    ];
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw new Error("Failed to fetch categories");
  }
});

// Cache the getLibroById function for 5 minutes
export const getLibroById = cache(async (id: number) => {
  try {
    const libroData = await db
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
      .where(eq(libro.id, id))
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
      .limit(1);

    if (!libroData[0]) {
      throw new Error("Book not found");
    }

    return libroData[0];
  } catch (error) {
    console.error("Error fetching book:", error);
    throw new Error("Failed to fetch book");
  }
});

export async function getLibrosPaginated(
  input: z.infer<typeof paginationParamsSchema>,
) {
  const { cursor, pageSize, orderBy, category, searchTerm } =
    paginationParamsSchema.parse(input);

  // Build conditions array
  const conditions: SQL[] = [];

  if (category && category !== "Todas las categorías") {
    conditions.push(eq(libro.categoria, category));
  }

  if (searchTerm) {
    conditions.push(
      sql`LOWER(${libro.nombre}) LIKE LOWER(${"%" + searchTerm + "%"})`,
    );
  }

  // Combine conditions
  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  // Build base query with all fields and join
  const query = db
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
    );

  // Apply where clause if conditions exist
  const finalQuery = whereClause ? query.where(whereClause) : query;

  // Get total count
  const countResult = await db
    .select({
      value: sql<number>`count(*)::integer`,
    })
    .from(finalQuery.as("filtered_books"));

  const totalCount = Number(countResult[0]?.value ?? 0);

  // Get paginated results
  const items = await finalQuery
    .limit(pageSize)
    .offset(cursor ?? 0)
    .orderBy(libro.nombre);

  const hasNextPage = items.length === pageSize;
  const nextCursor = hasNextPage ? (cursor ?? 0) + pageSize : undefined;

  return {
    items,
    nextCursor,
    hasNextPage,
    totalCount,
    totalPages: Math.ceil(totalCount / pageSize),
    currentPage: Math.floor((cursor ?? 0) / pageSize) + 1,
  };
}

export async function updateUserProfile(data: {
  nombre: string;
  email: string;
  telefono: string | null;
  direccion: string | null;
  avatarUrl: string;
}) {
  const { userId } = await auth();
  if (!userId) throw new Error("No autenticado");

  await db
    .update(usuario)
    .set({
      nombre: data.nombre,
      email: data.email,
      telefono: data.telefono,
      direccion: data.direccion,
    })
    .where(eq(usuario.clerkId, userId));

  revalidatePath("/usuario/perfil");
}

export async function getUserReservations(userId: string) {
  const { userId: authUserId } = await auth();
  if (!authUserId) throw new Error("No autenticado");
  if (authUserId !== userId) throw new Error("No autorizado");

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

export async function getUserFines(userId: string) {
  const { userId: authUserId } = await auth();
  if (!authUserId) throw new Error("No autenticado");
  if (authUserId !== userId) throw new Error("No autorizado");

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
