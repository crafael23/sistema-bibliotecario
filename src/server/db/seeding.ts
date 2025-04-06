"use server";

import { libro, libroCopia } from "./schema"; // Asegúrate de que la ruta a tu archivo de esquema sea correcta
import { db } from ".";

// Función generadora de código para libros según la documentación
function generarCodigoLibro(
  categoria: string,
  autor: string,
  edicion: number,
): string {
  // Extraer primeras 3 letras de la categoría
  const catPrefix = categoria.substring(0, 3).toUpperCase();

  // Extraer primeras 3 letras del apellido del autor
  // Asumimos que el último nombre es el apellido
  const apellido = autor.split(" ").pop() ?? autor;
  const autorPrefix = apellido.substring(0, 3).toUpperCase();

  // Últimos 2 dígitos del año de edición
  const edicionSuffix = String(edicion).substring(String(edicion).length - 2);

  return `${catPrefix}-${autorPrefix}-${edicionSuffix}`;
}

// Función generadora de localización para copias de libros
function generarLocalizacion(): string {
  // AAA-BBB-CCC
  // AAA: Número de estantería (001-999)
  // BBB: Número de estante (001-999)
  // CCC: Posición en el estante (001-999)
  const estanteria = String(Math.floor(Math.random() * 999) + 1).padStart(
    3,
    "0",
  );
  const estante = String(Math.floor(Math.random() * 999) + 1).padStart(3, "0");
  const posicion = String(Math.floor(Math.random() * 999) + 1).padStart(3, "0");

  return `${estanteria}-${estante}-${posicion}`;
}

