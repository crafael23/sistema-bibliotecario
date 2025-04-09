"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { type Multa } from "~/app/admin/reportes/types";

interface MultasTableProps {
  multas: Multa[];
}

export function MultasTable({ multas }: MultasTableProps) {
  // Calculate total sum of fines
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Código</TableHead>
            <TableHead>Usuario</TableHead>
            <TableHead>Teléfono</TableHead>
            <TableHead>Libro</TableHead>
            <TableHead className="text-right">Monto</TableHead>
            <TableHead className="text-center">Días Retraso</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {multas.map((multa) => (
            <TableRow key={multa.id}>
              <TableCell className="font-medium">{multa.codigo}</TableCell>
              <TableCell>{multa.usuario}</TableCell>
              <TableCell>{multa.telefono}</TableCell>
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
          {multas.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No se encontraron multas pendientes.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}
