"use client";

import React from "react";
import { Button } from "~/components/ui/button";
import { Check } from "lucide-react";
import { ScrollArea } from "~/components/ui/scroll-area";
import { type z } from "zod";
import { type libroCopiaLocationSchema } from "../schemas";

type CopiasProgressProps = {
  copiaLocations: z.infer<typeof libroCopiaLocationSchema>[];
  currentCopiaIndex: number;
  onSelectCopia: (index: number) => void;
};

export const CopiasProgress: React.FC<CopiasProgressProps> = ({
  copiaLocations,
  currentCopiaIndex,
  onSelectCopia,
}) => {
  return (
    <div className="mt-8">
      <h3 className="mb-2 text-sm font-medium">Ejemplares ingresados:</h3>
      <div className="rounded-md border bg-white p-2">
        <ScrollArea className="h-32">
          {copiaLocations.map((copia, index) => (
            <div
              key={index}
              className={`mb-1 flex items-center justify-between rounded-md p-2 ${
                index === currentCopiaIndex
                  ? "bg-blue-50"
                  : copia.localizacion
                    ? "bg-green-50"
                    : "bg-gray-50"
              }`}
            >
              <div className="flex items-center">
                <span className="mr-2 font-medium">#{index + 1}</span>
                {copia.localizacion ? (
                  <>
                    <span>{copia.localizacion}</span>
                    {index !== currentCopiaIndex && (
                      <Check className="ml-2 h-4 w-4 text-green-500" />
                    )}
                  </>
                ) : (
                  <span className="text-gray-400">Pendiente</span>
                )}
              </div>

              {copia.localizacion && index !== currentCopiaIndex && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onSelectCopia(index)}
                >
                  Editar
                </Button>
              )}
            </div>
          ))}
        </ScrollArea>
      </div>
    </div>
  );
};
