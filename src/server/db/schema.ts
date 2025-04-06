// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration
import {
  pgEnum,
  pgTableCreator,
  serial,
  text,
  date,
  integer,
  numeric,
  boolean,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { type z } from "zod";

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

export const libro = createTable("libro", {
  id: serial("id").primaryKey(),
  /*
   * CÓDIGO DE DERIVACIÓN ALFABÉTICA:
   * El campo 'codigo' puede usar derivación alfabética combinando:
   * - Primeras 3 letras de la categoría
   * - Primeras 3 letras del apellido del autor
   * - Últimos 2 dígitos del año de edición
   * Ejemplo: para un libro de "Matemáticas" del autor "García" edición 2021:
   * Código: "MAT-GAR-21"
   */
  codigo: text("codigo").notNull(),
  nombre: text("nombre").notNull(),
  categoria: text("categoria").notNull(),
  autor: text("autor").notNull(),
  /*
   * CÓDIGO DE SUBCONJUNTO DE DÍGITOS SIGNIFICATIVOS:
   * El ISBN ya es un ejemplo perfecto de este tipo de código.
   * ISBN-13: 978-3-16-148410-0
   * - 978: Prefijo EAN (libros)
   * - 3: Grupo de idioma (alemán)
   * - 16: Editor
   * - 148410: Número de título
   * - 0: Dígito de verificación
   */
  isbn: text("isbn").notNull(),
  edicion: integer("edicion").notNull(),
  descripcion: text("descripcion").notNull(),
  editorial: text("editorial").notNull(),
  urlImagenPortada: text("url_imagen_portada").notNull(),
});

export const libroCopia = createTable("libro_copia", {
  id: serial("id").primaryKey(),
  /*
   * CÓDIGO DE SECUENCIA EN BLOQUE:
   * La localización usa bloques para organizar la biblioteca:
   * AAA-BBB-CCC donde:
   * - AAA: Número de estantería (001-999)
   * - BBB: Número de estante (001-999)
   * - CCC: Posición en el estante (001-999)
   * Ejemplo: "005-003-012" = Estantería 5, estante 3, posición 12
   */
  localizacion: text("localizacion").notNull(),
  estado: estadoLibroEnum("estado").notNull().default("disponible"),
  libroId: integer("libro_id").references(() => libro.id),
});
export const insertLibroCopiaSchema = createInsertSchema(libroCopia);
export type insertLibroCopiaType = z.infer<typeof insertLibroCopiaSchema>;
export const selectLibroCopiaSchema = createSelectSchema(libroCopia);
export type selectLibroCopiaType = z.infer<typeof selectLibroCopiaSchema>;

// Create Zod schemas for libro
export const insertLibroSchema = createInsertSchema(libro);
export type insertLibroType = z.infer<typeof insertLibroSchema>;
export const selectLibroSchema = createSelectSchema(libro);

export const libroRelations = relations(libro, ({ many }) => ({
  reservaciones: many(reservacion),
  copias: many(libroCopia),
}));
export const libroCopiaRelations = relations(libroCopia, ({ one }) => ({
  libro: one(libro),
}));

export const tipoDeUsuarioEnum = pgEnum("tipo_de_usuario", [
  "externos",
  "estudiantes",
  "docentes",
  "bibliotecarios",
]);

export const usuario = createTable("usuario", {
  clerkId: text("clerkId").primaryKey(),
  nombre: text("nombre").notNull(),
  email: text("email").notNull(),
  telefono: text("telefono"),
  direccion: text("direccion"),
  /*
   * CÓDIGO DE CIFRADO:
   * La identidad podría cifrarse para protección:
   * Original: "0801-1990-12345"
   * Cifrado: "ZBZY-YFFZ-YZLMN"
   * Utilizando sustitución simple donde:
   * 0=Z, 1=Y, 2=X, 3=W, 4=V, 5=U, 6=T, 7=S, 8=R, 9=Q
   * Este campo almacenaría la versión cifrada.
   */
  identidad: text("identidad"),
  /*
   * CÓDIGO DE CLASIFICACIÓN:
   * El tipo de usuario ya implementa este código:
   * - "externos": usuarios sin afiliación directa
   * - "estudiantes": alumnos matriculados
   * - "docentes": profesores y personal académico
   * - "bibliotecarios": personal de biblioteca
   * Cada categoría tiene permisos y restricciones diferentes.
   */
  tipoDeUsuario: tipoDeUsuarioEnum("tipo_de_usuario")
    .notNull()
    .default("externos"),
  nuevo: boolean("nuevo").notNull().default(true),
});

// Create Zod schemas for usuario
export const insertUsuarioSchema = createInsertSchema(usuario);
export type insertUsuarioType = z.infer<typeof insertUsuarioSchema>;
export const selectUsuarioSchema = createSelectSchema(usuario);
export type selectUsuarioType = z.infer<typeof selectUsuarioSchema>;

export const usuarioRelations = relations(usuario, ({ many }) => ({
  reservaciones: many(reservacion),
  prestamos: many(prestamo),
  multas: many(multa),
}));

export const estadoPrestamoEnum = pgEnum("estado_prestamo", [
  "pendiente",
  "activo",
  "devuelto",
  "vencido",
]);

export const reservacion = createTable("reservacion", {
  id: serial("id").primaryKey(),
  /*
   * CÓDIGO MNEMÓNICO:
   * Se puede usar un código de referencia que facilite la identificación:
   * Formato: AAANNN donde:
   * - AAA: Código del tipo de material (LIB=libro, REV=revista, DOC=documento)
   * - NNN: Número correlativo de la reservación para ese tipo
   * Ejemplo: "LIB042" (reservación 42 de un libro)
   */
  codigoReferencia: text("codigo_referencia"),
  usuarioId: text("usuario_id").references(() => usuario.clerkId),
  libroId: integer("libro_id").references(() => libro.id),
  estado: estadoPrestamoEnum("estado").notNull().default("activo"),
});

// Create Zod schemas for reservacion
export const insertReservacionSchema = createInsertSchema(reservacion);
export const selectReservacionSchema = createSelectSchema(reservacion);

export const reservacionRelations = relations(reservacion, ({ one }) => ({
  usuario: one(usuario, {
    fields: [reservacion.usuarioId],
    references: [usuario.clerkId],
  }),
  libro: one(libro, {
    fields: [reservacion.libroId],
    references: [libro.id],
  }),
  prestamo: one(prestamo, {
    fields: [reservacion.id],
    references: [prestamo.reservaId],
  }),
}));

export const prestamo = createTable("prestamo", {
  id: serial("id").primaryKey(),
  reservaId: integer("reserva_id").references(() => reservacion.id),
  fechaPrestamo: date("fecha_prestamo").notNull(),
  fechaVencimiento: date("fecha_vencimiento").notNull(),
  fechaDevolucion: date("fecha_devolucion"),
  personalId: text("personal_id").references(() => usuario.clerkId),
});

// Create Zod schemas for prestamo
export const insertPrestamoSchema = createInsertSchema(prestamo);
export const selectPrestamoSchema = createSelectSchema(prestamo);

export const estadoMultaEnum = pgEnum("estado_multa", ["pagado", "pendiente"]);
export const multa = createTable("multa", {
  id: serial("id").primaryKey(),
  usuarioId: text("usuario_id").references(() => usuario.clerkId),
  prestamoId: integer("prestamo_id").references(() => prestamo.id),
  monto: numeric("monto", { precision: 10, scale: 2 }).notNull(),
  estado: estadoMultaEnum("estado").notNull().default("pendiente"),
  /*
   * CÓDIGO DE SECUENCIA EN BLOQUE:
   * Para las multas, podemos usar un código de referencia por rangos de montos:
   * - M1: Multas menores (0.01 - 10.00)
   * - M2: Multas intermedias (10.01 - 50.00)
   * - M3: Multas mayores (50.01 - 100.00)
   * - M4: Multas graves (>100.00)
   * Ejemplo: Para una multa de 75.50 el código sería "M3"
   */
  categoriaMulta: text("categoria_multa"),
});

// Create Zod schemas for multa
export const insertMultaSchema = createInsertSchema(multa);
export const selectMultaSchema = createSelectSchema(multa);

export const prestamoRelations = relations(prestamo, ({ one }) => ({
  reservacion: one(reservacion, {
    fields: [prestamo.reservaId],
    references: [reservacion.id],
  }),
  usuario: one(usuario, {
    fields: [prestamo.personalId],
    references: [usuario.clerkId],
  }),
  multas: one(multa),
}));

export const multaRelations = relations(multa, ({ one }) => ({
  usuario: one(usuario, {
    fields: [multa.usuarioId],
    references: [usuario.clerkId],
  }),
  prestamo: one(prestamo, {
    fields: [multa.prestamoId],
    references: [prestamo.id],
  }),
}));
