"use server";

import { db } from ".";
import {
  usuario,
  tipoDeUsuarioEnum,
  reservacion,
  prestamo,
  multa,
  estadoPrestamoEnum,
  estadoMultaEnum,
  libroCopia,
  libro,
} from "./schema";
import { cifraridentidad } from "~/lib/random-utils";
import { format, addDays, eachDayOfInterval, isSameDay } from "date-fns";
import { eq, sql } from "drizzle-orm";

// Helper function to generate a random date between start and end dates
function randomDate(start: Date, end: Date): Date {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime()),
  );
}

// Helper function to format date as YYYY-MM-DD
function formatDate(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

// Generate a random mnemonic code for reservations
function generateCodigoReferencia(type: string, num: number): string {
  const typeCode = type.substring(0, 3).toUpperCase();
  const numberPart = num.toString().padStart(3, "0");
  return `${typeCode}${numberPart}`;
}

// Generate a category code for fines based on amount
function generateCategoriaMulta(amount: number): string {
  if (amount <= 10) return "M1"; // Multas menores (0.01 - 10.00)
  if (amount <= 50) return "M2"; // Multas intermedias (10.01 - 50.00)
  if (amount <= 100) return "M3"; // Multas mayores (50.01 - 100.00)
  return "M4"; // Multas graves (>100.00)
}

// Generate random fine reason
function generateMultaReason(): string {
  const reasons = [
    "Devolución tardía",
    "Daño al material",
    "Pérdida parcial",
    "Subrayado en páginas",
    "Manchas en el libro",
    "Páginas dobladas",
    "Cubierta dañada",
    "Etiqueta removida",
    "Código de barras dañado",
    "Retraso en renovación",
  ];
  return reasons[Math.floor(Math.random() * reasons.length)]!;
}

// Demo users data
const demoUsers = [
  {
    clerkId: "user_01",
    nombre: "Ana Martínez",
    email: "ana.martinez@example.com",
    telefono: "9512-3456",
    direccion: "Calle Principal 123, Tegucigalpa",
    identidad: "0801-1992-12345",
    tipoDeUsuario: "estudiantes",
    reservationFrequency: 0.8, // High frequency of reservations
    lateReturnRate: 0.6, // Increased late return rate
  },
  {
    clerkId: "user_02",
    nombre: "Carlos López",
    email: "carlos.lopez@example.com",
    telefono: "9523-7890",
    direccion: "Avenida Central 456, San Pedro Sula",
    identidad: "0501-1989-67890",
    tipoDeUsuario: "docentes",
    reservationFrequency: 0.6,
    lateReturnRate: 0.4, // Increased late return rate
  },
  {
    clerkId: "user_03",
    nombre: "María Rodríguez",
    email: "maria.rodriguez@example.com",
    telefono: "9534-1234",
    direccion: "Boulevard Morazán 789, Tegucigalpa",
    identidad: "0801-1995-54321",
    tipoDeUsuario: "estudiantes",
    reservationFrequency: 0.7,
    lateReturnRate: 0.5, // Increased late return rate
  },
  {
    clerkId: "user_04",
    nombre: "Juan Pérez",
    email: "juan.perez@example.com",
    telefono: "9545-6789",
    direccion: "Colonia Palmira 012, Tegucigalpa",
    identidad: "0801-1985-09876",
    tipoDeUsuario: "docentes",
    reservationFrequency: 0.5,
    lateReturnRate: 0.3, // Increased late return rate
  },
  {
    clerkId: "user_05",
    nombre: "Lucía Hernández",
    email: "lucia.hernandez@example.com",
    telefono: "9556-2345",
    direccion: "Colonia Kennedy 345, Tegucigalpa",
    identidad: "0801-1997-24680",
    tipoDeUsuario: "estudiantes",
    reservationFrequency: 0.9,
    lateReturnRate: 0.7, // Increased late return rate
  },
  {
    clerkId: "user_06",
    nombre: "Roberto Mendoza",
    email: "roberto.mendoza@example.com",
    telefono: "9567-8901",
    direccion: "Barrio El Centro 678, La Ceiba",
    identidad: "0101-1990-13579",
    tipoDeUsuario: "externos",
    reservationFrequency: 0.3,
    lateReturnRate: 0.8, // Increased late return rate
  },
  {
    clerkId: "user_07",
    nombre: "Sofia Torres",
    email: "sofia.torres@example.com",
    telefono: "9578-3456",
    direccion: "Residencial Las Uvas 901, San Pedro Sula",
    identidad: "0501-1993-97531",
    tipoDeUsuario: "estudiantes",
    reservationFrequency: 0.8,
    lateReturnRate: 0.4, // Increased late return rate
  },
  {
    clerkId: "user_08",
    nombre: "Manuel Reyes",
    email: "manuel.reyes@example.com",
    telefono: "9589-7890",
    direccion: "Colonia Miraflores 234, Tegucigalpa",
    identidad: "0801-1987-86420",
    tipoDeUsuario: "estudiantes",
    reservationFrequency: 0.7,
    lateReturnRate: 0.5, // Increased late return rate
  },
  {
    clerkId: "user_09",
    nombre: "Laura Paz",
    email: "laura.paz@example.com",
    telefono: "9590-1234",
    direccion: "Colonia Lomas del Guijarro 567, Tegucigalpa",
    identidad: "0801-1994-31415",
    tipoDeUsuario: "estudiantes",
    reservationFrequency: 0.6,
    lateReturnRate: 0.6, // Increased late return rate
  },
  {
    clerkId: "user_10",
    nombre: "Raúl Mejía",
    email: "raul.mejia@example.com",
    telefono: "9501-5678",
    direccion: "Barrio La Leona 890, Tegucigalpa",
    identidad: "0801-1988-27182",
    tipoDeUsuario: "docentes",
    reservationFrequency: 0.5,
    lateReturnRate: 0.4, // Increased late return rate
  },
  // Biblioteca staff
  {
    clerkId: "staff_01",
    nombre: "Pedro Sánchez",
    email: "pedro.sanchez@biblioteca.edu",
    telefono: "9512-9876",
    direccion: "Colonia El Prado 123, Tegucigalpa",
    identidad: "0801-1980-16180",
    tipoDeUsuario: "bibliotecarios",
    reservationFrequency: 0,
    lateReturnRate: 0,
  },
  {
    clerkId: "staff_02",
    nombre: "Ana Torres",
    email: "ana.torres@biblioteca.edu",
    telefono: "9523-5432",
    direccion: "Residencial Plaza 456, Tegucigalpa",
    identidad: "0801-1982-33333",
    tipoDeUsuario: "bibliotecarios",
    reservationFrequency: 0,
    lateReturnRate: 0,
  },
];

// Generate demo users
export async function generateDemoUsers() {
  console.log("Generating demo users...");

  for (const userData of demoUsers) {
    // Check if user already exists
    const existingUser = await db.query.usuario.findFirst({
      where: (user, { eq }) => eq(user.clerkId, userData.clerkId),
    });

    if (!existingUser) {
      await db.insert(usuario).values({
        clerkId: userData.clerkId,
        nombre: userData.nombre,
        email: userData.email,
        telefono: userData.telefono,
        direccion: userData.direccion,
        identidad: cifraridentidad(userData.identidad),
        tipoDeUsuario:
          userData.tipoDeUsuario as (typeof tipoDeUsuarioEnum.enumValues)[number],
        nuevo: false,
      });
    }
  }

  console.log(`Demo users generated successfully.`);
}

// Generate demo reservations, loans and fines
export async function generateDemoReservationsAndLoans() {
  console.log("Generating demo reservations, loans, and fines...");

  // Date boundaries for our demo data (January to April 2025)
  const startDate = new Date(2025, 0, 1); // January 1, 2025
  const endDate = new Date(2025, 3, 8); // April 8, 2025 (today in demo)

  // Get all book copies and their related book info for use in reservations
  const bookCopies = await db.query.libroCopia.findMany({
    with: {
      libro: true,
    },
  });

  if (bookCopies.length === 0) {
    console.error(
      "No book copies found in the database. Please run the seeding script first.",
    );
    return;
  }

  // For each user, create multiple reservations based on their frequency
  let reservationCount = 0;
  let loanCount = 0;
  let fineCount = 0;

  // Exclude library staff from reservations
  const regularUsers = demoUsers.filter(
    (user) => user.tipoDeUsuario !== "bibliotecarios",
  );

  // Library staff for processing loans
  const staffUsers = demoUsers.filter(
    (user) => user.tipoDeUsuario === "bibliotecarios",
  );
  if (staffUsers.length === 0) {
    console.error(
      "No library staff users found. Please check the demo users data.",
    );
    return;
  }

  for (const user of regularUsers) {
    // Number of reservations to create for this user based on their frequency
    const numReservations =
      Math.floor(Math.random() * 10 * user.reservationFrequency) + 1;

    for (let i = 0; i < numReservations; i++) {
      // Get a random book copy
      const randomBookCopyIndex = Math.floor(Math.random() * bookCopies.length);
      const bookCopy = bookCopies[randomBookCopyIndex];

      if (!bookCopy?.libro) continue;

      // Create a reservation date (randomly between start and a week before end date)
      const reservationDate = randomDate(
        startDate,
        new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000),
      );

      // Determine reservation status and related dates
      const isReservationOld =
        reservationDate <
        new Date(endDate.getTime() - 14 * 24 * 60 * 60 * 1000);
      const reservationStatus: (typeof estadoPrestamoEnum.enumValues)[number] =
        "pendiente";

      // Insert the reservation
      const [newReservation] = await db
        .insert(reservacion)
        .values({
          codigoReferencia: generateCodigoReferencia(
            "LIB",
            reservationCount + 1,
          ),
          usuarioId: user.clerkId,
          libroId: bookCopy.libro.id,
          estado: reservationStatus,
        })
        .returning();

      reservationCount++;

      // For older reservations, create loans and potential fines
      if (isReservationOld && newReservation) {
        // Assign a random staff member to process the loan
        const randomStaffIndex = Math.floor(Math.random() * staffUsers.length);
        const staffMember = staffUsers[randomStaffIndex];

        // Skip if for some reason we don't have a staff member
        if (!staffMember) continue;

        // Loan date (1-3 days after reservation)
        const loanDate = addDays(
          reservationDate,
          Math.floor(Math.random() * 3) + 1,
        );

        // Due date (14 days after loan)
        const dueDate = addDays(loanDate, 14);

        // Determine if this user typically returns late based on their rate
        const isLateReturn = Math.random() < user.lateReturnRate;

        // Return date (on time or late)
        let returnDate: Date | null = null;
        let loanStatus: (typeof estadoPrestamoEnum.enumValues)[number] =
          "activo";

        if (dueDate < endDate) {
          if (isLateReturn) {
            // Late return (1-10 days late)
            returnDate = addDays(dueDate, Math.floor(Math.random() * 10) + 1);
            loanStatus = "vencido";
          } else {
            // On-time return (0-3 days before due date)
            returnDate = addDays(dueDate, -Math.floor(Math.random() * 4));
            loanStatus = "devuelto";
          }

          // If return date is after current date, set to null and keep as active
          if (returnDate > endDate) {
            returnDate = null;
            loanStatus = "activo";
          }
        }

        // Update reservation status based on loan status
        await db
          .update(reservacion)
          .set({
            estado: loanStatus,
          })
          .where(eq(reservacion.id, newReservation.id));

        // Insert the loan
        const [newLoan] = await db
          .insert(prestamo)
          .values({
            reservaId: newReservation.id,
            fechaPrestamo: formatDate(loanDate),
            fechaVencimiento: formatDate(dueDate),
            fechaDevolucion: returnDate ? formatDate(returnDate) : null,
            personalId: staffMember.clerkId,
            libroCopiaId: bookCopy.id,
          })
          .returning();

        loanCount++;

        // Create a fine for late returns
        if (loanStatus === "vencido" && returnDate && newLoan) {
          // Calculate fine amount based on days late (5 per day)
          const daysLate = Math.floor(
            (returnDate.getTime() - dueDate.getTime()) / (24 * 60 * 60 * 1000),
          );
          const fineAmount = daysLate * 5;

          // Most fines are pending
          const isPaid = Math.random() < 0.3;

          await db.insert(multa).values({
            usuarioId: user.clerkId,
            prestamoId: newLoan.id,
            monto: fineAmount.toString(), // Convert number to string for monto field
            estado: isPaid ? "pagado" : "pendiente",
            categoriaMulta: generateCategoriaMulta(fineAmount),
          });

          fineCount++;
        }

        // Add additional fines for various reasons (even for on-time returns)
        if (newLoan && Math.random() < 0.4) {
          // Generate an additional fine for book damage, etc.
          const additionalFineAmount = Math.floor(Math.random() * 100) + 10; // 10-110
          generateMultaReason(); // Just to use the function but discard the result

          // Most additional fines are pending
          const isPaid = Math.random() < 0.2;

          await db.insert(multa).values({
            usuarioId: user.clerkId,
            prestamoId: newLoan.id,
            monto: additionalFineAmount.toString(),
            estado: isPaid ? "pagado" : "pendiente",
            categoriaMulta: generateCategoriaMulta(additionalFineAmount),
          });

          fineCount++;
        }
      }
    }
  }

  console.log(
    `Generated ${reservationCount} reservations, ${loanCount} loans, and ${fineCount} fines.`,
  );
}

