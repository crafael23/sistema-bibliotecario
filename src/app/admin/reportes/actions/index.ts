"use server";

import { and, eq, gte, lte, sql, or } from "drizzle-orm";
import { db } from "~/server/db";
import {
  libro,
  libroCopia,
  usuario,
  reservacion,
  prestamo,
  multa,
} from "~/server/db/schema";
import type {
  PaginationParams,
  PaginatedResponse,
  Book,
  Prestamo,
  Usuario,
  Movimiento,
  Multa,
  BookSummary,
} from "../types";

// Helper function to calculate pagination
function calculatePagination<T>(
  items: T[],
  totalItems: number,
  params: PaginationParams,
): PaginatedResponse<T> {
  const currentPage = params.page ?? 1;
  const pageSize = params.pageSize ?? 10;
  const totalPages = Math.ceil(totalItems / pageSize);

  return {
    data: items,
    totalItems,
    currentPage,
    totalPages,
    pageSize,
  };
}

// Inventario Reports
export async function getInventarioBooks(
  params: PaginationParams,
): Promise<PaginatedResponse<Book>> {
  try {
    const { page = 1, pageSize = 10, mes, anio } = params;
    const offset = (page - 1) * pageSize;

    // Get date filter if available
    if (mes !== undefined && anio !== undefined) {
      // Date filter logic available for future use
      new Date(anio, mes - 1, 1);
    }

    // Count total books for pagination
    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(libro);

    const totalItems = Number(countResult[0]?.count ?? 0);

    // Get books with pagination
    const books = await db
      .select({
        id: libro.id,
        nombre: libro.nombre,
        categoria: libro.categoria,
        autor: libro.autor,
        codigo: libro.codigo,
        estado: libroCopia.estado ?? sql<"disponible">`'disponible'`,
        cantidad: sql<number>`cast(count(${libroCopia.id}) as integer)`,
      })
      .from(libro)
      .leftJoin(libroCopia, eq(libro.id, libroCopia.libroId))
      .groupBy(
        libro.id,
        libro.nombre,
        libro.categoria,
        libro.autor,
        libro.codigo,
        libroCopia.estado,
      )
      .orderBy(libro.nombre)
      .limit(pageSize)
      .offset(offset);

    // Fix nullable estado to ensure it matches the type
    const typedBooks = books.map((book) => ({
      ...book,
      estado: book.estado ?? "disponible",
    }));

    return calculatePagination(typedBooks, totalItems, params);
  } catch (error) {
    console.error("Error fetching inventory books:", error);
    throw new Error("Failed to fetch inventory data");
  }
}

