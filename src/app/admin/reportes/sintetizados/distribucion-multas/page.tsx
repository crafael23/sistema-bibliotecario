/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Label } from "~/components/ui/label";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Datos de prueba para distribución de multas por mes (2025)
const datosPorMes = {
  "1": {
    // Enero
    titulo: "Enero 2025",
    datos: [
      { categoria: "Ciencia", totalMultas: 950.25, montoPromedio: 17.5 },
      { categoria: "Literatura", totalMultas: 875.0, montoPromedio: 11.8 },
      { categoria: "Historia", totalMultas: 620.5, montoPromedio: 14.25 },
      { categoria: "Tecnología", totalMultas: 580.75, montoPromedio: 19.8 },
      { categoria: "Arte", totalMultas: 380.25, montoPromedio: 9.75 },
      { categoria: "Filosofía", totalMultas: 290.0, montoPromedio: 13.5 },
      { categoria: "Medicina", totalMultas: 480.5, montoPromedio: 18.2 },
    ],
  },
  "2": {
    // Febrero
    titulo: "Febrero 2025",
    datos: [
      { categoria: "Ciencia", totalMultas: 920.5, montoPromedio: 16.8 },
      { categoria: "Literatura", totalMultas: 850.25, montoPromedio: 11.5 },
      { categoria: "Historia", totalMultas: 600.75, montoPromedio: 13.9 },
      { categoria: "Tecnología", totalMultas: 560.0, montoPromedio: 19.2 },
      { categoria: "Arte", totalMultas: 360.5, montoPromedio: 9.5 },
      { categoria: "Filosofía", totalMultas: 275.25, montoPromedio: 13.2 },
      { categoria: "Medicina", totalMultas: 460.75, montoPromedio: 17.8 },
    ],
  },
  "3": {
    // Marzo
    titulo: "Marzo 2025",
    datos: [
      { categoria: "Ciencia", totalMultas: 980.75, montoPromedio: 18.2 },
      { categoria: "Literatura", totalMultas: 890.5, montoPromedio: 12.1 },
      { categoria: "Historia", totalMultas: 640.25, montoPromedio: 14.6 },
      { categoria: "Tecnología", totalMultas: 600.5, montoPromedio: 20.3 },
      { categoria: "Arte", totalMultas: 400.0, montoPromedio: 10.0 },
      { categoria: "Filosofía", totalMultas: 305.75, montoPromedio: 13.8 },
      { categoria: "Medicina", totalMultas: 500.25, montoPromedio: 18.6 },
    ],
  },
  "4": {
    // Abril
    titulo: "Abril 2025",
    datos: [
      { categoria: "Ciencia", totalMultas: 930.0, montoPromedio: 17.2 },
      { categoria: "Literatura", totalMultas: 860.75, montoPromedio: 11.7 },
      { categoria: "Historia", totalMultas: 610.5, montoPromedio: 14.0 },
      { categoria: "Tecnología", totalMultas: 570.25, montoPromedio: 19.5 },
      { categoria: "Arte", totalMultas: 370.75, montoPromedio: 9.6 },
      { categoria: "Filosofía", totalMultas: 280.5, montoPromedio: 13.3 },
      { categoria: "Medicina", totalMultas: 470.0, montoPromedio: 18.0 },
    ],
  },
  "5": {
    // Mayo
    titulo: "Mayo 2025",
    datos: [
      { categoria: "Ciencia", totalMultas: 910.5, montoPromedio: 16.9 },
      { categoria: "Literatura", totalMultas: 840.25, montoPromedio: 11.4 },
      { categoria: "Historia", totalMultas: 590.75, montoPromedio: 13.8 },
      { categoria: "Tecnología", totalMultas: 550.0, montoPromedio: 19.0 },
      { categoria: "Arte", totalMultas: 350.5, montoPromedio: 9.4 },
      { categoria: "Filosofía", totalMultas: 270.25, montoPromedio: 13.1 },
      { categoria: "Medicina", totalMultas: 450.75, montoPromedio: 17.7 },
    ],
  },
  "6": {
    // Junio
    titulo: "Junio 2025",
    datos: [
      { categoria: "Ciencia", totalMultas: 900.0, montoPromedio: 16.7 },
      { categoria: "Literatura", totalMultas: 830.5, montoPromedio: 11.3 },
      { categoria: "Historia", totalMultas: 580.25, montoPromedio: 13.7 },
      { categoria: "Tecnología", totalMultas: 540.75, montoPromedio: 18.8 },
      { categoria: "Arte", totalMultas: 340.0, montoPromedio: 9.3 },
      { categoria: "Filosofía", totalMultas: 260.5, montoPromedio: 13.0 },
      { categoria: "Medicina", totalMultas: 440.25, montoPromedio: 17.5 },
    ],
  },
  "7": {
    // Julio
    titulo: "Julio 2025",
    datos: [
      { categoria: "Ciencia", totalMultas: 890.75, montoPromedio: 16.5 },
      { categoria: "Literatura", totalMultas: 820.0, montoPromedio: 11.2 },
      { categoria: "Historia", totalMultas: 570.5, montoPromedio: 13.6 },
      { categoria: "Tecnología", totalMultas: 530.25, montoPromedio: 18.6 },
      { categoria: "Arte", totalMultas: 330.75, montoPromedio: 9.2 },
      { categoria: "Filosofía", totalMultas: 250.0, montoPromedio: 12.9 },
      { categoria: "Medicina", totalMultas: 430.5, montoPromedio: 17.3 },
    ],
  },
  "8": {
    // Agosto
    titulo: "Agosto 2025",
    datos: [
      { categoria: "Ciencia", totalMultas: 880.25, montoPromedio: 16.3 },
      { categoria: "Literatura", totalMultas: 810.5, montoPromedio: 11.1 },
      { categoria: "Historia", totalMultas: 560.0, montoPromedio: 13.5 },
      { categoria: "Tecnología", totalMultas: 520.75, montoPromedio: 18.4 },
      { categoria: "Arte", totalMultas: 320.25, montoPromedio: 9.1 },
      { categoria: "Filosofía", totalMultas: 240.5, montoPromedio: 12.8 },
      { categoria: "Medicina", totalMultas: 420.0, montoPromedio: 17.1 },
    ],
  },
  "9": {
    // Septiembre
    titulo: "Septiembre 2025",
    datos: [
      { categoria: "Ciencia", totalMultas: 940.0, montoPromedio: 17.4 },
      { categoria: "Literatura", totalMultas: 865.75, montoPromedio: 11.6 },
      { categoria: "Historia", totalMultas: 615.25, montoPromedio: 14.1 },
      { categoria: "Tecnología", totalMultas: 575.5, montoPromedio: 19.4 },
      { categoria: "Arte", totalMultas: 375.0, montoPromedio: 9.7 },
      { categoria: "Filosofía", totalMultas: 285.75, montoPromedio: 13.4 },
      { categoria: "Medicina", totalMultas: 475.25, montoPromedio: 18.1 },
    ],
  },
  "10": {
    // Octubre
    titulo: "Octubre 2025",
    datos: [
      { categoria: "Ciencia", totalMultas: 960.5, montoPromedio: 17.8 },
      { categoria: "Literatura", totalMultas: 885.25, montoPromedio: 11.9 },
      { categoria: "Historia", totalMultas: 630.0, montoPromedio: 14.4 },
      { categoria: "Tecnología", totalMultas: 590.75, montoPromedio: 19.9 },
      { categoria: "Arte", totalMultas: 390.5, montoPromedio: 9.9 },
      { categoria: "Filosofía", totalMultas: 300.25, montoPromedio: 13.7 },
      { categoria: "Medicina", totalMultas: 490.0, montoPromedio: 18.4 },
    ],
  },
  "11": {
    // Noviembre
    titulo: "Noviembre 2025",
    datos: [
      { categoria: "Ciencia", totalMultas: 970.25, montoPromedio: 18.0 },
      { categoria: "Literatura", totalMultas: 895.5, montoPromedio: 12.0 },
      { categoria: "Historia", totalMultas: 635.75, montoPromedio: 14.5 },
      { categoria: "Tecnología", totalMultas: 595.0, montoPromedio: 20.1 },
      { categoria: "Arte", totalMultas: 395.25, montoPromedio: 9.95 },
      { categoria: "Filosofía", totalMultas: 310.5, montoPromedio: 13.9 },
      { categoria: "Medicina", totalMultas: 495.75, montoPromedio: 18.5 },
    ],
  },
  "12": {
    // Diciembre
    titulo: "Diciembre 2025",
    datos: [
      { categoria: "Ciencia", totalMultas: 990.0, montoPromedio: 18.3 },
      { categoria: "Literatura", totalMultas: 905.75, montoPromedio: 12.2 },
      { categoria: "Historia", totalMultas: 645.25, montoPromedio: 14.7 },
      { categoria: "Tecnología", totalMultas: 605.5, montoPromedio: 20.4 },
      { categoria: "Arte", totalMultas: 405.0, montoPromedio: 10.1 },
      { categoria: "Filosofía", totalMultas: 315.75, montoPromedio: 14.0 },
      { categoria: "Medicina", totalMultas: 505.25, montoPromedio: 18.7 },
    ],
  },
};

