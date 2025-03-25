import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "~/components/ui/card";
import { getBooks } from "~/server/db/queries";
import { FilteredTable } from "./librot-table";

export default async function ReporteDetalladoInventarioPage() {
  const inventarioLibros = await getBooks();

  return (
    <div className="container py-10">
      <div className="mb-6 flex items-center">
        <Button variant="ghost" size="sm" asChild className="mr-4">
          <Link href="/admin/reportes">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Inventario Completo de Libros</h1>
      </div>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>
            Inventario - {new Date().toLocaleString("es-ES", { month: "long" })}{" "}
            {new Date().getFullYear()}
          </CardTitle>

          <CardDescription>
            Control físico y gestión de stock de libros en el sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FilteredTable books={inventarioLibros} />
        </CardContent>
      </Card>
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Mostrando {inventarioLibros.length} libros • Actualizado: 20 de marzo
          de 2025
        </div>
        <Button>Exportar a Excel</Button>
        <Button>Exportar a PDF</Button>
      </div>
    </div>
  );
}
