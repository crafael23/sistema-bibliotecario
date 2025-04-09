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
import { Info, RotateCcw } from "lucide-react";
import { format, parseISO, isAfter } from "date-fns";
import { es } from "date-fns/locale";
import { ReturnBookDialog } from "./ReturnBookDialog";
import { ReservationDetailsDialog } from "./ReservationDetailsDialog";
import type {
  ReservacionWithDetails,
  PaginatedReservaciones,
} from "../actions";
import { useToast } from "~/components/ui/use-toast";

interface ActiveReservationsProps {
  initialData: PaginatedReservaciones;
  searchQuery: string;
}

export function ActiveReservations({
  initialData,
  searchQuery,
}: ActiveReservationsProps) {
  const [reservations, setReservations] =
    useState<PaginatedReservaciones>(initialData);
  const [selectedReservation, setSelectedReservation] =
    useState<ReservacionWithDetails | null>(null);
  const [showReturnDialog, setShowReturnDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const { toast } = useToast();

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

  const handleReturnBook = useCallback(
    (reservation: ReservacionWithDetails) => {
      setSelectedReservation(reservation);
      setShowReturnDialog(true);
    },
    [],
  );

  const handleViewDetails = useCallback(
    (reservation: ReservacionWithDetails) => {
      setSelectedReservation(reservation);
      setShowDetailsDialog(true);
    },
    [],
  );

  const onReturnComplete = useCallback(
    (success: boolean, message: string) => {
      setShowReturnDialog(false);

      if (success) {
        // In a real implementation, we would refresh the data here
        // For now, let's simulate by removing the returned reservation
        setReservations((prev) => ({
          ...prev,
          items: prev.items.filter((res) => res.id !== selectedReservation?.id),
          totalCount: prev.totalCount - 1,
        }));

        toast({
          title: "Devolución exitosa",
          description: message,
        });
      } else {
        toast({
          title: "Error",
          description: message,
          variant: "destructive",
        });
      }
    },
    [selectedReservation, toast],
  );

  // Helper to check if a reservation is overdue
  const isOverdue = useCallback((reservation: ReservacionWithDetails) => {
    if (!reservation.prestamo.fechaVencimiento) return false;
    const today = new Date();
    const dueDate = parseISO(reservation.prestamo.fechaVencimiento);
    return isAfter(today, dueDate);
  }, []);

  // Helper to get the status badge
  const getStatusBadge = useCallback(
    (reservation: ReservacionWithDetails) => {
      if (reservation.estado === "vencido" || isOverdue(reservation)) {
        return (
          <Badge
            variant="outline"
            className="border-red-300 bg-red-100 text-red-800"
          >
            Vencido
          </Badge>
        );
      }
      return (
        <Badge
          variant="outline"
          className="border-blue-300 bg-blue-100 text-blue-800"
        >
          En préstamo
        </Badge>
      );
    },
    [isOverdue],
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
                    <TableHead>Fecha de Vencimiento</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reservations.items.length > 0 ? (
                    reservations.items.map((reservation) => (
                      <TableRow
                        key={reservation.id}
                        className={
                          reservation.estado === "vencido" ||
                          isOverdue(reservation)
                            ? "bg-red-50"
                            : undefined
                        }
                      >
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
                          {reservation.prestamo.fechaVencimiento
                            ? format(
                                parseISO(reservation.prestamo.fechaVencimiento),
                                "dd/MM/yyyy",
                                { locale: es },
                              )
                            : "No disponible"}
                        </TableCell>
                        <TableCell>{getStatusBadge(reservation)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 border-blue-500 text-blue-600 hover:bg-blue-50"
                              onClick={() => handleReturnBook(reservation)}
                            >
                              <RotateCcw className="mr-1 h-4 w-4" />
                              Recibir
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8"
                              onClick={() => handleViewDetails(reservation)}
                            >
                              <Info className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="py-10 text-center">
                        {searchQuery
                          ? "No se encontraron entregas realizadas que coincidan con la búsqueda."
                          : "No hay entregas realizadas."}
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
              className={`overflow-hidden bg-white shadow ${
                reservation.estado === "vencido" || isOverdue(reservation)
                  ? "border-l-4 border-red-500"
                  : ""
              }`}
            >
              <CardContent className="p-4">
                <div className="mb-3 flex items-center justify-between">
                  {getStatusBadge(reservation)}
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
                    <span className="font-medium text-gray-500">Vence:</span>
                    <span
                      className={`col-span-2 ${
                        reservation.estado === "vencido" ||
                        isOverdue(reservation)
                          ? "font-medium text-red-600"
                          : ""
                      }`}
                    >
                      {reservation.prestamo.fechaVencimiento
                        ? format(
                            parseISO(reservation.prestamo.fechaVencimiento),
                            "dd/MM/yyyy",
                            { locale: es },
                          )
                        : "No disponible"}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 border-blue-500 text-blue-600 hover:bg-blue-50"
                    onClick={() => handleReturnBook(reservation)}
                  >
                    <RotateCcw className="mr-1 h-4 w-4" />
                    Recibir
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-none"
                    onClick={() => handleViewDetails(reservation)}
                  >
                    <Info className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="py-8 text-center text-sm text-gray-500">
            {searchQuery
              ? "No se encontraron entregas realizadas que coincidan con la búsqueda."
              : "No hay entregas realizadas."}
          </div>
        )}
      </div>

      {/* Dialogs */}
      {selectedReservation && (
        <>
          <ReturnBookDialog
            open={showReturnDialog}
            onOpenChange={setShowReturnDialog}
            reservation={selectedReservation}
            onComplete={onReturnComplete}
          />

          <ReservationDetailsDialog
            open={showDetailsDialog}
            onOpenChange={setShowDetailsDialog}
            reservation={selectedReservation}
          />
        </>
      )}
    </>
  );
}
