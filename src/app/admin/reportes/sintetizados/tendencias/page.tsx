"use client";

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
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "~/components/ui/chart";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

// Datos de prueba para tendencias de préstamos
// En producción, estos datos vendrían de una API o del servidor
const tendenciasPrestamos = [
  { mes: "Enero", "2024": 420, "2023": 380, crecimiento: 10.5 },
  { mes: "Febrero", "2024": 450, "2023": 400, crecimiento: 12.5 },
  { mes: "Marzo", "2024": 480, "2023": 420, crecimiento: 14.3 },
  { mes: "Abril", "2024": 520, "2023": 450, crecimiento: 15.6 },
  { mes: "Mayo", "2024": 550, "2023": 470, crecimiento: 17.0 },
  { mes: "Junio", "2024": 580, "2023": 500, crecimiento: 16.0 },
  { mes: "Julio", "2024": 600, "2023": 510, crecimiento: 17.6 },
  { mes: "Agosto", "2024": 590, "2023": 520, crecimiento: 13.5 },
  { mes: "Septiembre", "2024": 610, "2023": 530, crecimiento: 15.1 },
  { mes: "Octubre", "2024": 630, "2023": 540, crecimiento: 16.7 },
  { mes: "Noviembre", "2024": 640, "2023": 545, crecimiento: 17.4 },
  { mes: "Diciembre", "2024": 615, "2023": 550, crecimiento: 11.8 },
];

export default function TendenciasPage() {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<string>(
    currentYear.toString(),
  );
  const [compareYear, setCompareYear] = useState<string>(
    (currentYear - 1).toString(),
  );
  const [chartData, setChartData] = useState(tendenciasPrestamos);

  // Years for the selectors (current year and 5 years back)
  const years = Array.from({ length: 6 }, (_, i) => {
    const year = currentYear - i;
    return { value: year.toString(), label: year.toString() };
  });

  // In a production app, this would fetch data from the server
  // using the selected years
  const fetchTendenciasData = () => {
    // Replace with real API call, e.g.:
    // const response = await fetch(`/api/reportes/tendencias?year=${selectedYear}&compareYear=${compareYear}`);
    // const data = await response.json();
    // setChartData(data);

    // For now, just update the display years in the demo data
    setChartData(
      tendenciasPrestamos.map((item) => ({
        mes: item.mes,
        [selectedYear]: item[selectedYear] || item["2024"], // Fallback to 2024 data
        [compareYear]: item[compareYear] || item["2023"], // Fallback to 2023 data
        crecimiento: item.crecimiento,
      })),
    );
  };

  // Update data when years change
  useEffect(() => {
    fetchTendenciasData();
  }, [selectedYear, compareYear]);

  // Prevent selecting the same year for both selectors
  const handleMainYearChange = (year: string) => {
    if (year === compareYear) {
      // If selected year is the same as compare year, adjust compare year
      const newCompareYear = parseInt(year) - 1;
      setCompareYear(newCompareYear.toString());
    }
    setSelectedYear(year);
  };

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
              <CardTitle>Comparativo Anual de Préstamos</CardTitle>
              <CardDescription>
                Análisis de tendencias {compareYear}-{selectedYear} con
                porcentaje de crecimiento
              </CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground">
                  Año Principal
                </span>
                <Select
                  value={selectedYear}
                  onValueChange={handleMainYearChange}
                >
                  <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder="Año" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year.value} value={year.value}>
                        {year.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground">
                  Comparar con
                </span>
                <Select value={compareYear} onValueChange={setCompareYear}>
                  <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder="Año" />
                  </SelectTrigger>
                  <SelectContent>
                    {years
                      .filter((year) => year.value !== selectedYear)
                      .map((year) => (
                        <SelectItem key={year.value} value={year.value}>
                          {year.label}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="w-[1000]">
            <ChartContainer
              config={{
                [selectedYear]: {
                  label: selectedYear,
                  color: "hsl(var(--chart-1))",
                },
                [compareYear]: {
                  label: compareYear,
                  color: "hsl(var(--chart-2))",
                },
              }}
            >
              <LineChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="mes" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey={selectedYear}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey={compareYear}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ChartContainer>
          </div>

          <div className="mt-8">
            <h3 className="mb-4 text-lg font-semibold">Datos de Crecimiento</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {chartData.map((item) => (
                <div
                  key={item.mes}
                  className="flex justify-between rounded-md border p-3"
                >
                  <span className="font-medium">{item.mes}</span>
                  <span
                    className={`font-semibold ${item.crecimiento > 15 ? "text-green-600" : "text-blue-600"}`}
                  >
                    +{item.crecimiento}%
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
