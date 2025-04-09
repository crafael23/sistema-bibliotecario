"use client";

import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import type { ReservacionWithDetails } from "../actions";

interface ReservationDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reservation: ReservacionWithDetails;
}

export function ReservationDetailsDialog({
  open,
  onOpenChange,
  reservation,
}: ReservationDetailsDialogProps) {
  // Function to get status text and badge
  const getStatusInfo = () => {
    switch (reservation.estado) {
      case "pendiente":
        return {
          text: "Pendiente",
          badge: (
            <Badge
              variant="outline"
              className="border-yellow-300 bg-yellow-100 text-yellow-800"
            >
              Pendiente
            </Badge>
          ),
        };
      case "activo":
        return {
          text: "En préstamo",
          badge: (
            <Badge
              variant="outline"
              className="border-blue-300 bg-blue-100 text-blue-800"
            >
              En préstamo
            </Badge>
          ),
        };
      case "devuelto":
        return {
          text: "Devuelto",
          badge: (
            <Badge
              variant="outline"
              className="border-green-300 bg-green-100 text-green-800"
            >
              Devuelto
            </Badge>
          ),
        };
      case "vencido":
        return {
          text: "Vencido",
          badge: (
            <Badge
              variant="outline"
              className="border-red-300 bg-red-100 text-red-800"
            >
              Vencido
            </Badge>
          ),
        };
      default:
        return {
          text: "Desconocido",
          badge: <Badge variant="outline">Desconocido</Badge>,
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-4 sm:p-6">
        <DialogHeader className="space-y-2">
          <DialogTitle>Detalles de la Reserva</DialogTitle>
          <DialogDescription>
            Información completa de la reserva
          </DialogDescription>
        </DialogHeader>

        <div className="py-3 sm:py-4">
          <div className="grid grid-cols-[1fr,2fr] gap-x-2 gap-y-3 text-sm">
            <div className="font-medium">ID Reserva:</div>
            <div>{reservation.codigoReferencia ?? `R-${reservation.id}`}</div>

            <div className="font-medium">Usuario:</div>
            <div>{reservation.usuario.nombre}</div>

            <div className="font-medium">Email:</div>
            <div className="truncate">{reservation.usuario.email}</div>

            <div className="font-medium">Libro:</div>
            <div>{reservation.libro.nombre}</div>

            <div className="font-medium">Autor:</div>
            <div>{reservation.libro.autor}</div>

            <div className="font-medium">Código:</div>
            <div>{reservation.libro.codigo}</div>

            <div className="font-medium">Estado:</div>
            <div>{statusInfo.badge}</div>

            {reservation.prestamo.fechaPrestamo && (
              <>
                <div className="font-medium">Fecha de Entrega:</div>
                <div>
                  {format(
                    parseISO(reservation.prestamo.fechaPrestamo),
                    "dd/MM/yyyy",
                    { locale: es },
                  )}
                </div>
              </>
            )}

            {reservation.prestamo.fechaVencimiento && (
              <>
                <div className="font-medium">Fecha de Vencimiento:</div>
                <div>
                  {format(
                    parseISO(reservation.prestamo.fechaVencimiento),
                    "dd/MM/yyyy",
                    { locale: es },
                  )}
                </div>
              </>
            )}

            {reservation.prestamo.fechaDevolucion && (
              <>
                <div className="font-medium">Fecha de Devolución:</div>
                <div>
                  {format(
                    parseISO(reservation.prestamo.fechaDevolucion),
                    "dd/MM/yyyy",
                    { locale: es },
                  )}
                </div>
              </>
            )}

            {reservation.prestamo.libroCopiaId && (
              <>
                <div className="font-medium">ID del Ejemplar:</div>
                <div>{reservation.prestamo.libroCopiaId}</div>
              </>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto"
          >
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
