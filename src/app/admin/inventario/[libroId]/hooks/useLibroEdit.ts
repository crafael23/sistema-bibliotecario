"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "~/hooks/use-toast";
import { updateLibro, deleteUploadedFile } from "../actions";
import { libroEditSchema } from "../schemas";
import { type z } from "zod";
import { useRouter } from "next/navigation";

// Types for our form values
type LibroEditFormValues = z.infer<typeof libroEditSchema>;

export function useLibroEdit(libro: {
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
}) {
  // Form state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    libro.urlImagenPortada,
  );

  const router = useRouter();
  const { toast } = useToast();

  // Libro edit form
  const libroForm = useForm<LibroEditFormValues>({
    resolver: zodResolver(libroEditSchema),
    defaultValues: {
      title: libro.nombre,
      author: libro.autor,
      isbn: libro.isbn,
      category: libro.categoria,
      description: libro.descripcion,
      publisher: libro.editorial,
      edition: libro.edicion,
      coverImageUrl: libro.urlImagenPortada,
    },
  });

  // Handle form submission
  const onSubmit = async (data: LibroEditFormValues) => {
    setIsSubmitting(true);
    setFormError(null);

    try {
      // Check if we have a cover image
      const coverImageUrl = libroForm.getValues("coverImageUrl");
      if (!coverImageUrl) {
        toast({
          title: "Imagen requerida",
          description:
            "Por favor, selecciona una imagen de portada para el libro",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Submit to server action
      const result = await updateLibro(libro.id, data);

      if (!result.success) {
        throw new Error(result.error ?? "Error al actualizar el libro");
      }

      // Show success message
      toast({
        title: "Libro actualizado correctamente",
        description: `El libro "${data.title}" ha sido actualizado.`,
      });

      // Close any dialogs
      setShowConfirmDialog(false);

      // Refresh the page
      router.refresh();
    } catch (error) {
      console.error("Error occurred:", error);
      setFormError(
        error instanceof Error
          ? error.message
          : "Ocurrió un error al actualizar el libro. Por favor, intente nuevamente.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Prepare for submission
  const handlePrepareSubmit = () => {
    setShowConfirmDialog(true);
  };

  // Confirm and submit
  const handleConfirmAndSubmit = () => {
    setShowConfirmDialog(false);
    void libroForm.handleSubmit(onSubmit)();
  };

  return {
    libroForm,
    isSubmitting,
    formError,
    showConfirmDialog,
    previewUrl,
    setShowConfirmDialog,
    setPreviewUrl,
    handlePrepareSubmit,
    handleConfirmAndSubmit,
  };
}
