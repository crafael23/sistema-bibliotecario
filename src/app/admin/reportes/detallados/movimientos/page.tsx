import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

// Datos de prueba para movimientos de libros
const movimientosLibro = [
  {
    fecha: "2023-12-03",
    tipo: "Reserva",
    usuario: "luis@mail.com",
    detalle: "Duración: 7 días",
  },
  {
    fecha: "2023-12-03",
    tipo: "Préstamo",
    usuario: "luis@mail.com",
    detalle: "Responsable: admin@biblioteca.org",
  },
  {
    fecha: "2023-12-17",
    tipo: "Devolución",
    usuario: "luis@mail.com",
    detalle: "Responsable: maria@biblioteca.org",
  },
  {
    fecha: "2024-01-10",
    tipo: "Reserva",
    usuario: "ana@estudiante.edu",
    detalle: "Duración: 5 días",
  },
  {
    fecha: "2024-01-12",
    tipo: "Préstamo",
    usuario: "ana@estudiante.edu",
    detalle: "Responsable: admin@biblioteca.org",
  },
  {
    fecha: "2024-01-15",
    tipo: "Devolución",
    usuario: "ana@estudiante.edu",
    detalle: "Responsable: admin@biblioteca.org",
  },
  {
    fecha: "2024-02-20",
    tipo: "Reserva",
    usuario: "carlos@mail.com",
    detalle: "Duración: 10 días",
  },
  {
    fecha: "2024-02-22",
    tipo: "Préstamo",
    usuario: "carlos@mail.com",
    detalle: "Responsable: pedro@biblioteca.org",
  },
  {
    fecha: "2024-03-01",
    tipo: "Devolución",
    usuario: "carlos@mail.com",
    detalle: "Responsable: maria@biblioteca.org",
  },
];

export default function MovimientosLibroPage() {
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
          Registro de Movimientos de Libros
        </h1>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>
            Movimientos del Libro: &quot;Cien años de soledad&quot; (ID: 101)
          </CardTitle>
          <CardDescription>
            Trazabilidad completa de ejemplares - Historial de reservas,
            préstamos y devoluciones
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex flex-col gap-4 md:flex-row">
            <div className="w-full md:w-1/3">
              <Label htmlFor="libro">Buscar otro libro</Label>
              <div className="mt-1 flex gap-2">
                <Input id="libro" placeholder="ID o nombre del libro" />
                <Button>Buscar</Button>
              </div>
            </div>
            <div className="w-full md:w-1/3">
              <Label htmlFor="periodo">Periodo</Label>
              <Select defaultValue="2023">
                <SelectTrigger id="periodo">
                  <SelectValue placeholder="Seleccionar periodo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="2025">2025</SelectItem>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mb-6 rounded-md border border-amber-200 bg-amber-50 p-4">
            <div className="flex flex-col justify-between md:flex-row">
              <div>
                <h3 className="font-semibold text-amber-800">
                  Información del libro
                </h3>
                <p className="mt-1 text-sm text-amber-700">
                  Categoría: Literatura | Estado actual: Disponible
                </p>
              </div>
              <div className="mt-2 md:mt-0">
                <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                  8 ejemplares disponibles
                </span>
              </div>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Tipo Movimiento</TableHead>
                <TableHead>Usuario</TableHead>
                <TableHead>Detalle</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {movimientosLibro.map((movimiento, index) => (
                <TableRow key={index}>
                  <TableCell>
                    {new Date(movimiento.fecha).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${
                        movimiento.tipo === "Reserva"
                          ? "bg-blue-100 text-blue-800"
                          : movimiento.tipo === "Préstamo"
                            ? "bg-green-100 text-green-800"
                            : "bg-purple-100 text-purple-800"
                      }`}
                    >
                      {movimiento.tipo}
                    </span>
                  </TableCell>
                  <TableCell>{movimiento.usuario}</TableCell>
                  <TableCell>{movimiento.detalle}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Mostrando {movimientosLibro.length} movimientos • Libro ID: 101
        </div>
        <div className="flex gap-2">
          <Button>Exportar a PDF</Button>
          <Button>Exportar a Excel</Button>
        </div>
      </div>
    </div>
  );
}
