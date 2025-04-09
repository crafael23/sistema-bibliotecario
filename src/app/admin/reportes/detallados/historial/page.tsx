import {
  getHistorialPrestamos,
  getUsuarios,
} from "~/app/admin/reportes/actions/index";
import { ReportLayout } from "../../components/report-layout";
import { ClientMonthFilter } from "../../components/client-month-filter";
import { ClientPagination } from "../../components/client-pagination";
import { ReportFooter } from "../../components/report-footer";
import { PrestamosTable } from "./components/prestamos-table";
import { UserSelect } from "./components/user-select";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "~/components/ui/card";
import { Label } from "~/components/ui/label";

export const dynamic = "force-dynamic";

interface SearchParams {
  page?: string;
  mes?: string;
  anio?: string;
  userId?: string;
}

export default async function HistorialUsuarioPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  // Parse pagination params
  const currentPage = searchParams.page ? parseInt(searchParams.page) : 1;
  const pageSize = 10;
  const userId = searchParams.userId ?? null;

  // Get date filter params if available
  let dateFilter;
  if (searchParams.mes && searchParams.anio) {
    const month = parseInt(searchParams.mes);
    const year = parseInt(searchParams.anio);
    dateFilter = new Date(year, month - 1, 1);
  }

  // Fetch all users for the selector
  const usuarios = await getUsuarios();

  // Fetch prestamos for the selected user with pagination and filtering
  const { data: prestamos, totalItems } = await getHistorialPrestamos(userId, {
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

  // Find selected user details if available
  const selectedUser = userId
    ? usuarios.find((u) => u.clerkId === userId)
    : null;

  const cardTitle = selectedUser
    ? `Préstamos del Usuario: ${selectedUser.nombre}`
    : "Seleccione un usuario para ver su historial";

  return (
    <ReportLayout
      title="Historial de Préstamos por Usuario"
      cardTitle={cardTitle}
      cardDescription={`Análisis de comportamiento individual - ${displayDate}`}
      filterComponent={<ClientMonthFilter currentDate={dateFilter} />}
      footerComponent={
        userId && (
          <ReportFooter
            itemCount={prestamos.length}
            totalItems={totalItems}
            itemLabel="préstamos"
            additionalInfo={
              selectedUser
                ? `Usuario: ${selectedUser.nombre} (${selectedUser.tipoDeUsuario})`
                : undefined
            }
          />
        )
      }
    >
      <div className="mb-6">
        <Label htmlFor="usuario" className="mb-2 block">
          Buscar usuario
        </Label>
        <UserSelect
          usuarios={usuarios}
          preselectedUserId={userId ?? undefined}
        />
      </div>

      {userId ? (
        <>
          <PrestamosTable prestamos={prestamos} />
          <div className="mt-6">
            <ClientPagination
              currentPage={currentPage}
              totalItems={totalItems}
              pageSize={pageSize}
            />
          </div>
        </>
      ) : (
        <Card className="border-dashed">
          <CardContent className="pt-6 text-center">
            <CardTitle className="text-muted-foreground">
              Seleccione un usuario para ver su historial de préstamos
            </CardTitle>
            <CardDescription className="mt-2">
              Use el selector de arriba para elegir un usuario
            </CardDescription>
          </CardContent>
        </Card>
      )}
    </ReportLayout>
  );
}
