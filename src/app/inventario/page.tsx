import { Button } from "~/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table"

// Esto normalmente vendría de tu base de datos
const libros = [
  { id: 1, titulo: "El Gran Gatsby", autor: "F. Scott Fitzgerald", estado: "Disponible", copias: 3 },
  { id: 2, titulo: "Matar a un Ruiseñor", autor: "Harper Lee", estado: "Reservado", copias: 2 },
  { id: 3, titulo: "1984", autor: "George Orwell", estado: "Prestado", copias: 1 },
]

export default function InventoryPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Gestión de Inventario</h1>
      <Button className="mb-4">Añadir Nuevo Libro</Button>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Título</TableHead>
            <TableHead>Autor</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Copias</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {libros.map((libro) => (
            <TableRow key={libro.id}>
              <TableCell>{libro.titulo}</TableCell>
              <TableCell>{libro.autor}</TableCell>
              <TableCell>{libro.estado}</TableCell>
              <TableCell>{libro.copias}</TableCell>
              <TableCell>
                <Button variant="outline" size="sm" className="mr-2">
                  Editar
                </Button>
                <Button variant="outline" size="sm">
                  Actualizar Estado
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

