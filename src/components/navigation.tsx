import Link from "next/link"
import { Button } from "~/components/ui/button"

export default function Navigation() {
  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="text-xl font-bold">
            Gestión de Biblioteca
          </Link>
          <div className="space-x-4">
            <Button variant="ghost" asChild>
              <Link href="/inventario">Inventario</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/reservar">Reservar</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/perfil">Perfil</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}