// Datos de ejemplo para libros
const librosData = [
  {
    nombre: "Cien años de soledad",
    categoria: "Novela",
    autor: "Gabriel García Márquez",
    isbn: "978-0307474728",
    edicion: 2017,
    descripcion:
      "La obra maestra de García Márquez que narra la historia de la familia Buendía en el pueblo ficticio de Macondo.",
    editorial: "Vintage Español",
    urlImagenPortada:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=2787&auto=format&fit=crop",
    copias: Math.floor(Math.random() * 6) + 3,
  },
  {
    nombre: "El señor de los anillos: La comunidad del anillo",
    categoria: "Fantasía",
    autor: "J.R.R. Tolkien",
    isbn: "978-8445073735",
    edicion: 2019,
    descripcion:
      "Primera parte de la trilogía que narra la aventura de Frodo Bolsón para destruir el Anillo Único.",
    editorial: "Minotauro",
    urlImagenPortada:
      "https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?q=80&w=2940&auto=format&fit=crop",
    copias: Math.floor(Math.random() * 6) + 3,
  },
  {
    nombre: "Algoritmos de programación",
    categoria: "Informática",
    autor: "Luis Joyanes Aguilar",
    isbn: "978-8448156220",
    edicion: 2008,
    descripcion:
      "Libro de texto que cubre los fundamentos de algoritmos y estructuras de datos.",
    editorial: "McGraw-Hill",
    urlImagenPortada:
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=2938&auto=format&fit=crop",
    copias: Math.floor(Math.random() * 6) + 3,
  },
  {
    nombre: "Breve historia del tiempo",
    categoria: "Ciencia",
    autor: "Stephen Hawking",
    isbn: "978-0553380163",
    edicion: 1998,
    descripcion:
      "Exploración accesible de las teorías cosmológicas modernas, desde el Big Bang hasta los agujeros negros.",
    editorial: "Crítica",
    urlImagenPortada:
      "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=2787&auto=format&fit=crop",
    copias: Math.floor(Math.random() * 6) + 3,
  },
  {
    nombre: "El principito",
    categoria: "Literatura",
    autor: "Antoine de Saint-Exupéry",
    isbn: "978-8478887194",
    edicion: 2001,
    descripcion:
      "Relato poético que aborda temas profundos sobre la vida y la naturaleza humana.",
    editorial: "Salamandra",
    urlImagenPortada:
      "https://images.unsplash.com/photo-1603289847962-9e48b33f0b8b?q=80&w=2787&auto=format&fit=crop",
    copias: Math.floor(Math.random() * 6) + 3,
  },
  {
    nombre: "Cálculo: Una variable",
    categoria: "Matemáticas",
    autor: "James Stewart",
    isbn: "978-6075266091",
    edicion: 2018,
    descripcion:
      "Texto exhaustivo sobre cálculo diferencial e integral de una variable.",
    editorial: "Cengage Learning",
    urlImagenPortada:
      "https://images.unsplash.com/photo-1565116175827-64847f972a3f?q=80&w=2787&auto=format&fit=crop",
    copias: Math.floor(Math.random() * 6) + 3,
  },
  {
    nombre: "1984",
    categoria: "Ciencia ficción",
    autor: "George Orwell",
    isbn: "978-8499890944",
    edicion: 2013,
    descripcion:
      "Novela distópica que presenta una sociedad totalitaria vigilada por el Gran Hermano.",
    editorial: "Debolsillo",
    urlImagenPortada:
      "https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=2788&auto=format&fit=crop",
    copias: Math.floor(Math.random() * 6) + 3,
  },
  {
    nombre: "El Alquimista",
    categoria: "Novela",
    autor: "Paulo Coelho",
    isbn: "978-0062511409",
    edicion: 2014,
    descripcion:
      "Historia sobre un joven pastor andaluz que viaja a Egipto tras un sueño recurrente.",
    editorial: "HarperOne",
    urlImagenPortada:
      "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=2942&auto=format&fit=crop",
    copias: Math.floor(Math.random() * 6) + 3,
  },
  {
    nombre: "Fundamentos de bases de datos",
    categoria: "Informática",
    autor: "Abraham Silberschatz",
    isbn: "978-8448190330",
    edicion: 2014,
    descripcion:
      "Libro de texto sobre los conceptos fundamentales de las bases de datos.",
    editorial: "McGraw-Hill",
    urlImagenPortada:
      "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=2944&auto=format&fit=crop",
    copias: Math.floor(Math.random() * 6) + 3,
  },
  {
    nombre: "Don Quijote de la Mancha",
    categoria: "Clásico",
    autor: "Miguel de Cervantes",
    isbn: "978-8420412146",
    edicion: 2015,
    descripcion:
      "Obra cumbre de la literatura española que narra las aventuras del ingenioso hidalgo Don Quijote.",
    editorial: "Alfaguara",
    urlImagenPortada:
      "https://images.unsplash.com/photo-1592496001020-d31bd830651f?q=80&w=2782&auto=format&fit=crop",
    copias: Math.floor(Math.random() * 6) + 3,
  },
  {
    nombre: "Crimen y castigo",
    categoria: "Novela",
    autor: "Fiódor Dostoyevski",
    isbn: "978-8420682334",
    edicion: 2016,
    descripcion:
      "Novela que explora la psicología de un joven universitario que comete un asesinato.",
    editorial: "Alianza",
    urlImagenPortada:
      "https://images.unsplash.com/photo-1591588582259-e675bd2e6088?q=80&w=2832&auto=format&fit=crop",
    copias: Math.floor(Math.random() * 6) + 3,
  },
  {
    nombre: "El Hobbit",
    categoria: "Fantasía",
    autor: "J.R.R. Tolkien",
    isbn: "978-8445073803",
    edicion: 2012,
    descripcion:
      "Relato que precede a El Señor de los Anillos, donde Bilbo Bolsón emprende una aventura inesperada.",
    editorial: "Minotauro",
    urlImagenPortada:
      "https://images.unsplash.com/photo-1618666012174-83b441c0bc76?q=80&w=2787&auto=format&fit=crop",
    copias: Math.floor(Math.random() * 6) + 3,
  },
  {
    nombre: "Física Universitaria",
    categoria: "Ciencia",
    autor: "Hugh D. Young",
    isbn: "978-9702615880",
    edicion: 2013,
    descripcion:
      "Libro de texto exhaustivo para cursos introductorios de física en nivel universitario.",
    editorial: "Pearson",
    urlImagenPortada:
      "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=2730&auto=format&fit=crop",
    copias: Math.floor(Math.random() * 6) + 3,
  },
  {
    nombre: "Rayuela",
    categoria: "Novela",
    autor: "Julio Cortázar",
    isbn: "978-8420406794",
    edicion: 2008,
    descripcion:
      "Novela experimental que puede leerse en diferentes órdenes según las preferencias del lector.",
    editorial: "Alfaguara",
    urlImagenPortada:
      "https://images.unsplash.com/photo-1535905557558-afc4877a26fc?q=80&w=2787&auto=format&fit=crop",
    copias: Math.floor(Math.random() * 6) + 3,
  },
  {
    nombre: "El Arte de la Guerra",
    categoria: "Estrategia",
    autor: "Sun Tzu",
    isbn: "978-8441426917",
    edicion: 2011,
    descripcion:
      "Antiguo tratado militar chino, considerado el mejor libro de estrategia de todos los tiempos.",
    editorial: "EDAF",
    urlImagenPortada:
      "https://images.unsplash.com/photo-1505664194779-8beaceb93744?q=80&w=2940&auto=format&fit=crop",
    copias: Math.floor(Math.random() * 6) + 3,
  },
  {
    nombre: "Clean Code",
    categoria: "Informática",
    autor: "Robert C. Martin",
    isbn: "978-0132350884",
    edicion: 2008,
    descripcion:
      "Guía para escribir código limpio, mantenible y eficiente en el desarrollo de software.",
    editorial: "Prentice Hall",
    urlImagenPortada:
      "https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=2940&auto=format&fit=crop",
    copias: Math.floor(Math.random() * 6) + 3,
  },
  {
    nombre: "Mujercitas",
    categoria: "Novela",
    autor: "Louisa May Alcott",
    isbn: "978-8491051725",
    edicion: 2016,
    descripcion:
      "Historia de cuatro hermanas que crecen durante la Guerra Civil estadounidense.",
    editorial: "Penguin Clásicos",
    urlImagenPortada:
      "https://images.unsplash.com/photo-1519791883288-dc8bd696e667?q=80&w=2940&auto=format&fit=crop",
    copias: Math.floor(Math.random() * 6) + 3,
  },
  {
    nombre: "Estructura y diseño de computadores",
    categoria: "Informática",
    autor: "David A. Patterson",
    isbn: "978-8429126204",
    edicion: 2011,
    descripcion:
      "Texto completo sobre arquitectura de computadoras y diseño de hardware.",
    editorial: "Reverté",
    urlImagenPortada:
      "https://images.unsplash.com/photo-1563770557287-f39118ee621c?q=80&w=2940&auto=format&fit=crop",
    copias: Math.floor(Math.random() * 6) + 3,
  },
  {
    nombre: "Pedro Páramo",
    categoria: "Novela",
    autor: "Juan Rulfo",
    isbn: "978-8437600765",
    edicion: 2005,
    descripcion:
      "Novela que narra la búsqueda de un hijo por su padre en el pueblo fantasma de Comala.",
    editorial: "Cátedra",
    urlImagenPortada:
      "https://images.unsplash.com/photo-1532153955177-f59af40d6472?q=80&w=2940&auto=format&fit=crop",
    copias: Math.floor(Math.random() * 6) + 3,
  },
  {
    nombre: "El código Da Vinci",
    categoria: "Thriller",
    autor: "Dan Brown",
    isbn: "978-8408175650",
    edicion: 2018,
    descripcion:
      "Novela de misterio sobre una conspiración que involucra a La Última Cena de Leonardo da Vinci.",
    editorial: "Booket",
    urlImagenPortada:
      "https://images.unsplash.com/photo-1515098506762-79e1384e9d8e?q=80&w=2832&auto=format&fit=crop",
    copias: Math.floor(Math.random() * 6) + 3,
  },
  {
    nombre: "Álgebra Lineal",
    categoria: "Matemáticas",
    autor: "Stanley I. Grossman",
    isbn: "978-9701068175",
    edicion: 2012,
    descripcion:
      "Libro de texto completo sobre álgebra lineal, matrices y transformaciones lineales.",
    editorial: "McGraw-Hill",
    urlImagenPortada:
      "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2940&auto=format&fit=crop",
    copias: Math.floor(Math.random() * 6) + 3,
  },
  {
    nombre: "La Odisea",
    categoria: "Clásico",
    autor: "Homero",
    isbn: "978-8437627748",
    edicion: 2014,
    descripcion:
      "Poema épico griego que narra el regreso de Ulises a Ítaca después de la Guerra de Troya.",
    editorial: "Cátedra",
    urlImagenPortada:
      "https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=2874&auto=format&fit=crop",
    copias: Math.floor(Math.random() * 6) + 3,
  },
  {
    nombre: "JavaScript: The Good Parts",
    categoria: "Informática",
    autor: "Douglas Crockford",
    isbn: "978-0596517748",
    edicion: 2008,
    descripcion:
      "Guía que destaca las mejores características del lenguaje JavaScript.",
    editorial: "O'Reilly Media",
    urlImagenPortada:
      "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?q=80&w=2940&auto=format&fit=crop",
    copias: Math.floor(Math.random() * 6) + 3,
  },
  {
    nombre: "La sombra del viento",
    categoria: "Novela",
    autor: "Carlos Ruiz Zafón",
    isbn: "978-8408163800",
    edicion: 2016,
    descripcion:
      "Novela que transcurre en la Barcelona posterior a la Guerra Civil Española.",
    editorial: "Planeta",
    urlImagenPortada:
      "https://images.unsplash.com/photo-1470549638415-0a0755be0619?q=80&w=2848&auto=format&fit=crop",
    copias: Math.floor(Math.random() * 6) + 3,
  },
  {
    nombre: "Biología de Campbell",
    categoria: "Ciencia",
    autor: "Neil A. Campbell",
    isbn: "978-9500694193",
    edicion: 2017,
    descripcion:
      "Libro de texto completo sobre biología para estudiantes universitarios.",
    editorial: "Médica Panamericana",
    urlImagenPortada:
      "https://images.unsplash.com/photo-1530213786676-41ad9f7736f6?q=80&w=2970&auto=format&fit=crop",
    copias: Math.floor(Math.random() * 6) + 3,
  },
  {
    nombre: "Hamlet",
    categoria: "Teatro",
    autor: "William Shakespeare",
    isbn: "978-8437633169",
    edicion: 2015,
    descripcion:
      "Tragedia que narra la venganza del príncipe Hamlet por el asesinato de su padre.",
    editorial: "Cátedra",
    urlImagenPortada:
      "https://images.unsplash.com/photo-1609620520105-67de669284d9?q=80&w=2940&auto=format&fit=crop",
    copias: Math.floor(Math.random() * 6) + 3,
  },
  {
    nombre: "Design Patterns",
    categoria: "Informática",
    autor: "Erich Gamma",
    isbn: "978-0201633610",
    edicion: 1994,
    descripcion:
      "Libro que cataloga y explica patrones de diseño en programación orientada a objetos.",
    editorial: "Addison-Wesley Professional",
    urlImagenPortada:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=2834&auto=format&fit=crop",
    copias: Math.floor(Math.random() * 6) + 3,
  },
  {
    nombre: "La metamorfosis",
    categoria: "Novela",
    autor: "Franz Kafka",
    isbn: "978-8420651361",
    edicion: 2012,
    descripcion:
      "Relato que narra la transformación de Gregorio Samsa en un monstruoso insecto.",
    editorial: "Alianza",
    urlImagenPortada:
      "https://images.unsplash.com/photo-1551265881-36bbe529ae1e?q=80&w=2787&auto=format&fit=crop",
    copias: Math.floor(Math.random() * 6) + 3,
  },
  {
    nombre: "Química Orgánica",
    categoria: "Ciencia",
    autor: "John McMurry",
    isbn: "978-6074816198",
    edicion: 2012,
    descripcion:
      "Libro de texto completo sobre química orgánica para estudiantes universitarios.",
    editorial: "Cengage Learning",
    urlImagenPortada:
      "https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?q=80&w=2940&auto=format&fit=crop",
    copias: Math.floor(Math.random() * 6) + 3,
  },
  {
    nombre: "Harry Potter y la piedra filosofal",
    categoria: "Fantasía",
    autor: "J.K. Rowling",
    isbn: "978-8478884957",
    edicion: 2015,
    descripcion:
      "Primera novela de la serie que narra las aventuras del joven mago Harry Potter.",
    editorial: "Salamandra",
    urlImagenPortada:
      "https://images.unsplash.com/photo-1600189261867-30e5ffe7b8da?q=80&w=2787&auto=format&fit=crop",
    copias: Math.floor(Math.random() * 6) + 3,
  },
];

