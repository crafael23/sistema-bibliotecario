import {
  BookOpen,
  DollarSign,
  Users,
  TrendingUp,
  BarChart,
  FileText,
} from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "~/components/ui/card";

export default function AdminPage() {
  return (
    <div>
      <div className="grid w-full place-items-center gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Link href="reportes/detallados/inventario">
          <Card className="h-full transition-all hover:shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Inventario de Libros
              </CardTitle>
              <CardDescription>
                Control físico y gestión de stock
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Visualiza el inventario completo de libros con información
                detallada sobre su estado y disponibilidad.
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="reportes/detallados/multas">
          <Card className="h-full transition-all hover:shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                Multas Pendientes
              </CardTitle>
              <CardDescription>Seguimiento de deudas activas</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Monitorea las multas pendientes de pago y los días de retraso
                acumulados.
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="reportes/detallados/historial">
          <Card className="h-full transition-all hover:shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Préstamos por Usuario
              </CardTitle>
              <CardDescription>
                Análisis de comportamiento individual
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Revisa el historial de préstamos por usuario para analizar
                patrones de comportamiento.
              </p>
            </CardContent>
          </Card>
        </Link>
        <Link href="reportes/detallados/movimientos">
          <Card className="h-full transition-all hover:shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Registro de Movimientos de Libros
              </CardTitle>
              <CardDescription>
                Trazabilidad completa de ejemplares
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Revisa el historial de movimientos de libros especificos para
                determinar la localización y el estado de los ejemplares.
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="reportes/sintetizados/tendencias">
          <Card className="h-full transition-all hover:shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Tendencias de Préstamos
              </CardTitle>
              <CardDescription>Comparativo anual de préstamos</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Analiza las tendencias de préstamos con comparativos anuales y
                porcentajes de crecimiento.
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="reportes/sintetizados/categorias">
          <Card className="h-full transition-all hover:shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart className="h-5 w-5 text-primary" />
                Estadísticas por Categoría
              </CardTitle>
              <CardDescription>
                Mapa de calor por franjas horarias
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Visualiza las estadísticas de préstamos por categoría y franja
                horaria.
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="reportes/sintetizados/rendimiento-devoluciones">
          <Card className="h-full transition-all hover:shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart className="h-5 w-5 text-primary" />
                Rendimiento en devoluciones
              </CardTitle>
              <CardDescription>
                Analiza el rendimiento de los libros en devoluciones
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Visualiza el rendimiento de los libros en devoluciones de cada
                usuario responsable del mismo.
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="reportes/sintetizados/distribucion-multas">
          <Card className="h-full transition-all hover:shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart className="h-5 w-5 text-primary" />
                Distribución de multas
              </CardTitle>
              <CardDescription>
                Analiza la distribución de multas por categoría
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Visualiza la distribución de multas por categoría en base a un
                tiempo especifico.
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="reportes/excepcion/usuarios-sin-multas">
          <Card className="h-full transition-all hover:shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Top Usuarios Sin Multas
              </CardTitle>
              <CardDescription>Usuarios activos sin multas</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Identifica a los usuarios más activos que no han recibido multas
                en el último año.
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
