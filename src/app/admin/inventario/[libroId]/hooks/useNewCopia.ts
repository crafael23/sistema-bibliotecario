"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "~/hooks/use-toast";
import { addLibroCopia } from "../actions";
import { newLibroCopiaSchema } from "../schemas";
import { z } from "zod";
import { useRouter } from "next/navigation";

// Types for our form values
type NewCopiaFormValues = z.infer<typeof newLibroCopiaSchema>;

export function useNewCopia(libroId: number) {
  // Form state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const router = useRouter();
  const { toast } = useToast();

  // New copia form
  const newCopiaForm = useForm<NewCopiaFormValues>({
    resolver: zodResolver(newLibroCopiaSchema),
    defaultValues: {
      localizacion: "",
    },
  });

  // Handle form submission
  const onSubmit = async (data: NewCopiaFormValues) => {
    setIsSubmitting(true);
    setFormError(null);

    try {
      // Submit to server action
      const result = await addLibroCopia(libroId, data);

      if (!result.success) {
        throw new Error(result.error ?? "Error al agregar el ejemplar");
      }

      // Show success message
      toast({
        title: "Ejemplar agregado correctamente",
        description: "El nuevo ejemplar ha sido agregado exitosamente.",
      });

      // Reset form
      newCopiaForm.reset();

      // Close any dialogs
      setShowConfirmDialog(false);

      // Refresh the page
      router.refresh();
    } catch (error) {
      console.error("Error occurred:", error);
      setFormError(
        error instanceof Error
          ? error.message
          : "Ocurrió un error al agregar el ejemplar. Por favor, intente nuevamente.",
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
    void newCopiaForm.handleSubmit(onSubmit)();
  };

  return {
    newCopiaForm,
    isSubmitting,
    formError,
    showConfirmDialog,
    setShowConfirmDialog,
    handlePrepareSubmit,
    handleConfirmAndSubmit,
  };
}
