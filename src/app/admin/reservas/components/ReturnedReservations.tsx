"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Info } from "lucide-react";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { ReservationDetailsDialog } from "./ReservationDetailsDialog";
import type {
  ReservacionWithDetails,
  PaginatedReservaciones,
} from "../actions";

interface ReturnedReservationsProps {
  initialData: PaginatedReservaciones;
  searchQuery: string;
}

export function ReturnedReservations({
  initialData,
  searchQuery,
}: ReturnedReservationsProps) {
  const [reservations, setReservations] =
    useState<PaginatedReservaciones>(initialData);
  const [selectedReservation, setSelectedReservation] =
    useState<ReservacionWithDetails | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  // Update the reservations when search query changes
  useEffect(() => {
    if (searchQuery) {
      // We would fetch filtered results here based on searchQuery
      // For now, just filter the client-side data
      const filtered = {
        ...initialData,
        items: initialData.items.filter(
          (res) =>
            res.usuario.nombre
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            res.libro.nombre
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            (res.codigoReferencia?.toLowerCase() ?? "").includes(
              searchQuery.toLowerCase(),
            ),
        ),
      };
      setReservations(filtered);
    } else {
      setReservations(initialData);
    }
  }, [searchQuery, initialData]);

  const handleViewDetails = useCallback(
    (reservation: ReservacionWithDetails) => {
      setSelectedReservation(reservation);
      setShowDetailsDialog(true);
    },
    [],
  );

  return (
    <>
      {/* Desktop view */}
      <div className="hidden sm:block">
        <Card className="bg-gray-100 shadow-md">
          <CardContent className="p-0">
            <div className="w-full overflow-x-auto">
              <Table className="w-full min-w-[800px]">
                <TableHeader className="bg-gray-200">
                  <TableRow>
                    <TableHead>ID Reserva</TableHead>
                    <TableHead>Usuario</TableHead>
                    <TableHead>Libro</TableHead>
                    <TableHead>Fecha de Entrega</TableHead>
                    <TableHead>Fecha de Devolución</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reservations.items.length > 0 ? (
                    reservations.items.map((reservation) => (
                      <TableRow key={reservation.id}>
                        <TableCell>
                          {reservation.codigoReferencia ??
                            `R-${reservation.id}`}
                        </TableCell>
                        <TableCell>{reservation.usuario.nombre}</TableCell>
                        <TableCell>{reservation.libro.nombre}</TableCell>
                        <TableCell>
                          {reservation.prestamo.fechaPrestamo
                            ? format(
                                parseISO(reservation.prestamo.fechaPrestamo),
                                "dd/MM/yyyy",
                                { locale: es },
                              )
                            : "No disponible"}
                        </TableCell>
                        <TableCell>
                          {reservation.prestamo.fechaDevolucion
                            ? format(
                                parseISO(reservation.prestamo.fechaDevolucion),
                                "dd/MM/yyyy",
                                { locale: es },
                              )
                            : "No disponible"}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="border-green-300 bg-green-100 text-green-800"
                          >
                            Devuelto
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8"
                            onClick={() => handleViewDetails(reservation)}
                          >
                            <Info className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="py-10 text-center">
                        {searchQuery
                          ? "No se encontraron entregas recibidas que coincidan con la búsqueda."
                          : "No hay entregas recibidas."}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mobile view */}
      <div className="space-y-4 sm:hidden">
        {reservations.items.length > 0 ? (
          reservations.items.map((reservation) => (
            <Card
              key={reservation.id}
              className="overflow-hidden bg-white shadow"
            >
              <CardContent className="p-4">
                <div className="mb-3 flex items-center justify-between">
                  <Badge
                    variant="outline"
                    className="border-green-300 bg-green-100 text-green-800"
                  >
                    Devuelto
                  </Badge>
                  <span className="text-xs font-medium text-gray-500">
                    ID: {reservation.codigoReferencia ?? `R-${reservation.id}`}
                  </span>
                </div>

                <div className="mb-4 space-y-2 text-sm">
                  <div className="grid grid-cols-3 gap-1">
                    <span className="font-medium text-gray-500">Usuario:</span>
                    <span className="col-span-2">
                      {reservation.usuario.nombre}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    <span className="font-medium text-gray-500">Libro:</span>
                    <span className="col-span-2">
                      {reservation.libro.nombre}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    <span className="font-medium text-gray-500">Entrega:</span>
                    <span className="col-span-2">
                      {reservation.prestamo.fechaPrestamo
                        ? format(
                            parseISO(reservation.prestamo.fechaPrestamo),
                            "dd/MM/yyyy",
                            { locale: es },
                          )
                        : "No disponible"}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    <span className="font-medium text-gray-500">
                      Devolución:
                    </span>
                    <span className="col-span-2">
                      {reservation.prestamo.fechaDevolucion
                        ? format(
                            parseISO(reservation.prestamo.fechaDevolucion),
                            "dd/MM/yyyy",
                            { locale: es },
                          )
                        : "No disponible"}
                    </span>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleViewDetails(reservation)}
                  >
                    <Info className="h-4 w-4" />
                    <span className="ml-1">Detalles</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="py-8 text-center text-sm text-gray-500">
            {searchQuery
              ? "No se encontraron entregas recibidas que coincidan con la búsqueda."
              : "No hay entregas recibidas."}
          </div>
        )}
      </div>

      {/* Dialogs */}
      {selectedReservation && (
        <ReservationDetailsDialog
          open={showDetailsDialog}
          onOpenChange={setShowDetailsDialog}
          reservation={selectedReservation}
        />
      )}
    </>
  );
}
