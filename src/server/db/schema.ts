// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration
import {
  pgEnum,
  pgTableCreator,
  serial,
  text,
  timestamp,
  date,
  integer,
  numeric,
  varchar,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */

// Crear tablas con prefijo personalizado
export const createTable = pgTableCreator(
  (name) => `sistema-bibliotecario_${name}`,
);

// 1. Enums para estados
export const estadoLibroEnum = pgEnum("estado_libro", [
  "disponible",
  "reservado",
  "prestado",
  "mantenimiento",
]);
export const estadoPrestamoEnum = pgEnum("estado_prestamo", [
  "activo",
  "devuelto",
  "vencido",
]);
export const estadoMultaEnum = pgEnum("estado_multa", ["pagado", "pendiente"]);

// 2. Tabla de libros (Inventario)
export const libro = createTable("libro", {
  id: serial("id").primaryKey(),
  nombre: varchar("nombre").notNull(),
  categoria: varchar("categoria").notNull(),
  cantidad: integer("cantidad").notNull(),
  estado: estadoLibroEnum("estado").notNull().default("disponible"),
  creadoEn: timestamp("creado_en").defaultNow(),
});

// 3. Tabla de usuarios (Integración con Clerk)
export const usuario = createTable("usuario", {
  id: text("id").primaryKey(),
  clerkId: text("clerk_id").unique().notNull(),
  email: text("email").unique().notNull(),
  creadoEn: timestamp("creado_en").defaultNow(),
});

// 4. Tabla de reservaciones
export const reservacion = createTable("reservacion", {
  id: serial("id").primaryKey(),
  usuarioId: text("usuario_id").references(() => usuario.id),
  libroId: integer("libro_id").references(() => libro.id),
  fechaInicio: date("fecha_inicio").notNull(),
  fechaFin: date("fecha_fin").notNull(),
  estado: estadoPrestamoEnum("estado").notNull().default("activo"),
  creadoEn: timestamp("creado_en").defaultNow(),
});

// 5. Tabla de préstamos
export const prestamo = createTable("prestamo", {
  id: serial("id").primaryKey(),
  reservaId: integer("reserva_id").references(() => reservacion.id),
  fechaPrestamo: date("fecha_prestamo").notNull(),
  fechaVencimiento: date("fecha_vencimiento").notNull(),
  fechaDevolucion: date("fecha_devolucion"),
  personalId: text("personal_id").references(() => usuario.id),
  creadoEn: timestamp("creado_en").defaultNow(),
});

// 6. Tabla de multas
export const multa = createTable("multa", {
  id: serial("id").primaryKey(),
  usuarioId: text("usuario_id").references(() => usuario.id),
  prestamoId: integer("prestamo_id").references(() => prestamo.id),
  monto: numeric("monto", { precision: 10, scale: 2 }).notNull(),
  estado: estadoMultaEnum("estado").notNull().default("pendiente"),
  creadoEn: timestamp("creado_en").defaultNow(),
});

// Relaciones
export const libroRelaciones = relations(libro, ({ many }) => ({
  reservaciones: many(reservacion),
}));

export const usuarioRelaciones = relations(usuario, ({ many }) => ({
  reservaciones: many(reservacion),
  prestamos: many(prestamo),
  multas: many(multa),
}));

export const reservacionRelaciones = relations(reservacion, ({ one }) => ({
  libro: one(libro, {
    fields: [reservacion.libroId],
    references: [libro.id],
  }),
  usuario: one(usuario, {
    fields: [reservacion.usuarioId],
    references: [usuario.id],
  }),
  prestamo: one(prestamo, {
    fields: [reservacion.id],
    references: [prestamo.reservaId],
  }),
}));

export const prestamoRelaciones = relations(prestamo, ({ one }) => ({
  reservacion: one(reservacion, {
    fields: [prestamo.reservaId],
    references: [reservacion.id],
  }),
  personal: one(usuario, {
    fields: [prestamo.personalId],
    references: [usuario.id],
  }),
  multa: one(multa, {
    fields: [prestamo.id],
    references: [multa.prestamoId],
  }),
}));

export const multaRelaciones = relations(multa, ({ one }) => ({
  usuario: one(usuario, {
    fields: [multa.usuarioId],
    references: [usuario.id],
  }),
  prestamo: one(prestamo, {
    fields: [multa.prestamoId],
    references: [prestamo.id],
  }),
}));
