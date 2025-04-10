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

// Datos de prueba para estadísticas por categoría organizados por mes
const datosPorMes = {
  "1": {
    // Enero
    titulo: "Enero 2025",
    datos: [
      {
        categoria: "Tecnología",
        manana: 120,
        tarde: 85,
        noche: 45,
        total: 250,
      },
      {
        categoria: "Literatura",
        manana: 95,
        tarde: 110,
        noche: 30,
        total: 235,
      },
      { categoria: "Ciencia", manana: 80, tarde: 95, noche: 25, total: 200 },
      { categoria: "Historia", manana: 70, tarde: 65, noche: 20, total: 155 },
      { categoria: "Arte", manana: 50, tarde: 60, noche: 15, total: 125 },
      { categoria: "Filosofía", manana: 40, tarde: 45, noche: 10, total: 95 },
      { categoria: "Medicina", manana: 60, tarde: 70, noche: 20, total: 150 },
    ],
  },
  "2": {
    // Febrero
    titulo: "Febrero 2025",
    datos: [
      {
        categoria: "Tecnología",
        manana: 110,
        tarde: 90,
        noche: 40,
        total: 240,
      },
      {
        categoria: "Literatura",
        manana: 105,
        tarde: 100,
        noche: 35,
        total: 240,
      },
      { categoria: "Ciencia", manana: 85, tarde: 90, noche: 30, total: 205 },
      { categoria: "Historia", manana: 65, tarde: 70, noche: 25, total: 160 },
      { categoria: "Arte", manana: 55, tarde: 65, noche: 20, total: 140 },
      { categoria: "Filosofía", manana: 45, tarde: 50, noche: 15, total: 110 },
      { categoria: "Medicina", manana: 70, tarde: 75, noche: 25, total: 170 },
    ],
  },
  "3": {
    // Marzo
    titulo: "Marzo 2025",
    datos: [
      {
        categoria: "Tecnología",
        manana: 130,
        tarde: 95,
        noche: 50,
        total: 275,
      },
      {
        categoria: "Literatura",
        manana: 100,
        tarde: 115,
        noche: 40,
        total: 255,
      },
      { categoria: "Ciencia", manana: 90, tarde: 100, noche: 35, total: 225 },
      { categoria: "Historia", manana: 75, tarde: 80, noche: 30, total: 185 },
      { categoria: "Arte", manana: 60, tarde: 70, noche: 25, total: 155 },
      { categoria: "Filosofía", manana: 50, tarde: 55, noche: 20, total: 125 },
      { categoria: "Medicina", manana: 80, tarde: 85, noche: 30, total: 195 },
    ],
  },
  "4": {
    // Abril
    titulo: "Abril 2025",
    datos: [
      {
        categoria: "Tecnología",
        manana: 125,
        tarde: 90,
        noche: 55,
        total: 270,
      },
      {
        categoria: "Literatura",
        manana: 110,
        tarde: 105,
        noche: 45,
        total: 260,
      },
      { categoria: "Ciencia", manana: 95, tarde: 105, noche: 40, total: 240 },
      { categoria: "Historia", manana: 80, tarde: 75, noche: 35, total: 190 },
      { categoria: "Arte", manana: 65, tarde: 75, noche: 30, total: 170 },
      { categoria: "Filosofía", manana: 55, tarde: 60, noche: 25, total: 140 },
      { categoria: "Medicina", manana: 85, tarde: 90, noche: 35, total: 210 },
    ],
  },
  "5": {
    // Mayo
    titulo: "Mayo 2025",
    datos: [
      {
        categoria: "Tecnología",
        manana: 135,
        tarde: 100,
        noche: 60,
        total: 295,
      },
      {
        categoria: "Literatura",
        manana: 115,
        tarde: 120,
        noche: 50,
        total: 285,
      },
      { categoria: "Ciencia", manana: 100, tarde: 110, noche: 45, total: 255 },
      { categoria: "Historia", manana: 85, tarde: 85, noche: 40, total: 210 },
      { categoria: "Arte", manana: 70, tarde: 80, noche: 35, total: 185 },
      { categoria: "Filosofía", manana: 60, tarde: 65, noche: 30, total: 155 },
      { categoria: "Medicina", manana: 90, tarde: 95, noche: 40, total: 225 },
    ],
  },
  "6": {
    // Junio
    titulo: "Junio 2025",
    datos: [
      {
        categoria: "Tecnología",
        manana: 115,
        tarde: 80,
        noche: 40,
        total: 235,
      },
      { categoria: "Literatura", manana: 90, tarde: 95, noche: 25, total: 210 },
      { categoria: "Ciencia", manana: 75, tarde: 85, noche: 20, total: 180 },
      { categoria: "Historia", manana: 65, tarde: 60, noche: 15, total: 140 },
      { categoria: "Arte", manana: 45, tarde: 55, noche: 10, total: 110 },
      { categoria: "Filosofía", manana: 35, tarde: 40, noche: 5, total: 80 },
      { categoria: "Medicina", manana: 55, tarde: 65, noche: 15, total: 135 },
    ],
  },
  "7": {
    // Julio
    titulo: "Julio 2025",
    datos: [
      {
        categoria: "Tecnología",
        manana: 105,
        tarde: 75,
        noche: 35,
        total: 215,
      },
      { categoria: "Literatura", manana: 85, tarde: 90, noche: 20, total: 195 },
      { categoria: "Ciencia", manana: 70, tarde: 80, noche: 15, total: 165 },
      { categoria: "Historia", manana: 60, tarde: 55, noche: 10, total: 125 },
      { categoria: "Arte", manana: 40, tarde: 50, noche: 5, total: 95 },
      { categoria: "Filosofía", manana: 30, tarde: 35, noche: 5, total: 70 },
      { categoria: "Medicina", manana: 50, tarde: 60, noche: 10, total: 120 },
    ],
  },
  "8": {
    // Agosto
    titulo: "Agosto 2025",
    datos: [
      {
        categoria: "Tecnología",
        manana: 110,
        tarde: 85,
        noche: 40,
        total: 235,
      },
      {
        categoria: "Literatura",
        manana: 90,
        tarde: 100,
        noche: 25,
        total: 215,
      },
      { categoria: "Ciencia", manana: 75, tarde: 90, noche: 20, total: 185 },
      { categoria: "Historia", manana: 65, tarde: 65, noche: 15, total: 145 },
      { categoria: "Arte", manana: 45, tarde: 55, noche: 10, total: 110 },
      { categoria: "Filosofía", manana: 35, tarde: 40, noche: 5, total: 80 },
      { categoria: "Medicina", manana: 55, tarde: 65, noche: 15, total: 135 },
    ],
  },
  "9": {
    // Septiembre
    titulo: "Septiembre 2025",
    datos: [
      {
        categoria: "Tecnología",
        manana: 125,
        tarde: 95,
        noche: 50,
        total: 270,
      },
      {
        categoria: "Literatura",
        manana: 105,
        tarde: 115,
        noche: 35,
        total: 255,
      },
      { categoria: "Ciencia", manana: 90, tarde: 105, noche: 30, total: 225 },
      { categoria: "Historia", manana: 80, tarde: 75, noche: 25, total: 180 },
      { categoria: "Arte", manana: 60, tarde: 70, noche: 20, total: 150 },
      { categoria: "Filosofía", manana: 50, tarde: 55, noche: 15, total: 120 },
      { categoria: "Medicina", manana: 75, tarde: 85, noche: 25, total: 185 },
    ],
  },
  "10": {
    // Octubre
    titulo: "Octubre 2025",
    datos: [
      {
        categoria: "Tecnología",
        manana: 130,
        tarde: 100,
        noche: 55,
        total: 285,
      },
      {
        categoria: "Literatura",
        manana: 110,
        tarde: 120,
        noche: 40,
        total: 270,
      },
      { categoria: "Ciencia", manana: 95, tarde: 110, noche: 35, total: 240 },
      { categoria: "Historia", manana: 85, tarde: 80, noche: 30, total: 195 },
      { categoria: "Arte", manana: 65, tarde: 75, noche: 25, total: 165 },
      { categoria: "Filosofía", manana: 55, tarde: 60, noche: 20, total: 135 },
      { categoria: "Medicina", manana: 80, tarde: 90, noche: 30, total: 200 },
    ],
  },
  "11": {
    // Noviembre
    titulo: "Noviembre 2025",
    datos: [
      {
        categoria: "Tecnología",
        manana: 135,
        tarde: 105,
        noche: 60,
        total: 300,
      },
      {
        categoria: "Literatura",
        manana: 115,
        tarde: 125,
        noche: 45,
        total: 285,
      },
      { categoria: "Ciencia", manana: 100, tarde: 115, noche: 40, total: 255 },
      { categoria: "Historia", manana: 90, tarde: 85, noche: 35, total: 210 },
      { categoria: "Arte", manana: 70, tarde: 80, noche: 30, total: 180 },
      { categoria: "Filosofía", manana: 60, tarde: 65, noche: 25, total: 150 },
      { categoria: "Medicina", manana: 85, tarde: 95, noche: 35, total: 215 },
    ],
  },
  "12": {
    // Diciembre
    titulo: "Diciembre 2025",
    datos: [
      {
        categoria: "Tecnología",
        manana: 115,
        tarde: 85,
        noche: 45,
        total: 245,
      },
      {
        categoria: "Literatura",
        manana: 95,
        tarde: 105,
        noche: 30,
        total: 230,
      },
      { categoria: "Ciencia", manana: 80, tarde: 95, noche: 25, total: 200 },
      { categoria: "Historia", manana: 70, tarde: 65, noche: 20, total: 155 },
      { categoria: "Arte", manana: 50, tarde: 60, noche: 15, total: 125 },
      { categoria: "Filosofía", manana: 40, tarde: 45, noche: 10, total: 95 },
      { categoria: "Medicina", manana: 60, tarde: 70, noche: 20, total: 150 },
    ],
  },
};

