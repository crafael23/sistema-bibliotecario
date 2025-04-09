"use server";

import { revalidatePath } from "next/cache";
import { reservacionesPaginationParamsSchema } from "./types";

// Import from our modular db directory
import {
  getPendingReservaciones,
  getActiveReservaciones,
  getReturnedReservaciones,
  getAvailableCopias,
  entregarLibro,
  recibirLibro,
} from "./db";

// Re-export functions with their original signatures
export {
  getPendingReservaciones,
  getActiveReservaciones,
  getReturnedReservaciones,
  getAvailableCopias,
  entregarLibro,
  recibirLibro,
};

// Re-export types from types.ts
import type {
  ReservacionWithDetails,
  PaginatedReservaciones,
  ActionResponse,
  ReservacionEstado,
} from "./types";

export type {
  ReservacionWithDetails,
  PaginatedReservaciones,
  ActionResponse,
  ReservacionEstado,
};

/**
 * Wrapper for pagination validation to ensure safety when used client-side
 */
export async function getReservacionesByStatus(
  status: "pendiente" | "activo" | "devuelto",
  params: unknown,
) {
  // Validate params
  const validatedParams = reservacionesPaginationParamsSchema.parse(params);

  // Call the appropriate function based on status
  switch (status) {
    case "pendiente":
      return getPendingReservaciones(validatedParams);
    case "activo":
      return getActiveReservaciones(validatedParams);
    case "devuelto":
      return getReturnedReservaciones(validatedParams);
    default:
      // Cast status to string to avoid template literal type error
      throw new Error("Invalid status: " + String(status));
  }
}

/**
 * Helper function to validate parameters for the deliver book operation
 */
export async function deliverBook(data: {
  reservacionId: number;
  copiaId: number;
  fechaEntrega?: string;
}) {
  // Extract data
  const { reservacionId, copiaId, fechaEntrega } = data;

  // Validate required fields
  if (!reservacionId || !copiaId) {
    return {
      success: false,
      message: "Se requiere el ID de la reservación y el ID de la copia",
    };
  }

  // Call transaction with parsed data
  const result = await entregarLibro(
    reservacionId,
    copiaId,
    fechaEntrega ? new Date(fechaEntrega) : new Date(),
  );

  // Revalidate path on success
  if (result.success) {
    revalidatePath("/admin/reservas");
  }

  return result;
}

/**
 * Helper function to validate parameters for the return book operation
 */
export async function returnBook(data: {
  reservacionId: number;
  fechaDevolucion?: string;
}) {
  // Extract data
  const { reservacionId, fechaDevolucion } = data;

  // Validate required fields
  if (!reservacionId) {
    return {
      success: false,
      message: "Se requiere el ID de la reservación",
    };
  }

  // Call transaction with parsed data
  const result = await recibirLibro(
    reservacionId,
    fechaDevolucion ? new Date(fechaDevolucion) : new Date(),
  );

  // Revalidate path on success
  if (result.success) {
    revalidatePath("/admin/reservas");
  }

  return result;
}
