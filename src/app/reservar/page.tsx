import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

// Esto normalmente vendría de tu base de datos
const libros = [
  {
    id: 1,
    titulo: "El Gran Gatsby",
    autor: "F. Scott Fitzgerald",
    disponible: true,
  },
  {
    id: 2,
    titulo: "Matar a un Ruiseñor",
    autor: "Harper Lee",
    disponible: false,
  },
  { id: 3, titulo: "1984", autor: "George Orwell", disponible: true },
];

export default function ReservePage() {
  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Reserva de Libros</h1>
      <div className="mb-4">
        <Label htmlFor="search">Buscar Libros</Label>
        <Input
          id="search"
          placeholder="Ingrese título o autor del libro"
          className="max-w-sm"
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Título</TableHead>
            <TableHead>Autor</TableHead>
            <TableHead>Disponibilidad</TableHead>
            <TableHead>Acción</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {libros.map((libro) => (
            <TableRow key={libro.id}>
              <TableCell>{libro.titulo}</TableCell>
              <TableCell>{libro.autor}</TableCell>
              <TableCell>
                {libro.disponible ? "Disponible" : "No Disponible"}
              </TableCell>
              <TableCell>
                <Button disabled={!libro.disponible}>
                  {libro.disponible ? "Reservar" : "Unirse a Lista de Espera"}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