// Función principal para sembrar la base de datos
async function sembrarLibros() {
  try {
    console.log("Comenzando a sembrar libros...");
    const librosInsertados = [];

    // Insertar libros
    for (const libroData of librosData) {
      const codigo = generarCodigoLibro(
        libroData.categoria,
        libroData.autor,
        libroData.edicion,
      );

      const [libroInsertado] = await db
        .insert(libro)
        .values({
          codigo,
          nombre: libroData.nombre,
          categoria: libroData.categoria,
          autor: libroData.autor,
          isbn: libroData.isbn,
          edicion: libroData.edicion,
          descripcion: libroData.descripcion,
          editorial: libroData.editorial,
          urlImagenPortada: libroData.urlImagenPortada,
        })
        .returning();

      if (libroInsertado) {
        librosInsertados.push({
          libroId: libroInsertado.id,
          copias: libroData.copias,
        });
      }
    }

    console.log(`${librosInsertados.length} libros insertados correctamente.`);

    // Insertar copias de libros
    let totalCopias = 0;
    for (const libro of librosInsertados) {
      for (let i = 0; i < libro.copias; i++) {
        await db.insert(libroCopia).values({
          localizacion: generarLocalizacion(),
          estado: "disponible", // Todas las copias están disponibles inicialmente
          libroId: libro.libroId,
        });
        totalCopias++;
      }
    }

    console.log(`${totalCopias} copias de libros insertadas correctamente.`);
    console.log("Proceso de siembra completado con éxito.");
  } catch (error) {
    console.error("Error al sembrar la base de datos:", error);
    throw error;
  }
}

// Exportar la función de siembra
export { sembrarLibros };
