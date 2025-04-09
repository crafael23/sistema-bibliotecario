"use client";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "~/components/ui/table";
import { Prestamo } from "~/app/admin/reportes/types";

interface PrestamosTableProps {
  prestamos: Prestamo[];
}

export function PrestamosTable({ prestamos }: PrestamosTableProps) {
  return (
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
        {prestamos.map((prestamo) => (
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
            <TableCell className="text-center">{prestamo.utilizado}</TableCell>
          </TableRow>
        ))}
        {prestamos.length === 0 && (
          <TableRow>
            <TableCell colSpan={5} className="h-24 text-center">
              No se encontraron préstamos.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
