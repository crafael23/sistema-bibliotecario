import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import Link from "next/link";
import SeedButton from "~/components/seed-button";
import { seedDataLibros } from "~/server/db/seeding";

export default function Home() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Gestión de Inventario</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            Administra y actualiza el inventario de libros de la biblioteca.
          </p>
          <Link
            href="/inventario"
            className="mt-2 inline-block text-blue-600 hover:underline"
          >
            Ir al Inventario
          </Link>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Reservas de Libros</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Reserva libros por períodos de tiempo específicos.</p>
          <Link
            href="/reservar"
            className="mt-2 inline-block text-blue-600 hover:underline"
          >
            Reservar un Libro
          </Link>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Perfil de Usuario</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Ver y gestionar tu perfil y reservas.</p>
          <Link
            href="/perfil"
            className="mt-2 inline-block text-blue-600 hover:underline"
          >
            Ir al Perfil
          </Link>
        </CardContent>
      </Card>
      <SeedButton action={seedDataLibros} />
    </div>
  );
}
