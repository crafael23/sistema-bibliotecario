export type FineStatus = "pagado" | "pendiente";
export type ReservationStatus = "pendiente" | "activo" | "devuelto" | "vencido";

export interface BookInfo {
  nombre: string;
  codigo: string;
  autor?: string;
}

export interface Fine {
  id: number;
  prestamoId: number | null;
  monto: string;
  estado: FineStatus;
  categoriaMulta: string | null;
  libroNombre: string;
  libroCodigo: string;
}

export interface Reservation {
  id: number;
  codigoReferencia: string | null;
  estado: ReservationStatus;
  fechaReserva: string;
  fechaVencimiento: string;
  libro: BookInfo;
}

export interface PaginationState {
  page: number;
  total: number;
  perPage: number;
}

export interface DataFetchState<T> {
  data: T[];
  isLoading: boolean;
  error: Error | null;
}
