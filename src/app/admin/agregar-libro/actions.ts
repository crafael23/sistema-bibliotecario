"use server";

import { revalidatePath } from "next/cache";
import { db } from "~/server/db";
import {
  insertLibroSchema,
  insertLibroCopiaSchema,
  libro,
  libroCopia,
} from "~/server/db/schema";
import { z } from "zod";
import { generateCodigoFromInfo } from "~/lib/generate-codigo";
import { UTApi } from "uploadthing/server";
import { type libroFormSchema, type libroCopiaLocationSchema } from "./schemas";

// Initialize the UploadThing API client
const utapi = new UTApi();

type ErrorResponse = {
  success: false;
  error: string;
  details?: unknown;
};

type SuccessResponse<T = unknown> = {
  success: true;
  data?: T;
};

type ActionResponse<T = unknown> = SuccessResponse<T> | ErrorResponse;

/**
 * Validates and creates a libro record
 *
 * @param formData - The validated form data
 * @returns A response object with success status and data or error details
 */
export async function createLibro(
  formData: z.infer<typeof libroFormSchema>,
): Promise<ActionResponse<typeof libro.$inferSelect>> {
  try {
    // Create base libro record
    const libroData = {
      nombre: formData.title,
      autor: formData.author,
      categoria: formData.category,
      isbn: formData.isbn,
      edicion: formData.edition ?? 1, // Default to 1 if not provided
      descripcion: formData.description ?? "",
      editorial: formData.publisher ?? "",
      urlImagenPortada: formData.coverImageUrl ?? "",
      codigo: generateCodigoFromInfo(
        formData.category,
        formData.author,
        formData.edition ?? 1,
      ),
    };

    // Validate with Drizzle schema
    const validatedLibro = insertLibroSchema.parse(libroData);

    // Insert into database
    const [newLibro] = await db
      .insert(libro)
      .values(validatedLibro)
      .returning();

    return { success: true, data: newLibro };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Validation error",
        details: error.errors,
      };
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create book",
    };
  }
}

/**
 * Creates multiple libro copies for a given libro
 *
 * @param libroId - The ID of the libro to create copies for
 * @param copias - Array of copy locations
 * @returns A response object with success status or error details
 */
export async function createLibroCopias(
  libroId: number,
  copias: z.infer<typeof libroCopiaLocationSchema>[],
): Promise<ActionResponse> {
  try {
    // Prepare all copies data for insertion
    const copiasData = copias.map((copia) => ({
      libroId,
      localizacion: copia.localizacion,
      estado: "disponible", // Default state
    }));

    // Validate all copies at once
    const validatedCopias = copiasData.map((copia) =>
      insertLibroCopiaSchema.parse(copia),
    );

    // Batch insert all copies in a single DB query
    await db.insert(libroCopia).values(validatedCopias);

    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Validation error",
        details: error.errors,
      };
    }

    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create book copies",
    };
  }
}

/**
 * Deletes an uploaded file
 *
 * @param fileKey - The uploadthing file key to delete
 * @returns A response object with success status or error details
 */
export async function deleteUploadedFile(
  fileKey: string,
): Promise<ActionResponse> {
  try {
    if (!fileKey) return { success: true }; // Nothing to delete

    await utapi.deleteFiles(fileKey);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete file",
    };
  }
}

/**
 * Full transaction to create libro and its copies. Uses a database transaction
 * to ensure all operations succeed or fail together.
 *
 * @param libroData - The validated form data for the libro
 * @param copiasData - Array of copy locations
 * @returns A response object with success status and data or error details
 */
export async function createLibroWithCopias(
  libroData: z.infer<typeof libroFormSchema>,
  copiasData: z.infer<typeof libroCopiaLocationSchema>[],
): Promise<ActionResponse<typeof libro.$inferSelect>> {
  try {
    // Define result variable with a proper type
    let result: typeof libro.$inferSelect | undefined;

    // Execute everything as a transaction
    await db.transaction(async (tx) => {
      // Create the base libro record
      const libroInsertData = {
        nombre: libroData.title,
        autor: libroData.author,
        categoria: libroData.category,
        isbn: libroData.isbn,
        edicion: libroData.edition ?? 1,
        descripcion: libroData.description ?? "",
        editorial: libroData.publisher ?? "",
        urlImagenPortada: libroData.coverImageUrl ?? "",
        codigo: generateCodigoFromInfo(
          libroData.category,
          libroData.author,
          libroData.edition ?? 1,
        ),
      };

      // Validate and insert libro
      const validatedLibro = insertLibroSchema.parse(libroInsertData);
      const [newLibro] = await tx
        .insert(libro)
        .values(validatedLibro)
        .returning();

      if (!newLibro) {
        throw new Error("Failed to create libro record");
      }

      // Prepare and validate all copies
      const copiasInsertData = copiasData.map((copia) => ({
        libroId: newLibro.id,
        localizacion: copia.localizacion,
        estado: "disponible",
      }));

      // Validate all copies
      const validatedCopias = copiasInsertData.map((copia) =>
        insertLibroCopiaSchema.parse(copia),
      );

      // Insert all copies
      await tx.insert(libroCopia).values(validatedCopias);

      result = newLibro;
    });

    // Ensure result exists after transaction
    if (!result) {
      throw new Error("Transaction completed but no libro record was created");
    }

    // Revalidate the inventory page after successful transaction
    revalidatePath("/admin/inventario");

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    // Clean up the uploaded file if there was an error
    if (libroData.coverImageKey) {
      await deleteUploadedFile(libroData.coverImageKey).catch(() => {
        // Silently fail - this is just cleanup
      });
    }

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Validation error",
        details: error.errors,
      };
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : "Transaction failed",
    };
  }
}
