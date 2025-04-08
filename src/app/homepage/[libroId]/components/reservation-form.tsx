"use client";

import { Card, CardContent, CardFooter } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { BookOpen, Info } from "lucide-react";
import Link from "next/link";

type ReservationFormProps = {
  bookId: number;
  bookName: string;
  availableCopies: number;
};

export default function ReservationForm({
  bookId,
  bookName,
  availableCopies,
}: ReservationFormProps) {
  return (
    <Card>
      <CardContent className="p-6">
        {availableCopies > 0 ? (
          <div className="space-y-4">
            <div className="text-2xl font-bold text-green-700">Disponible</div>

            <div className="rounded-md bg-green-50 p-3">
              <p className="text-sm text-green-800">
                <span className="font-medium">Copias disponibles:</span>{" "}
                {availableCopies}
              </p>
            </div>

            <div className="text-center text-xs text-gray-500">
              Reserva segura. Puedes cancelar en cualquier momento.
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-2xl font-bold text-red-700">No disponible</div>

            <div className="rounded-md bg-red-50 p-4">
              <p className="text-red-700">
                Lo sentimos, este libro no está disponible actualmente para
                reserva.
              </p>
            </div>

            <div className="text-center text-xs text-gray-500">
              Vuelve a consultar más tarde para verificar disponibilidad.
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t bg-gray-50 p-4">
        <div className="w-full space-y-4">
          {availableCopies > 0 ? (
            <Button asChild className="w-full">
              <Link href={`/homepage/${bookId}/reserva`}>
                <BookOpen className="mr-2 h-4 w-4" />
                Reservar ahora
              </Link>
            </Button>
          ) : (
            <Button disabled className="w-full">
              <BookOpen className="mr-2 h-4 w-4" />
              Reservar libro
            </Button>
          )}

          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <Info className="mt-0.5 h-4 w-4 text-gray-500" />
              <p className="text-xs text-gray-500">
                Los préstamos tienen una duración máxima de 7 días.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <Info className="mt-0.5 h-4 w-4 text-gray-500" />
              <p className="text-xs text-gray-500">
                Recuerda devolver el libro en la fecha acordada para evitar
                sanciones.
              </p>
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
