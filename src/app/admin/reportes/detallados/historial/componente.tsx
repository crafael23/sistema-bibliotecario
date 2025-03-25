import { Label } from "@radix-ui/react-label";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "~/components/ui/table";
import { ComboboxUsuario } from "./select-usuario";

type Prestamo = {
  id: number;
  fechaPrestamo: string;
  estado: "activo" | "devuelto" | "vencido";
  libro: string;
  utilizado: number;
};

export type Usuario = {
  id: string;
  clerkId: string;
  email: string;
  creadoEn: Date;
  tipoDeUsuario: string;
};

type UsuarioPageProps = {
  prestamosPorUsuario: Prestamo[];
  usuarios: Usuario[];
  usuarioElegido: string | undefined;
};

export default function PrestamosUsuarioPage({
  prestamosPorUsuario,
  usuarios,
}: UsuarioPageProps) {
  return (
    <>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Préstamos del Usuario: USR-8891</CardTitle>
          <CardDescription>
            Análisis de comportamiento individual - Marzo 2025
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex gap-4">
            <div className="w-full max-w-sm">
              <Label htmlFor="usuario">Buscar otro usuario</Label>
              <div className="mt-1 flex gap-2">
                <ComboboxUsuario usuarios={usuarios} />
                <Button>Buscar</Button>
              </div>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Préstamo ID</TableHead>
                <TableHead>Libro</TableHead>
                <TableHead>Fecha Préstamo</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-center">Días Utilizados</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {prestamosPorUsuario.map((prestamo) => (
                <TableRow key={prestamo.id}>
                  <TableCell className="font-medium">{prestamo.id}</TableCell>
                  <TableCell>{prestamo.libro}</TableCell>
                  <TableCell>
                    {new Date(prestamo.fechaPrestamo).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${
                        prestamo.estado === "devuelto"
                          ? "bg-green-100 text-green-800"
                          : prestamo.estado === "activo"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {prestamo.estado}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    {prestamo.utilizado}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Mostrando {prestamosPorUsuario.length} préstamos • Usuario: USR-8891
        </div>
        <Button>Exportar a Excel</Button>
      </div>
    </>
  );
}
