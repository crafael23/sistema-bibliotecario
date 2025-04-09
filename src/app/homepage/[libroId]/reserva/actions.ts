"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "~/server/db";
import { reservacion, prestamo, libroCopia, libro } from "~/server/db/schema";
import { eq, and, or, gte } from "drizzle-orm";
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

    // Get all active reservations for this book
    const reservations = await db
      .select({
        startDate: prestamo.fechaPrestamo,
        endDate: prestamo.fechaVencimiento,
        usuarioId: reservacion.usuarioId,
      })
      .from(reservacion)
      .innerJoin(prestamo, eq(prestamo.reservaId, reservacion.id))
      .where(
        and(
          eq(reservacion.libroId, bookId),
          eq(reservacion.estado, "activo"),
          gte(prestamo.fechaVencimiento, new Date().toISOString()),
        ),
      );

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
