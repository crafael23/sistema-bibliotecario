import { getMultas } from "~/app/admin/reportes/actions/index";
import { ReportLayout } from "../../components/report-layout";
import { ClientMonthFilter } from "../../components/client-month-filter";
import { ClientPagination } from "../../components/client-pagination";
import { ReportFooter } from "../../components/report-footer";
import { MultasTable } from "./components/multas-table";

export const dynamic = "force-dynamic";

interface SearchParams {
  page?: string;
  mes?: string;
  anio?: string;
}

export default async function MultasPage({
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

  // Fetch multas with pagination and filtering
  const { data: multas, totalItems } = await getMultas({
    page: currentPage,
    pageSize,
    mes: searchParams.mes ? parseInt(searchParams.mes) : undefined,
    anio: searchParams.anio ? parseInt(searchParams.anio) : undefined,
  });

  // Calculate total sum of fines
  const totalMonto = multas.reduce((sum, multa) => sum + multa.monto, 0);

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
      title="Multas Pendientes"
      cardTitle={`Multas Pendientes - ${displayDate}`}
      cardDescription="Seguimiento de deudas activas por préstamos vencidos"
      filterComponent={<ClientMonthFilter currentDate={dateFilter} />}
      footerComponent={
        <ReportFooter
          itemCount={multas.length}
          totalItems={totalItems}
          itemLabel="multas pendientes"
          additionalInfo={`Total: $${totalMonto.toFixed(2)}`}
        />
      }
    >
      <MultasTable multas={multas} />
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