// Generate future reservations from April 8 to June 2025
// Each reservation will have a corresponding prestamo
export async function generateFutureReservations() {
  console.log("Generating future reservations (April 8 to June 2025)...");

  // Date boundaries for future reservations
  const startDate = new Date(2025, 3, 8); // April 8, 2025 (today in demo)
  const endDate = new Date(2025, 5, 30); // June 30, 2025

  // Get all books and book copies
  const books = await db.query.libro.findMany();

  if (books.length === 0) {
    console.error(
      "No books found in the database. Please run the seeding script first.",
    );
    return;
  }

  // Select 10 books to make completely unavailable during specific date ranges
  const popularBookIndices: number[] = [];
  while (
    popularBookIndices.length < 10 &&
    popularBookIndices.length < books.length
  ) {
    const randomIndex = Math.floor(Math.random() * books.length);
    if (!popularBookIndices.includes(randomIndex)) {
      popularBookIndices.push(randomIndex);
    }
  }

  // Generate unavailable date ranges for each popular book
  const unavailableDateRanges: Array<{
    bookId: number;
    bookName: string;
    startDate: Date;
    endDate: Date;
    days: Date[];
  }> = [];

  for (const index of popularBookIndices) {
    // Create 2-3 unavailable date ranges for each popular book
    const numRanges = Math.floor(Math.random() * 2) + 2; // 2-3 ranges

    for (let j = 0; j < numRanges; j++) {
      // Random start date between April and June
      const rangeStartDate = randomDate(startDate, new Date(2025, 5, 20));

      // Range length: 3-10 days
      const rangeDuration = Math.floor(Math.random() * 8) + 3; // 3-10 days
      const rangeEndDate = addDays(rangeStartDate, rangeDuration);

      // Ensure end date is not after June 30, 2025
      const adjustedEndDate = rangeEndDate > endDate ? endDate : rangeEndDate;

      const book = books[index];

      if (book?.id !== undefined) {
        unavailableDateRanges.push({
          bookId: book.id,
          bookName: book.nombre,
          startDate: rangeStartDate,
          endDate: adjustedEndDate,
          days: eachDayOfInterval({
            start: rangeStartDate,
            end: adjustedEndDate,
          }),
        });
      }
    }
  }

  console.log(
    `Created ${unavailableDateRanges.length} unavailable date ranges for ${popularBookIndices.length} popular books`,
  );

  // Exclude library staff from reservations
  const regularUsers = demoUsers.filter(
    (user) => user.tipoDeUsuario !== "bibliotecarios",
  );

  // For each book, get all its copies
  let reservationCount = 0;
  let prestamoCount = 0;

  // Create reservations and prestamos for unavailable date ranges (ensure all copies are reserved)
  for (const dateRange of unavailableDateRanges) {
    // Get all copies of this book
    const bookCopies = await db.query.libroCopia.findMany({
      where: (libroCopia, { eq }) => eq(libroCopia.libroId, dateRange.bookId),
    });

    if (bookCopies.length === 0) continue;

    console.log(
      `Making book "${dateRange.bookName}" unavailable from ${formatDate(dateRange.startDate)} to ${formatDate(dateRange.endDate)} (${bookCopies.length} copies)`,
    );

    // For each copy, create a reservation during this date range
    for (const bookCopy of bookCopies) {
      // Skip if bookCopy is undefined
      if (!bookCopy) continue;

      // Choose a random user
      const randomUserIndex = Math.floor(Math.random() * regularUsers.length);
      const user = regularUsers[randomUserIndex];

      if (!user) continue;

      // Insert the reservation
      const [newReservation] = await db
        .insert(reservacion)
        .values({
          codigoReferencia: generateCodigoReferencia(
            "FUT",
            reservationCount + 1,
          ),
          usuarioId: user.clerkId,
          libroId: dateRange.bookId,
          estado: "pendiente",
        })
        .returning();

      reservationCount++;

      if (newReservation) {
        // Calculate due date (14 days after reservation)
        const dueDate = addDays(dateRange.startDate, 14);

        // Create a corresponding prestamo (without personalId and fechaDevolucion)
        await db.insert(prestamo).values({
          reservaId: newReservation.id,
          fechaPrestamo: formatDate(dateRange.startDate),
          fechaVencimiento: formatDate(dueDate),
          fechaDevolucion: null, // Will be filled when the book is returned
          personalId: null, // Will be filled when the book is given to the user
          libroCopiaId: bookCopy.id,
        });

        prestamoCount++;
      }
    }
  }

  // Create some additional random future reservations
  const additionalReservations = 50; // Number of additional random reservations

  for (let i = 0; i < additionalReservations; i++) {
    // Choose a random book
    const randomBookIndex = Math.floor(Math.random() * books.length);
    const randomBook = books[randomBookIndex];

    if (!randomBook?.id) {
      i--;
      continue;
    }

    // Choose a random user
    const randomUserIndex = Math.floor(Math.random() * regularUsers.length);
    const user = regularUsers[randomUserIndex];

    if (!user) {
      i--;
      continue;
    }

    // Random reservation date
    const reservationDate = randomDate(startDate, endDate);

    // Check if this date falls within an unavailable range for this book
    const isUnavailableDate = unavailableDateRanges.some(
      (range) =>
        range.bookId === randomBook.id &&
        range.days.some((day) => isSameDay(day, reservationDate)),
    );

    // Skip if date is unavailable to avoid conflicts
    if (isUnavailableDate) {
      i--; // Try again
      continue;
    }

    // Find an available copy of this book
    const bookCopies = await db.query.libroCopia.findMany({
      where: (libroCopia, { eq }) => eq(libroCopia.libroId, randomBook.id),
    });

    if (bookCopies.length === 0) {
      i--;
      continue;
    }

    // Choose a random copy
    const randomCopyIndex = Math.floor(Math.random() * bookCopies.length);
    const bookCopy = bookCopies[randomCopyIndex];

    // If no book copy is available, skip this iteration
    if (!bookCopy) {
      continue;
    }

    // Insert the reservation
    const [newReservation] = await db
      .insert(reservacion)
      .values({
        codigoReferencia: generateCodigoReferencia("FUT", reservationCount + 1),
        usuarioId: user.clerkId,
        libroId: randomBook.id,
        estado: "pendiente",
      })
      .returning();

    reservationCount++;

    if (newReservation) {
      // Calculate due date (14 days after reservation)
      const dueDate = addDays(reservationDate, 14);

      // Create a corresponding prestamo (without personalId and fechaDevolucion)
      await db.insert(prestamo).values({
        reservaId: newReservation.id,
        fechaPrestamo: formatDate(reservationDate),
        fechaVencimiento: formatDate(dueDate),
        fechaDevolucion: null, // Will be filled when the book is returned
        personalId: null, // Will be filled when the book is given to the user
        libroCopiaId: bookCopy.id,
      });

      prestamoCount++;
    }
  }

  console.log(
    `Generated ${reservationCount} future reservations with ${prestamoCount} corresponding prestamos`,
  );
}

// Main function to generate all demo data
export async function generateAllDemoData() {
  try {
    await generateDemoUsers();
    await generateDemoReservationsAndLoans();
    await generateFutureReservations();
    return { success: true, message: "Demo data generated successfully" };
  } catch (error) {
    console.error("Error generating demo data:", error);
    return {
      success: false,
      message: `Error generating demo data: ${(error as Error).message}`,
    };
  }
}
