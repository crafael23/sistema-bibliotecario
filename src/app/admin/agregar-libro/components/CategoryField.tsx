"use client";

import React, { useState } from "react";
import { UseFormReturn } from "react-hook-form";
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
import { X } from "lucide-react";
import { libroFormSchema } from "../schemas";
import { z } from "zod";

type CategoryFieldProps = {
  form: UseFormReturn<z.infer<typeof libroFormSchema>>;
  categorias: string[];
};

export const CategoryField: React.FC<CategoryFieldProps> = React.memo(
  function CategoryField({ form, categorias }) {
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
                Categoría <span className="text-red-500">*</span>
              </FormLabel>

              {!isCustomCategoryMode ? (
                <FormControl>
                  <Select
                    onValueChange={(value) => {
                      if (value === "agregar_nueva") {
                        setIsCustomCategoryMode(true);
                      } else {
                        field.onChange(value);
                      }
                    }}
                    value={selectValue}
                    defaultValue={selectValue}
                  >
                    <SelectTrigger className="bg-white">
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
                      className="bg-white"
                      {...field}
                    />
                  </FormControl>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      setIsCustomCategoryMode(false);
                      field.onChange("");
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
