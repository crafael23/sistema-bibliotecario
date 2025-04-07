"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "~/hooks/use-toast";
import { updateLibroCopia } from "../actions";
import { libroCopiaEditSchema } from "../schemas";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { estadoLibroEnum } from "~/server/db/schema";

// Types for our form values
type CopiaEditFormValues = z.infer<typeof libroCopiaEditSchema>;
type EstadoLibro = (typeof estadoLibroEnum.enumValues)[number];

export function useCopiaEdit(copia: {
  id: number;
  localizacion: string;
  estado: string;
  libroId: number | null;
}) {
  // Form state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const router = useRouter();
  const { toast } = useToast();

  // Copia edit form
  const copiaForm = useForm<CopiaEditFormValues>({
    resolver: zodResolver(libroCopiaEditSchema),
    defaultValues: {
      localizacion: copia.localizacion,
      estado: copia.estado as EstadoLibro, // Cast to match the enum type
    },
  });

  // Handle form submission
  const onSubmit = async (data: CopiaEditFormValues) => {
    setIsSubmitting(true);
    setFormError(null);

    try {
      // Submit to server action
      const result = await updateLibroCopia(copia.id, data);

      if (!result.success) {
        throw new Error(result.error ?? "Error al actualizar el ejemplar");
      }

      // Show success message
      toast({
        title: "Ejemplar actualizado correctamente",
        description: "El ejemplar ha sido actualizado exitosamente.",
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
          : "Ocurrió un error al actualizar el ejemplar. Por favor, intente nuevamente.",
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
    void copiaForm.handleSubmit(onSubmit)();
  };

  return {
    copiaForm,
    isSubmitting,
    formError,
    showConfirmDialog,
    setShowConfirmDialog,
    handlePrepareSubmit,
    handleConfirmAndSubmit,
  };
}
