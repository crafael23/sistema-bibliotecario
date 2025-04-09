"use client";

import { useState, useTransition } from "react";
import { format, parseISO, differenceInDays } from "date-fns";
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
import { AlertCircle, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { recibirLibro } from "../actions";
import type { ReservacionWithDetails } from "../actions";

interface ReturnBookDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reservation: ReservacionWithDetails;
  onComplete: (success: boolean, message: string) => void;
}

export function ReturnBookDialog({
  open,
  onOpenChange,
  reservation,
  onComplete,
}: ReturnBookDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Calculate if the return is late
  const isLate = (): boolean => {
    if (!reservation.prestamo.fechaVencimiento) return false;
    const today = new Date();
    const dueDate = parseISO(reservation.prestamo.fechaVencimiento);
    return today > dueDate;
  };

  // Calculate days overdue and fine amount
  const calculateFine = (): { days: number; amount: number } => {
    if (!reservation.prestamo.fechaVencimiento) return { days: 0, amount: 0 };

    const today = new Date();
    const dueDate = parseISO(reservation.prestamo.fechaVencimiento);
    const daysLate = Math.max(0, differenceInDays(today, dueDate));

    // Fine calculation: $1.00 per day late
    const fineAmount = daysLate * 1.0;

    return { days: daysLate, amount: fineAmount };
  };

  const { days: daysLate, amount: fineAmount } = calculateFine();
  const isReservationLate = isLate();

  const handleReturn = () => {
    setIsLoading(true);
    setError(null);

    startTransition(async () => {
      try {
        // Check if this reservation has an associated book copy
        if (!reservation.prestamo.libroCopiaId) {
          setError("No se pudo identificar el ejemplar prestado");
          setIsLoading(false);
          return;
        }

        // We no longer need to pass the copy ID since the server function gets it from the database
        const result = await recibirLibro(reservation.id);

        if (result.success) {
          let message = "Libro recibido exitosamente";
          if (isReservationLate) {
            message += `. Se ha generado una multa de $${fineAmount.toFixed(2)} por ${daysLate} días de retraso.`;
          }
          onComplete(true, message);
        } else {
          setError(result.message ?? "Error al recibir el libro");
          onComplete(false, result.message ?? "Error al recibir el libro");
        }
      } catch (err) {
        console.error("Error returning book:", err);
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Error desconocido al recibir el libro";
        setError(errorMessage);
        onComplete(false, errorMessage);
      } finally {
        setIsLoading(false);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-4 sm:p-6">
        <DialogHeader className="space-y-2">
          <DialogTitle>Recibir Libro</DialogTitle>
          <DialogDescription>
            Confirme la devolución del libro por parte del usuario
          </DialogDescription>
        </DialogHeader>

        <div className="py-3 sm:py-4">
          <div className="mb-4 grid grid-cols-[1fr,2fr] gap-2 text-sm">
            <div className="font-medium">ID Reserva:</div>
            <div>{reservation.codigoReferencia ?? `R-${reservation.id}`}</div>

            <div className="font-medium">Usuario:</div>
            <div>{reservation.usuario.nombre}</div>

            <div className="font-medium">Libro:</div>
            <div>{reservation.libro.nombre}</div>

            <div className="font-medium">Fecha de Entrega:</div>
            <div>
              {reservation.prestamo.fechaPrestamo
                ? format(
                    parseISO(reservation.prestamo.fechaPrestamo),
                    "dd/MM/yyyy",
                    { locale: es },
                  )
                : "No disponible"}
            </div>

            <div className="font-medium">Fecha de Vencimiento:</div>
            <div>
              {reservation.prestamo.fechaVencimiento
                ? format(
                    parseISO(reservation.prestamo.fechaVencimiento),
                    "dd/MM/yyyy",
                    { locale: es },
                  )
                : "No disponible"}
            </div>

            <div className="font-medium">Fecha de Devolución:</div>
            <div>{format(new Date(), "dd/MM/yyyy", { locale: es })}</div>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {isReservationLate && (
            <Alert className="mb-4 border-yellow-300 bg-yellow-50">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <AlertTitle className="text-yellow-800">
                Devolución tardía
              </AlertTitle>
              <AlertDescription className="text-yellow-700">
                Este libro tiene un retraso de {daysLate} días. Se generará una
                multa de ${fineAmount.toFixed(2)}.
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter className="flex flex-col gap-2 sm:flex-row">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleReturn}
            className="w-full bg-blue-600 text-white hover:bg-blue-700 sm:w-auto"
            disabled={isLoading || !reservation.prestamo.libroCopiaId}
          >
            {isLoading ? "Procesando..." : "Confirmar Devolución"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
