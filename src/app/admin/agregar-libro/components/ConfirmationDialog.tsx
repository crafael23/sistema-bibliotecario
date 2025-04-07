"use client";

import React from "react";
import { type UseFormReturn } from "react-hook-form";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "~/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { DialogImagePreview } from "./DialogImagePreview";
import { type libroFormSchema } from "../schemas";
import { type z } from "zod";

type ConfirmationDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: UseFormReturn<z.infer<typeof libroFormSchema>>;
  onConfirm: () => void;
};

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  open,
  onOpenChange,
  form,
  onConfirm,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmar información del libro</DialogTitle>
          <DialogDescription>
            Por favor, revise la información del libro antes de continuar.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          <div className="flex items-start gap-4">
            <DialogImagePreview form={form} />

            <div>
              <h3 className="text-lg font-bold">{form.getValues("title")}</h3>
              <p className="text-sm text-muted-foreground">
                por {form.getValues("author")}
              </p>
            </div>
          </div>

          <Accordion type="single" collapsible defaultValue="details">
            <AccordionItem value="details">
              <AccordionTrigger>Detalles del libro</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-sm font-semibold">ISBN:</p>
                      <p className="text-sm">{form.getValues("isbn")}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Categoría:</p>
                      <p className="text-sm">{form.getValues("category")}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Editorial:</p>
                      <p className="text-sm">
                        {form.getValues("publisher") ?? "No especificada"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Edición:</p>
                      <p className="text-sm">
                        {form.getValues("edition") ?? "No especificada"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Ejemplares:</p>
                      <p className="text-sm">{form.getValues("copies")}</p>
                    </div>
                  </div>

                  {form.getValues("description") && (
                    <div>
                      <p className="text-sm font-semibold">Descripción:</p>
                      <p className="text-sm">{form.getValues("description")}</p>
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <DialogFooter className="mt-4 flex justify-between sm:justify-between">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Editar
          </Button>
          <Button
            className="bg-blue-600 text-white hover:bg-blue-700"
            onClick={onConfirm}
          >
            Continuar con ejemplares
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
