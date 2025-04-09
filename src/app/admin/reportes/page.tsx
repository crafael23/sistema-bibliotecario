import { PageHeader } from "~/components/page-header";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Book,
  FileText,
  History,
  ArrowUpDown,
  TrendingUp,
  BookOpen,
  BarChart,
  DollarSign,
  Award,
} from "lucide-react";
import Link from "next/link";
import SeedDemoButton from "~/components/seed-demo-button";
import { generateReportsDemoData } from "./actions";

export default function ReportesPage() {
  return (
    <>
      <PageHeader
        title="Reportes del Sistema"
        icon={<FileText className="h-6 w-6" />}
        action={<SeedDemoButton action={generateReportsDemoData} />}
      />
      <main className="w-full flex-1 overflow-auto p-4 md:p-6">
        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/admin/reportes/detallados/inventario"
            className="block h-full"
          >
            <Card className="h-full cursor-pointer bg-gray-100 shadow-md transition-colors hover:bg-white/100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Book className="h-5 w-5 flex-shrink-0" />
                  <span className="line-clamp-2">
                    Reporte de inventario completo de libros
                  </span>
                </CardTitle>
                <CardDescription>
                  Listado detallado de todos los libros en el sistema
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link
            href="/admin/reportes/detallados/multas"
            className="block h-full"
          >
            <Card className="h-full cursor-pointer bg-gray-100 shadow-md transition-colors hover:bg-white/100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <DollarSign className="h-5 w-5 flex-shrink-0" />
                  <span className="line-clamp-2">
                    Reporte de multas pendientes
                  </span>
                </CardTitle>
                <CardDescription>
                  Usuarios con multas activas por retrasos
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link
            href="/admin/reportes/detallados/historial"
            className="block h-full"
          >
            <Card className="h-full cursor-pointer bg-gray-100 shadow-md transition-colors hover:bg-white/100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <History className="h-5 w-5 flex-shrink-0" />
                  <span className="line-clamp-2">
                    Reporte de historial de préstamos por usuarios
                  </span>
                </CardTitle>
                <CardDescription>
                  Historial completo de préstamos por usuario
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link
            href="/admin/reportes/detallados/movimientos"
            className="block h-full"
          >
            <Card className="h-full cursor-pointer bg-gray-100 shadow-md transition-colors hover:bg-white/100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <ArrowUpDown className="h-5 w-5 flex-shrink-0" />
                  <span className="line-clamp-2">
                    Registro de movimientos de libros
                  </span>
                </CardTitle>
                <CardDescription>
                  Entradas y salidas de libros del inventario
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link
            href="/admin/reportes/sintetizados/tendencias"
            className="block h-full"
          >
            <Card className="h-full cursor-pointer bg-gray-100 shadow-md transition-colors hover:bg-white/100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <TrendingUp className="h-5 w-5 flex-shrink-0" />
                  <span className="line-clamp-2">
                    Reporte de tendencia de préstamos
                  </span>
                </CardTitle>
                <CardDescription>
                  Análisis de tendencias de préstamos por período
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link
            href="/admin/reportes/sintetizados/categorias"
            className="block h-full"
          >
            <Card className="h-full cursor-pointer bg-gray-100 shadow-md transition-colors hover:bg-white/100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <BookOpen className="h-5 w-5 flex-shrink-0" />
                  <span className="line-clamp-2">
                    Reporte de estadísticas por categoría de libro
                  </span>
                </CardTitle>
                <CardDescription>
                  Estadísticas de préstamos por categoría
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link
            href="/admin/reportes/sintetizados/rendimiento-devoluciones"
            className="block h-full"
          >
            <Card className="h-full cursor-pointer bg-gray-100 shadow-md transition-colors hover:bg-white/100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <BarChart className="h-5 w-5 flex-shrink-0" />
                  <span className="line-clamp-2">
                    Reporte de rendimiento en las devoluciones
                  </span>
                </CardTitle>
                <CardDescription>
                  Análisis de tiempos de devolución
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link
            href="/admin/reportes/sintetizados/distribucion-multas"
            className="block h-full"
          >
            <Card className="h-full cursor-pointer bg-gray-100 shadow-md transition-colors hover:bg-white/100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <DollarSign className="h-5 w-5 flex-shrink-0" />
                  <span className="line-clamp-2">
                    Reporte de distribución de multas
                  </span>
                </CardTitle>
                <CardDescription>
                  Análisis de multas por tipo y monto
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link
            href="/admin/reportes/excepcion/usuarios-sin-multas"
            className="block h-full"
          >
            <Card className="h-full cursor-pointer bg-gray-100 shadow-md transition-colors hover:bg-white/100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Award className="h-5 w-5 flex-shrink-0" />
                  <span className="line-clamp-2">Top usuarios sin multas</span>
                </CardTitle>
                <CardDescription>
                  Mejores usuarios sin multas en el último año
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </main>
    </>
  );
}
