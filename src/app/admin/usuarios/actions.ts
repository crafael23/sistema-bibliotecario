"use server";

import { revalidatePath } from "next/cache";
import { db } from "~/server/db";
import { usuario } from "~/server/db/schema";
import { eq, like, or, asc, desc } from "drizzle-orm";
import { z } from "zod";
import {
  usuarioFormSchema,
  usuarioPaginationParamsSchema,
  usuarioSearchParamsSchema,
} from "./schemas";
import { cifraridentidad } from "~/lib/random-utils";

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

// Type for paginated user data
type PaginatedUsuarios = {
  usuarios: (typeof usuario.$inferSelect)[];
  nextCursor: string | null;
  hasNextPage: boolean;
};

/**
 * Get paginated users from the database
 */
export async function getUsuariosPaginated(
  cursor?: string,
  pageSize = 5,
  sortOrder: "asc" | "desc" = "asc",
): Promise<PaginatedUsuarios> {
  // Determine how to order the results
  const orderFn = sortOrder === "asc" ? asc : desc;

  // Query to get one more item than needed to check if there's a next page
  const usuarios = await db
    .select()
    .from(usuario)
    .orderBy(orderFn(usuario.nombre))
    .limit(pageSize + 1)
    .where(cursor ? eq(usuario.clerkId, cursor) : undefined);

  // Check if we have more items
  const hasNextPage = usuarios.length > pageSize;
  // If we have more items, remove the last one as it's just for checking next page
  const items = hasNextPage ? usuarios.slice(0, -1) : usuarios;
  // Get the ID of the last item as the next cursor
  const nextCursor = hasNextPage
    ? (items[items.length - 1]?.clerkId ?? null)
    : null;

  return {
    usuarios: items,
    nextCursor,
    hasNextPage,
  };
}

/**
 * Search for users by name, email, or identification
 */
export async function searchUsuarios(
  searchTerm: string,
): Promise<PaginatedUsuarios> {
  // Search for users in database
  const usuarios = await db
    .select()
    .from(usuario)
    .where(
      or(
        like(usuario.nombre, `%${searchTerm}%`),
        like(usuario.email, `%${searchTerm}%`),
        like(usuario.identidad, `%${searchTerm}%`),
      ),
    )
    .orderBy(asc(usuario.nombre))
    .limit(20); // Limited to prevent large result sets

  return {
    usuarios,
    nextCursor: null,
    hasNextPage: false,
  };
}

/**
 * Get a single user by ID
 */
export async function getUsuarioById(
  clerkId: string,
): Promise<typeof usuario.$inferSelect | null> {
  const [user] = await db
    .select()
    .from(usuario)
    .where(eq(usuario.clerkId, clerkId))
    .limit(1);

  return user ?? null;
}

/**
 * Update user data in the database
 */
export async function updateUsuario(
  clerkId: string,
  formData: z.infer<typeof usuarioFormSchema>,
): Promise<ActionResponse<typeof usuario.$inferSelect>> {
  try {
    // Validate the input data
    const validatedData = usuarioFormSchema.parse(formData);

    // Encrypt the identidad field if it exists
    const encryptedIdentidad = validatedData.identidad
      ? cifraridentidad(validatedData.identidad)
      : null;

    // Update the user in the database
    const [updatedUser] = await db
      .update(usuario)
      .set({
        nombre: validatedData.nombre,
        email: validatedData.email,
        telefono: validatedData.telefono ?? null,
        direccion: validatedData.direccion ?? null,
        identidad: encryptedIdentidad,
        tipoDeUsuario: validatedData.tipoDeUsuario,
        nuevo: validatedData.nuevo,
      })
      .where(eq(usuario.clerkId, clerkId))
      .returning();

    if (!updatedUser) {
      return {
        success: false,
        error: "No se pudo actualizar el usuario",
      };
    }

    // Revalidate the users page to reflect changes
    revalidatePath("/admin/usuarios");

    return {
      success: true,
      data: updatedUser,
    };
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
          : "Error al actualizar el usuario",
    };
  }
}

/**
 * Action for pagination
 */
export async function getUsuariosAction(params: {
  cursor?: string;
  pageSize?: number;
  orderBy?: "asc" | "desc";
}): Promise<{
  usuarios: (typeof usuario.$inferSelect)[];
  nextCursor: string | null;
  hasNextPage: boolean;
  isSearchResult: false;
}> {
  "use server";

  // Validate and parse parameters
  const validParams = usuarioPaginationParamsSchema.parse(params);

  // For first page with no cursor, we ensure we get the first page
  const cursor = validParams.cursor === null ? undefined : validParams.cursor;

  // Get paginated data
  const data = await getUsuariosPaginated(
    cursor,
    validParams.pageSize,
    validParams.orderBy,
  );

  return {
    usuarios: data.usuarios,
    nextCursor: data.nextCursor,
    hasNextPage: data.hasNextPage,
    isSearchResult: false,
  };
}

/**
 * Action for searching users
 */
export async function searchUsuariosAction(params: {
  searchTerm: string;
}): Promise<{
  usuarios: (typeof usuario.$inferSelect)[];
  nextCursor: string | null;
  hasNextPage: boolean;
  isSearchResult: true;
  searchTerm: string;
}> {
  "use server";

  // Validate and parse search term
  const validParams = usuarioSearchParamsSchema.parse(params);

  // Search for users
  const data = await searchUsuarios(validParams.searchTerm);

  return {
    usuarios: data.usuarios,
    nextCursor: null,
    hasNextPage: false,
    isSearchResult: true,
    searchTerm: validParams.searchTerm,
  };
}
