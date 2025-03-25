"use client";

import { enumUtil } from "node_modules/zod/lib/helpers/enumUtil";
import { useState } from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "~/components/ui/table";

interface Book {
  id: number;
  nombre: string;
  categoria: string;
  estado: "disponible" | "mantenimiento" | "prestado" | "reservado";
  cantidad: number;
}

interface FilteredTableProps {
  books: Book[];
}

export function FilteredTable({ books }: FilteredTableProps) {
  const [filter, setFilter] = useState("");

  const filteredBooks = books.filter((book) =>
    book.nombre.toLowerCase().includes(filter.toLowerCase()),
  );

  return (
    <>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full rounded border p-2"
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Categoría</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-center">Cantidad</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredBooks.map((book) => (
            <TableRow key={book.id}>
              <TableCell>{book.nombre}</TableCell>
              <TableCell>{book.categoria}</TableCell>
              <TableCell>
                <span
                  className={`rounded-full px-2 py-1 text-xs font-medium ${
                    book.estado === "disponible"
                      ? "bg-green-100 text-green-800"
                      : book.estado === "mantenimiento"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {book.estado}
                </span>
              </TableCell>
              <TableCell className="text-center">{book.cantidad}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
