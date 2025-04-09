import { notFound } from "next/navigation";
import { getLibroById } from "../../actions";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { ArrowLeft, Calendar, Info } from "lucide-react";
import Link from "next/link";
import ReservationCalendar from "./components/reservation-calendar";
import { getUnavailableDates } from "./actions";

// Force dynamic rendering to ensure we always get fresh data
export const dynamic = "force-dynamic";
export const revalidate = 0; // Disable cache for this page

export default async function ReservationPage({
  params,
}: {
  params: Promise<{ libroId: string }>;
}) {
  const { libroId } = await params;
  const libro = await getLibroById(Number(libroId));

  if (!libro) {
    notFound();
  }

  // Get unavailable dates and available copies
  const data = await getUnavailableDates(Number(libroId));
  const { unavailableRanges = [], availableCopies = 0, totalCopies = 0 } = data;

  console.log("Page data:", {
    libroId,
    availableCopies,
    totalCopies,
    unavailableRangesCount: unavailableRanges.length,
    unavailableRanges,
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <nav className="flex items-center text-sm text-gray-500">
          <Button variant="secondary" asChild>
            <Link href={`/homepage/${libroId}`} className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver
            </Link>
          </Button>

          <span className="mx-2">/</span>
          <Link href="/homepage" className="hover:text-gray-700">
            {libro.categoria}
          </Link>
          <span className="mx-2">/</span>
          <Link href={`/homepage/${libroId}`} className="hover:text-gray-700">
            {libro.nombre}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">Reserva</span>
        </nav>
      </div>

      <div className="mx-auto max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>Selecciona las fechas de préstamo</CardTitle>
            <div className="mt-2 space-y-2">
              <p className="text-sm text-gray-500">
                {availableCopies === 0
                  ? "Actualmente no hay copias disponibles para reservar inmediatamente."
                  : `${availableCopies} de ${totalCopies} ${totalCopies === 1 ? "copia disponible" : "copias disponibles"} actualmente.`}
              </p>

              <div className="flex items-start gap-2 rounded-md bg-amber-50 p-3">
                <Info className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" />
                <div className="text-sm text-amber-800">
                  <p className="font-medium">Información sobre reservas</p>
                  <ul className="mt-1 list-disc space-y-1 pl-4">
                    <li>
                      Las fechas bloqueadas en el calendario indican días donde
                      todas las copias ya están reservadas.
                    </li>
                    <li>
                      Puedes realizar una reserva para fechas futuras aunque no
                      haya copias disponibles actualmente.
                    </li>
                    <li>
                      Las reservaciones se procesan en el orden en que se
                      reciben.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ReservationCalendar
              bookId={libro.id}
              bookName={libro.nombre}
              availableCopies={availableCopies}
              bookData={libro}
              unavailableRanges={unavailableRanges}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
