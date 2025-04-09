"use server";

import {
  and,
  eq,
  sql,
  desc,
  asc,
  gte,
  lte,
  or,
  isNull,
  not,
} from "drizzle-orm";
import { db } from "./index";
import {
  libro,
  libroCopia,
  multa,
  prestamo,
  reservacion,
  usuario,
} from "./schema";

/**
 * Query for the detailed inventory report
 * Shows all books with their status and quantity
 */
export async function getInventarioCompleto(
  page = 1,
  pageSize = 10,
  startDate?: string,
  endDate?: string,
) {
  // Calculate date range for the query
  const dateCondition =
    startDate && endDate
      ? sql`CURRENT_DATE BETWEEN ${startDate} AND ${endDate}`
      : undefined;

  // Count total items for pagination
  const countResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(libro)
    .where(dateCondition);

  const count = countResult[0]?.count ?? 0;

  // Get paginated records
  const inventario = await db
    .select({
      id: libro.id,
      nombre: libro.nombre,
      categoria: libro.categoria,
      autor: libro.autor,
      codigo: libro.codigo,
      estado: libroCopia.estado,
      cantidad: sql<number>`count(${libroCopia.id})`,
    })
    .from(libro)
    .leftJoin(libroCopia, eq(libro.id, libroCopia.libroId))
    .where(dateCondition)
    .groupBy(
      libro.id,
      libro.nombre,
      libro.categoria,
      libro.autor,
      libro.codigo,
      libroCopia.estado,
    )
    .orderBy(asc(libro.nombre))
    .limit(pageSize)
    .offset((page - 1) * pageSize);

  return {
    inventario,
    pagination: {
      totalItems: count,
      currentPage: page,
      pageSize,
      totalPages: Math.ceil(count / pageSize),
    },
  };
}

/**
 * Query for the detailed pending fines report
 * Shows all users with active fines for delays
 */
export async function getMultasPendientes(
  page = 1,
  pageSize = 10,
  startDate?: string,
  endDate?: string,
) {
  // Calculate date range for the query
  const dateCondition =
    startDate && endDate
      ? sql`CURRENT_DATE BETWEEN ${startDate} AND ${endDate}`
      : undefined;

  // Count total items for pagination
  const countResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(multa)
    .where(and(eq(multa.estado, "pendiente"), dateCondition));

  const count = countResult[0]?.count ?? 0;

  // Get paginated records
  const multas = await db
    .select({
      id: multa.id,
      usuario: usuario.email,
      usuarioId: multa.usuarioId,
      libro: libro.nombre,
      monto: multa.monto,
      diasRetraso: sql<number>`CURRENT_DATE - ${prestamo.fechaVencimiento}`,
      fechaVencimiento: prestamo.fechaVencimiento,
    })
    .from(multa)
    .innerJoin(prestamo, eq(multa.prestamoId, prestamo.id))
    .innerJoin(reservacion, eq(prestamo.reservaId, reservacion.id))
    .innerJoin(libro, eq(reservacion.libroId, libro.id))
    .innerJoin(usuario, eq(multa.usuarioId, usuario.clerkId))
    .where(and(eq(multa.estado, "pendiente"), dateCondition))
    .orderBy(desc(multa.id))
    .limit(pageSize)
    .offset((page - 1) * pageSize);

  return {
    multas,
    pagination: {
      totalItems: count,
      currentPage: page,
      pageSize,
      totalPages: Math.ceil(count / pageSize),
    },
  };
}

/**
 * Query for the detailed loan history by user report
 */
