"use client";

import React from "react";
import { Button } from "~/components/ui/button";
import { Check, MapPin } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "~/components/ui/dialog";
import { ScrollArea } from "~/components/ui/scroll-area";
import { UseFormReturn } from "react-hook-form";
import { libroFormSchema, libroCopiaLocationSchema } from "../schemas";
import { z } from "zod";

type LocationsReviewDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  libroForm: UseFormReturn<z.infer<typeof libroFormSchema>>;
  copiaLocations: z.infer<typeof libroCopiaLocationSchema>[];
  onConfirm: () => void;
  isSubmitting: boolean;
};

export const LocationsReviewDialog: React.FC<LocationsReviewDialogProps> = ({
  open,
  onOpenChange,
  libroForm,
  copiaLocations,
  onConfirm,
  isSubmitting,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            Revisar localizaciones
          </DialogTitle>
          <DialogDescription className="text-center">
            Por favor, confirme las localizaciones de los ejemplares antes de
            finalizar.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          <div className="mb-4">
            <h3 className="text-lg font-bold">
              {libroForm.getValues("title")}
            </h3>
            <p className="text-sm text-muted-foreground">
              por {libroForm.getValues("author")}
            </p>
          </div>

          <div className="rounded-md border bg-slate-50 p-3">
            <h4 className="mb-2 text-sm font-medium">
              Localizaciones de los ejemplares
            </h4>
            <ScrollArea className="h-48 w-full">
              <div className="space-y-2">
                {copiaLocations.map((copia, index) => (
                  <div
                    key={index}
                    className="flex items-center rounded-md bg-white p-2 shadow-sm"
                  >
                    <div className="mr-2 flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                      {index + 1}
                    </div>
                    <div className="flex flex-1 items-center">
                      <MapPin className="mr-2 h-4 w-4 text-slate-400" />
                      <span>{copia.localizacion}</span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          <div className="rounded-md bg-yellow-50 p-3 text-sm text-yellow-800">
            <p>
              Una vez confirmado, no podrá modificar las localizaciones sin
              crear un nuevo registro. Por favor, revise cuidadosamente.
            </p>
          </div>
        </div>

        <DialogFooter className="flex gap-2 sm:justify-between">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Modificar
          </Button>
          <Button
            className="bg-green-600 text-white hover:bg-green-700"
            onClick={onConfirm}
            disabled={isSubmitting}
          >
            <Check className="mr-2 h-4 w-4" /> Confirmar y guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
