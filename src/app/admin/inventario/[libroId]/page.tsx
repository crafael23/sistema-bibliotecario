import { getLibroWithCopias } from "~/server/db/queries";
import { PageHeader } from "~/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Book, MapPin, Tag, Info } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import Image from "next/image";
import { notFound } from "next/navigation";

// Define prop types for params
type Props = {
  params: {
    libroId: string;
  };
};

export default async function LibroDetailsPage({
  params,
}: {
  params: Promise<{ libroId: string }>;
}) {
  const { libroId } = await params;

  const parsedLibroId = parseInt(libroId, 10);

  if (isNaN(parsedLibroId)) {
    notFound();
  }

  // Fetch libro details using the getLibroWithCopias function
  const libroData = await getLibroWithCopias(Number(libroId));

  if (!libroData) {
    notFound();
  }

  return (
    <>
      <PageHeader
        title={`Detalles del Libro: ${libroData.nombre}`}
        icon={<Book className="h-6 w-6" />}
        backUrl="/admin/inventario"
      />
      <main className="w-full flex-1 overflow-auto px-4 pb-6 md:px-6">
        <div className="grid gap-6 md:grid-cols-3">
          {/* Imagen y detalles básicos */}
          <Card className="bg-white shadow-md md:col-span-1">
            <CardHeader>
              <CardTitle className="text-center">Portada</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <div className="relative h-64 w-48 overflow-hidden rounded-md shadow-sm">
                <Image
                  src={libroData.urlImagenPortada}
                  alt={`Portada de ${libroData.nombre}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 300px"
                  style={{ objectFit: "cover" }}
                  priority
                />
              </div>
            </CardContent>
          </Card>

          {/* Información del libro */}
          <Card className="bg-white shadow-md md:col-span-2">
            <CardHeader>
              <CardTitle>Información del Libro</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <dt className="flex items-center gap-1 font-medium text-gray-500">
                    <Tag className="h-4 w-4" />
                    Código
                  </dt>
                  <dd className="mt-1">{libroData.codigo}</dd>
                </div>

                <div>
                  <dt className="flex items-center gap-1 font-medium text-gray-500">
                    <Info className="h-4 w-4" />
                    ISBN
                  </dt>
                  <dd className="mt-1">{libroData.isbn}</dd>
                </div>

                <div>
                  <dt className="font-medium text-gray-500">Autor</dt>
                  <dd className="mt-1">{libroData.autor}</dd>
                </div>

                <div>
                  <dt className="font-medium text-gray-500">Categoría</dt>
                  <dd className="mt-1">{libroData.categoria}</dd>
                </div>

                <div>
                  <dt className="font-medium text-gray-500">Editorial</dt>
                  <dd className="mt-1">{libroData.editorial}</dd>
                </div>

                <div>
                  <dt className="font-medium text-gray-500">Edición</dt>
                  <dd className="mt-1">{libroData.edicion}</dd>
                </div>

                <div className="col-span-full">
                  <dt className="font-medium text-gray-500">Descripción</dt>
                  <dd className="mt-1">{libroData.descripcion}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          {/* Tabla de copias */}
          <Card className="bg-white shadow-md md:col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Ejemplares ({libroData.copias.length})
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
                    {libroData.copias.length > 0 ? (
                      libroData.copias.map((copia) => (
                        <TableRow key={copia.id}>
                          <TableCell>{copia.id}</TableCell>
                          <TableCell>{copia.localizacion}</TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getEstadoClasses(copia.estado)}`}
                            >
                              {copia.estado}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} className="py-4 text-center">
                          No hay ejemplares disponibles para este libro.
                        </TableCell>
                      </TableRow>
                    )}
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

// Helper function to get classes for estado
function getEstadoClasses(estado: string): string {
  switch (estado) {
    case "disponible":
      return "bg-green-100 text-green-800";
    case "prestado":
      return "bg-yellow-100 text-yellow-800";
    case "reservado":
      return "bg-blue-100 text-blue-800";
    case "mantenimiento":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}
