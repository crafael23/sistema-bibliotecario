"use server";

import { revalidatePath } from "next/cache";
import { db } from "~/server/db";
import {
  libro,
  libroCopia,
  insertLibroCopiaSchema,
  estadoLibroEnum,
} from "~/server/db/schema";
import { z } from "zod";
import { generateCodigoFromInfo } from "~/lib/generate-codigo";
import { UTApi } from "uploadthing/server";
import {
  type libroEditSchema,
  type libroCopiaEditSchema,
  type newLibroCopiaSchema,
} from "./schemas";
import { eq } from "drizzle-orm";

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
 * Updates an existing libro record
 *
 * @param libroId - The ID of the libro to update
 * @param formData - The validated form data
 * @returns A response object with success status and data or error details
 */
export async function updateLibro(
  libroId: number,
  formData: z.infer<typeof libroEditSchema>,
): Promise<ActionResponse<typeof libro.$inferSelect>> {
  try {
    // First get the current libro to check if relevant fields changed
    const [currentLibro] = await db
      .select()
      .from(libro)
      .where(eq(libro.id, libroId))
      .limit(1);

    if (!currentLibro) {
      throw new Error("No se pudo encontrar el libro para actualizar");
    }

    // Check if any code-relevant fields changed
    const shouldRegenerateCodigo =
      currentLibro.categoria !== formData.category ||
      currentLibro.autor !== formData.author ||
      currentLibro.edicion !== formData.edition;

    // Create updated libro data
    const libroData = {
      nombre: formData.title,
      autor: formData.author,
      categoria: formData.category,
      isbn: formData.isbn,
      edicion: formData.edition,
      descripcion: formData.description,
      editorial: formData.publisher,
    };

    // Optional URL update
    if (formData.coverImageUrl) {
      Object.assign(libroData, { urlImagenPortada: formData.coverImageUrl });
    }

    // Regenerate codigo if relevant fields changed
    if (shouldRegenerateCodigo) {
      Object.assign(libroData, {
        codigo: generateCodigoFromInfo(
          formData.category,
          formData.author,
          formData.edition,
        ),
      });
    }

    // Update the database
    const [updatedLibro] = await db
      .update(libro)
      .set(libroData)
      .where(eq(libro.id, libroId))
      .returning();

    if (!updatedLibro) {
      throw new Error(
        "No se pudo actualizar el libro, no se encontró el registro",
      );
    }

    // Revalidate the inventory pages
    revalidatePath("/admin/inventario");
    revalidatePath(`/admin/inventario/${libroId}`);

    return { success: true, data: updatedLibro };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Error de validación",
        details: error.errors,
      };
    }

    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Error al actualizar el libro",
    };
  }
}

/**
 * Updates an existing libro_copia record
 *
 * @param copiaId - The ID of the copy to update
 * @param formData - The validated form data
 * @returns A response object with success status and data or error details
 */
export async function updateLibroCopia(
  copiaId: number,
  formData: z.infer<typeof libroCopiaEditSchema>,
): Promise<ActionResponse<typeof libroCopia.$inferSelect>> {
  try {
    // Validate estado is a valid enum value
    if (!Object.values(estadoLibroEnum.enumValues).includes(formData.estado)) {
      throw new Error("Estado inválido");
    }

    // Create updated copia data
    const copiaData = {
      localizacion: formData.localizacion,
      estado: formData.estado,
    };

    // Update the database
    const [updatedCopia] = await db
      .update(libroCopia)
      .set(copiaData)
      .where(eq(libroCopia.id, copiaId))
      .returning();

    if (!updatedCopia) {
      throw new Error(
        "No se pudo actualizar el ejemplar, no se encontró el registro",
      );
    }

    // Get the libro ID to revalidate the correct path
    const libroId = updatedCopia.libroId;

    // Revalidate the inventory pages
    revalidatePath("/admin/inventario");
    revalidatePath(`/admin/inventario/${libroId}`);

    return { success: true, data: updatedCopia };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Error de validación",
        details: error.errors,
      };
    }

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Error al actualizar el ejemplar",
    };
  }
}

/**
 * Adds a new copy to an existing libro
 *
 * @param libroId - The ID of the libro to add a copy to
 * @param formData - The validated form data
 * @returns A response object with success status and data or error details
 */
export async function addLibroCopia(
  libroId: number,
  formData: z.infer<typeof newLibroCopiaSchema>,
): Promise<ActionResponse<typeof libroCopia.$inferSelect>> {
  try {
    // Create new copia data
    const copiaData = {
      libroId,
      localizacion: formData.localizacion,
      estado: "disponible",
    };

    // Validate with schema
    const validatedCopia = insertLibroCopiaSchema.parse(copiaData);

    // Insert into database
    const [newCopia] = await db
      .insert(libroCopia)
      .values(validatedCopia)
      .returning();

    // Revalidate the inventory pages
    revalidatePath("/admin/inventario");
    revalidatePath(`/admin/inventario/${libroId}`);

    return { success: true, data: newCopia };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Error de validación",
        details: error.errors,
      };
    }

    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Error al agregar el ejemplar",
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
      error:
        error instanceof Error ? error.message : "Error al eliminar el archivo",
    };
  }
}
