import { getHistorialPrestamosUsuario } from "~/server/db/queries";
import PrestamosUsuarioPage from "./componente";
import { ArrowLeft } from "lucide-react";
import { Button } from "~/components/ui/button";
import { db } from "~/server/db";
import { usuario } from "~/server/db/schema";
import Link from "next/link";

export default async function HistorialUsuarioPage() {
  console.log("HistorialUsuarioPage");
  const reservas = await getHistorialPrestamosUsuario(
    "USR-0001",
    new Date(2024, 2),
  );

  const usuarios = await db.select().from(usuario);

  //TODO: Cambiar a usar el usuario actual //al principio tiene que no ser
  // ninguno y al elegir uno y darle buscar se tiene que hacer la llamada de
  // la base de datos correspondiente para que se muestre // el historial del
  // usuario elegido
  return (
    <div className="container py-10">
      <div className="mb-6 flex items-center">
        <Button variant="ghost" size="sm" asChild className="mr-4">
          <Link href="/admin/reportes">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">
          Historial de Préstamos por Usuario
        </h1>
      </div>
      <div>
        <PrestamosUsuarioPage
          prestamosPorUsuario={reservas}
          usuarios={usuarios}
        />
      </div>
    </div>
  );
}
