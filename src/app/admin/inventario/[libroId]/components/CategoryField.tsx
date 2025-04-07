"use client";

import React, { useState } from "react";
import { type UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { X, Info } from "lucide-react";
import { type libroEditSchema } from "../schemas";
import { type z } from "zod";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";

type CategoryFieldProps = {
  form: UseFormReturn<z.infer<typeof libroEditSchema>>;
  categorias: string[];
  isSubmitting: boolean;
};

export const CategoryField: React.FC<CategoryFieldProps> = React.memo(
  function CategoryField({ form, categorias, isSubmitting }) {
    const [isCustomCategoryMode, setIsCustomCategoryMode] = useState(false);

    return (
      <FormField
        control={form.control}
        name="category"
        render={({ field }) => {
          // Use this local variable to prevent field.value being undefined
          const selectValue = field.value || undefined;

          return (
            <FormItem>
              <FormLabel>
                Categoría
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="ml-1 h-3.5 w-3.5 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-[300px]">
                      Seleccione la categoría principal del libro o agregue una
                      nueva.
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </FormLabel>

              {!isCustomCategoryMode ? (
                <FormControl>
                  <Select
                    disabled={isSubmitting}
                    onValueChange={(value) => {
                      if (value === "agregar_nueva") {
                        setIsCustomCategoryMode(true);
                        field.onChange(""); // Clear the field value
                      } else {
                        field.onChange(value);
                      }
                    }}
                    value={selectValue}
                    defaultValue={selectValue}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="agregar_nueva">
                        + Agregar nueva categoría
                      </SelectItem>
                      {categorias.map((categoria) => (
                        <SelectItem key={categoria} value={categoria}>
                          {categoria}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
              ) : (
                <div className="flex gap-2">
                  <FormControl>
                    <Input
                      placeholder="Escribir nueva categoría"
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    disabled={isSubmitting}
                    onClick={() => {
                      setIsCustomCategoryMode(false);
                      field.onChange(""); // Reset the value
                    }}
                    title="Volver a seleccionar categoría existente"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
              <FormMessage />
            </FormItem>
          );
        }}
      />
    );
  },
);
