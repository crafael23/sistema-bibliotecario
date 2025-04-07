"use client";

import { type UseFormReturn } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Loader2, Info, Plus } from "lucide-react";
import { type newLibroCopiaSchema } from "../schemas";
import { type z } from "zod";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { ConfirmationDialog } from "./ConfirmationDialog";

type NewCopiaFormValues = z.infer<typeof newLibroCopiaSchema>;

interface NewCopiaFormProps {
  form: UseFormReturn<NewCopiaFormValues>;
  isSubmitting: boolean;
  showConfirmDialog: boolean;
  setShowConfirmDialog: (show: boolean) => void;
  onPrepareSubmit: () => void;
  onConfirmSubmit: () => void;
  libroNombre: string;
}

export function NewCopiaForm({
  form,
  isSubmitting,
  showConfirmDialog,
  setShowConfirmDialog,
  onPrepareSubmit,
  onConfirmSubmit,
  libroNombre,
}: NewCopiaFormProps) {
  return (
    <>
      <Form {...form}>
        <form
          className="space-y-6"
          onSubmit={form.handleSubmit(onPrepareSubmit)}
        >
          <div>
            <FormLabel className="text-lg font-medium">
              Agregar Nuevo Ejemplar
            </FormLabel>
            <FormDescription>
              Agregar un nuevo ejemplar para el libro:{" "}
              <strong>{libroNombre}</strong>
            </FormDescription>
          </div>

          {/* Localizacion */}
          <FormField
            control={form.control}
            name="localizacion"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Localización
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="ml-1 h-3.5 w-3.5 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-[300px]">
                        Formato: 000-000-000 (Estantería-Estante-Posición)
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isSubmitting}
                    placeholder="000-000-000"
                  />
                </FormControl>
                <FormDescription>
                  Ingrese la localización física del ejemplar en la biblioteca
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Plus className="mr-2 h-4 w-4" />
              )}
              Agregar Ejemplar
            </Button>
          </div>
        </form>
      </Form>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        title="Confirmar Nuevo Ejemplar"
        description={`¿Está seguro que desea agregar un nuevo ejemplar para el libro "${libroNombre}"?`}
        confirmLabel="Agregar"
        cancelLabel="Cancelar"
        onConfirm={onConfirmSubmit}
        isSubmitting={isSubmitting}
      />
    </>
  );
}
