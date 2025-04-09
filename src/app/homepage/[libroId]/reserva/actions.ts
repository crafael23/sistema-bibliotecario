"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "~/server/db";
import { reservacion, prestamo, libroCopia, libro } from "~/server/db/schema";
import { eq, and, or, gte, lte } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { type z } from "zod";
import {
  insertReservacionSchema,
  insertPrestamoSchema,
} from "~/server/db/schema";
import { format, parseISO, isSameDay } from "date-fns";

export async function getUnavailableDates(bookId: number) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return {
        success: false,
        error: "Usuario no autenticado",
        unavailableRanges: [],
        availableCopies: 0,
        totalCopies: 0,
      };
    }

    // Get all copies of the book
    const copies = await db
      .select()
      .from(libroCopia)
      .where(eq(libroCopia.libroId, bookId));

    if (!copies.length) {
      return {
        success: false,
        error: "No existen copias de este libro",
        unavailableRanges: [],
        availableCopies: 0,
        totalCopies: 0,
      };
    }

    // Get all active and pending reservations for this book
    // Include both "activo" and "pendiente" reservations as they both block dates
    const reservations = await db
      .select({
        startDate: prestamo.fechaPrestamo,
        endDate: prestamo.fechaVencimiento,
        usuarioId: reservacion.usuarioId,
        estado: reservacion.estado,
      })
      .from(reservacion)
      .innerJoin(prestamo, eq(prestamo.reservaId, reservacion.id))
      .where(
        and(
          eq(reservacion.libroId, bookId),
          gte(prestamo.fechaVencimiento, new Date().toISOString()),
        ),
      );

    console.log("Found reservations:", reservations);

    // Group reservations by date to count how many are active on each day
    const reservationsByDate = new Map<string, number>();
    const userReservations = new Set<string>();

    reservations.forEach((res) => {
      const startDate = parseISO(res.startDate);
      const endDate = parseISO(res.endDate);

      // If this is the current user's reservation, mark all these dates as unavailable
      if (res.usuarioId === userId) {
        let currentDate = new Date(startDate);
        while (currentDate <= endDate) {
          const dateKey = format(currentDate, "yyyy-MM-dd");
          userReservations.add(dateKey);
          // Move to next day
          const nextDate = new Date(currentDate);
          nextDate.setDate(nextDate.getDate() + 1);
          currentDate = nextDate;
        }
      }

      // Mark each day in the range as having a reservation
      let currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        const dateKey = format(currentDate, "yyyy-MM-dd");
        const currentCount = reservationsByDate.get(dateKey) ?? 0;
        reservationsByDate.set(dateKey, currentCount + 1);

        // Move to next day
        const nextDate = new Date(currentDate);
        nextDate.setDate(nextDate.getDate() + 1);
        currentDate = nextDate;
      }
    });

    console.log("Reservations by date:", [...reservationsByDate.entries()]);
    console.log("User reservations:", [...userReservations]);

    // Find dates where all copies would be reserved OR where the user already has a reservation
    const unavailableDates: Date[] = [];
    reservationsByDate.forEach((count, dateStr) => {
      // If number of reservations on this date equals or exceeds total copies,
      // or if the user already has a reservation on this date
      if (count >= copies.length || userReservations.has(dateStr)) {
        unavailableDates.push(parseISO(dateStr));
      }
    });

    // Convert individual unavailable dates to date ranges
    const unavailableRanges: { from: Date; to: Date }[] = [];
    if (unavailableDates.length > 0) {
      // Sort dates
      unavailableDates.sort((a, b) => a.getTime() - b.getTime());

      let rangeStart = unavailableDates[0]!;
      let rangeEnd = unavailableDates[0]!;

      for (let i = 1; i < unavailableDates.length; i++) {
        const prevDate = new Date(unavailableDates[i - 1]!);
        prevDate.setDate(prevDate.getDate() + 1);

        if (prevDate.getTime() === unavailableDates[i]!.getTime()) {
          // Consecutive date, extend range
          rangeEnd = unavailableDates[i]!;
        } else {
          // Non-consecutive, create a range and start a new one
          unavailableRanges.push({
            from: rangeStart,
            to: rangeEnd,
          });
          rangeStart = unavailableDates[i]!;
          rangeEnd = unavailableDates[i]!;
        }
      }

      // Add the last range
      unavailableRanges.push({
        from: rangeStart,
        to: rangeEnd,
      });
    }

    console.log("Calculated unavailable ranges:", unavailableRanges);

    return {
      success: true,
      unavailableRanges,
      availableCopies: copies.length,
      totalCopies: copies.length,
    };
  } catch (error) {
    console.error("Error fetching unavailable dates:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Error al obtener fechas no disponibles",
      unavailableRanges: [],
      availableCopies: 0,
      totalCopies: 0,
    };
  }
}

