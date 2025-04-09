import {
  getMovimientosLibro,
  searchBooks,
} from "~/app/admin/reportes/actions/index";
import { ReportLayout } from "../../components/report-layout";
import { ClientPagination } from "../../components/client-pagination";
import { ReportFooter } from "../../components/report-footer";
import { MonthFilter } from "./components/month-filter";
import { BookSelect } from "./components/book-select";
import { MovimientosTable } from "./components/movimientos-table";
import { BookInfo } from "./components/book-info";
import { type BookSummary, type Movimiento } from "~/app/admin/reportes/types";
import { Suspense } from "react";
import { Skeleton } from "~/components/ui/skeleton";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface SearchParams {
  page?: string;
  mes?: string;
  anio?: string;
  libroId?: string;
}

export default async function MovimientosLibroPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  // Parse pagination and filter params
  const currentPage = parseInt(searchParams.page ?? "1");
  const pageSize = 10; // Keep page size consistent
  const month = searchParams.mes ? parseInt(searchParams.mes) : undefined;
  const year = searchParams.anio ? parseInt(searchParams.anio) : undefined;
  const libroId = searchParams.libroId ? parseInt(searchParams.libroId) : null;

  // Fetch all books initially
  const allBooks = await searchBooks("");

  // Fetch data with error handling
  let bookInfo: BookSummary | null = null;
  let movimientos: Movimiento[] = [];
  let totalItems = 0;
  let error: string | null = null;

  try {
    if (libroId) {
      // Find book in the already fetched books
      bookInfo = allBooks.find((b) => b.id === libroId) ?? null;

      // Only fetch movements if we found a valid book
      if (bookInfo) {
        try {
          const result = await getMovimientosLibro(libroId, {
            page: currentPage,
            pageSize,
            mes: month,
            anio: year,
          });

          movimientos = Array.isArray(result.data) ? result.data : [];
          totalItems = result.totalItems ?? 0;
        } catch (movimientosError) {
          console.error("Error fetching movimientos:", movimientosError);
          error = "Error al cargar los movimientos del libro";
        }
      } else {
        error = "No se encontró información del libro seleccionado";
      }
    }
  } catch (err) {
    console.error("Error fetching data:", err);
    error = "Error al cargar los datos. Por favor, intente nuevamente.";
    bookInfo = null;
    movimientos = [];
    totalItems = 0;
  }

  // Prepare title and description based on state
  const title = "Registro de Movimientos de Libros";
  const cardTitle = bookInfo
    ? `Movimientos del Libro: "${bookInfo.nombre}" (ID: ${bookInfo.id})`
    : "Seleccione un libro para ver sus movimientos";
  const cardDescription =
    "Trazabilidad completa de ejemplares - Historial de reservas, préstamos y devoluciones";

  return (
    <ReportLayout
      title={title}
      cardTitle={cardTitle}
      cardDescription={cardDescription}
      filterComponent={<MonthFilter currentMonth={month} currentYear={year} />}
      footerComponent={
        libroId && bookInfo ? (
          <ReportFooter
            itemCount={movimientos.length}
            totalItems={totalItems}
            itemLabel="movimientos"
            additionalInfo={`Libro ID: ${bookInfo.id}`}
          />
        ) : null
      }
    >
      {error && (
        <div className="mb-6 rounded-md border border-red-200 bg-red-50 p-4 text-red-800">
          {error}
        </div>
      )}

      <div className="mb-6">
        <BookSelect initialBookId={libroId ?? undefined} allBooks={allBooks} />
      </div>

      <Suspense fallback={<Skeleton className="h-20 w-full" />}>
        {bookInfo && <BookInfo book={bookInfo} />}
      </Suspense>

      {bookInfo ? (
        <>
          <MovimientosTable movimientos={movimientos} />
          <div className="mt-6">
            <ClientPagination
              currentPage={currentPage}
              totalItems={totalItems}
              pageSize={pageSize}
            />
          </div>
        </>
      ) : (
        <div className="flex h-32 items-center justify-center rounded-md border border-dashed p-8 text-muted-foreground">
          Seleccione un libro para ver sus movimientos
        </div>
      )}
    </ReportLayout>
  );
}
