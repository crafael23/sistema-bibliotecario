import { SQL, or, sql } from "drizzle-orm";
import { reservacion, usuario, libro } from "~/server/db/schema";

/**
 * Formats a date to ISO string or returns null if date is undefined/null
 *
 * @param date - The date to format
 * @returns Formatted date string or null
 */
export const formatDate = (
  date: Date | string | null | undefined,
): string | null => {
  if (!date) return null;
  return date instanceof Date ? date.toISOString() : String(date);
};

/**
 * Creates a SQL search condition for reservations based on a search term
 *
 * @param searchTerm - The term to search for
 * @returns SQL condition for matching reservations
 */
export function createSearchCondition(searchTerm: string): SQL<unknown> {
  const searchPattern = `%${searchTerm}%`;
  return or(
    sql`LOWER(${usuario.nombre}) LIKE LOWER(${searchPattern})`,
    sql`LOWER(${libro.nombre}) LIKE LOWER(${searchPattern})`,
    sql`LOWER(${reservacion.codigoReferencia}) LIKE LOWER(${searchPattern})`,
  )!;
}

/**
 * Calculates pagination properties based on count and params
 *
 * @param totalCount - Total number of items
 * @param cursor - Current cursor position
 * @param pageSize - Number of items per page
 * @returns Pagination properties
 */
export function calculatePagination(
  totalCount: number,
  cursor: number | undefined | null,
  pageSize: number,
) {
  const currentCursor = cursor ?? 0;
  const hasNextPage = currentCursor + pageSize < totalCount;
  const nextCursor = hasNextPage ? currentCursor + pageSize : null;
  const totalPages = Math.ceil(totalCount / pageSize);
  const currentPage = Math.floor(currentCursor / pageSize) + 1;

  return {
    nextCursor,
    hasNextPage,
    totalCount,
    totalPages,
    currentPage,
  };
}
