import { Button } from "~/components/ui/button";
import { Book } from "lucide-react";
import Link from "next/link";
import { handleInitialAuthRouting } from "~/lib/auth-utils";
import SeedButton from "~/components/seed-button";
import SeedDemoButton from "~/components/seed-demo-button";
import { sembrarLibros } from "~/server/db/seeding";
import { generateAllDemoData } from "~/server/db/demo-data";

export default async function HomePage() {
  await handleInitialAuthRouting();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="text-center">
        <div className="mb-8 flex justify-center">
          <Book className="h-16 w-16 text-white" />
        </div>
        <h1 className="mb-6 text-4xl font-bold text-white">
          Sistema Bibliotecario
        </h1>
        <p className="mb-8 text-xl text-white">
          Bienvenido al sistema de gestión para bibliotecas
        </p>
        <div className="flex flex-col items-center gap-4">
          <div className="flex gap-2">
            <Link href="/admin">
              <Button className="bg-white text-black hover:bg-gray-100">
                Ir a la ruta de administrador
              </Button>
            </Link>
            <Link href="/homepage">
              <Button className="bg-white text-black hover:bg-gray-100">
                Ir a la ruta de usuario
              </Button>
            </Link>
          </div>

          <div className="mt-6 flex items-center">
            <SeedButton action={sembrarLibros} />
            <SeedDemoButton action={generateAllDemoData} />
          </div>

          <div className="mt-2 text-sm text-gray-300">
            <p>1. Genere libros primero con &ldquo;Generar Libros&rdquo;</p>
            <p>
              2. Luego genere datos de demostración para reportes con
              &ldquo;Generar datos de demo&rdquo;
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
