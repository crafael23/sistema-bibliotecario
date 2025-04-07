import { getLibrosPaginated, searchLibros } from "~/server/db/queries";
import InventarioComponent from "./inventario-component";
import { z } from "zod";

export const dynamic = "force-dynamic";

// Define the pagination parameters schema
const paginationParamsSchema = z.object({
  cursor: z.number().optional(),
  pageSize: z.number().optional().default(5),
  orderBy: z.enum(["asc", "desc"]).optional().default("asc"),
});

// Define the search parameters schema
const searchParamsSchema = z.object({
  searchTerm: z.string().min(1),
});

// Define the action to fetch paginated data
export async function getLibrosAction(params: {
  cursor?: number;
  pageSize?: number;
  orderBy?: "asc" | "desc";
}) {
  "use server";

  // Validate and parse the input parameters
  const validParams = paginationParamsSchema.parse(params);

  // For first page with no cursor, we need to ensure we get the first page
  // by setting cursor to undefined
  const cursor = validParams.cursor === null ? undefined : validParams.cursor;

  // Get the paginated data using our query function
  const data = await getLibrosPaginated(
    cursor,
    validParams.pageSize,
    validParams.orderBy,
  );

  return {
    libros: data.libros,
    nextCursor: data.nextCursor,
    hasNextPage: data.hasNextPage,
    isSearchResult: false,
  };
}

// Define the action to search for books
export async function searchLibrosAction(params: { searchTerm: string }) {
  "use server";

  // Validate and parse the search term
  const validParams = searchParamsSchema.parse(params);

  // Search for books using the search function
  const data = await searchLibros(validParams.searchTerm);

  return {
    libros: data.libros,
    nextCursor: null,
    hasNextPage: false,
    isSearchResult: true,
    searchTerm: validParams.searchTerm,
  };
}

export default async function InventarioPage() {
  // Get initial data
  const initialData = await getLibrosPaginated(undefined, 5);

  return (
    <>
      <InventarioComponent
        initialData={initialData}
        getLibrosAction={getLibrosAction}
        searchLibrosAction={searchLibrosAction}
      />
    </>
  );
}
