import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { getTendenciasData } from "../actions";
import { ClientTendenciasChart } from "./components/client-tendencias-chart";
import { PeriodoSelector } from "./components/periodo-selector";

export const dynamic = "force-dynamic";

// Define interfaces directly in the page or import from a types file
interface SearchParams {
  primerMes?: string;
  primerAnio?: string;
  segundoMes?: string;
  segundoAnio?: string;
}

interface TendenciaDataPoint {
  dia: number;
  primerPeriodo: number;
  segundoPeriodo: number;
  crecimiento: number;
}

interface TendenciasResult {
  data: TendenciaDataPoint[];
  primerPeriodoTotal: number;
  segundoPeriodoTotal: number;
  crecimientoPromedio: number;
}

// Helper function to format month names
const formatMonth = (month: number): string => {
  return new Date(2000, month - 1, 1).toLocaleDateString("es-ES", {
    month: "long",
  });
};

// Helper function to get default date components
const getDefaultDates = () => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // JavaScript months are 0-based

  const defaultPrimerMes = currentMonth;
  const defaultPrimerAnio = currentYear;
  const defaultSegundoMes = currentMonth === 1 ? 12 : currentMonth - 1;
  const defaultSegundoAnio = currentMonth === 1 ? currentYear - 1 : currentYear;

  return {
    defaultPrimerMes,
    defaultPrimerAnio,
    defaultSegundoMes,
    defaultSegundoAnio,
  };
};

// Data fetching and processing function
async function fetchAndProcessData(params: SearchParams): Promise<{
  processedData: TendenciasResult | null;
  error: string | null;
  labels: { primerPeriodoLabel: string; segundoPeriodoLabel: string };
  periods: {
    primerMes: number;
    primerAnio: number;
    segundoMes: number;
    segundoAnio: number;
  };
}> {
  const {
    defaultPrimerMes,
    defaultPrimerAnio,
    defaultSegundoMes,
    defaultSegundoAnio,
  } = getDefaultDates();

  const primerMes = params.primerMes
    ? parseInt(params.primerMes)
    : defaultPrimerMes;
  const primerAnio = params.primerAnio
    ? parseInt(params.primerAnio)
    : defaultPrimerAnio;
  const segundoMes = params.segundoMes
    ? parseInt(params.segundoMes)
    : defaultSegundoMes;
  const segundoAnio = params.segundoAnio
    ? parseInt(params.segundoAnio)
    : defaultSegundoAnio;

  const periods = { primerMes, primerAnio, segundoMes, segundoAnio };
  const labels = {
    primerPeriodoLabel: `${formatMonth(primerMes)} ${primerAnio}`,
    segundoPeriodoLabel: `${formatMonth(segundoMes)} ${segundoAnio}`,
  };

  try {
    const result = await getTendenciasData({
      primerMes,
      primerAnio,
      segundoMes,
      segundoAnio,
    });
    if (!result) {
      throw new Error("No se recibieron datos.");
    }
    const processedData: TendenciasResult = {
      data: result.data || [],
      primerPeriodoTotal: result.primerPeriodoTotal || 0,
      segundoPeriodoTotal: result.segundoPeriodoTotal || 0,
      crecimientoPromedio: result.crecimientoPromedio || 0,
    };
    return { processedData, error: null, labels, periods };
  } catch (err) {
    console.error("Error fetching tendencias data:", err);
    const errorMessage =
      err instanceof Error
        ? err.message
        : "Error desconocido al cargar los datos.";
    return { processedData: null, error: errorMessage, labels, periods };
  }
}

// --- Sub Components ---

