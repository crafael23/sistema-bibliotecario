import { db } from "~/server/db";
import {
  reservacion,
  prestamo,
  libro,
  usuario,
  libroCopia,
} from "~/server/db/schema";
import { eq, and, or, sql, isNull } from "drizzle-orm";
import { formatDate, calculatePagination } from "../utils";
import { isBefore } from "date-fns";
import type {
  ReservationPaginationParams,
  PaginatedReservaciones,
  ReservacionWithDetails,
} from "../types";

/**
 * Get available copies of a book that can be lent to users
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
 * Common function to create a search condition
 */
function createSearchFilter(searchTerm: string) {
  const searchPattern = `%${searchTerm}%`;
  return or(
    sql`LOWER(${usuario.nombre}) LIKE LOWER(${searchPattern})`,
    sql`LOWER(${libro.nombre}) LIKE LOWER(${searchPattern})`,
    sql`LOWER(${reservacion.codigoReferencia}) LIKE LOWER(${searchPattern})`,
  )!; // Non-null assertion to fix the typing issue
}

/**
 * Get pending reservations with pagination
 */
export async function getPendingReservaciones(
  params: ReservationPaginationParams,
): Promise<PaginatedReservaciones> {
  const { cursor, pageSize, searchTerm } = params;

  // Build conditions: either the reservation is in 'pendiente' state OR
  // it has no assigned book copy yet (not delivered)
  const conditions = [
    or(
      eq(reservacion.estado, "pendiente"),
      and(
        eq(reservacion.estado, "activo"),
        sql`${prestamo.libroCopiaId} IS NULL`,
      ),
    ),
  ];

  if (searchTerm) {
    conditions.push(createSearchFilter(searchTerm));
  }

  // Build query
  const query = db
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
        libroCopiaId: prestamo.libroCopiaId,
      },
    })
    .from(reservacion)
    .innerJoin(usuario, eq(reservacion.usuarioId, usuario.clerkId))
    .innerJoin(libro, eq(reservacion.libroId, libro.id))
    .leftJoin(prestamo, eq(reservacion.id, prestamo.reservaId))
    .where(and(...conditions));

  // Count total records
  const countResult = await db
    .select({ count: sql<number>`count(*)::integer` })
    .from(reservacion)
    .innerJoin(usuario, eq(reservacion.usuarioId, usuario.clerkId))
    .innerJoin(libro, eq(reservacion.libroId, libro.id))
    .leftJoin(prestamo, eq(reservacion.id, prestamo.reservaId))
    .where(and(...conditions));

  const totalCount = countResult[0]?.count ?? 0;

  // Fetch paginated data
  const items = await query
    .orderBy(sql`${prestamo.fechaPrestamo} ASC`) // Order by loan start date
    .limit(pageSize)
    .offset(cursor ?? 0);

  // Calculate pagination metadata
  const paginationInfo = calculatePagination(totalCount, cursor, pageSize);

  // Transform data for frontend
  const transformedItems: ReservacionWithDetails[] = items.map((item) => ({
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
      libroCopiaId: item.prestamo?.libroCopiaId ?? null,
    },
  }));

  return {
    items: transformedItems,
    ...paginationInfo,
  };
}

/**
 * Get active reservations with pagination
 */
export async function getActiveReservaciones(
  params: ReservationPaginationParams,
): Promise<PaginatedReservaciones> {
  const { cursor, pageSize, searchTerm } = params;

  // Build conditions
  const conditions = [
    eq(reservacion.estado, "activo"),
    isNull(prestamo.fechaDevolucion),
    sql`${prestamo.libroCopiaId} IS NOT NULL`,
  ];

  if (searchTerm) {
    conditions.push(createSearchFilter(searchTerm));
  }

  // Build query
  const query = db
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
        libroCopiaId: prestamo.libroCopiaId,
      },
      libroCopia: {
        id: libroCopia.id,
        localizacion: libroCopia.localizacion,
      },
    })
    .from(reservacion)
    .innerJoin(usuario, eq(reservacion.usuarioId, usuario.clerkId))
    .innerJoin(libro, eq(reservacion.libroId, libro.id))
    .innerJoin(prestamo, eq(reservacion.id, prestamo.reservaId))
    .leftJoin(libroCopia, eq(prestamo.libroCopiaId, libroCopia.id))
    .where(and(...conditions));

  // Count total records
  const countResult = await db
    .select({ count: sql<number>`count(*)::integer` })
    .from(reservacion)
    .innerJoin(usuario, eq(reservacion.usuarioId, usuario.clerkId))
    .innerJoin(libro, eq(reservacion.libroId, libro.id))
    .innerJoin(prestamo, eq(reservacion.id, prestamo.reservaId))
    .where(and(...conditions));

  const totalCount = countResult[0]?.count ?? 0;

  // Fetch paginated data
  const items = await query
    .orderBy(sql`${prestamo.fechaVencimiento} ASC`)
    .limit(pageSize)
    .offset(cursor ?? 0);

  // Calculate pagination metadata
  const paginationInfo = calculatePagination(totalCount, cursor, pageSize);

  // Process items to determine if any are overdue
  const today = new Date();
  const transformedItems: ReservacionWithDetails[] = items.map((item) => {
    // Create processed item
    const processedItem: ReservacionWithDetails = {
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

    // Check if overdue
    if (
      item.prestamo?.fechaVencimiento &&
      isBefore(new Date(item.prestamo.fechaVencimiento), today)
    ) {
      processedItem.estado = "vencido";
    }

    return processedItem;
  });

  return {
    items: transformedItems,
    ...paginationInfo,
  };
}

/**
 * Get returned reservations with pagination
 */
export async function getReturnedReservaciones(
  params: ReservationPaginationParams,
): Promise<PaginatedReservaciones> {
  const { cursor, pageSize, searchTerm } = params;

  // Build conditions
  const conditions = [
    eq(reservacion.estado, "devuelto"),
    sql`${prestamo.fechaDevolucion} IS NOT NULL`,
  ];

  if (searchTerm) {
    conditions.push(createSearchFilter(searchTerm));
  }

  // Build query
  const query = db
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
        libroCopiaId: prestamo.libroCopiaId,
      },
      libroCopia: {
        id: libroCopia.id,
        localizacion: libroCopia.localizacion,
      },
    })
    .from(reservacion)
    .innerJoin(usuario, eq(reservacion.usuarioId, usuario.clerkId))
    .innerJoin(libro, eq(reservacion.libroId, libro.id))
    .innerJoin(prestamo, eq(reservacion.id, prestamo.reservaId))
    .leftJoin(libroCopia, eq(prestamo.libroCopiaId, libroCopia.id))
    .where(and(...conditions));

  // Count total records
  const countResult = await db
    .select({ count: sql<number>`count(*)::integer` })
    .from(reservacion)
    .innerJoin(usuario, eq(reservacion.usuarioId, usuario.clerkId))
    .innerJoin(libro, eq(reservacion.libroId, libro.id))
    .innerJoin(prestamo, eq(reservacion.id, prestamo.reservaId))
    .where(and(...conditions));

  const totalCount = countResult[0]?.count ?? 0;

  // Fetch paginated data
  const items = await query
    .orderBy(sql`${prestamo.fechaDevolucion} DESC`)
    .limit(pageSize)
    .offset(cursor ?? 0);

  // Calculate pagination metadata
  const paginationInfo = calculatePagination(totalCount, cursor, pageSize);

  // Transform data for frontend
  const transformedItems: ReservacionWithDetails[] = items.map((item) => ({
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
  }));

  return {
    items: transformedItems,
    ...paginationInfo,
  };
}