export async function getHistorialPrestamosPorUsuario(
  userId: string,
  page = 1,
  pageSize = 10,
  startDate?: string,
  endDate?: string,
) {
  // Calculate date range for the query
  const dateCondition =
    startDate && endDate
      ? sql`${prestamo.fechaPrestamo} BETWEEN ${startDate} AND ${endDate}`
      : undefined;

  // Count total items for pagination
  const countResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(prestamo)
    .innerJoin(reservacion, eq(prestamo.reservaId, reservacion.id))
    .where(and(eq(reservacion.usuarioId, userId), dateCondition));

  const count = countResult[0]?.count ?? 0;

  // Get paginated records
  const historial = await db
    .select({
      id: prestamo.id,
      libro: libro.nombre,
      fechaPrestamo: prestamo.fechaPrestamo,
      fechaDevolucion: prestamo.fechaDevolucion,
      fechaVencimiento: prestamo.fechaVencimiento,
      estado: sql<string>`CASE 
        WHEN ${prestamo.fechaDevolucion} IS NULL AND ${prestamo.fechaVencimiento} < CURRENT_DATE THEN 'vencido' 
        WHEN ${prestamo.fechaDevolucion} IS NULL THEN 'activo' 
        ELSE 'devuelto' 
      END`,
      diasUtilizados: sql<number>`CASE 
        WHEN ${prestamo.fechaDevolucion} IS NULL THEN CURRENT_DATE - ${prestamo.fechaPrestamo}
        ELSE ${prestamo.fechaDevolucion} - ${prestamo.fechaPrestamo}
      END`,
    })
    .from(prestamo)
    .innerJoin(reservacion, eq(prestamo.reservaId, reservacion.id))
    .innerJoin(libro, eq(reservacion.libroId, libro.id))
    .where(and(eq(reservacion.usuarioId, userId), dateCondition))
    .orderBy(desc(prestamo.fechaPrestamo))
    .limit(pageSize)
    .offset((page - 1) * pageSize);

  return {
    historial,
    pagination: {
      totalItems: count,
      currentPage: page,
      pageSize,
      totalPages: Math.ceil(count / pageSize),
    },
  };
}

/**
 * Query for the detailed book movements report
 */
