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
import { Badge } from "~/components/ui/badge";

// Datos de prueba para usuarios sin multas
const usuariosSinMultas = [
  {
    id: "USR-5501",
    email: "sofia@tech.com",
    reservas: 34,
    ultimaActividad: "2025-03-10",
  },
  {
    id: "USR-6723",
    email: "raul@invest.com",
    reservas: 29,
    ultimaActividad: "2025-02-28",
  },
  {
    id: "USR-8912",
    email: "manuel@correo.com",
    reservas: 22,
    ultimaActividad: "2025-03-15",
  },
];

export default function UsuariosSinMultasPage() {
  return (
    <div className="container py-10">
      <div className="mb-6 flex items-center">
        <Button variant="ghost" size="sm" asChild className="mr-4">
          <Link href="/admin/reportes">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Top Usuarios Sin Multas</h1>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Usuarios Activos Sin Multas (Último Año)</CardTitle>
          <CardDescription>
            Usuarios con 20 o más reservas y sin multas en el último año
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Usuario</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="text-center">Reservas</TableHead>
                <TableHead>Última Actividad</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usuariosSinMultas.map((usuario) => (
                <TableRow key={usuario.id}>
                  <TableCell className="font-medium">{usuario.id}</TableCell>
                  <TableCell>{usuario.email}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className="bg-green-50">
                      {usuario.reservas}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(usuario.ultimaActividad).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                      Excelente
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="mt-6 rounded-md border border-green-200 bg-green-50 p-4">
            <h3 className="mb-2 text-lg font-semibold text-green-800">
              Recomendación
            </h3>
            <p className="text-green-700">
              Estos usuarios demuestran un excelente comportamiento en el uso de
              la biblioteca. Considere implementar un programa de recompensas o
              beneficios especiales para incentivar este tipo de comportamiento
              en más usuarios.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Datos actualizados al 20 de marzo de 2025
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Enviar reconocimiento</Button>
          <Button>Exportar a Excel</Button>
        </div>
      </div>
    </div>
  );
}
