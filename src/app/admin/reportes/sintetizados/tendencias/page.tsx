import { ArrowLeft } from "lucide-react";
import Link from "next/link";
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

export const dynamic = "force-dynamic";

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

export default async function TendenciasPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  // Get current date
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // JavaScript months are 0-based

  // Parse search params or use current date as default
  const primerMes = searchParams.primerMes
    ? parseInt(searchParams.primerMes)
    : currentMonth;
  const primerAnio = searchParams.primerAnio
    ? parseInt(searchParams.primerAnio)
    : currentYear;
  const segundoMes = searchParams.segundoMes
    ? parseInt(searchParams.segundoMes)
    : currentMonth === 1
      ? 12
      : currentMonth - 1;
  const segundoAnio = searchParams.segundoAnio
    ? parseInt(searchParams.segundoAnio)
    : currentMonth === 1
      ? currentYear - 1
      : currentYear;

  // Fetch data for the selected periods
  const result = await getTendenciasData({
    primerMes,
    primerAnio,
    segundoMes,
    segundoAnio,
  });

  const data: TendenciaDataPoint[] = result.data || [];
  const primerPeriodoTotal = result.primerPeriodoTotal || 0;
  const segundoPeriodoTotal = result.segundoPeriodoTotal || 0;
  const crecimientoPromedio = result.crecimientoPromedio || 0;

  // Format month names for display
  const formatMonth = (month: number) => {
    return new Date(2000, month - 1, 1).toLocaleDateString("es-ES", {
      month: "long",
    });
  };

  const primerPeriodoLabel = `${formatMonth(primerMes)} ${primerAnio}`;
  const segundoPeriodoLabel = `${formatMonth(segundoMes)} ${segundoAnio}`;

  return (
    <div className="container py-10">
      <div className="mb-6 flex items-center">
        <Button variant="ghost" size="sm" asChild className="mr-4">
          <Link href="/admin/reportes">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Tendencias de Préstamos</h1>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <div className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
            <div>
              <CardTitle>Comparativo de Préstamos</CardTitle>
              <CardDescription>
                Análisis de tendencias {segundoPeriodoLabel} vs{" "}
                {primerPeriodoLabel} con porcentaje de crecimiento
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ClientTendenciasChart
            data={data}
            primerPeriodoLabel={primerPeriodoLabel}
            segundoPeriodoLabel={segundoPeriodoLabel}
            primerMes={primerMes}
            primerAnio={primerAnio}
            segundoMes={segundoMes}
            segundoAnio={segundoAnio}
          />

          <div className="mt-8">
            <h3 className="mb-4 text-lg font-semibold">
              Resumen de Crecimiento
            </h3>
            <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="rounded-lg border bg-card p-4 shadow-sm">
                <div className="text-sm font-medium text-muted-foreground">
                  Total Préstamos {primerPeriodoLabel}
                </div>
                <div className="mt-1 text-2xl font-bold">
                  {primerPeriodoTotal}
                </div>
              </div>
              <div className="rounded-lg border bg-card p-4 shadow-sm">
                <div className="text-sm font-medium text-muted-foreground">
                  Total Préstamos {segundoPeriodoLabel}
                </div>
                <div className="mt-1 text-2xl font-bold">
                  {segundoPeriodoTotal}
                </div>
              </div>
              <div className="rounded-lg border bg-card p-4 shadow-sm">
                <div className="text-sm font-medium text-muted-foreground">
                  Crecimiento Promedio
                </div>
                <div
                  className={`mt-1 text-2xl font-bold ${crecimientoPromedio >= 0 ? "text-green-600" : "text-red-600"}`}
                >
                  {crecimientoPromedio >= 0 ? "+" : ""}
                  {crecimientoPromedio.toFixed(1)}%
                </div>
              </div>
            </div>

            <h3 className="mb-4 text-lg font-semibold">Datos Diarios</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {data.map((item) => (
                <div
                  key={item.dia}
                  className="flex justify-between rounded-md border p-3"
                >
                  <span className="font-medium">Día {item.dia}</span>
                  <span
                    className={`font-semibold ${
                      item.crecimiento > 0
                        ? "text-green-600"
                        : item.crecimiento < 0
                          ? "text-red-600"
                          : "text-blue-600"
                    }`}
                  >
                    {item.crecimiento > 0 ? "+" : ""}
                    {item.crecimiento.toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Datos actualizados al {new Date().toLocaleDateString("es-ES")}
        </div>
        <Button>Exportar a Excel</Button>
      </div>
    </div>
  );
}
