import { db } from "~/server/db";
import { reservacion, prestamo, libroCopia, multa } from "~/server/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { addDays, format } from "date-fns";
import { revalidatePath } from "next/cache";
import type { ActionResponse } from "../types";
import { auth } from "@clerk/nextjs/server";

/**
 * Deliver a book to a user by assigning a copy to a reservation
 *
 * @param reservacionId - The ID of the reservation
 * @param copiaId - The ID of the book copy to deliver
 * @param fechaEntrega - The delivery date (defaults to now)
 * @returns Result of the transaction
 */
export async function entregarLibro(
  reservacionId: number,
  copiaId: number,
  fechaEntrega: Date = new Date(),
): Promise<
  ActionResponse<{
    reservacionId: number;
    copiaId: number;
    fechaEntrega: string;
    fechaVencimiento: string;
  }>
> {
  try {
    console.log("entregarLibro - Input params:", {
      reservacionId,
      copiaId,
      fechaEntrega:
        fechaEntrega instanceof Date
          ? fechaEntrega.toISOString()
          : fechaEntrega,
    });

    // Format dates for SQL queries
    const fechaEntregaStr = format(fechaEntrega, "yyyy-MM-dd");
    const fechaVencimiento = addDays(fechaEntrega, 14); // 14 days loan period
    const fechaVencimientoStr = format(fechaVencimiento, "yyyy-MM-dd");

    console.log("entregarLibro - Formatted dates:", {
      fechaEntregaStr,
      fechaVencimientoStr,
    });

    // Execute everything as a transaction
    return await db.transaction(async (tx) => {
      // 1. Get the reservation and copy
      const [reserva] = await tx
        .select()
        .from(reservacion)
        .where(eq(reservacion.id, reservacionId))
        .limit(1);

      if (!reserva) {
        return {
          success: false,
          message: "Reservación no encontrada",
        };
      }

      const [copia] = await tx
        .select()
        .from(libroCopia)
        .where(
          and(eq(libroCopia.id, copiaId), eq(libroCopia.estado, "disponible")),
        )
        .limit(1);

      if (!copia) {
        return {
          success: false,
          message: "Copia no disponible",
        };
      }

      // 2. Update the reservation status
      await tx
        .update(reservacion)
        .set({ estado: "activo" })
        .where(eq(reservacion.id, reservacionId));

      // 3. Create or update the loan record
      console.log("entregarLibro - Checking for existing prestamo");

      const [existingPrestamo] = await tx
        .select()
        .from(prestamo)
        .where(eq(prestamo.reservaId, reservacionId))
        .limit(1);

      if (existingPrestamo) {
        console.log(
          "entregarLibro - Updating existing prestamo:",
          existingPrestamo.id,
        );
        // Update existing loan
        await tx
          .update(prestamo)
          .set({
            fechaPrestamo: sql`${fechaEntregaStr}`,
            fechaVencimiento: sql`${fechaVencimientoStr}`,
            libroCopiaId: copiaId,
            personalId: (await auth())?.userId,
          })
          .where(eq(prestamo.id, existingPrestamo.id));
      } else {
        console.log("entregarLibro - Creating new prestamo");
        // Create new loan
        await tx.insert(prestamo).values({
          reservaId: reservacionId,
          fechaPrestamo: sql`${fechaEntregaStr}`,
          fechaVencimiento: sql`${fechaVencimientoStr}`,
          libroCopiaId: copiaId,
          personalId: (await auth())?.userId,
        });
      }

      // 4. Update the book copy status
      await tx
        .update(libroCopia)
        .set({ estado: "prestado" })
        .where(eq(libroCopia.id, copiaId));

      // Revalidate the path to update UI
      revalidatePath("/admin/reservas");

      return {
        success: true,
        message: "Libro entregado exitosamente",
        data: {
          reservacionId,
          copiaId,
          fechaEntrega: fechaEntrega.toISOString(),
          fechaVencimiento: fechaVencimiento.toISOString(),
        },
      };
    });
  } catch (error) {
    console.error("Error al entregar libro:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Error desconocido al entregar el libro",
    };
  }
}

