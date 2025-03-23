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
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "~/components/ui/table";
import { getBooks } from "~/server/db/queries";

export default async function ReporteDetalladoInventarioPage() {
  const inventarioLibros = await getBooks();

  return (
    <div className="container py-10">
      <div className="mb-6 flex items-center">
        <Button variant="ghost" size="sm" asChild className="mr-4">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Inventario Completo de Libros</h1>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Inventario - Marzo 2025</CardTitle>
          <CardDescription>
            Control físico y gestión de stock de libros en el sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-center">Cantidad</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventarioLibros.map((libro) => (
                <TableRow key={libro.id}>
                  <TableCell>{libro.nombre}</TableCell>
                  <TableCell>{libro.categoria}</TableCell>
                  <TableCell>
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${
                        libro.estado === "disponible"
                          ? "bg-green-100 text-green-800"
                          : libro.estado === "mantenimiento"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {libro.estado}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    {libro.cantidad}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Mostrando {inventarioLibros.length} libros • Actualizado: 20 de marzo
          de 2025
        </div>
        <Button>Exportar a Excel</Button>
      </div>
    </div>
  );
}
