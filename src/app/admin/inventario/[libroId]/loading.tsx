import { PageHeader } from "~/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Book, MapPin } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Skeleton } from "~/components/ui/skeleton";

export default function LoadingLibroDetails() {
  return (
    <>
      <PageHeader
        title="Cargando detalles del libro..."
        icon={<Book className="h-6 w-6" />}
        backUrl="/admin/inventario"
      />
      <main className="w-full flex-1 overflow-auto px-4 pb-6 md:px-6">
        <div className="grid gap-6 md:grid-cols-3">
          {/* Imagen y detalles básicos - Skeleton */}
          <Card className="bg-white shadow-md md:col-span-1">
            <CardHeader>
              <CardTitle className="text-center">Portada</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Skeleton className="h-64 w-48" />
            </CardContent>
          </Card>

          {/* Información del libro - Skeleton */}
          <Card className="bg-white shadow-md md:col-span-2">
            <CardHeader>
              <CardTitle>Información del Libro</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i}>
                    <Skeleton className="mb-2 h-4 w-20" />
                    <Skeleton className="h-6 w-full" />
                  </div>
                ))}
                <div className="col-span-full">
                  <Skeleton className="mb-2 h-4 w-24" />
                  <Skeleton className="h-24 w-full" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabla de copias - Skeleton */}
          <Card className="bg-white shadow-md md:col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                <span>Ejemplares</span>
                <Skeleton className="ml-1 inline-block h-5 w-8" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Localización</TableHead>
                      <TableHead>Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Array.from({ length: 3 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <Skeleton className="h-5 w-8" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-5 w-32" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-6 w-20 rounded-full" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
