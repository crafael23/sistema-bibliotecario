"use client";

import React from "react";
import { type UseFormReturn } from "react-hook-form";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { ImageUploadField } from "./ImageUploadField";
import { CategoryField } from "./CategoryField";
import { type libroFormSchema } from "../schemas";
import { type z } from "zod";

type BookFormProps = {
  form: UseFormReturn<z.infer<typeof libroFormSchema>>;
  categorias: string[];
  isSubmitting: boolean;
  previewUrl: string | null;
  setPreviewUrl: React.Dispatch<React.SetStateAction<string | null>>;
  onSubmit: (data: z.infer<typeof libroFormSchema>) => void;
};

export const BookForm: React.FC<BookFormProps> = ({
  form,
  categorias,
  isSubmitting,
  previewUrl,
  setPreviewUrl,
  onSubmit,
}) => {
  const router = useRouter();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Título <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="bg-white"
                      placeholder="Ingrese el título del libro"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="author"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Autor <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="bg-white"
                      placeholder="Ingrese el nombre del autor"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isbn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    ISBN <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="bg-white"
                      placeholder="Ej: 978-3-16-148410-0"
                    />
                  </FormControl>
                  <FormMessage />
                  <p className="mt-1 text-xs text-muted-foreground">
                    Formato ISBN-10 o ISBN-13 (con o sin guiones)
                  </p>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="publisher"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Editorial</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="bg-white"
                      placeholder="Ingrese la editorial"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <CategoryField form={form} categorias={categorias} />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="edition"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Edición</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        className="bg-white"
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            Number.parseInt(e.target.value) ||
                              new Date().getFullYear(),
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="copies"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Ejemplares <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        className="bg-white"
                        {...field}
                        onChange={(e) =>
                          field.onChange(Number.parseInt(e.target.value) || 1)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                    <p className="mt-1 text-xs text-muted-foreground">
                      Debe ser un número entero positivo
                    </p>
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="space-y-4">
            <ImageUploadField
              form={form}
              previewUrl={previewUrl}
              setPreviewUrl={setPreviewUrl}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      className="min-h-[150px] bg-white"
                      placeholder="Ingrese una descripción del libro..."
                    />
                  </FormControl>
                  <FormMessage />
                  <p className="mt-1 text-xs text-muted-foreground">
                    Máximo 500 caracteres
                  </p>
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button
            variant="outline"
            type="button"
            onClick={() => router.push("/admin/inventario")}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            className="bg-blue-600 text-white hover:bg-blue-700"
            disabled={isSubmitting}
          >
            Continuar <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <div className="text-xs text-muted-foreground">
          <p>
            Los campos marcados con <span className="text-red-500">*</span> son
            obligatorios
          </p>
        </div>
      </form>
    </Form>
  );
};
