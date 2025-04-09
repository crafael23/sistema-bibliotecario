"use client";

import { useState, useEffect, useTransition } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { getAvailableCopias, entregarLibro } from "../actions";
import type { ReservacionWithDetails } from "../actions";

interface DeliverBookDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reservation: ReservacionWithDetails;
  onComplete: (success: boolean, message: string) => void;
}

export function DeliverBookDialog({
  open,
  onOpenChange,
  reservation,
  onComplete,
}: DeliverBookDialogProps) {
  const [availableCopies, setAvailableCopies] = useState<
    Array<{ id: number; localizacion: string }>
  >([]);
  const [selectedCopyId, setSelectedCopyId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Fetch available copies when dialog opens
  useEffect(() => {
    if (open) {
      setIsLoading(true);
      setError(null);
      setSelectedCopyId("");

      getAvailableCopias(reservation.libro.id)
        .then((copies) => {
          setAvailableCopies(copies);
          if (copies.length === 0) {
            setError("No hay ejemplares disponibles para este libro");
          }
        })
        .catch((err) => {
          console.error("Error fetching available copies:", err);
          setError("Error al obtener los ejemplares disponibles");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [open, reservation.libro.id]);

  const handleDelivery = () => {
    if (!selectedCopyId) {
      setError("Debe seleccionar un ejemplar para continuar");
      return;
    }

    setIsLoading(true);
    setError(null);

    startTransition(async () => {
      try {
        const result = await entregarLibro(
          reservation.id,
          parseInt(selectedCopyId, 10),
        );

        if (result.success) {
          onComplete(true, result.message ?? "Libro entregado exitosamente");
        } else {
          setError(result.message ?? "Error al entregar el libro");
          onComplete(false, result.message ?? "Error al entregar el libro");
        }
      } catch (err) {
        console.error("Error delivering book:", err);
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Error desconocido al entregar el libro";
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
          <DialogTitle>Entregar Libro</DialogTitle>
          <DialogDescription>
            Seleccione un ejemplar disponible para entregar al usuario
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

            <div className="font-medium">Autor:</div>
            <div>{reservation.libro.autor}</div>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-3 sm:space-y-4">
            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="copy-select">Seleccionar Ejemplar</Label>
              <Select
                value={selectedCopyId}
                onValueChange={setSelectedCopyId}
                disabled={isLoading || availableCopies.length === 0}
              >
                <SelectTrigger id="copy-select" className="w-full">
                  <SelectValue placeholder="Seleccione un ejemplar" />
                </SelectTrigger>
                <SelectContent>
                  {availableCopies.map((copy) => (
                    <SelectItem key={copy.id} value={copy.id.toString()}>
                      Ejemplar #{copy.id} - {copy.localizacion}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1 sm:space-y-2">
              <Label>Fecha de Entrega</Label>
              <div className="rounded-md border bg-gray-50 p-2">
                {format(new Date(), "dd/MM/yyyy", { locale: es })}
              </div>
            </div>

            <div className="space-y-1 sm:space-y-2">
              <Label>Fecha de Vencimiento</Label>
              <div className="rounded-md border bg-gray-50 p-2">
                {format(
                  new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
                  "dd/MM/yyyy",
                  { locale: es },
                )}
              </div>
            </div>
          </div>
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
            onClick={handleDelivery}
            className="w-full bg-green-600 text-white hover:bg-green-700 sm:w-auto"
            disabled={
              isLoading || !selectedCopyId || availableCopies.length === 0
            }
          >
            {isLoading ? "Procesando..." : "Confirmar Entrega"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
