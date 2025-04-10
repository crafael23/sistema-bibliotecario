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

// Aquí se implementará la función getUsuariosSinMultas en producción
async function getTopUsuariosSinMultas() {
  // En producción, esta función haría una llamada a la base de datos:
  // return await db.query.usuario.findMany({...});

  // Por ahora, retornamos datos de prueba
  return [
    {
      id: "USR-5501",
      email: "sofia@tech.com",
      nombre: "Sofia García",
      reservas: 34,
      ultimaActividad: "2025-03-10",
    },
    {
      id: "USR-6723",
      email: "raul@invest.com",
      nombre: "Raul Mendez",
      reservas: 29,
      ultimaActividad: "2025-02-28",
    },
    {
      id: "USR-8912",
      email: "manuel@correo.com",
      nombre: "Manuel Sánchez",
      reservas: 22,
      ultimaActividad: "2025-03-15",
    },
  ];
}

export default async function UsuariosSinMultasPage() {
  const usuarios = await getTopUsuariosSinMultas();

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
                <TableHead>Nombre</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="text-center">Reservas</TableHead>
                <TableHead>Última Actividad</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usuarios.map((usuario) => (
                <TableRow key={usuario.id}>
                  <TableCell className="font-medium">{usuario.id}</TableCell>
                  <TableCell>{usuario.nombre}</TableCell>
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
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Datos actualizados al {new Date().toLocaleDateString("es-ES")}
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Enviar reconocimiento</Button>
          <Button>Exportar a Excel</Button>
        </div>
      </div>
    </div>
  );
}
