"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { BookOpen } from "lucide-react";
import { useState } from "react";

type BookCardProps = {
  id: number;
  codigo: string;
  nombre: string;
  categoria: string;
  autor: string;
  isbn: string;
  edicion: number;
  descripcion: string;
  editorial: string;
  urlImagenPortada: string;
  copias: number;
};

export default function BookCard({
  id,
  codigo,
  nombre,
  categoria,
  autor,
  isbn,
  edicion,
  descripcion,
  editorial,
  urlImagenPortada,
  copias,
}: BookCardProps) {
  const [imageError, setImageError] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);

  const handleImageError = () => {
    setImageError(true);
    setIsImageLoading(false);
  };

  const handleImageLoad = () => {
    setIsImageLoading(false);
  };

  return (
    <Card className="flex flex-col overflow-hidden transition-all hover:shadow-lg">
      <div className="relative flex justify-center px-4 pt-4">
        <div className="absolute right-6 top-6 z-10">
          {copias > 0 ? (
            <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
              {copias} disponible{copias !== 1 ? "s" : ""}
            </span>
          ) : (
            <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800">
              No disponible
            </span>
          )}
        </div>
        <div className="relative h-[300px] w-[200px]">
          {isImageLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-primary" />
            </div>
          )}
          <Image
            src={imageError ? "/placeholder.svg" : urlImagenPortada}
            alt={nombre}
            fill
            className={`rounded-md object-cover transition-opacity duration-300 ${
              isImageLoading ? "opacity-0" : "opacity-100"
            }`}
            onError={handleImageError}
            onLoad={handleImageLoad}
            priority={false}
            loading="lazy"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </div>
      <CardContent className="flex-grow pt-4">
        <h3 className="line-clamp-1 text-lg font-semibold">{nombre}</h3>
        <p className="mb-1 text-sm text-muted-foreground">{autor}</p>
        <p className="mb-2 text-xs text-muted-foreground">
          {editorial}, {edicion}ª Edición
        </p>
        <p className="line-clamp-2 text-xs text-muted-foreground">
          {descripcion}
        </p>
      </CardContent>
      <CardFooter className="pt-0">
        <Button
          className="w-full"
          variant="outline"
          asChild
          disabled={copias === 0}
        >
          <Link href={`/homepage/${id}`}>
            <BookOpen className="mr-2 h-4 w-4" />
            Ver detalles
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
