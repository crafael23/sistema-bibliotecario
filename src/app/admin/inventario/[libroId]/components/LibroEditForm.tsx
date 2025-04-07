"use client";

import { useEffect, useState } from "react";
import { type UseFormReturn } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
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
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Card, CardContent } from "~/components/ui/card";
import { Loader2, ImageIcon, Info } from "lucide-react";
import { UploadButton } from "~/utils/uploadthing";
import { type libroEditSchema } from "../schemas";
import { type z } from "zod";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import Image from "next/image";
import { ConfirmationDialog } from "./ConfirmationDialog";
import { DialogImagePreview } from "./DialogImagePreview";
import { CategoryField } from "./CategoryField";

type LibroEditFormValues = z.infer<typeof libroEditSchema>;

interface UploadResponse {
  url: string;
  key: string;
}

interface LibroEditFormProps {
  form: UseFormReturn<LibroEditFormValues>;
  categorias: string[];
  isSubmitting: boolean;
  previewUrl: string | null;
  showConfirmDialog: boolean;
  setPreviewUrl: (url: string | null) => void;
  setShowConfirmDialog: (show: boolean) => void;
  onPrepareSubmit: () => void;
  onConfirmSubmit: () => void;
}

export function LibroEditForm({
  form,
  categorias,
  isSubmitting,
  previewUrl,
  showConfirmDialog,
  setPreviewUrl,
  setShowConfirmDialog,
  onPrepareSubmit,
  onConfirmSubmit,
}: LibroEditFormProps) {
  const [showImagePreview, setShowImagePreview] = useState(false);

  // Clean up URL objects when component unmounts
  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <>
      <Form {...form}>
        <form
          className="space-y-6"
          onSubmit={form.handleSubmit(onPrepareSubmit)}
        >
          <div className="grid gap-6 md:grid-cols-2">
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Título
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="ml-1 h-3.5 w-3.5 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[300px]">
                          Ingrese el título completo del libro.
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isSubmitting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Author */}
            <FormField
              control={form.control}
              name="author"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Autor
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="ml-1 h-3.5 w-3.5 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[300px]">
                          Ingrese el nombre completo del autor. Para múltiples
                          autores, sepárelos por coma.
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isSubmitting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ISBN */}
            <FormField
              control={form.control}
              name="isbn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    ISBN
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="ml-1 h-3.5 w-3.5 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[300px]">
                          Ingrese el ISBN-10 o ISBN-13 del libro. Puede incluir
                          guiones.
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isSubmitting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Category - Using our custom CategoryField component */}
            <CategoryField
              form={form}
              categorias={categorias}
              isSubmitting={isSubmitting}
            />

            {/* Publisher */}
            <FormField
              control={form.control}
              name="publisher"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Editorial
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="ml-1 h-3.5 w-3.5 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[300px]">
                          Ingrese el nombre de la editorial.
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isSubmitting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Edition */}
            <FormField
              control={form.control}
              name="edition"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Edición
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="ml-1 h-3.5 w-3.5 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[300px]">
                          Ingrese el número de edición o año de publicación.
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      {...field}
                      disabled={isSubmitting}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Descripción
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="ml-1 h-3.5 w-3.5 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-[300px]">
                        Ingrese un breve resumen o descripción del libro.
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </FormLabel>
                <FormControl>
                  <Textarea rows={4} {...field} disabled={isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Cover Image */}
          <div className="space-y-4">
            <div>
              <FormLabel className="flex items-center">
                Imagen de Portada
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="ml-1 h-3.5 w-3.5 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-[300px]">
                      Suba una imagen de portada del libro. Recomendado: imagen
                      vertical de alta calidad.
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </FormLabel>
              <FormDescription>
                La imagen actual se mantendrá si no selecciona una nueva.
              </FormDescription>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              {/* Current Image Preview */}
              {previewUrl && (
                <Card className="w-full sm:w-1/3">
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center gap-2">
                      <div
                        className="relative h-40 w-32 cursor-pointer overflow-hidden rounded-md shadow-sm"
                        onClick={() => setShowImagePreview(true)}
                      >
                        <Image
                          src={previewUrl}
                          alt="Vista previa de la portada"
                          fill
                          sizes="(max-width: 768px) 100vw, 300px"
                          style={{ objectFit: "cover" }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">
                        Click para ampliar
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Upload Button */}
              <Card className="w-full sm:w-2/3">
                <CardContent className="pt-6">
                  <UploadButton
                    endpoint="imageUploader"
                    onClientUploadComplete={(res) => {
                      if (res && res.length > 0) {
                        const uploadResult = res[0] as UploadResponse;
                        if (uploadResult) {
                          // Set the image URL and key
                          form.setValue("coverImageUrl", uploadResult.url);
                          form.setValue("coverImageKey", uploadResult.key);
                          setPreviewUrl(uploadResult.url);
                        }
                      }
                    }}
                    onUploadError={(error: Error) => {
                      console.error("Upload error:", error);
                    }}
                  />
                </CardContent>
              </Card>
            </div>
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

          {/* Info about codigo */}
          <div className="mt-4 rounded-md bg-blue-50 p-3 text-sm text-blue-800">
            <p>
              <strong>Nota:</strong> El código del libro se regenerará
              automáticamente si cambia la categoría, autor o edición.
            </p>
          </div>
        </form>
      </Form>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        title="Confirmar Cambios"
        description="¿Está seguro que desea actualizar la información del libro?"
        confirmLabel="Actualizar"
        cancelLabel="Cancelar"
        onConfirm={onConfirmSubmit}
        isSubmitting={isSubmitting}
      />

      {/* Image Preview Dialog */}
      {previewUrl && (
        <DialogImagePreview
          open={showImagePreview}
          onOpenChange={setShowImagePreview}
          imageUrl={previewUrl}
          title="Vista previa de la portada"
        />
      )}
    </>
  );
}
