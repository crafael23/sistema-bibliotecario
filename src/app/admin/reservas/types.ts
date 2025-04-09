import { z } from "zod";

// ======== Pagination Schemas ========
export const reservacionesPaginationParamsSchema = z.object({
  cursor: z.number().optional(),
  pageSize: z.number().min(1).max(100).default(10),
  searchTerm: z.string().optional(),
  estado: z.enum(["pendiente", "activo", "devuelto", "vencido"]).optional(),
});

export const searchParamsSchema = z.object({
  q: z.string().optional(),
  page: z.coerce.number().default(1),
  per_page: z.coerce.number().default(10),
});

// ======== Reservation Estado Types ========
export const reservacionEstadoEnum = z.enum([
  "pendiente",
  "activo",
  "devuelto",
  "vencido",
]);

export type ReservacionEstado = z.infer<typeof reservacionEstadoEnum>;

// ======== API Parameter Types ========
export type ReservationPaginationParams = z.infer<
  typeof reservacionesPaginationParamsSchema
>;

export type SearchParams = z.infer<typeof searchParamsSchema>;

// ======== Database Result Types ========
// Raw query result with Date objects
export interface ReservacionQueryResult {
  id: number;
  codigoReferencia: string | null;
  estado: ReservacionEstado;
  usuario: {
    id: string;
    nombre: string;
    email: string;
  };
  libro: {
    id: number;
    nombre: string;
    autor: string;
    codigo: string;
  };
  prestamo: {
    id: number | null;
    fechaPrestamo: Date | null;
    fechaVencimiento: Date | null;
    fechaDevolucion: Date | null;
  };
  libroCopia?: {
    id: number;
    localizacion: string;
  } | null;
}

// ======== Frontend Types ========
// Processed types with string dates for the frontend
export interface ReservacionWithDetails {
  id: number;
  codigoReferencia: string | null;
  estado: ReservacionEstado;
  usuario: {
    id: string;
    nombre: string;
    email: string;
  };
  libro: {
    id: number;
    nombre: string;
    autor: string;
    codigo: string;
  };
  prestamo: {
    id: number | null;
    fechaPrestamo: string | null;
    fechaVencimiento: string | null;
    fechaDevolucion: string | null;
    libroCopiaId: number | null;
  };
}

// Pagination response type
export interface PaginatedReservaciones {
  items: ReservacionWithDetails[];
  nextCursor: number | null;
  hasNextPage: boolean;
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

// ======== API Response Types ========
export type ActionErrorResponse = {
  success: false;
  message: string;
  details?: unknown;
};

export type ActionSuccessResponse<T = unknown> = {
  success: true;
  message: string;
  data?: T;
};

export type ActionResponse<T = unknown> =
  | ActionSuccessResponse<T>
  | ActionErrorResponse;
