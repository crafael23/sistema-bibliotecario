"use server";

import { db } from "~/server/db";
import { prestamo } from "~/server/db/schema";
import { sql } from "drizzle-orm";

interface TendenciasParams {
  primerMes: number;
  primerAnio: number;
  segundoMes: number;
  segundoAnio: number;
}

interface TendenciaDataPoint {
  dia: number;
  primerPeriodo: number;
  segundoPeriodo: number;
  crecimiento: number;
}

export async function getTendenciasData({
  primerMes,
  primerAnio,
  segundoMes,
  segundoAnio,
}: TendenciasParams) {
  try {
    const primerPeriodoStart = new Date(primerAnio, primerMes - 1, 1);
    const primerPeriodoEnd = new Date(primerAnio, primerMes, 0); // Last day of the month

    const segundoPeriodoStart = new Date(segundoAnio, segundoMes - 1, 1);
    const segundoPeriodoEnd = new Date(segundoAnio, segundoMes, 0); // Last day of the month

    // Format dates for SQL queries
    const primerPeriodoStartStr = primerPeriodoStart
      .toISOString()
      .split("T")[0];
    const primerPeriodoEndStr = primerPeriodoEnd.toISOString().split("T")[0];
    const segundoPeriodoStartStr = segundoPeriodoStart
      .toISOString()
      .split("T")[0];
    const segundoPeriodoEndStr = segundoPeriodoEnd.toISOString().split("T")[0];

    // Get days in the month for the first period
    const diasEnMes = primerPeriodoEnd.getDate();

    // Initialize data structure
    const data: TendenciaDataPoint[] = [];
    let primerPeriodoTotal = 0;
    let segundoPeriodoTotal = 0;

    // Fetch data for the first period (each day of the month)
    const primerPeriodoResult = await db
      .select({
        dia: sql`EXTRACT(DAY FROM ${prestamo.fechaPrestamo})::integer`,
        count: sql`COUNT(*)`,
      })
      .from(prestamo)
      .where(
        sql`${prestamo.fechaPrestamo} >= ${primerPeriodoStartStr} AND ${prestamo.fechaPrestamo} <= ${primerPeriodoEndStr}`,
      )
      .groupBy(sql`EXTRACT(DAY FROM ${prestamo.fechaPrestamo})`)
      .orderBy(sql`EXTRACT(DAY FROM ${prestamo.fechaPrestamo})`);

    // Create a map for faster lookups
    const primerPeriodoMap = new Map(
      primerPeriodoResult.map((item) => [item.dia, Number(item.count)]),
    );

    // Calculate total for primer periodo
    primerPeriodoTotal = primerPeriodoResult.reduce(
      (sum, item) => sum + Number(item.count),
      0,
    );

    // Fetch data for the second period (each day of the month)
    const segundoPeriodoResult = await db
      .select({
        dia: sql`EXTRACT(DAY FROM ${prestamo.fechaPrestamo})::integer`,
        count: sql`COUNT(*)`,
      })
      .from(prestamo)
      .where(
        sql`${prestamo.fechaPrestamo} >= ${segundoPeriodoStartStr} AND ${prestamo.fechaPrestamo} <= ${segundoPeriodoEndStr}`,
      )
      .groupBy(sql`EXTRACT(DAY FROM ${prestamo.fechaPrestamo})`)
      .orderBy(sql`EXTRACT(DAY FROM ${prestamo.fechaPrestamo})`);

    // Create a map for faster lookups
    const segundoPeriodoMap = new Map(
      segundoPeriodoResult.map((item) => [item.dia, Number(item.count)]),
    );

    // Calculate total for segundo periodo
    segundoPeriodoTotal = segundoPeriodoResult.reduce(
      (sum, item) => sum + Number(item.count),
      0,
    );

    // Combine the data and calculate growth percentages
    for (let dia = 1; dia <= diasEnMes; dia++) {
      const primerPeriodoCount = primerPeriodoMap.get(dia) ?? 0;
      const segundoPeriodoCount = segundoPeriodoMap.get(dia) ?? 0;

      // Calculate growth percentage
      let crecimiento = 0;
      if (segundoPeriodoCount > 0) {
        crecimiento =
          ((primerPeriodoCount - segundoPeriodoCount) / segundoPeriodoCount) *
          100;
      } else if (primerPeriodoCount > 0) {
        crecimiento = 100; // If segundoPeriodo is 0 and primerPeriodo has data, it's 100% growth
      }

      data.push({
        dia,
        primerPeriodo: primerPeriodoCount,
        segundoPeriodo: segundoPeriodoCount,
        crecimiento,
      });
    }

    // Calculate average growth
    const crecimientoPromedio =
      segundoPeriodoTotal > 0
        ? ((primerPeriodoTotal - segundoPeriodoTotal) / segundoPeriodoTotal) *
          100
        : primerPeriodoTotal > 0
          ? 100
          : 0;

    return {
      data,
      primerPeriodoTotal,
      segundoPeriodoTotal,
      crecimientoPromedio,
    };
  } catch (error) {
    console.error("Error fetching tendencias data:", error);
    return {
      data: [],
      primerPeriodoTotal: 0,
      segundoPeriodoTotal: 0,
      crecimientoPromedio: 0,
    };
  }
}