// Component for Summary Cards
function ResumenCrecimiento({
  primerPeriodoLabel,
  segundoPeriodoLabel,
  primerPeriodoTotal,
  segundoPeriodoTotal,
  crecimientoPromedio,
}: {
  primerPeriodoLabel: string;
  segundoPeriodoLabel: string;
  primerPeriodoTotal: number;
  segundoPeriodoTotal: number;
  crecimientoPromedio: number;
}) {
  return (
    <>
      <h3 className="mb-4 text-lg font-semibold">Resumen de Crecimiento</h3>
      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="text-sm font-medium text-muted-foreground">
            Total Préstamos {primerPeriodoLabel}
          </div>
          <div className="mt-1 text-2xl font-bold">{primerPeriodoTotal}</div>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="text-sm font-medium text-muted-foreground">
            Total Préstamos {segundoPeriodoLabel}
          </div>
          <div className="mt-1 text-2xl font-bold">{segundoPeriodoTotal}</div>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="text-sm font-medium text-muted-foreground">
            Crecimiento Promedio
          </div>
          <div
            className={`mt-1 text-2xl font-bold ${
              crecimientoPromedio >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {crecimientoPromedio >= 0 ? "+" : ""}
            {crecimientoPromedio.toFixed(1)}%
          </div>
        </div>
      </div>
    </>
  );
}

// Component for Daily Data Grid
function DatosDiarios({ data }: { data: TendenciaDataPoint[] }) {
  if (data.length === 0) {
    return (
      <p className="text-muted-foreground">
        No hay datos diarios disponibles para los periodos seleccionados.
      </p>
    );
  }

  return (
    <>
      <h3 className="mb-4 text-lg font-semibold">Crecimiento Diario (%)</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {data.map((item) => (
          <div
            key={item.dia}
            className="flex items-center justify-between rounded-md border p-3 text-sm"
          >
            <span className="font-medium text-muted-foreground">
              Día {item.dia}
            </span>
            <span
              className={`font-semibold ${
                item.crecimiento > 0
                  ? "text-green-600"
                  : item.crecimiento < 0
                    ? "text-red-600"
                    : "text-blue-600" // Use blue for 0% growth
              }`}
            >
              {item.crecimiento >= 0 ? "+" : ""}
              {item.crecimiento.toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </>
  );
}

// --- Main Page Component ---
export default async function TendenciasPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { processedData, error, labels, periods } =
    await fetchAndProcessData(searchParams);

  return (
    <div className="container py-10">
      {/* Header and Back Button */}
      <div className="mb-6 flex items-center">
        <Button variant="ghost" size="sm" asChild className="mr-4">
          <Link href="/admin/reportes">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Tendencias de Préstamos</h1>
      </div>

      {/* Period Selector Card */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Seleccionar Periodos</CardTitle>
          <CardDescription>
            Elige los dos periodos (mes y año) que deseas comparar.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Suspense boundary for client component */}
          <Suspense fallback={<div>Cargando selector...</div>}>
            <PeriodoSelector
              initialPrimerMes={periods.primerMes}
              initialPrimerAnio={periods.primerAnio}
              initialSegundoMes={periods.segundoMes}
              initialSegundoAnio={periods.segundoAnio}
            />
          </Suspense>
        </CardContent>
      </Card>

      {/* Results Card */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
            <div>
              <CardTitle>Comparativo de Préstamos</CardTitle>
              <CardDescription>
                Análisis de tendencias {labels.segundoPeriodoLabel} vs{" "}
                {labels.primerPeriodoLabel}
              </CardDescription>
            </div>
            {/* TODO: Implement Export Functionality */}
            <Button
              disabled={
                !processedData || processedData.data.length === 0 || !!error
              }
            >
              Exportar a Excel
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 rounded-md border border-destructive bg-destructive/10 p-4 text-destructive">
              <p className="font-semibold">Error al cargar datos</p>
              <p>{error}</p>
            </div>
          )}

          {!error && !processedData && (
            <div className="flex h-60 items-center justify-center">
              <p className="text-muted-foreground">Cargando datos...</p>
            </div>
          )}

          {processedData && (
            <>
              <div>
                {/* Ensure chart container has height */}
                <ClientTendenciasChart
                  data={processedData.data}
                  primerPeriodoLabel={labels.primerPeriodoLabel}
                  segundoPeriodoLabel={labels.segundoPeriodoLabel}
                />
              </div>

              <div className="mt-8 space-y-6">
                <ResumenCrecimiento
                  primerPeriodoLabel={labels.primerPeriodoLabel}
                  segundoPeriodoLabel={labels.segundoPeriodoLabel}
                  primerPeriodoTotal={processedData.primerPeriodoTotal}
                  segundoPeriodoTotal={processedData.segundoPeriodoTotal}
                  crecimientoPromedio={processedData.crecimientoPromedio}
                />

                <DatosDiarios data={processedData.data} />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Footer Info */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Datos actualizados al {new Date().toLocaleDateString("es-ES")}
        </div>
        {/* Optionally move Export button here if preferred */}
      </div>
    </div>
  );
}
