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

// Datos de prueba para tendencias de préstamos
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
          <CardTitle>Comparativo Anual de Préstamos</CardTitle>
          <CardDescription>
            Análisis de tendencias 2023-2024 con porcentaje de crecimiento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-[1000]">
            <ChartContainer
              config={{
                "2024": {
                  label: "2024",
                  color: "hsl(var(--chart-1))",
                },
                "2023": {
                  label: "2023",
                  color: "hsl(var(--chart-2))",
                },
              }}
            >
              <LineChart
                data={tendenciasPrestamos}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="mes" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="2024"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="2023"
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
              {tendenciasPrestamos.map((item) => (
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
          Datos actualizados al 20 de marzo de 2025
        </div>
        <Button>Exportar a Excel</Button>
      </div>
    </div>
  );
}