/**
 * Return a book to the library
 *
 * @param reservacionId - The ID of the reservation
 * @param fechaDevolucion - The return date (defaults to now)
 * @returns Result of the transaction
 */
export async function recibirLibro(
  reservacionId: number,
  fechaDevolucion: Date = new Date(),
): Promise<
  ActionResponse<{
    reservacionId: number;
    copiaId: number;
    fechaDevolucion: string;
    multa?: {
      amount: number;
      diasRetraso: number;
      categoria: string;
    };
  }>
> {
  try {
    console.log("recibirLibro - Input params:", {
      reservacionId,
      fechaDevolucion:
        fechaDevolucion instanceof Date
          ? fechaDevolucion.toISOString()
          : fechaDevolucion,
    });

    // Format date for SQL query
    const fechaDevolucionStr = format(fechaDevolucion, "yyyy-MM-dd");
    console.log("recibirLibro - Formatted date:", { fechaDevolucionStr });

    // Execute everything as a transaction
    return await db.transaction(async (tx) => {
      // 1. Get the reservation and prestamo
      const [reservaResult] = await tx
        .select({
          reservacion: reservacion,
          prestamo: prestamo,
        })
        .from(reservacion)
        .innerJoin(prestamo, eq(reservacion.id, prestamo.reservaId))
        .where(eq(reservacion.id, reservacionId))
        .limit(1);

      if (!reservaResult?.prestamo.libroCopiaId) {
        return {
          success: false,
          message:
            "Reservación no encontrada o no tiene una copia de libro asignada",
        };
      }

      const copiaId = reservaResult.prestamo.libroCopiaId;

      // 2. Update the copy status
      await tx
        .update(libroCopia)
        .set({ estado: "disponible" })
        .where(eq(libroCopia.id, copiaId));

      // 3. Update the loan record
      await tx
        .update(prestamo)
        .set({ fechaDevolucion: sql`${fechaDevolucionStr}` })
        .where(eq(prestamo.reservaId, reservacionId));

      // 4. Update the reservation status
      await tx
        .update(reservacion)
        .set({ estado: "devuelto" })
        .where(eq(reservacion.id, reservacionId));

      // 5. Check if the book is overdue and create a fine if necessary
      const [prestamoInfo] = await tx
        .select()
        .from(prestamo)
        .where(eq(prestamo.reservaId, reservacionId))
        .limit(1);

      // Result object
      const result: ActionResponse<{
        reservacionId: number;
        copiaId: number;
        fechaDevolucion: string;
        multa?: {
          amount: number;
          diasRetraso: number;
          categoria: string;
        };
      }> = {
        success: true,
        message: "Libro recibido exitosamente",
        data: {
          reservacionId,
          copiaId,
          fechaDevolucion: fechaDevolucion.toISOString(),
        },
      };

      // Check if book is returned late
      if (prestamoInfo?.fechaVencimiento) {
        const fechaVencimientoDate = new Date(prestamoInfo.fechaVencimiento);
        const diasRetraso = Math.max(
          0,
          Math.floor(
            (fechaDevolucion.getTime() - fechaVencimientoDate.getTime()) /
              (1000 * 60 * 60 * 24),
          ),
        );

        if (diasRetraso > 0) {
          // Create a fine - $1.00 per day of delay
          const montoMulta = diasRetraso * 1.0;

          // Determine fine category based on severity
          const categoriaMulta =
            diasRetraso > 30
              ? "M4"
              : diasRetraso > 14
                ? "M3"
                : diasRetraso > 7
                  ? "M2"
                  : "M1";

          await tx.insert(multa).values({
            usuarioId: reservaResult.reservacion.usuarioId,
            prestamoId: prestamoInfo.id,
            monto: montoMulta.toFixed(2),
            estado: "pendiente",
            categoriaMulta,
          });

          // Add fine details to result
          if (result.data) {
            result.data.multa = {
              amount: montoMulta,
              diasRetraso,
              categoria: categoriaMulta,
            };
          }
        }
      }

      // Revalidate the path to update UI
      revalidatePath("/admin/reservas");

      return result;
    });
  } catch (error) {
    console.error("Error al recibir libro:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Error desconocido al recibir el libro",
    };
  }
}
