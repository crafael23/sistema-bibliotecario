import { Button } from "~/components/ui/button"
import { Book } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-[#61cee2] to-[#f34638]">
      <div className="text-center">
        <div className="mb-8 flex justify-center">
          <Book className="h-16 w-16 text-white" />
        </div>
        <h1 className="mb-6 text-4xl font-bold text-white">Sistema Bibliotecario</h1>
        <p className="mb-8 text-xl text-white">Bienvenido al sistema de gestión para bibliotecas</p>
        <Link href="/admin">
          <Button className="bg-white text-black hover:bg-gray-100">Ir a la ruta de administrador</Button>
        </Link>
      </div>
    </div>
  )
}

