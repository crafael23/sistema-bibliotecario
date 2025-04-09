"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Movimiento } from "~/app/admin/reportes/types";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Filter, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { Button } from "~/components/ui/button";

interface MovimientosTableProps {
  movimientos: Movimiento[];
}

export function MovimientosTable({ movimientos }: MovimientosTableProps) {
  const [filteredTipo, setFilteredTipo] = useState<string | null>(null);

  const filteredMovimientos = filteredTipo
    ? movimientos.filter((m) => m.tipo === filteredTipo)
    : movimientos;

  // Function to format date nicely
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // Badge color based on movement type
  const getBadgeStyle = (tipo: string) => {
    switch (tipo) {
      case "Reserva":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "Préstamo":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "Devolución":
        return "bg-purple-100 text-purple-800 hover:bg-purple-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">Movimientos</CardTitle>
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 gap-1">
                      <Filter className="h-4 w-4" />
                      {filteredTipo ?? "Todos"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Filtrar por tipo</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setFilteredTipo(null)}>
                      Todos
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setFilteredTipo("Reserva")}
                    >
                      Reserva
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setFilteredTipo("Préstamo")}
                    >
                      Préstamo
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setFilteredTipo("Devolución")}
                    >
                      Devolución
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TooltipTrigger>
              <TooltipContent>
                <p>Filtrar por tipo de movimiento</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead className="hidden md:table-cell">Usuario</TableHead>
                <TableHead className="hidden md:table-cell">Detalle</TableHead>
                <TableHead className="md:hidden"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMovimientos.length > 0 ? (
                filteredMovimientos.map((movimiento) => (
                  <TableRow key={movimiento.id}>
                    <TableCell className="font-medium">
                      {formatDate(movimiento.fecha)}
                    </TableCell>
                    <TableCell>
                      <Badge className={getBadgeStyle(movimiento.tipo)}>
                        {movimiento.tipo}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {movimiento.usuario}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {movimiento.detalle}
                    </TableCell>
                    <TableCell className="md:hidden">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Abrir menú</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Detalles</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="flex flex-col items-start">
                            <span className="font-semibold">Usuario:</span>
                            <span className="text-sm">
                              {movimiento.usuario}
                            </span>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="flex flex-col items-start">
                            <span className="font-semibold">Detalle:</span>
                            <span className="text-sm">
                              {movimiento.detalle}
                            </span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-24 text-center text-muted-foreground"
                  >
                    {movimientos.length === 0
                      ? "No se encontraron movimientos para este libro."
                      : "No se encontraron movimientos con el filtro seleccionado."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
