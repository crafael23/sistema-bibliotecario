import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import Link from "next/link"

export default function Home() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Gestión de Inventario</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Administra y actualiza el inventario de libros de la biblioteca.</p>
          <Link href="/inventario" className="text-blue-600 hover:underline mt-2 inline-block">
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
          <Link href="/reservar" className="text-blue-600 hover:underline mt-2 inline-block">
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
          <Link href="/perfil" className="text-blue-600 hover:underline mt-2 inline-block">
            Ir al Perfil
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}