// Colores para las categorías
const COLORS = [
  "#4f46e5", // Indigo
  "#0891b2", // Cyan
  "#059669", // Emerald
  "#ca8a04", // Yellow
  "#d97706", // Amber
  "#dc2626", // Red
  "#7c3aed", // Violet
];

// Función para formatear valores monetarios
const formatCurrency = (value: number) => {
  return `Lps. ${value.toFixed(2)}`;
};

// Componente personalizado para el tooltip del gráfico de barras
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length > 0) {
    const data = payload[0];
    return (
      <div className="rounded-md border bg-white p-3 shadow-md">
        <p className="font-semibold" style={{ color: data.color }}>
          {data.name}
        </p>
        <p className="text-sm">
          Total Multas:{" "}
          <span className="font-medium">{formatCurrency(data.value)}</span>
        </p>
        <p className="text-sm">
          Monto Promedio:{" "}
          <span className="font-medium">
            {formatCurrency(data.payload.montoPromedio)}
          </span>
        </p>
        <p className="text-sm">
          Porcentaje:{" "}
          <span className="font-medium">{data.payload.porcentaje}%</span>
        </p>
      </div>
    );
  }
  return null;
};

// Obtener el mes actual
const getMesActual = () => {
  const fecha = new Date();
  return fecha.getMonth() + 1; // getMonth() devuelve 0-11, sumamos 1 para obtener 1-12
};

