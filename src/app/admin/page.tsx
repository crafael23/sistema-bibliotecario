import { PageHeader } from "~/components/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Book, FileText, Users } from "lucide-react"
import Link from "next/link"

export default function AdminHomePage() {
  return (
    <>
      <PageHeader title="Página Principal" icon={<Book className="h-6 w-6" />} />
      <main className="flex-1 p-4 md:p-6 overflow-auto w-full">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 w-full">
          <Link href="/admin/inventario" className="block">
            <Card className="hover:bg-white/100 transition-colors cursor-pointer h-full bg-gray-100 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Book className="h-5 w-5" />
                  Inventario de Libros
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>Gestión completa del catálogo de libros</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/usuarios" className="block">
            <Card className="hover:bg-white/100 transition-colors cursor-pointer h-full bg-gray-100 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Gestión de Usuarios
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>Administración de usuarios y préstamos</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/reportes" className="block">
            <Card className="hover:bg-white/100 transition-colors cursor-pointer h-full bg-gray-100 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Reportes del Sistema
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>Estadísticas y reportes detallados</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </main>
    </>
  )
}

