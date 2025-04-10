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
import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "~/components/ui/chart";

// Datos de prueba para rendimiento en devoluciones por mes
const datosPorMes = {
  "1": {
    // Enero
    titulo: "Enero 2025",
    datos: [
      {
        responsable: "Pedro Sánchez",
        prestamos: 80,
        devATiempo: 76,
        eficiencia: 95.0,
      },
      {
        responsable: "Ana Torres",
        prestamos: 115,
        devATiempo: 109,
        eficiencia: 94.8,
      },
      {
        responsable: "María López",
        prestamos: 95,
        devATiempo: 88,
        eficiencia: 92.6,
      },
      {
        responsable: "Juan Rodríguez",
        prestamos: 70,
        devATiempo: 63,
        eficiencia: 90.0,
      },
      {
        responsable: "Carlos Gómez",
        prestamos: 60,
        devATiempo: 53,
        eficiencia: 88.3,
      },
    ],
  },
  "2": {
    // Febrero
    titulo: "Febrero 2025",
    datos: [
      {
        responsable: "Pedro Sánchez",
        prestamos: 82,
        devATiempo: 78,
        eficiencia: 95.1,
      },
      {
        responsable: "Ana Torres",
        prestamos: 118,
        devATiempo: 112,
        eficiencia: 94.9,
      },
      {
        responsable: "María López",
        prestamos: 98,
        devATiempo: 90,
        eficiencia: 91.8,
      },
      {
        responsable: "Juan Rodríguez",
        prestamos: 72,
        devATiempo: 65,
        eficiencia: 90.3,
      },
      {
        responsable: "Carlos Gómez",
        prestamos: 63,
        devATiempo: 56,
        eficiencia: 88.9,
      },
    ],
  },
  "3": {
    // Marzo
    titulo: "Marzo 2025",
    datos: [
      {
        responsable: "Pedro Sánchez",
        prestamos: 85,
        devATiempo: 82,
        eficiencia: 96.5,
      },
      {
        responsable: "Ana Torres",
        prestamos: 120,
        devATiempo: 115,
        eficiencia: 95.8,
      },
      {
        responsable: "María López",
        prestamos: 100,
        devATiempo: 94,
        eficiencia: 94.0,
      },
      {
        responsable: "Juan Rodríguez",
        prestamos: 75,
        devATiempo: 69,
        eficiencia: 92.0,
      },
      {
        responsable: "Carlos Gómez",
        prestamos: 65,
        devATiempo: 59,
        eficiencia: 90.8,
      },
    ],
  },
  "4": {
    // Abril
    titulo: "Abril 2025",
    datos: [
      {
        responsable: "Pedro Sánchez",
        prestamos: 83,
        devATiempo: 80,
        eficiencia: 96.4,
      },
      {
        responsable: "Ana Torres",
        prestamos: 117,
        devATiempo: 113,
        eficiencia: 96.6,
      },
      {
        responsable: "María López",
        prestamos: 97,
        devATiempo: 92,
        eficiencia: 94.8,
      },
      {
        responsable: "Juan Rodríguez",
        prestamos: 73,
        devATiempo: 68,
        eficiencia: 93.2,
      },
      {
        responsable: "Carlos Gómez",
        prestamos: 62,
        devATiempo: 57,
        eficiencia: 91.9,
      },
    ],
  },
  "5": {
    // Mayo
    titulo: "Mayo 2025",
    datos: [
      {
        responsable: "Pedro Sánchez",
        prestamos: 87,
        devATiempo: 84,
        eficiencia: 96.6,
      },
      {
        responsable: "Ana Torres",
        prestamos: 122,
        devATiempo: 118,
        eficiencia: 96.7,
      },
      {
        responsable: "María López",
        prestamos: 102,
        devATiempo: 97,
        eficiencia: 95.1,
      },
      {
        responsable: "Juan Rodríguez",
        prestamos: 77,
        devATiempo: 72,
        eficiencia: 93.5,
      },
      {
        responsable: "Carlos Gómez",
        prestamos: 67,
        devATiempo: 62,
        eficiencia: 92.5,
      },
    ],
  },
  "6": {
    // Junio
    titulo: "Junio 2025",
    datos: [
      {
        responsable: "Pedro Sánchez",
        prestamos: 80,
        devATiempo: 77,
        eficiencia: 96.3,
      },
      {
        responsable: "Ana Torres",
        prestamos: 115,
        devATiempo: 110,
        eficiencia: 95.7,
      },
      {
        responsable: "María López",
        prestamos: 95,
        devATiempo: 89,
        eficiencia: 93.7,
      },
      {
        responsable: "Juan Rodríguez",
        prestamos: 70,
        devATiempo: 64,
        eficiencia: 91.4,
      },
      {
        responsable: "Carlos Gómez",
        prestamos: 60,
        devATiempo: 54,
        eficiencia: 90.0,
      },
    ],
  },
  "7": {
    // Julio
    titulo: "Julio 2025",
    datos: [
      {
        responsable: "Pedro Sánchez",
        prestamos: 75,
        devATiempo: 72,
        eficiencia: 96.0,
      },
      {
        responsable: "Ana Torres",
        prestamos: 110,
        devATiempo: 105,
        eficiencia: 95.5,
      },
      {
        responsable: "María López",
        prestamos: 90,
        devATiempo: 84,
        eficiencia: 93.3,
      },
      {
        responsable: "Juan Rodríguez",
        prestamos: 65,
        devATiempo: 59,
        eficiencia: 90.8,
      },
      {
        responsable: "Carlos Gómez",
        prestamos: 55,
        devATiempo: 49,
        eficiencia: 89.1,
      },
    ],
  },
  "8": {
    // Agosto
    titulo: "Agosto 2025",
    datos: [
      {
        responsable: "Pedro Sánchez",
        prestamos: 78,
        devATiempo: 75,
        eficiencia: 96.2,
      },
      {
        responsable: "Ana Torres",
        prestamos: 113,
        devATiempo: 108,
        eficiencia: 95.6,
      },
      {
        responsable: "María López",
        prestamos: 93,
        devATiempo: 87,
        eficiencia: 93.5,
      },
      {
        responsable: "Juan Rodríguez",
        prestamos: 68,
        devATiempo: 62,
        eficiencia: 91.2,
      },
      {
        responsable: "Carlos Gómez",
        prestamos: 58,
        devATiempo: 52,
        eficiencia: 89.7,
      },
    ],
  },
  "9": {
    // Septiembre
    titulo: "Septiembre 2025",
    datos: [
      {
        responsable: "Pedro Sánchez",
        prestamos: 84,
        devATiempo: 81,
        eficiencia: 96.4,
      },
      {
        responsable: "Ana Torres",
        prestamos: 119,
        devATiempo: 114,
        eficiencia: 95.8,
      },
      {
        responsable: "María López",
        prestamos: 99,
        devATiempo: 93,
        eficiencia: 93.9,
      },
      {
        responsable: "Juan Rodríguez",
        prestamos: 74,
        devATiempo: 68,
        eficiencia: 91.9,
      },
      {
        responsable: "Carlos Gómez",
        prestamos: 64,
        devATiempo: 58,
        eficiencia: 90.6,
      },
    ],
  },
  "10": {
    // Octubre
    titulo: "Octubre 2025",
    datos: [
      {
        responsable: "Pedro Sánchez",
        prestamos: 86,
        devATiempo: 83,
        eficiencia: 96.5,
      },
      {
        responsable: "Ana Torres",
        prestamos: 121,
        devATiempo: 116,
        eficiencia: 95.9,
      },
      {
        responsable: "María López",
        prestamos: 101,
        devATiempo: 95,
        eficiencia: 94.1,
      },
      {
        responsable: "Juan Rodríguez",
        prestamos: 76,
        devATiempo: 70,
        eficiencia: 92.1,
      },
      {
        responsable: "Carlos Gómez",
        prestamos: 66,
        devATiempo: 60,
        eficiencia: 90.9,
      },
    ],
  },
  "11": {
    // Noviembre
    titulo: "Noviembre 2025",
    datos: [
      {
        responsable: "Pedro Sánchez",
        prestamos: 88,
        devATiempo: 85,
        eficiencia: 96.6,
      },
      {
        responsable: "Ana Torres",
        prestamos: 123,
        devATiempo: 119,
        eficiencia: 96.7,
      },
      {
        responsable: "María López",
        prestamos: 103,
        devATiempo: 98,
        eficiencia: 95.1,
      },
      {
        responsable: "Juan Rodríguez",
        prestamos: 78,
        devATiempo: 73,
        eficiencia: 93.6,
      },
      {
        responsable: "Carlos Gómez",
        prestamos: 68,
        devATiempo: 63,
        eficiencia: 92.6,
      },
    ],
  },
  "12": {
    // Diciembre
    titulo: "Diciembre 2025",
    datos: [
      {
        responsable: "Pedro Sánchez",
        prestamos: 81,
        devATiempo: 78,
        eficiencia: 96.3,
      },
      {
        responsable: "Ana Torres",
        prestamos: 116,
        devATiempo: 111,
        eficiencia: 95.7,
      },
      {
        responsable: "María López",
        prestamos: 96,
        devATiempo: 90,
        eficiencia: 93.8,
      },
      {
        responsable: "Juan Rodríguez",
        prestamos: 71,
        devATiempo: 65,
        eficiencia: 91.5,
      },
      {
        responsable: "Carlos Gómez",
        prestamos: 61,
        devATiempo: 55,
        eficiencia: 90.2,
      },
    ],
  },
};

