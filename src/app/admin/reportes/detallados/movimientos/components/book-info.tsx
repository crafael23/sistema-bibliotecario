"use client";

import { BookSummary } from "~/app/admin/reportes/types";
import { Book, BookOpen, Bookmark } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";

interface BookInfoProps {
  book: BookSummary;
}

export function BookInfo({ book }: BookInfoProps) {
  return (
    <Card className="mb-6 border-amber-200 bg-amber-50">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-amber-800">
          <BookOpen className="h-5 w-5" /> {book.nombre}
        </CardTitle>
        <CardDescription className="text-amber-700">
          ISBN: {book.isbn || "No disponible"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <div className="flex items-center gap-2 text-sm text-amber-700">
            <Book className="h-4 w-4" />
            <span>
              Autor: <strong>{book.autor}</strong>
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-amber-700">
            <Bookmark className="h-4 w-4" />
            <span>
              Categoría: <strong>{book.categoria}</strong>
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-amber-700">
            <span>
              Editorial: <strong>{book.editorial}</strong>
            </span>
          </div>
          <div className="ml-auto">
            <Badge variant="outline" className="bg-green-100 text-green-800">
              Código: {book.codigo}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
