DO $$ BEGIN
 CREATE TYPE "public"."estado_libro" AS ENUM('disponible', 'reservado', 'prestado', 'mantenimiento');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."estado_multa" AS ENUM('pagado', 'pendiente');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."estado_prestamo" AS ENUM('activo', 'devuelto', 'vencido');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sistema-bibliotecario_libro" (
	"id" serial PRIMARY KEY NOT NULL,
	"nombre" varchar NOT NULL,
	"categoria" varchar NOT NULL,
	"cantidad" integer NOT NULL,
	"estado" "estado_libro" DEFAULT 'disponible' NOT NULL,
	"creado_en" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sistema-bibliotecario_multa" (
	"id" serial PRIMARY KEY NOT NULL,
	"usuario_id" text,
	"prestamo_id" integer,
	"monto" numeric(10, 2) NOT NULL,
	"estado" "estado_multa" DEFAULT 'pendiente' NOT NULL,
	"creado_en" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sistema-bibliotecario_prestamo" (
	"id" serial PRIMARY KEY NOT NULL,
	"reserva_id" integer,
	"fecha_prestamo" date NOT NULL,
	"fecha_vencimiento" date NOT NULL,
	"fecha_devolucion" date,
	"personal_id" text,
	"creado_en" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sistema-bibliotecario_reservacion" (
	"id" serial PRIMARY KEY NOT NULL,
	"usuario_id" text,
	"libro_id" integer,
	"fecha_inicio" date NOT NULL,
	"fecha_fin" date NOT NULL,
	"estado" "estado_prestamo" DEFAULT 'activo' NOT NULL,
	"creado_en" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sistema-bibliotecario_usuario" (
	"id" text PRIMARY KEY NOT NULL,
	"clerk_id" text NOT NULL,
	"email" text NOT NULL,
	"creado_en" timestamp DEFAULT now(),
	CONSTRAINT "sistema-bibliotecario_usuario_clerk_id_unique" UNIQUE("clerk_id"),
	CONSTRAINT "sistema-bibliotecario_usuario_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sistema-bibliotecario_multa" ADD CONSTRAINT "sistema-bibliotecario_multa_usuario_id_sistema-bibliotecario_usuario_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "public"."sistema-bibliotecario_usuario"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sistema-bibliotecario_multa" ADD CONSTRAINT "sistema-bibliotecario_multa_prestamo_id_sistema-bibliotecario_prestamo_id_fk" FOREIGN KEY ("prestamo_id") REFERENCES "public"."sistema-bibliotecario_prestamo"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sistema-bibliotecario_prestamo" ADD CONSTRAINT "sistema-bibliotecario_prestamo_reserva_id_sistema-bibliotecario_reservacion_id_fk" FOREIGN KEY ("reserva_id") REFERENCES "public"."sistema-bibliotecario_reservacion"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sistema-bibliotecario_prestamo" ADD CONSTRAINT "sistema-bibliotecario_prestamo_personal_id_sistema-bibliotecario_usuario_id_fk" FOREIGN KEY ("personal_id") REFERENCES "public"."sistema-bibliotecario_usuario"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sistema-bibliotecario_reservacion" ADD CONSTRAINT "sistema-bibliotecario_reservacion_usuario_id_sistema-bibliotecario_usuario_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "public"."sistema-bibliotecario_usuario"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sistema-bibliotecario_reservacion" ADD CONSTRAINT "sistema-bibliotecario_reservacion_libro_id_sistema-bibliotecario_libro_id_fk" FOREIGN KEY ("libro_id") REFERENCES "public"."sistema-bibliotecario_libro"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