// Obtener el mes actual (3 para marzo)
const getMesActual = () => {
  const fecha = new Date();
  return fecha.getMonth() + 1; // getMonth() devuelve 0-11, sumamos 1 para obtener 1-12
};

// Función para determinar el color de la eficiencia
const getEficienciaColor = (eficiencia: number) => {
  if (eficiencia >= 95) return "text-green-600";
  if (eficiencia >= 90) return "text-blue-600";
  return "text-amber-600";
};

export default function RendimientoDevoluciones() {
  // Estado para el mes seleccionado (por defecto el mes actual)
  const [mesSeleccionado, setMesSeleccionado] = useState(
    getMesActual().toString(),
  );

  // Datos del mes seleccionado
  const datosDelMes =
    datosPorMes[mesSeleccionado as keyof typeof datosPorMes].datos;
  const tituloMes =
    datosPorMes[mesSeleccionado as keyof typeof datosPorMes].titulo;

  // Datos para el gráfico
  const datosGrafico = datosDelMes.map((item) => ({
    name: item.responsable.split(" ")[0], // Solo el primer nombre para el gráfico
    eficiencia: item.eficiencia,
    prestamos: item.prestamos,
    devATiempo: item.devATiempo,
  }));

  return (
    <div className="container py-10">
      <div className="mb-6 flex items-center">
        <Button variant="ghost" size="sm" asChild className="mr-4">
          <Link href="admin/reportes">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Rendimiento en Devoluciones</h1>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Eficiencia Operativa por Bibliotecario</CardTitle>
              <CardDescription>
                Métricas de rendimiento en devoluciones - {tituloMes}
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
          <div className="mb-10 h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ChartContainer
                config={{
                  eficiencia: {
                    label: "% Eficiencia",
                    color: "hsl(var(--chart-1))",
                  },
                }}
              >
                <BarChart
                  data={datosGrafico}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <XAxis dataKey="name" />
                  <YAxis domain={[85, 100]} />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        formatValue={(value, name) => {
                          if (name === "eficiencia") return `${value}%`;
                          return value;
                        }}
                      />
                    }
                  />
                  <Bar
                    dataKey="eficiencia"
                    fill="var(--color-eficiencia)"
                    radius={[4, 4, 0, 0]}
                    barSize={40}
                  />
                </BarChart>
              </ChartContainer>
            </ResponsiveContainer>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Responsable</TableHead>
                <TableHead className="text-center">Préstamos</TableHead>
                <TableHead className="text-center">Dev. a Tiempo</TableHead>
                <TableHead className="text-center">% Eficiencia</TableHead>
                <TableHead>Evaluación</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {datosDelMes.map((item) => (
                <TableRow key={item.responsable}>
                  <TableCell className="font-medium">
                    {item.responsable}
                  </TableCell>
                  <TableCell className="text-center">
                    {item.prestamos}
                  </TableCell>
                  <TableCell className="text-center">
                    {item.devATiempo}
                  </TableCell>
                  <TableCell
                    className={`text-center font-semibold ${getEficienciaColor(item.eficiencia)}`}
                  >
                    {item.eficiencia}%
                  </TableCell>
                  <TableCell>
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${
                        item.eficiencia >= 95
                          ? "bg-green-100 text-green-800"
                          : item.eficiencia >= 90
                            ? "bg-blue-100 text-blue-800"
                            : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {item.eficiencia >= 95
                        ? "Excelente"
                        : item.eficiencia >= 90
                          ? "Bueno"
                          : "Regular"}
                    </span>
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
          <Button variant="outline">Ver tendencia anual</Button>
          <Button>Exportar a Excel</Button>
        </div>
      </div>
    </div>
  );
}