export async function confirmReservation(formData: {
  bookId: number;
  bookName: string;
  startDate: Date;
  endDate: Date;
  rentalDays: number;
}) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Usuario no autenticado" };
    }

    // Format dates for database queries
    const startDateStr = format(formData.startDate, "yyyy-MM-dd");
    const endDateStr = format(formData.endDate, "yyyy-MM-dd");

    // Check if the user already has a reservation for this book on these dates
    const existingReservations = await db
      .select()
      .from(reservacion)
      .innerJoin(prestamo, eq(prestamo.reservaId, reservacion.id))
      .where(
        and(
          eq(reservacion.usuarioId, userId),
          eq(reservacion.libroId, formData.bookId),
          or(
            eq(reservacion.estado, "activo"),
            eq(reservacion.estado, "pendiente"),
          ),
          or(
            // Check for overlapping date ranges
            and(
              lte(prestamo.fechaPrestamo, startDateStr),
              gte(prestamo.fechaVencimiento, startDateStr),
            ),
            and(
              lte(prestamo.fechaPrestamo, endDateStr),
              gte(prestamo.fechaVencimiento, endDateStr),
            ),
            and(
              gte(prestamo.fechaPrestamo, startDateStr),
              lte(prestamo.fechaVencimiento, endDateStr),
            ),
          ),
        ),
      );

    if (existingReservations.length > 0) {
      return {
        success: false,
        error:
          "Ya tienes una reserva para este libro en las fechas seleccionadas",
      };
    }

    // Check if there are enough copies available for these dates
    const bookCopies = await db
      .select()
      .from(libroCopia)
      .where(eq(libroCopia.libroId, formData.bookId));

    const totalCopies = bookCopies.length;

    // Get all existing reservations for this book on the selected dates
    const overlappingReservations = await db
      .select()
      .from(reservacion)
      .innerJoin(prestamo, eq(prestamo.reservaId, reservacion.id))
      .where(
        and(
          eq(reservacion.libroId, formData.bookId),
          or(
            eq(reservacion.estado, "activo"),
            eq(reservacion.estado, "pendiente"),
          ),
          or(
            // Check for overlapping date ranges
            and(
              lte(prestamo.fechaPrestamo, startDateStr),
              gte(prestamo.fechaVencimiento, startDateStr),
            ),
            and(
              lte(prestamo.fechaPrestamo, endDateStr),
              gte(prestamo.fechaVencimiento, endDateStr),
            ),
            and(
              gte(prestamo.fechaPrestamo, startDateStr),
              lte(prestamo.fechaVencimiento, endDateStr),
            ),
          ),
        ),
      );

    if (overlappingReservations.length >= totalCopies) {
      return {
        success: false,
        error:
          "No hay suficientes copias disponibles para las fechas seleccionadas",
      };
    }

    // Start a transaction
    const result = await db.transaction(async (tx) => {
      // 1. Create the reservation
      const reservationData = {
        usuarioId: userId,
        libroId: formData.bookId,
        estado: "pendiente" as const,
        codigoReferencia: `LIB${Date.now().toString().slice(-3)}`, // Simple reference code
      };

      const [newReservation] = await tx
        .insert(reservacion)
        .values(reservationData)
        .returning();

      if (!newReservation) {
        throw new Error("Error al crear la reservación");
      }

      // 2. Create the loan record
      const loanData = {
        reservaId: newReservation.id,
        fechaPrestamo: startDateStr,
        fechaVencimiento: endDateStr,
      };

      await tx.insert(prestamo).values(loanData);

      return { newReservation };
    });

    // Revalidate the book page to update availability
    revalidatePath(`/homepage/${formData.bookId}`);
    revalidatePath(`/homepage/${formData.bookId}/reserva`);

    return {
      success: true,
      reservationId: result?.newReservation?.id,
      message: "Reserva confirmada exitosamente",
    };
  } catch (error) {
    console.error("Error confirming reservation:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Error al confirmar la reserva",
    };
  }
}
