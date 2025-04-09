import { db } from "~/server/db";
import {
  reservacion,
  prestamo,
  libro,
  usuario,
  libroCopia,
} from "~/server/db/schema";
import { eq, and, sql, isNull, type SQL } from "drizzle-orm";
import type {
  ReservacionEstado,
  ReservacionWithDetails,
  ReservacionQueryResult,
  PaginatedReservaciones,
} from "../types";
import {
  createSearchCondition,
  formatDate,
  calculatePagination,
} from "../utils";

/**
 * Base query builder for reservations with common joins
 */
export function createBaseReservacionQuery() {
  return db
    .select({
      id: reservacion.id,
      codigoReferencia: reservacion.codigoReferencia,
      estado: reservacion.estado,
      usuario: {
        id: usuario.clerkId,
        nombre: usuario.nombre,
        email: usuario.email,
      },
      libro: {
        id: libro.id,
        nombre: libro.nombre,
        autor: libro.autor,
        codigo: libro.codigo,
      },
      prestamo: {
        id: prestamo.id,
        fechaPrestamo: prestamo.fechaPrestamo,
        fechaVencimiento: prestamo.fechaVencimiento,
        fechaDevolucion: prestamo.fechaDevolucion,
      },
    })
    .from(reservacion)
    .innerJoin(usuario, eq(reservacion.usuarioId, usuario.clerkId))
    .innerJoin(libro, eq(reservacion.libroId, libro.id))
    .leftJoin(prestamo, eq(reservacion.id, prestamo.reservaId));
}

/**
 * Get the count of a query using an alias
 */
export async function getQueryCount(
  query: ReturnType<typeof createBaseReservacionQuery>,
  alias: string,
) {
  const countResult = await db
    .select({ value: sql<number>`count(*)::integer` })
    .from(query.as(alias));

  return Number(countResult[0]?.value ?? 0);
}

/**
 * Maps database results to frontend-friendly format
 */
export function mapReservacionToDetails(
  item: ReservacionQueryResult,
): ReservacionWithDetails {
  return {
    id: item.id,
    codigoReferencia: item.codigoReferencia,
    estado: item.estado,
    usuario: item.usuario,
    libro: item.libro,
    prestamo: {
      id: item.prestamo?.id ?? null,
      fechaPrestamo: formatDate(item.prestamo?.fechaPrestamo),
      fechaVencimiento: formatDate(item.prestamo?.fechaVencimiento),
      fechaDevolucion: formatDate(item.prestamo?.fechaDevolucion),
      libroCopiaId: item.libroCopia?.id ?? null,
    },
  };
}

/**
 * Retrieves available copies of a book that can be lent
 */
export async function getAvailableCopias(libroId: number) {
  return db
    .select({
      id: libroCopia.id,
      localizacion: libroCopia.localizacion,
      estado: libroCopia.estado,
      libroId: libroCopia.libroId,
    })
    .from(libroCopia)
    .where(
      and(eq(libroCopia.libroId, libroId), eq(libroCopia.estado, "disponible")),
    );
}

/**
 * Builds a query based on reservation status and search term
 */
export function buildReservacionQuery(
  estado: ReservacionEstado,
  searchTerm?: string,
) {
  // Start with base query
  const baseQuery = createBaseReservacionQuery();

  // Build conditions array
  const conditions: SQL<unknown>[] = [eq(reservacion.estado, estado)];

  // For active reservations, we need to check null fecha devolucion
  if (estado === "activo") {
    conditions.push(isNull(prestamo.fechaDevolucion));
  }

  // For returned reservations, we need non-null fecha devolucion
  if (estado === "devuelto") {
    conditions.push(sql`${prestamo.fechaDevolucion} IS NOT NULL`);
  }

  // Add search condition if provided
  if (searchTerm) {
    conditions.push(createSearchCondition(searchTerm));
  }

  // Apply all conditions at once
  return baseQuery.where(and(...conditions));
}
