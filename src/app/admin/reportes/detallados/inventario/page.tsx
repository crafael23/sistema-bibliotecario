import { getInventarioBooks } from "~/app/admin/reportes/actions/index";
import { ReportLayout } from "../../components/report-layout";
import { ClientMonthFilter } from "../../components/client-month-filter";
import { ClientPagination } from "../../components/client-pagination";
import { ReportFooter } from "../../components/report-footer";
import { BookTable } from "./components/book-table";

export const dynamic = "force-dynamic";

interface SearchParams {
  page?: string;
  mes?: string;
  anio?: string;
}

export default async function ReporteDetalladoInventarioPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  // Parse pagination params
  const currentPage = searchParams.page ? parseInt(searchParams.page) : 1;
  const pageSize = 10;

  // Get date filter params if available
  let dateFilter;
  if (searchParams.mes && searchParams.anio) {
    const month = parseInt(searchParams.mes);
    const year = parseInt(searchParams.anio);
    dateFilter = new Date(year, month - 1, 1);
  }

  // Fetch data with pagination and filtering
  const { data: books, totalItems } = await getInventarioBooks({
    page: currentPage,
    pageSize,
    mes: searchParams.mes ? parseInt(searchParams.mes) : undefined,
    anio: searchParams.anio ? parseInt(searchParams.anio) : undefined,
  });

  // Format date for display
  const displayDate = dateFilter
    ? new Date(dateFilter).toLocaleDateString("es-ES", {
        month: "long",
        year: "numeric",
      })
    : new Date().toLocaleDateString("es-ES", {
        month: "long",
        year: "numeric",
      });

  return (
    <ReportLayout
      title="Inventario Completo de Libros"
      cardTitle={`Inventario - ${displayDate}`}
      cardDescription="Control físico y gestión de stock de libros en el sistema"
      filterComponent={<ClientMonthFilter currentDate={dateFilter} />}
      footerComponent={
        <ReportFooter
          itemCount={books.length}
          totalItems={totalItems}
          itemLabel="libros"
          additionalInfo={`Actualizado: ${new Date().toLocaleDateString()}`}
        />
      }
    >
      <BookTable books={books} />
      <div className="mt-6">
        <ClientPagination
          currentPage={currentPage}
          totalItems={totalItems}
          pageSize={pageSize}
        />
      </div>
    </ReportLayout>
  );
}
