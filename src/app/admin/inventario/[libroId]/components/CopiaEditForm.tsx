"use client";

import { type UseFormReturn } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Button } from "~/components/ui/button";
import { Loader2, Info } from "lucide-react";
import { type libroCopiaEditSchema } from "../schemas";
import { type z } from "zod";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { ConfirmationDialog } from "./ConfirmationDialog";
import { estadoLibroEnum } from "~/server/db/schema";

type CopiaEditFormValues = z.infer<typeof libroCopiaEditSchema>;

interface CopiaEditFormProps {
  form: UseFormReturn<CopiaEditFormValues>;
  isSubmitting: boolean;
  showConfirmDialog: boolean;
  setShowConfirmDialog: (show: boolean) => void;
  onPrepareSubmit: () => void;
  onConfirmSubmit: () => void;
  copiaId: number;
}

export function CopiaEditForm({
  form,
  isSubmitting,
  showConfirmDialog,
  setShowConfirmDialog,
  onPrepareSubmit,
  onConfirmSubmit,
  copiaId,
}: CopiaEditFormProps) {
  return (
    <>
      <Form {...form}>
        <form
          className="space-y-6"
          onSubmit={form.handleSubmit(onPrepareSubmit)}
        >
          <div className="grid gap-6 md:grid-cols-2">
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
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Estado */}
            <FormField
              control={form.control}
              name="estado"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Estado
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="ml-1 h-3.5 w-3.5 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[300px]">
                          Seleccione el estado actual del ejemplar
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </FormLabel>
                  <Select
                    disabled={isSubmitting}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar estado" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {estadoLibroEnum.enumValues.map((estado) => (
                        <SelectItem
                          key={estado}
                          value={estado}
                          className={getEstadoClass(estado)}
                        >
                          {capitalizeFirstLetter(estado)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Guardar Cambios
            </Button>
          </div>
        </form>
      </Form>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        title="Confirmar Cambios"
        description={`¿Está seguro que desea actualizar la información del ejemplar #${copiaId}?`}
        confirmLabel="Actualizar"
        cancelLabel="Cancelar"
        onConfirm={onConfirmSubmit}
        isSubmitting={isSubmitting}
      />
    </>
  );
}

// Helper function to get classnames for estado
function getEstadoClass(estado: string): string {
  switch (estado) {
    case "disponible":
      return "text-green-600";
    case "prestado":
      return "text-yellow-600";
    case "reservado":
      return "text-blue-600";
    case "mantenimiento":
      return "text-red-600";
    default:
      return "";
  }
}

// Helper to capitalize first letter
function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
