import { notFound } from "next/navigation";
import { getLibroById } from "../actions";
import BookInfo from "./components/book-info";
import ReservationForm from "./components/reservation-form";
import { Button } from "~/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function BookDetailPage({
  params,
}: {
  params: Promise<{ libroId: string }>;
}) {
  const { libroId } = await params;

  const libro = await getLibroById(Number(libroId));

  if (!libro) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <nav className="flex items-center text-sm text-gray-500">
          <Button variant="secondary" asChild>
            <Link href="/homepage" className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver
            </Link>
          </Button>

          <span className="mx-2">/</span>
          <Link href="/homepage" className="hover:text-gray-700">
            {libro.categoria}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{libro.nombre}</span>
        </nav>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <BookInfo {...libro} />
        </div>

        <div className="lg:col-span-4">
          <div className="sticky top-4">
            <ReservationForm
              bookId={libro.id}
              bookName={libro.nombre}
              availableCopies={libro.copias}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
