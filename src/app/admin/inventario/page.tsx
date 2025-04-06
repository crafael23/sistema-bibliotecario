"use client"

import { useState } from "react"
import { PageHeader } from "~/components/page-header"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table"
import { Book } from "lucide-react"

export default function InventarioPage() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <>
      <PageHeader
        title="Inventario de Libros"
        icon={<Book className="h-6 w-6" />}
        showSearch={true}
        showAddButton={true}
        searchPlaceholder="Buscar libros..."
        onSearch={setSearchQuery}
      />
      <main className="flex-1 px-4 md:px-6 pb-6 overflow-auto w-full">
        <div className="rounded-md border bg-gray-100 shadow-md w-full">
          <div className="overflow-x-auto w-full">
            <Table className="w-full min-w-[800px]">
              <TableHeader className="bg-gray-200">
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead>Autor</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Ejemplares</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10">
                    No hay libros registrados en el sistema.
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </main>
    </>
  )
}

