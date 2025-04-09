"use server";

import { currentUser } from "@clerk/nextjs/server";
import { db } from "~/server/db";
import { getUsuario, updateUsuarioPerfil } from "~/server/db/queries";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { multa, libro, reservacion, prestamo } from "~/server/db/schema";
import type { InferSelectModel } from "drizzle-orm";

export type UserProfileData = {
  nombre: string;
  email: string;
  telefono: string | null;
  direccion: string | null;
  avatarUrl: string;
};

/**
 * Gets the current user profile data from the database
 */
export async function getUserProfile() {
  try {
    const user = await currentUser();

    if (!user) {
      throw new Error("No authenticated user found");
    }

    // Fetch the user data from our database using the Clerk ID
    const userData = await getUsuario(user.id);

    if (!userData) {
      throw new Error("User not found in the database");
    }

    return {
      clerkId: userData.clerkId,
      nombre: userData.nombre,
      email: userData.email,
      telefono: userData.telefono,
      direccion: userData.direccion,
      identidad: userData.identidad,
      tipoDeUsuario: userData.tipoDeUsuario,
      nuevo: userData.nuevo,
      avatarUrl: user.imageUrl || "/placeholder.svg?height=96&width=96",
    };
  } catch (error) {
    console.error("Error getting user profile:", error);
    throw error;
  }
}

/**
 * Updates the user profile in the database
 */
export async function updateUserProfile(data: UserProfileData) {
  try {
    const user = await currentUser();

    if (!user) {
      throw new Error("No authenticated user found");
    }

    // Update the user data in our database
    await updateUsuarioPerfil(user.id, {
      nombre: data.nombre,
      email: data.email,
      telefono: data.telefono ?? "",
      direccion: data.direccion ?? "",
      avatarUrl: data.avatarUrl,
    });

    // Revalidate the profile page to show the updated data
    revalidatePath("/homepage/perfil");

    return { success: true };
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
}

type FineWithBook = {
  id: number;
  prestamoId: number | null;
  monto: string;
  estado: "pendiente" | "pagado";
  categoriaMulta: string | null;
  libro: {
    nombre: string;
    codigo: string;
  } | null;
};

type ReservationWithBook = {
  id: number;
  codigoReferencia: string | null;
  estado: "pendiente" | "activo" | "devuelto" | "vencido";
  prestamo: {
    fechaPrestamo: Date;
    fechaVencimiento: Date;
  } | null;
  libro: {
    nombre: string;
    codigo: string;
    autor: string;
  } | null;
};

/**
 * Gets all fines for a user
 */
export async function getUserFines(userId: string) {
  try {
    const fines = (await db
      .select({
        id: multa.id,
        prestamoId: multa.prestamoId,
        monto: multa.monto,
        estado: multa.estado,
        categoriaMulta: multa.categoriaMulta,
        libro: {
          nombre: libro.nombre,
          codigo: libro.codigo,
        },
      })
      .from(multa)
      .leftJoin(prestamo, eq(multa.prestamoId, prestamo.id))
      .leftJoin(reservacion, eq(prestamo.reservaId, reservacion.id))
      .leftJoin(libro, eq(reservacion.libroId, libro.id))
      .where(eq(multa.usuarioId, userId))) as FineWithBook[];

    return fines.map((fine) => ({
      id: fine.id,
      prestamoId: fine.prestamoId,
      monto: fine.monto.toString(),
      estado: fine.estado,
      categoriaMulta: fine.categoriaMulta,
      libroNombre: fine.libro?.nombre ?? "",
      libroCodigo: fine.libro?.codigo ?? "",
    }));
  } catch (error) {
    console.error("Error getting user fines:", error);
    throw new Error("Failed to fetch user fines");
  }
}

/**
 * Gets all reservations for a user
 */
export async function getUserReservations(userId: string) {
  try {
    const reservations = (await db
      .select({
        id: reservacion.id,
        codigoReferencia: reservacion.codigoReferencia,
        estado: reservacion.estado,
        prestamo: {
          fechaPrestamo: prestamo.fechaPrestamo,
          fechaVencimiento: prestamo.fechaVencimiento,
        },
        libro: {
          nombre: libro.nombre,
          codigo: libro.codigo,
          autor: libro.autor,
        },
      })
      .from(reservacion)
      .leftJoin(prestamo, eq(reservacion.id, prestamo.reservaId))
      .leftJoin(libro, eq(reservacion.libroId, libro.id))
      .where(eq(reservacion.usuarioId, userId))) as ReservationWithBook[];

    return reservations.map((reservation) => ({
      id: reservation.id,
      codigoReferencia: reservation.codigoReferencia,
      estado: reservation.estado,
      fechaReserva:
        reservation.prestamo?.fechaPrestamo instanceof Date
          ? reservation.prestamo.fechaPrestamo.toISOString()
          : String(reservation.prestamo?.fechaPrestamo ?? ""),
      fechaVencimiento:
        reservation.prestamo?.fechaVencimiento instanceof Date
          ? reservation.prestamo.fechaVencimiento.toISOString()
          : String(reservation.prestamo?.fechaVencimiento ?? ""),
      libro: {
        nombre: reservation.libro?.nombre ?? "",
        codigo: reservation.libro?.codigo ?? "",
        autor: reservation.libro?.autor ?? "",
      },
    }));
  } catch (error) {
    console.error("Error getting user reservations:", error);
    throw new Error("Failed to fetch user reservations");
  }
}