// Función para determinar el color de fondo según la intensidad
const getHeatmapColor = (value: number, max: number) => {
  const intensity = Math.min(Math.floor((value / max) * 100), 100);

  if (intensity < 30) return "bg-blue-50";
  if (intensity < 50) return "bg-blue-100";
  if (intensity < 70) return "bg-blue-200";
  if (intensity < 85) return "bg-blue-300";
  return "bg-blue-400";
};

// Obtener el mes actual (3 para marzo)
const getMesActual = () => {
  const fecha = new Date();
  return fecha.getMonth() + 1; // getMonth() devuelve 0-11, sumamos 1 para obtener 1-12
};

export default function CategoriasPage() {
  // Estado para el mes seleccionado (por defecto el mes actual)
  const [mesSeleccionado, setMesSeleccionado] = useState(
    getMesActual().toString(),
  );

  // Datos del mes seleccionado
  const datosDelMes =
    datosPorMes[mesSeleccionado as keyof typeof datosPorMes].datos;
  const tituloMes =
    datosPorMes[mesSeleccionado as keyof typeof datosPorMes].titulo;

  // Encontrar el valor máximo para la escala de calor
  const maxValue = Math.max(
    ...datosDelMes.flatMap((item) => [item.manana, item.tarde, item.noche]),
  );

  return (
    <div className="container py-10">
      <div className="mb-6 flex items-center">
        <Button variant="ghost" size="sm" asChild className="mr-4">
          <Link href="/admin/reportes">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Estadísticas por Categoría</h1>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Mapa de Calor por Franjas Horarias</CardTitle>
              <CardDescription>
                Distribución de préstamos por categoría y horario - {tituloMes}
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Categoría</TableHead>
                <TableHead className="text-center">Mañana (8-12h)</TableHead>
                <TableHead className="text-center">Tarde (12-18h)</TableHead>
                <TableHead className="text-center">Noche (18-22h)</TableHead>
                <TableHead className="text-center">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {datosDelMes.map((item) => (
                <TableRow key={item.categoria}>
                  <TableCell className="font-medium">
                    {item.categoria}
                  </TableCell>
                  <TableCell
                    className={`text-center ${getHeatmapColor(item.manana, maxValue)}`}
                  >
                    {item.manana}
                  </TableCell>
                  <TableCell
                    className={`text-center ${getHeatmapColor(item.tarde, maxValue)}`}
                  >
                    {item.tarde}
                  </TableCell>
                  <TableCell
                    className={`text-center ${getHeatmapColor(item.noche, maxValue)}`}
                  >
                    {item.noche}
                  </TableCell>
                  <TableCell className="text-center font-semibold">
                    {item.total}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="mt-6">
            <h3 className="mb-3 text-lg font-semibold">
              Leyenda de intensidad
            </h3>
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                <div className="h-6 w-6 rounded bg-blue-50"></div>
                <div className="h-6 w-6 rounded bg-blue-100"></div>
                <div className="h-6 w-6 rounded bg-blue-200"></div>
                <div className="h-6 w-6 rounded bg-blue-300"></div>
                <div className="h-6 w-6 rounded bg-blue-400"></div>
              </div>
              <div className="flex w-full justify-between text-xs text-muted-foreground">
                <span>Menor demanda</span>
                <span>Mayor demanda</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Datos actualizados al{" "}
          {new Date().toLocaleDateString("es-ES", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </div>
        <div className="flex gap-2">
          <Button>Exportar a PDF</Button>
          <Button>Exportar a Excel</Button>
        </div>
      </div>
    </div>
  );
}
