"use server";

import { libro, prestamo, reservacion, usuario } from "./schema"; // Asegúrate de que la ruta a tu archivo de esquema sea correcta
import { db } from ".";
import { randomUUID } from "crypto";

export async function seedDataLibros() {
  // Lista de libros con sus categorías y cantidades
  const libros = [
    { nombre: "Don Quijote de la Mancha", categoria: "Novela", cantidad: 3 },
    {
      nombre: "Cien Años de Soledad",
      categoria: "Realismo Mágico",
      cantidad: 2,
    },
    { nombre: "El Principito", categoria: "Infantil", cantidad: 4 },
    { nombre: "1984", categoria: "Distopía", cantidad: 2 },
    { nombre: "The Great Gatsby", categoria: "Literatura", cantidad: 3 },
    { nombre: "Matar a un Ruiseñor", categoria: "Drama", cantidad: 5 },
    { nombre: "Orgullo y Prejuicio", categoria: "Romance", cantidad: 6 },
    { nombre: "Crimen y Castigo", categoria: "Filosofía", cantidad: 4 },
    { nombre: "El Hobbit", categoria: "Fantasía", cantidad: 7 },
    { nombre: "La Odisea", categoria: "Épica", cantidad: 3 },
    { nombre: "Hamlet", categoria: "Teatro", cantidad: 2 },
    { nombre: "El Alquimista", categoria: "Ficción", cantidad: 5 },
    { nombre: "Drácula", categoria: "Terror", cantidad: 4 },
    { nombre: "Frankenstein", categoria: "Ciencia Ficción", cantidad: 3 },
    { nombre: "El Conde de Montecristo", categoria: "Aventura", cantidad: 6 },
    { nombre: "Los Miserables", categoria: "Drama", cantidad: 4 },
    {
      nombre: "El Retrato de Dorian Gray",
      categoria: "Filosofía",
      cantidad: 3,
    },
    { nombre: "La Divina Comedia", categoria: "Poesía", cantidad: 2 },
    { nombre: "El Señor de los Anillos", categoria: "Fantasía", cantidad: 8 },
    {
      nombre: "Alicia en el País de las Maravillas",
      categoria: "Infantil",
      cantidad: 5,
    },
    {
      nombre: "Las Aventuras de Sherlock Holmes",
      categoria: "Misterio",
      cantidad: 4,
    },
    { nombre: "El Gran Gatsby", categoria: "Literatura", cantidad: 3 },
    { nombre: "Rayuela", categoria: "Experimental", cantidad: 2 },
    { nombre: "Cumbres Borrascosas", categoria: "Romance", cantidad: 4 },
    { nombre: "La Metamorfosis", categoria: "Filosofía", cantidad: 3 },
    { nombre: "El Viejo y el Mar", categoria: "Aventura", cantidad: 5 },
    { nombre: "La Isla del Tesoro", categoria: "Aventura", cantidad: 6 },
    { nombre: "El Principito", categoria: "Infantil", cantidad: 7 },
    { nombre: "El Lobo Estepario", categoria: "Filosofía", cantidad: 4 },
    {
      nombre: "Cien Años de Soledad",
      categoria: "Realismo Mágico",
      cantidad: 3,
    },
  ];

  // Iterar sobre la lista de libros
  for (const libroData of libros) {
    const { nombre, categoria, cantidad } = libroData;

    console.log(`Generando ${cantidad} copias del libro ${nombre}...`);
    // Generar un groupId único para este conjunto de copias
    const groupId = Math.floor(Math.random() * 10000) + 1;
    // Insertar las copias del libro con el mismo groupId
    const copias = Array.from({ length: cantidad }, () => ({
      nombre,
      categoria,
      estado: "disponible", // Estado por defecto
      groupId,
    }));

    for (const copia of copias) {
      await db.insert(libro).values({
        id: randomUUID(),
        categoria: copia.categoria,
        estado: "disponible",
        nombre: copia.nombre,
        groupId: copia.groupId,
      });
    } // Insertar las copias en la base de datos
  }

  console.log("¡Libros sembrados exitosamente!");
}

export async function seedTestData() {
  // 1. Crear usuarios
  const users = await Promise.all([
    // Personal
    db
      .insert(usuario)
      .values({
        id: "STAFF-001",
        clerkId: "staff_001",
        email: "bibliotecario@test.com",
        tipoDeUsuario: "personal",
      })
      .returning(),

    // Usuarios normales
    ...[1, 2, 3, 4].map((i) =>
      db
        .insert(usuario)
        .values({
          id: `USR-${i.toString().padStart(4, "0")}`,
          clerkId: `user_${i}`,
          email: `usuario${i}@test.com`,
          tipoDeUsuario: "usuario",
        })
        .returning(),
    ),
  ]);

  // 2. Seleccionar 20 libros existentes (para 4 usuarios × 5 reservas cada uno)
  const libros = await db.select().from(libro).limit(20);

  // 3. Crear reservaciones y préstamos
  let libroIndex = 0;
  const startDate = new Date(2024, 2, 1); // 1 de marzo 2024

  for (const user of users.slice(1)) {
    // Excluir al personal
    const userId = user[0]!.id;

    // Crear 5 reservaciones por usuario
    for (let i = 0; i < 5; i++) {
      // Calcular fechas
      const fechaPrestamo = new Date(startDate);
      fechaPrestamo.setDate(1 + i * 5); // Distribuir en el mes

      const reserva = await db
        .insert(reservacion)
        .values({
          fechaInicio: fechaPrestamo.toISOString(),
          fechaFin: new Date(
            fechaPrestamo.setDate(fechaPrestamo.getDate() + 7),
          ).toISOString(),
          estado: "activo",
          usuarioId: userId,
          libroId: libros[libroIndex]!.id,
        })
        .returning();

      // Crear préstamo asociado
      await db.insert(prestamo).values({
        fechaPrestamo: fechaPrestamo.toISOString(),
        reservaId: reserva[0]!.id,
        fechaVencimiento: new Date(fechaPrestamo.getDate() + 7).toISOString(),
        fechaDevolucion:
          i % 2 === 0
            ? new Date(
                fechaPrestamo.setDate(fechaPrestamo.getDate() + 2),
              ).toISOString()
            : null,
        personalId: users[0][0]!.id, // ID del personal
      });

      libroIndex++;
    }
  }

  console.log("¡Datos creados exitosamente!");
}
