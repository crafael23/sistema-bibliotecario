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

// Datos de prueba para multas pendientes
const multasPendientes = [
  {
    id: 3321,
    usuario: "maria@uni.edu",
    libro: "El Principito",
    monto: 12.5,
    diasRetraso: 23,
  },
  {
    id: 3323,
    usuario: "ana@mail.net",
    libro: "Dune",
    monto: 9.75,
    diasRetraso: 15,
  },
  {
    id: 3325,
    usuario: "carlos@estudiante.org",
    libro: "Cálculo Diferencial",
    monto: 15.25,
    diasRetraso: 30,
  },
  {
    id: 3327,
    usuario: "roberto@gmail.com",
    libro: "Historia del Arte",
    monto: 8.5,
    diasRetraso: 17,
  },
  {
    id: 3329,
    usuario: "laura@hotmail.com",
    libro: "Programación en Java",
    monto: 20.0,
    diasRetraso: 40,
  },
];

export default function MultasPage() {
  return (
    <div className="container py-10">
      <div className="mb-6 flex items-center">
        <Button variant="ghost" size="sm" asChild className="mr-4">
          <Link href="/admin/reportes">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Multas Pendientes</h1>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Multas Pendientes - Marzo 2025</CardTitle>
          <CardDescription>
            Seguimiento de deudas activas por préstamos vencidos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Multa ID</TableHead>
                <TableHead>Usuario</TableHead>
                <TableHead>Libro</TableHead>
                <TableHead className="text-right">Monto</TableHead>
                <TableHead className="text-center">Días Retraso</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {multasPendientes.map((multa) => (
                <TableRow key={multa.id}>
                  <TableCell className="font-medium">{multa.id}</TableCell>
                  <TableCell>{multa.usuario}</TableCell>
                  <TableCell>{multa.libro}</TableCell>
                  <TableCell className="text-right">
                    ${multa.monto.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-center">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${
                        multa.diasRetraso <= 15
                          ? "bg-yellow-100 text-yellow-800"
                          : multa.diasRetraso <= 30
                            ? "bg-orange-100 text-orange-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {multa.diasRetraso} días
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
          Mostrando {multasPendientes.length} multas pendientes • Total: $
          {multasPendientes
            .reduce((sum, multa) => sum + multa.monto, 0)
            .toFixed(2)}
        </div>
        <Button>Exportar a Excel</Button>
      </div>
    </div>
  );
}