// Historial Reports
export async function getHistorialPrestamos(
  usuarioId: string | null,
  params: PaginationParams,
): Promise<PaginatedResponse<Prestamo>> {
  try {
    const { page = 1, pageSize = 10, mes, anio } = params;
    const offset = (page - 1) * pageSize;

    // Calculate date range for filtering
    let startDate = null;
    let endDate = null;

    if (mes !== undefined && anio !== undefined) {
      startDate = new Date(anio, mes - 1, 1);
      endDate = new Date(anio, mes, 0); // Last day of month
    }

    // Build the query conditions
    const conditions = [];

    if (usuarioId) {
      conditions.push(eq(reservacion.usuarioId, usuarioId));
    }

    if (startDate && endDate) {
      // Convert dates to ISO strings for proper comparison
      conditions.push(gte(prestamo.fechaPrestamo, startDate.toISOString()));
      conditions.push(lte(prestamo.fechaPrestamo, endDate.toISOString()));
    }

    // Count total prestamos for pagination
    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(reservacion)
      .innerJoin(prestamo, eq(reservacion.id, prestamo.reservaId))
      .where(conditions.length > 0 ? and(...conditions) : undefined);

    const totalItems = Number(countResult[0]?.count ?? 0);

    // Get prestamos with pagination
    const prestamos = await db
      .select({
        id: reservacion.id,
        fechaPrestamo: prestamo.fechaPrestamo,
        estado: reservacion.estado,
        libro: libro.nombre,
        utilizado: sql<number>`EXTRACT(DAY FROM AGE(${prestamo.fechaDevolucion}, ${prestamo.fechaPrestamo}))`,
      })
      .from(reservacion)
      .innerJoin(prestamo, eq(reservacion.id, prestamo.reservaId))
      .innerJoin(libro, eq(reservacion.libroId, libro.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(sql`${prestamo.fechaPrestamo} DESC`)
      .limit(pageSize)
      .offset(offset);

    // Map the results to match the Prestamo type
    const mappedPrestamos: Prestamo[] = prestamos.map((p) => ({
      ...p,
      estado:
        p.estado === "pendiente"
          ? "activo"
          : p.estado === "devuelto"
            ? "devuelto"
            : "vencido",
    }));

    return calculatePagination(mappedPrestamos, totalItems, params);
  } catch (error) {
    console.error("Error fetching prestamos history:", error);
    throw new Error("Failed to fetch historial data");
  }
}

export async function getUsuarios(): Promise<Usuario[]> {
  try {
    const users = await db
      .select({
        id: usuario.clerkId,
        clerkId: usuario.clerkId,
        email: usuario.email,
        nombre: usuario.nombre,
        creadoEn: sql<Date>`CURRENT_TIMESTAMP`,
        tipoDeUsuario: usuario.tipoDeUsuario,
      })
      .from(usuario);

    return users;
  } catch (error) {
    console.error("Error fetching usuarios:", error);
    throw new Error("Failed to fetch usuarios");
  }
}

// Movimientos Reports
export async function getMovimientosLibro(
  libroId: number | null,
  params: PaginationParams,
): Promise<PaginatedResponse<Movimiento>> {
  try {
    const { page = 1, pageSize = 10, mes, anio } = params;
    const offset = (page - 1) * pageSize;

    // Build query conditions
    const conditions = [];

    if (libroId) {
      conditions.push(eq(reservacion.libroId, libroId));
    } else {
      // If no book is selected, return an empty result
      return {
        data: [],
        totalItems: 0,
        currentPage: page,
        totalPages: 0,
        pageSize,
      };
    }

    // Date filtering by month and year or just year
    if (anio) {
      if (mes !== undefined) {
        // Filter by specific month and year
        const startDate = new Date(anio, mes - 1, 1);
        const endDate = new Date(anio, mes, 0); // Last day of month
        conditions.push(gte(prestamo.fechaPrestamo, startDate.toISOString()));
        conditions.push(lte(prestamo.fechaPrestamo, endDate.toISOString()));
      } else {
        // Filter by entire year
        const startYear = new Date(anio, 0, 1);
        const endYear = new Date(anio, 11, 31);
        conditions.push(gte(prestamo.fechaPrestamo, startYear.toISOString()));
        conditions.push(lte(prestamo.fechaPrestamo, endYear.toISOString()));
      }
    }

    // Count total movimientos for pagination
    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(reservacion)
      .leftJoin(prestamo, eq(reservacion.id, prestamo.reservaId))
      .where(conditions.length > 0 ? and(...conditions) : undefined);

    const totalItems = Number(countResult[0]?.count ?? 0) * 2; // Approximation (each reservation typically has 2-3 movements)

    // Get reservations data
    const reservations = await db
      .select({
        id: reservacion.id,
        fecha: prestamo.fechaPrestamo,
        estado: reservacion.estado,
        usuarioId: reservacion.usuarioId,
        libroId: reservacion.libroId,
        libroNombre: libro.nombre,
      })
      .from(reservacion)
      .innerJoin(prestamo, eq(reservacion.id, prestamo.reservaId))
      .innerJoin(libro, eq(reservacion.libroId, libro.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(sql`${prestamo.fechaPrestamo} DESC`)
      .limit(pageSize)
      .offset(offset);

    // Get usuarios data for the reservations
    const userIds = [
      ...new Set(reservations.map((r) => r.usuarioId).filter(Boolean)),
    ] as string[];

    const users =
      userIds.length > 0
        ? await db
            .select()
            .from(usuario)
            .where(sql`${usuario.clerkId} IN (${userIds.join(",")})`)
        : [];

    const userMap = new Map(users.map((u) => [u.clerkId, u]));

    // Transform to movimientos (reservas, préstamos, devoluciones)
    const movimientos: Movimiento[] = [];

    for (const res of reservations) {
      if (!res.usuarioId) continue;

      const user = userMap.get(res.usuarioId);

      // Add reservation movement
      movimientos.push({
        id: res.id * 10, // Generate unique ID for each movement
        fecha: new Date(res.fecha).toISOString(),
        tipo: "Reserva",
        usuario: user?.email ?? res.usuarioId,
        detalle: `Duración: 7 días`,
      });

      // If estado is active or returned, add préstamo movement
      if (res.estado === "activo" || res.estado === "devuelto") {
        movimientos.push({
          id: res.id * 10 + 1,
          fecha: new Date(
            new Date(res.fecha).getTime() + 86400000,
          ).toISOString(), // Next day
          tipo: "Préstamo",
          usuario: user?.email ?? res.usuarioId,
          detalle: "Responsable: admin@biblioteca.org",
        });
      }

      // If estado is returned, add devolucion movement
      if (res.estado === "devuelto") {
        movimientos.push({
          id: res.id * 10 + 2,
          fecha: new Date(
            new Date(res.fecha).getTime() + 7 * 86400000,
          ).toISOString(), // 7 days later
          tipo: "Devolución",
          usuario: user?.email ?? res.usuarioId,
          detalle: "Estado: Buenas condiciones",
        });
      }
    }

    return calculatePagination(movimientos, totalItems, params);
  } catch (error) {
    console.error("Error fetching movimientos libro:", error);
    // Return a valid empty response instead of throwing
    return {
      data: [],
      totalItems: 0,
      currentPage: params.page ?? 1,
      totalPages: 0,
      pageSize: params.pageSize ?? 10,
    };
  }
}

// Multas Reports
export async function getMultas(
  params: PaginationParams,
): Promise<PaginatedResponse<Multa>> {
  try {
    const { page = 1, pageSize = 10, mes, anio } = params;
    const offset = (page - 1) * pageSize;

    // Build query conditions for date filtering
    const conditions = [];

    if (mes !== undefined && anio !== undefined) {
      const startDate = new Date(anio, mes - 1, 1);
      const endDate = new Date(anio, mes, 0); // Last day of month

      // We'll filter based on prestamo creation date
      conditions.push(gte(prestamo.fechaPrestamo, startDate.toISOString()));
      conditions.push(lte(prestamo.fechaPrestamo, endDate.toISOString()));
    }

    // Only show pending multas
    conditions.push(eq(multa.estado, "pendiente"));

    // Count total multas for pagination
    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(multa)
      .leftJoin(prestamo, eq(multa.prestamoId, prestamo.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined);

    const totalItems = Number(countResult[0]?.count ?? 0);

    // Get multas with user and book data
    const multasData = await db
      .select({
        id: multa.id,
        monto: multa.monto,
        categoriaMulta: multa.categoriaMulta,
        usuarioId: multa.usuarioId,
        prestamoId: multa.prestamoId,
      })
      .from(multa)
      .leftJoin(prestamo, eq(multa.prestamoId, prestamo.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(multa.id)
      .limit(pageSize)
      .offset(offset);

    // Get user information for the multas
    const userIds = [
      ...new Set(multasData.map((m) => m.usuarioId).filter(Boolean)),
    ] as string[];

    const users =
      userIds.length > 0
        ? await db
            .select({
              clerkId: usuario.clerkId,
              nombre: usuario.nombre,
              email: usuario.email,
              telefono: usuario.telefono,
            })
            .from(usuario)
            .where(sql`${usuario.clerkId} IN (${userIds.join(",")})`)
        : [];

    const userMap = new Map(users.map((u) => [u.clerkId, u]));

    // Get prestamo information to link to books
    const prestamoIds = [
      ...new Set(multasData.map((m) => m.prestamoId).filter(Boolean)),
    ] as number[];

    const prestamosData =
      prestamoIds.length > 0
        ? await db
            .select({
              id: prestamo.id,
              reservaId: prestamo.reservaId,
              fechaPrestamo: prestamo.fechaPrestamo,
              fechaVencimiento: prestamo.fechaVencimiento,
            })
            .from(prestamo)
            .where(
              prestamoIds.length === 1
                ? eq(prestamo.id, prestamoIds[0]!)
                : or(...prestamoIds.map((id) => eq(prestamo.id, id))),
            )
        : [];

    const prestamoMap = new Map(prestamosData.map((p) => [p.id, p]));

    // Get libro information using reservaciones
    const reservaIds = [
      ...new Set(prestamosData.map((p) => p.reservaId).filter(Boolean)),
    ] as number[];

    const reservasData =
      reservaIds.length > 0
        ? await db
            .select({
              id: reservacion.id,
              libroId: reservacion.libroId,
            })
            .from(reservacion)
            .where(
              reservaIds.length === 1
                ? eq(reservacion.id, reservaIds[0]!)
                : or(...reservaIds.map((id) => eq(reservacion.id, id))),
            )
        : [];

    const reservaMap = new Map(reservasData.map((r) => [r.id, r]));

    // Get libro information
    const libroIds = [
      ...new Set(reservasData.map((r) => r.libroId).filter(Boolean)),
    ] as number[];

    const librosData =
      libroIds.length > 0
        ? await db
            .select({
              id: libro.id,
              nombre: libro.nombre,
            })
            .from(libro)
            .where(
              libroIds.length === 1
                ? eq(libro.id, libroIds[0]!)
                : or(...libroIds.map((id) => eq(libro.id, id))),
            )
        : [];

    const libroMap = new Map(librosData.map((l) => [l.id, l]));

    // Calculate delay days and format multas for display
    const formattedMultas: Multa[] = multasData.map((m) => {
      const user = userMap.get(m.usuarioId ?? "");
      const prestamoDatos = prestamoMap.get(m.prestamoId ?? 0);
      const reservaDatos = prestamoDatos
        ? reservaMap.get(prestamoDatos.reservaId ?? 0)
        : null;
      const libroDatos = reservaDatos
        ? libroMap.get(reservaDatos.libroId ?? 0)
        : null;

      // Generate multa code based on the monto range
      const montoValue = parseFloat(m.monto?.toString() ?? "0");
      let codigo = "M1"; // Default category for very small amounts

      if (montoValue > 10 && montoValue <= 50) {
        codigo = "M2";
      } else if (montoValue > 50 && montoValue <= 100) {
        codigo = "M3";
      } else if (montoValue > 100) {
        codigo = "M4";
      }

      // If a categoriaMulta already exists in the database, use that instead
      if (m.categoriaMulta) {
        codigo = m.categoriaMulta;
      }

      // Calculate days of delay
      const fechaVencimiento = prestamoDatos?.fechaVencimiento
        ? new Date(prestamoDatos.fechaVencimiento)
        : null;
      const hoy = new Date();
      const diasRetraso = fechaVencimiento
        ? Math.floor(
            (hoy.getTime() - fechaVencimiento.getTime()) /
              (1000 * 60 * 60 * 24),
          )
        : 0;

      return {
        id: m.id,
        codigo: `${codigo}-${m.id.toString().padStart(4, "0")}`,
        usuario: user?.nombre ?? "Usuario desconocido",
        libro: libroDatos?.nombre ?? "Libro desconocido",
        telefono: user?.telefono ?? "Sin teléfono",
        monto: montoValue,
        diasRetraso: diasRetraso > 0 ? diasRetraso : 1, // Ensure at least 1 day of delay
      };
    });

    return calculatePagination(formattedMultas, totalItems, params);
  } catch (error) {
    console.error("Error fetching multas:", error);
    throw new Error("Failed to fetch multas data");
  }
}

// Book search for dropdown
export async function searchBooks(query?: string): Promise<BookSummary[]> {
  try {
    if (!query || query.trim() === "") {
      // Return all books with a limit if no query is provided
      const books = await db
        .select({
          id: libro.id,
          nombre: libro.nombre,
          categoria: libro.categoria,
          autor: libro.autor,
          codigo: libro.codigo,
          isbn: libro.isbn,
          editorial: libro.editorial,
        })
        .from(libro)
        .orderBy(libro.nombre)
        .limit(20);

      return books || []; // Return empty array if no books found
    }

    // If a query is provided, search across multiple fields
    const searchTerm = `%${query.toLowerCase()}%`;

    const books = await db
      .select({
        id: libro.id,
        nombre: libro.nombre,
        categoria: libro.categoria,
        autor: libro.autor,
        codigo: libro.codigo,
        isbn: libro.isbn,
        editorial: libro.editorial,
      })
      .from(libro)
      .where(
        or(
          sql`LOWER(${libro.nombre}) LIKE ${searchTerm}`,
          sql`LOWER(${libro.codigo}) LIKE ${searchTerm}`,
          sql`LOWER(${libro.autor}) LIKE ${searchTerm}`,
          sql`LOWER(${libro.categoria}) LIKE ${searchTerm}`,
          sql`LOWER(${libro.isbn}) LIKE ${searchTerm}`,
          sql`LOWER(${libro.editorial}) LIKE ${searchTerm}`,
          sql`CAST(${libro.id} AS TEXT) LIKE ${searchTerm}`,
        ),
      )
      .orderBy(libro.nombre)
      .limit(20);

    return books || []; // Return empty array if no books found
  } catch (error) {
    console.error("Error searching books:", error);
    return []; // Return empty array instead of throwing, to gracefully handle errors
  }
}
