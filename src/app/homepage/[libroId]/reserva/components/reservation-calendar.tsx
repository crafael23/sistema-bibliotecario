"use client";

import { useState } from "react";
import {
  BookOpen,
  Calendar as CalendarIcon,
  X,
  Check,
  BookMarked,
} from "lucide-react";
import {
  format,
  isBefore,
  startOfToday,
  differenceInDays,
  isAfter,
  isSameDay,
} from "date-fns";
import { es } from "date-fns/locale";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import { type DateRange as DayPickerDateRange } from "react-day-picker";
import { useToast } from "~/hooks/use-toast";
import { Badge } from "~/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import Image from "next/image";
import { confirmReservation } from "../actions";

type BookData = {
  id: number;
  codigo: string;
  nombre: string;
  categoria: string;
  autor: string;
  isbn: string;
  edicion: number;
  descripcion: string;
  editorial: string;
  urlImagenPortada: string;
  copias: number;
};

type DateRange = {
  from: Date;
  to: Date;
};

type ReservationCalendarProps = {
  bookId: number;
  bookName: string;
  availableCopies: number;
  bookData: BookData;
  unavailableRanges: DateRange[];
};

export default function ReservationCalendar({
  bookId,
  bookName,
  availableCopies,
  bookData,
  unavailableRanges,
}: ReservationCalendarProps) {
  const [date, setDate] = useState<DayPickerDateRange | undefined>(undefined);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const { toast } = useToast();
  const today = startOfToday();

  // Debug information
  console.log("Calendar component data:", {
    availableCopies,
    unavailableRangesCount: unavailableRanges.length,
    unavailableRanges,
    currentSelection: date,
  });

  // Revised date disabling logic:
  // 1. Block dates before today
  // 2. Block dates that fall within unavailable ranges (where all copies are reserved)
  const isDateDisabled = (date: Date) => {
    // Always disable dates before today
    if (isBefore(date, today)) {
      return true;
    }

    // Check if the date falls within any unavailable range
    // These ranges represent dates where all copies would be reserved or user already has a reservation
    return unavailableRanges.some(
      (range) =>
        (isAfter(date, range.from) || isSameDay(date, range.from)) &&
        (isBefore(date, range.to) || isSameDay(date, range.to)),
    );
  };

  // The rest of the isDateValid logic remains the same - validating max 7 days
  const isDateRangeValid = (from: Date, to: Date) => {
    const daysDiff = differenceInDays(to, from) + 1;
    return daysDiff <= 7;
  };

  const rentalDays =
    date?.to && date?.from ? differenceInDays(date.to, date.from) + 1 : 0;

  const handleDateSelect = (range: DayPickerDateRange | undefined) => {
    console.log("Date selected:", range);

    if (!range) {
      setDate(undefined);
      return;
    }

    // If both dates are selected
    if (range.from && range.to) {
      const daysDiff = differenceInDays(range.to, range.from) + 1;

      if (daysDiff > 7) {
        toast({
          title: "Período máximo excedido",
          description: "El préstamo no puede exceder los 7 días",
          variant: "destructive",
        });
        // Don't update the state if over 7 days
        return;
      }
    }

    setDate(range);
  };

  const resetSelection = () => {
    setDate(undefined);
  };

  const openConfirmDialog = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirmReservation = async () => {
    if (!date?.from || !date?.to) return;

    setIsConfirming(true);
    try {
      const result = await confirmReservation({
        bookId,
        bookName,
        startDate: date.from,
        endDate: date.to,
        rentalDays,
      });

      if (result.success) {
        // Show success toast
        toast({
          title: "Reserva exitosa",
          description:
            result.message ??
            `Has reservado "${bookName}" por ${rentalDays} días.`,
          variant: "default",
        });

        // Reset all component state
        setDate(undefined);
        setShowConfirmDialog(false);

        // Force a refresh of the page to update the unavailable dates
        window.location.reload();
      } else {
        // Show error toast
        toast({
          title: "Error al confirmar la reserva",
          description: result.error ?? "Por favor, intenta nuevamente",
          variant: "destructive",
        });
      }
    } catch (error) {
      // Show error toast
      toast({
        title: "Error al confirmar la reserva",
        description: "Por favor, intenta nuevamente",
        variant: "destructive",
      });
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Selecciona un rango de fechas para tu préstamo (máximo 7 días):
          </p>

          {date && (
            <Button
              variant="outline"
              size="sm"
              onClick={resetSelection}
              className="h-8 px-2 text-xs"
            >
              <X className="mr-1 h-3 w-3" />
              Limpiar
            </Button>
          )}
        </div>

        <div className="flex justify-center">
          <Calendar
            mode="range"
            selected={date}
            onSelect={handleDateSelect}
            numberOfMonths={1}
            disabled={isDateDisabled}
            locale={es}
            className="rounded-md border"
            fromMonth={today}
            modifiersClassNames={{
              selected:
                "bg-amber-500 text-white hover:bg-amber-600 hover:text-white",
              range_middle:
                "bg-amber-100 text-amber-900 hover:bg-amber-200 hover:text-amber-900",
              range_start: "rounded-l-md",
              range_end: "rounded-r-md",
            }}
          />
        </div>

        {date?.from && (
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="bg-amber-50">
              <CalendarIcon className="mr-1 h-3 w-3" />
              Inicio: {format(date.from, "PPP", { locale: es })}
            </Badge>

            {date.to && (
              <>
                <Badge variant="outline" className="bg-amber-50">
                  <CalendarIcon className="mr-1 h-3 w-3" />
                  Fin: {format(date.to, "PPP", { locale: es })}
                </Badge>

                <Badge variant="outline" className="bg-amber-50">
                  Duración: {rentalDays} día{rentalDays !== 1 ? "s" : ""}
                </Badge>
              </>
            )}
          </div>
        )}
      </div>

      <Button
        className="w-full"
        disabled={!date?.from || !date?.to}
        onClick={openConfirmDialog}
      >
        <BookOpen className="mr-2 h-4 w-4" />
        {!date?.from
          ? "Selecciona fecha de inicio"
          : !date?.to
            ? "Selecciona fecha de fin"
            : "Confirmar reserva"}
      </Button>

      <div className="rounded-md bg-gray-50 p-4">
        <div className="space-y-2">
          <p className="text-xs text-gray-500">
            Los préstamos tienen una duración máxima de 7 días.
          </p>
          <p className="text-xs text-gray-500">
            Recuerda devolver el libro en la fecha acordada para evitar
            sanciones.
          </p>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog
        open={showConfirmDialog}
        onOpenChange={(open) => {
          if (!isConfirming) {
            setShowConfirmDialog(open);
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmar reserva</DialogTitle>
            <DialogDescription>
              {availableCopies === 0
                ? "No hay copias disponibles inmediatamente, pero puedes reservar para fechas futuras."
                : "Revisa los detalles antes de confirmar tu reserva"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            <div className="flex items-start gap-4">
              <div className="relative h-24 w-16 overflow-hidden rounded-md">
                <Image
                  src={
                    bookData.urlImagenPortada ||
                    "/placeholder.svg?height=96&width=64"
                  }
                  alt={bookData.nombre}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              <div className="flex-1">
                <h3 className="font-semibold">{bookData.nombre}</h3>
                <p className="text-sm text-gray-500">Autor: {bookData.autor}</p>
                <p className="text-sm text-gray-500">
                  Categoría: {bookData.categoria}
                </p>
                <p className="text-sm text-gray-500">
                  Editorial: {bookData.editorial}
                </p>
              </div>
            </div>

            <div className="space-y-2 rounded-md bg-amber-50 p-3">
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-amber-500" />
                <span className="text-sm font-medium">
                  Detalles de la reserva
                </span>
              </div>

              {date?.from && date?.to && (
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500">Fecha de inicio:</span>
                    <p>{format(date.from, "PPP", { locale: es })}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Fecha de fin:</span>
                    <p>{format(date.to, "PPP", { locale: es })}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Duración:</span>
                    <p>
                      {rentalDays} día{rentalDays !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Copias disponibles:</span>
                    <p>{availableCopies}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="flex sm:justify-between">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowConfirmDialog(false)}
              disabled={isConfirming}
            >
              <X className="mr-2 h-4 w-4" />
              Cancelar
            </Button>

            <Button
              type="button"
              onClick={handleConfirmReservation}
              disabled={isConfirming}
            >
              {isConfirming ? (
                <>
                  <svg
                    className="mr-2 h-4 w-4 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Confirmando...
                </>
              ) : (
                <>
                  <BookMarked className="mr-2 h-4 w-4" />
                  Confirmar reserva
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