export default function DistribucionMultas() {
  // Estado para el mes seleccionado (por defecto el mes actual)
  const [mesSeleccionado, setMesSeleccionado] = useState(
    getMesActual().toString(),
  );

  // Datos del mes seleccionado
  const datosDelMes =
    datosPorMes[mesSeleccionado as keyof typeof datosPorMes]?.datos || [];
  const tituloMes =
    datosPorMes[mesSeleccionado as keyof typeof datosPorMes]?.titulo ||
    "Mes actual";

  // Calcular el total de multas para el mes seleccionado
  const totalMultasMes = datosDelMes.reduce(
    (sum, item) => sum + item.totalMultas,
    0,
  );

  // Preparar datos para el gráfico de barras
  const datosPieChart = datosDelMes.map((item) => ({
    name: item.categoria,
    value: item.totalMultas,
    montoPromedio: item.montoPromedio,
    porcentaje: ((item.totalMultas / totalMultasMes) * 100).toFixed(1),
  }));

  // Encontrar la categoría con mayor monto
  const categoriaMaxMonto =
    datosDelMes.length > 0
      ? datosDelMes.reduce((prev, current) =>
          prev.totalMultas > current.totalMultas ? prev : current,
        )
      : { categoria: "N/A", totalMultas: 0 };

  return (
    <div className="container py-10">
      <div className="mb-6 flex items-center">
        <Button variant="ghost" size="sm" asChild className="mr-4">
          <Link href="/admin/reportes">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Distribución de Multas</h1>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>
                Distribución de Multas por Categoría de Libro
              </CardTitle>
              <CardDescription>
                Análisis de multas generadas por categoría - {tituloMes}
              </CardDescription>
            </div>
            <div className="mt-4 w-full md:mt-0 md:w-64">
              <Label htmlFor="mes" className="mb-1 block">
                Seleccionar mes
              </Label>
              <Select
                value={mesSeleccionado}
                onValueChange={setMesSeleccionado}
              >
                <SelectTrigger id="mes">
                  <SelectValue placeholder="Seleccionar mes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Enero 2025</SelectItem>
                  <SelectItem value="2">Febrero 2025</SelectItem>
                  <SelectItem value="3">Marzo 2025</SelectItem>
                  <SelectItem value="4">Abril 2025</SelectItem>
                  <SelectItem value="5">Mayo 2025</SelectItem>
                  <SelectItem value="6">Junio 2025</SelectItem>
                  <SelectItem value="7">Julio 2025</SelectItem>
                  <SelectItem value="8">Agosto 2025</SelectItem>
                  <SelectItem value="9">Septiembre 2025</SelectItem>
                  <SelectItem value="10">Octubre 2025</SelectItem>
                  <SelectItem value="11">Noviembre 2025</SelectItem>
                  <SelectItem value="12">Diciembre 2025</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-10 h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={datosPieChart}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="value" fill="#4f46e5" name="Total Multas" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mb-8 rounded-md border border-blue-200 bg-blue-50 p-4">
            <h3 className="mb-2 text-lg font-semibold text-blue-800">
              Resumen de multas - {tituloMes}
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-md border border-blue-100 bg-white p-3">
                <h4 className="mb-1 font-semibold text-blue-800">
                  Total recaudado en el mes
                </h4>
                <p className="text-2xl font-bold text-blue-700">
                  {formatCurrency(totalMultasMes)}
                </p>
              </div>
              <div className="rounded-md border border-blue-100 bg-white p-3">
                <h4 className="mb-1 font-semibold text-blue-800">
                  Categoría con mayor monto
                </h4>
                <p className="text-lg font-medium text-blue-700">
                  {categoriaMaxMonto.categoria}
                </p>
                <p className="text-sm text-blue-600">
                  {formatCurrency(categoriaMaxMonto.totalMultas)}
                </p>
              </div>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Categoría</TableHead>
                <TableHead className="text-right">Total Multas</TableHead>
                <TableHead className="text-right">Monto Promedio</TableHead>
                <TableHead className="text-right">% del Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {datosDelMes.map((item) => (
                <TableRow key={item.categoria}>
                  <TableCell className="font-medium">
                    {item.categoria}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(item.totalMultas)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(item.montoPromedio)}
                  </TableCell>
                  <TableCell className="text-right">
                    {((item.totalMultas / totalMultasMes) * 100).toFixed(1)}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Datos actualizados al 20 de marzo de 2025
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Comparar con mes anterior</Button>
          <Button>Exportar a Excel</Button>
        </div>
      </div>
    </div>
  );
}
