// Common types for reports

export type PaginationParams = {
  page?: number;
  pageSize?: number;
  mes?: number;
  anio?: number;
};

export type PaginatedResponse<T> = {
  data: T[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
};

// Inventario types
export interface Book {
  id: number;
  nombre: string;
  categoria: string;
  autor: string;
  codigo: string;
  estado: "disponible" | "reservado" | "prestado" | "mantenimiento";
  cantidad: number;
}

// Book search result for dropdown
export interface BookSummary {
  id: number;
  nombre: string;
  categoria: string;
  autor: string;
  codigo: string;
  isbn: string;
  editorial: string;
}

// Historial types
export interface Prestamo {
  id: number;
  fechaPrestamo: string;
  estado: "activo" | "devuelto" | "vencido";
  libro: string;
  utilizado: number;
}

export interface Usuario {
  id: string;
  clerkId: string;
  email: string;
  nombre: string;
  creadoEn: Date;
  tipoDeUsuario: string;
}

// Movimientos types
export interface Movimiento {
  id: number;
  fecha: string;
  tipo: "Reserva" | "Préstamo" | "Devolución";
  usuario: string;
  detalle: string;
}

// Multas types
export interface Multa {
  id: number;
  codigo: string;
  usuario: string;
  libro: string;
  telefono: string;
  monto: number;
  diasRetraso: number;
}
