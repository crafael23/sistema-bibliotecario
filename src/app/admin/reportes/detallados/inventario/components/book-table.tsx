"use client";

import { useState } from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "~/components/ui/table";
import { Input } from "~/components/ui/input";
import { Book } from "~/app/admin/reportes/types";

interface BookTableProps {
  books: Book[];
}

export function BookTable({ books }: BookTableProps) {
  const [filter, setFilter] = useState("");

  const filteredBooks = books.filter((book) =>
    book.nombre.toLowerCase().includes(filter.toLowerCase()),
  );

  return (
    <>
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Buscar por nombre..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full"
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Categoría</TableHead>
            <TableHead>Autor</TableHead>
            <TableHead>Código</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-center">Cantidad</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredBooks.map((book) => (
            <TableRow key={book.id}>
              <TableCell className="font-medium">{book.nombre}</TableCell>
              <TableCell>{book.categoria}</TableCell>
              <TableCell>{book.autor}</TableCell>
              <TableCell>{book.codigo}</TableCell>
              <TableCell>
                <span
                  className={`rounded-full px-2 py-1 text-xs font-medium ${
                    book.estado === "disponible"
                      ? "bg-green-100 text-green-800"
                      : book.estado === "mantenimiento"
                        ? "bg-yellow-100 text-yellow-800"
                        : book.estado === "prestado"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-purple-100 text-purple-800"
                  }`}
                >
                  {book.estado}
                </span>
              </TableCell>
              <TableCell className="text-center">{book.cantidad}</TableCell>
            </TableRow>
          ))}
          {filteredBooks.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No se encontraron libros.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}
