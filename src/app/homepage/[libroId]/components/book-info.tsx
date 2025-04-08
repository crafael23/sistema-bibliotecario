"use client";

import Image from "next/image";
import { Card, CardContent } from "~/components/ui/card";

type BookInfoProps = {
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

export default function BookInfo({
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
}: BookInfoProps) {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
      <div className="md:col-span-4 lg:col-span-5">
        <div className="sticky top-4">
          <div className="flex justify-center">
            <div className="relative aspect-[2/3] w-full max-w-[350px] overflow-hidden rounded-md shadow-md">
              <Image
                src={
                  urlImagenPortada || "/placeholder.svg?height=450&width=300"
                }
                alt={nombre}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </div>

      <div className="md:col-span-8 lg:col-span-7">
        <Card>
          <CardContent className="p-6">
            <div>
              <h1 className="text-2xl font-bold md:text-3xl">{nombre}</h1>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-lg text-gray-600">por {autor}</span>
                <span className="ml-2 rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                  {categoria}
                </span>
              </div>

              <hr className="my-6 border-gray-200" />

              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Disponibilidad:</span>
                  <span>
                    {copias > 0 ? (
                      <span className="rounded-full border border-green-200 bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
                        {copias} disponible{copias !== 1 ? "s" : ""}
                      </span>
                    ) : (
                      <span className="rounded-full border border-red-200 bg-red-50 px-2 py-1 text-xs font-medium text-red-700">
                        No disponible
                      </span>
                    )}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-medium">Código:</span>
                  <span className="font-mono">{codigo}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-medium">ISBN:</span>
                  <span className="font-mono">{isbn}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-medium">Edición:</span>
                  <span>{edicion}ª Edición</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-medium">Editorial:</span>
                  <span>{editorial}</span>
                </div>
              </div>

              <hr className="my-6 border-gray-200" />

              <div>
                <h2 className="mb-4 text-xl font-semibold">Descripción</h2>
                <div className="text-gray-600">
                  <p>{descripcion}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
