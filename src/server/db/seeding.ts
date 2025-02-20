"use server";
import { seed } from "drizzle-seed";
import { estadoLibroEnum, libro } from "./schema"; // Ensure the path to your schema file is correct
import { db } from ".";

export async function seedData() {
  await seed(db, { libro }).refine((f) => ({
    libro: {
      // Generate 5 libro rows
      count: 5,
      columns: {
        // Use a fixed list of book names so that each generated row picks one value
        nombre: f.valuesFromArray({
          values: [
            "Don Quijote de la Mancha",
            "Cien Años de Soledad",
            "El Principito",
            "1984",
            "The Great Gatsby",
          ],
          // Set to true if you want unique names; false otherwise.
          isUnique: true,
        }),
        // Similarly, provide a set of categories
        categoria: f.valuesFromArray({
          values: [
            "Novela",
            "Realismo Mágico",
            "Infantil",
            "Distopía",
            "Literatura",
          ],
          isUnique: false,
        }),
        // Generate a random quantity between 1 and 10
        cantidad: f.int({ minValue: 1, maxValue: 10 }),

        estado: f.valuesFromArray({
          values: [estadoLibroEnum.enumValues[0]],
        }),
        // The estado column has a default of "disponible", so it can be omitted.
      },
    },
  }));

  console.log("Libros seeded successfully!");
}
