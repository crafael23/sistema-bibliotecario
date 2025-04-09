"use client";

import { useState, useEffect, useCallback, useTransition } from "react";
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
import { Check, Info } from "lucide-react";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { DeliverBookDialog } from "./DeliverBookDialog";
import { ReservationDetailsDialog } from "./ReservationDetailsDialog";
import type {
  ReservacionWithDetails,
  PaginatedReservaciones,
} from "../actions";
import { useToast } from "~/components/ui/use-toast";

interface PendingReservationsProps {
  initialData: PaginatedReservaciones;
  searchQuery: string;
}

export function PendingReservations({
  initialData,
  searchQuery,
}: PendingReservationsProps) {
  const [reservations, setReservations] =
    useState<PaginatedReservaciones>(initialData);
  const [selectedReservation, setSelectedReservation] =
    useState<ReservacionWithDetails | null>(null);
  const [showDeliverDialog, setShowDeliverDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [isPending, startTransition] = useTransition();
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

  const handleDeliverBook = useCallback(
    (reservation: ReservacionWithDetails) => {
      setSelectedReservation(reservation);
      setShowDeliverDialog(true);
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

  const onDeliveryComplete = useCallback(
    (success: boolean, message: string) => {
      setShowDeliverDialog(false);

      if (success) {
        // In a real implementation, we would refresh the data here
        // For now, let's simulate by removing the delivered reservation
        setReservations((prev) => ({
          ...prev,
          items: prev.items.filter((res) => res.id !== selectedReservation?.id),
          totalCount: prev.totalCount - 1,
        }));

        toast({
          title: "Entrega exitosa",
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
                    <TableHead>Fecha de Reserva</TableHead>
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
                            : "Pendiente"}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="border-yellow-300 bg-yellow-100 text-yellow-800"
                          >
                            Pendiente
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 border-green-500 text-green-600 hover:bg-green-50"
                              onClick={() => handleDeliverBook(reservation)}
                            >
                              <Check className="mr-1 h-4 w-4" />
                              Entregar
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
                      <TableCell colSpan={6} className="py-10 text-center">
                        {searchQuery
                          ? "No se encontraron reservas pendientes que coincidan con la búsqueda."
                          : "No hay reservas pendientes de entrega."}
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
                    className="border-yellow-300 bg-yellow-100 text-yellow-800"
                  >
                    Pendiente
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
                    <span className="font-medium text-gray-500">Fecha:</span>
                    <span className="col-span-2">
                      {reservation.prestamo.fechaPrestamo
                        ? format(
                            parseISO(reservation.prestamo.fechaPrestamo),
                            "dd/MM/yyyy",
                            { locale: es },
                          )
                        : "Pendiente"}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 border-green-500 text-green-600 hover:bg-green-50"
                    onClick={() => handleDeliverBook(reservation)}
                  >
                    <Check className="mr-1 h-4 w-4" />
                    Entregar
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
              ? "No se encontraron reservas pendientes que coincidan con la búsqueda."
              : "No hay reservas pendientes de entrega."}
          </div>
        )}
      </div>

      {/* Dialogs */}
      {selectedReservation && (
        <>
          <DeliverBookDialog
            open={showDeliverDialog}
            onOpenChange={setShowDeliverDialog}
            reservation={selectedReservation}
            onComplete={onDeliveryComplete}
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