export async function getMovimientosLibros(
  libroId?: number,
  page = 1,
  pageSize = 10,
  startDate?: Date,
  endDate?: Date,
) {
  // Calculate date range for the query
  const dateCondition =
    startDate && endDate
      ? and(
          gte(prestamo.fechaPrestamo, startDate),
          lte(prestamo.fechaPrestamo, endDate),
        )
      : undefined;

  // Build book condition
  const libroCondition = libroId ? eq(reservacion.libroId, libroId) : undefined;

  // Count total items for pagination
  const prestamosCount = await db
    .select({ count: sql<number>`count(*)` })
    .from(prestamo)
    .innerJoin(reservacion, eq(prestamo.reservaId, reservacion.id))
    .where(and(libroCondition, dateCondition));

  const devolucionesCount = await db
    .select({ count: sql<number>`count(*)` })
    .from(prestamo)
    .innerJoin(reservacion, eq(prestamo.reservaId, reservacion.id))
    .where(
      and(libroCondition, not(isNull(prestamo.fechaDevolucion)), dateCondition),
    );

  const totalCount = prestamosCount[0].count + devolucionesCount[0].count;

  // Get paginated prestamos (type: Préstamo)
  const prestamos = await db
    .select({
      fecha: prestamo.fechaPrestamo,
      tipo: sql<string>`'Préstamo'`,
      usuario: usuario.email,
      libroCodigo: libro.codigo,
      libroNombre: libro.nombre,
      detalle: sql<string>`'Responsable: ' || ${usuario.nombre}`,
    })
    .from(prestamo)
    .innerJoin(reservacion, eq(prestamo.reservaId, reservacion.id))
    .innerJoin(usuario, eq(reservacion.usuarioId, usuario.clerkId))
    .innerJoin(libro, eq(reservacion.libroId, libro.id))
    .where(and(libroCondition, dateCondition))
    .orderBy(desc(prestamo.fechaPrestamo))
    .limit(pageSize / 2)
    .offset(((page - 1) * pageSize) / 2);

  // Get paginated devoluciones (type: Devolución)
  const devoluciones = await db
    .select({
      fecha: prestamo.fechaDevolucion,
      tipo: sql<string>`'Devolución'`,
      usuario: usuario.email,
      libroCodigo: libro.codigo,
      libroNombre: libro.nombre,
      detalle: sql<string>`'Duración: ' || (${prestamo.fechaDevolucion} - ${prestamo.fechaPrestamo}) || ' días'`,
    })
    .from(prestamo)
    .innerJoin(reservacion, eq(prestamo.reservaId, reservacion.id))
    .innerJoin(usuario, eq(reservacion.usuarioId, usuario.clerkId))
    .innerJoin(libro, eq(reservacion.libroId, libro.id))
    .where(
      and(libroCondition, not(isNull(prestamo.fechaDevolucion)), dateCondition),
    )
    .orderBy(desc(prestamo.fechaDevolucion))
    .limit(pageSize / 2)
    .offset(((page - 1) * pageSize) / 2);

  // Combine results
  const movimientos = [...prestamos, ...devoluciones].sort(
    (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime(),
  );

  return {
    movimientos,
    pagination: {
      totalItems: totalCount,
      currentPage: page,
      pageSize,
      totalPages: Math.ceil(totalCount / pageSize),
    },
  };
}

/**
 * Query for the loan trends report
 */
export async function getTendenciasPrestamos(
  year = new Date().getFullYear(),
  compareYear = new Date().getFullYear() - 1,
) {
  // Get data for current year
  const currentYearData = await db
    .select({
      mes: sql<number>`EXTRACT(MONTH FROM ${prestamo.fechaPrestamo})`,
      cantidad: sql<number>`COUNT(*)`,
    })
    .from(prestamo)
    .where(sql`EXTRACT(YEAR FROM ${prestamo.fechaPrestamo}) = ${year}`)
    .groupBy(sql`EXTRACT(MONTH FROM ${prestamo.fechaPrestamo})`)
    .orderBy(sql`EXTRACT(MONTH FROM ${prestamo.fechaPrestamo})`);

  // Get data for comparison year
  const prevYearData = await db
    .select({
      mes: sql<number>`EXTRACT(MONTH FROM ${prestamo.fechaPrestamo})`,
      cantidad: sql<number>`COUNT(*)`,
    })
    .from(prestamo)
    .where(sql`EXTRACT(YEAR FROM ${prestamo.fechaPrestamo}) = ${compareYear}`)
    .groupBy(sql`EXTRACT(MONTH FROM ${prestamo.fechaPrestamo})`)
    .orderBy(sql`EXTRACT(MONTH FROM ${prestamo.fechaPrestamo})`);

  // Format data for chart
  const meses = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  // Combine the data
  const tendencias = meses.map((mes, index) => {
    const mesNum = index + 1;
    const currentYearItem = currentYearData.find((item) => item.mes === mesNum);
    const prevYearItem = prevYearData.find((item) => item.mes === mesNum);

    const currentYearValue = currentYearItem?.cantidad ?? 0;
    const prevYearValue = prevYearItem?.cantidad ?? 0;

    // Calculate growth percentage
    const crecimiento =
      prevYearValue === 0
        ? 100 // If previous year was 0, growth is 100%
        : Number(
            (
              ((currentYearValue - prevYearValue) * 100) /
              prevYearValue
            ).toFixed(1),
          );

    return {
      mes,
      [year.toString()]: currentYearValue,
      [compareYear.toString()]: prevYearValue,
      crecimiento,
    };
  });

  return tendencias;
}

/**
 * Query for the loan statistics by book category report
 */
export async function getEstadisticasPorCategoria(
  startDate?: Date,
  endDate?: Date,
) {
  // Calculate date range for the query
  const dateCondition =
    startDate && endDate
      ? and(
          gte(prestamo.fechaPrestamo, startDate),
          lte(prestamo.fechaPrestamo, endDate),
        )
      : undefined;

  // Define time slots based on hour
  const estadisticas = await db
    .select({
      categoria: libro.categoria,
      franjaHoraria: sql<string>`
        CASE 
          WHEN EXTRACT(HOUR FROM ${prestamo.fechaPrestamo}) BETWEEN 8 AND 11 THEN 'Mañana'
          WHEN EXTRACT(HOUR FROM ${prestamo.fechaPrestamo}) BETWEEN 12 AND 17 THEN 'Tarde'
          WHEN EXTRACT(HOUR FROM ${prestamo.fechaPrestamo}) BETWEEN 18 AND 21 THEN 'Noche'
          ELSE 'Otros'
        END
      `,
      cantidad: sql<number>`COUNT(*)`,
    })
    .from(prestamo)
    .innerJoin(reservacion, eq(prestamo.reservaId, reservacion.id))
    .innerJoin(libro, eq(reservacion.libroId, libro.id))
    .where(dateCondition)
    .groupBy(
      libro.categoria,
      sql`
      CASE 
        WHEN EXTRACT(HOUR FROM ${prestamo.fechaPrestamo}) BETWEEN 8 AND 11 THEN 'Mañana'
        WHEN EXTRACT(HOUR FROM ${prestamo.fechaPrestamo}) BETWEEN 12 AND 17 THEN 'Tarde'
        WHEN EXTRACT(HOUR FROM ${prestamo.fechaPrestamo}) BETWEEN 18 AND 21 THEN 'Noche'
        ELSE 'Otros'
      END
    `,
    );

  // Transform data for heat map format
  const categories = [...new Set(estadisticas.map((item) => item.categoria))];

  const formattedData = categories.map((categoria) => {
    const mañana =
      estadisticas.find(
        (item) =>
          item.categoria === categoria && item.franjaHoraria === "Mañana",
      )?.cantidad ?? 0;

    const tarde =
      estadisticas.find(
        (item) =>
          item.categoria === categoria && item.franjaHoraria === "Tarde",
      )?.cantidad ?? 0;

    const noche =
      estadisticas.find(
        (item) =>
          item.categoria === categoria && item.franjaHoraria === "Noche",
      )?.cantidad ?? 0;

    return {
      categoria,
      "Mañana (8-12h)": mañana,
      "Tarde (12-18h)": tarde,
      "Noche (18-22h)": noche,
      total: mañana + tarde + noche,
    };
  });

  return formattedData.sort((a, b) => b.total - a.total);
}

/**
 * Query for the return performance report
 */
export async function getRendimientoDevoluciones(
  startDate?: Date,
  endDate?: Date,
) {
  // Calculate date range for the query
  const dateCondition =
    startDate && endDate
      ? and(
          gte(prestamo.fechaPrestamo, startDate),
          lte(prestamo.fechaPrestamo, endDate),
        )
      : undefined;

  const rendimiento = await db
    .select({
      responsable: usuario.nombre,
      prestamos: sql<number>`COUNT(${prestamo.id})`,
      devolucionesATiempo: sql<number>`SUM(CASE WHEN ${prestamo.fechaDevolucion} <= ${prestamo.fechaVencimiento} THEN 1 ELSE 0 END)`,
      eficiencia: sql<number>`ROUND((SUM(CASE WHEN ${prestamo.fechaDevolucion} <= ${prestamo.fechaVencimiento} THEN 1 ELSE 0 END) * 100.0 / COUNT(${prestamo.id})), 1)`,
    })
    .from(prestamo)
    .innerJoin(usuario, eq(prestamo.personalId, usuario.clerkId))
    .where(and(not(isNull(prestamo.fechaDevolucion)), dateCondition))
    .groupBy(usuario.nombre)
    .orderBy(desc(sql`eficiencia`));

  return rendimiento;
}

/**
 * Query for the fine distribution report
 */
export async function getDistribucionMultas(startDate?: Date, endDate?: Date) {
  // Calculate date range for the query
  const dateCondition =
    startDate && endDate
      ? and(
          gte(multa.createdAt ?? sql`CURRENT_DATE`, startDate),
          lte(multa.createdAt ?? sql`CURRENT_DATE`, endDate),
        )
      : undefined;

  const distribucion = await db
    .select({
      categoria: libro.categoria,
      totalMultas: sql<number>`SUM(${multa.monto})`,
      montoPromedio: sql<number>`ROUND(AVG(${multa.monto}), 2)`,
      cantidad: sql<number>`COUNT(*)`,
    })
    .from(multa)
    .innerJoin(prestamo, eq(multa.prestamoId, prestamo.id))
    .innerJoin(reservacion, eq(prestamo.reservaId, reservacion.id))
    .innerJoin(libro, eq(reservacion.libroId, libro.id))
    .where(dateCondition)
    .groupBy(libro.categoria)
    .orderBy(desc(sql`totalMultas`));

  return distribucion;
}

/**
 * Query for the top users without fines report
 */
export async function getUsuariosSinMultas(limit = 3) {
  const usuarios = await db
    .select({
      id: usuario.clerkId,
      email: usuario.email,
      nombre: usuario.nombre,
      reservas: sql<number>`COUNT(${reservacion.id})`,
      ultimaActividad: sql<string>`MAX(${reservacion.createdAt})`,
    })
    .from(usuario)
    .leftJoin(reservacion, eq(usuario.clerkId, reservacion.usuarioId))
    .leftJoin(multa, eq(usuario.clerkId, multa.usuarioId))
    .where(
      and(
        isNull(multa.id),
        gte(
          reservacion.createdAt ?? sql`CURRENT_DATE`,
          sql`DATE_TRUNC('year', CURRENT_DATE - INTERVAL '1 YEAR')`,
        ),
      ),
    )
    .groupBy(usuario.clerkId, usuario.email, usuario.nombre)
    .having(sql`COUNT(${reservacion.id}) >= 20`)
    .orderBy(desc(sql`COUNT(${reservacion.id})`))
    .limit(limit);

  return usuarios;
}
