"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useToast } from "~/hooks/use-toast";
import { createLibroWithCopias } from "../actions";
import { libroFormSchema, libroCopiaLocationSchema } from "../schemas";
import { z } from "zod";

// Types for our form values
type LibroFormValues = z.infer<typeof libroFormSchema>;
type CopiaLocationFormValues = z.infer<typeof libroCopiaLocationSchema>;

export function useLibroForm() {
  // Form state
  const [activeStep, setActiveStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showLocationsReviewDialog, setShowLocationsReviewDialog] =
    useState(false);
  const [copiaLocations, setCopiaLocations] = useState<
    CopiaLocationFormValues[]
  >([]);
  const [currentCopiaIndex, setCurrentCopiaIndex] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const router = useRouter();
  const { toast } = useToast();

  // Libro form
  const libroForm = useForm<LibroFormValues>({
    resolver: zodResolver(libroFormSchema),
    defaultValues: {
      title: "",
      author: "",
      isbn: "",
      category: "",
      copies: 1,
      description: "",
      publisher: "",
      edition: new Date().getFullYear(),
    },
  });

  // Copia location form
  const copiaLocationForm = useForm<CopiaLocationFormValues>({
    resolver: zodResolver(libroCopiaLocationSchema),
    defaultValues: {
      localizacion: "",
    },
  });

  // Handle step 1 submission (libro details)
  const onStepOneSubmit = (data: LibroFormValues) => {
    // Check if we have a cover image
    const coverImageUrl = libroForm.getValues("coverImageUrl");

    if (!coverImageUrl) {
      toast({
        title: "Imagen requerida",
        description:
          "Por favor, selecciona una imagen de portada para el libro",
        variant: "destructive",
      });
      return;
    }

    // Show confirmation dialog
    setShowConfirmDialog(true);
  };

  // Continue to step 2 (copy details)
  const handleConfirmAndContinue = () => {
    setShowConfirmDialog(false);

    // Initialize the copia locations array based on the number of copies
    const numberOfCopies = libroForm.getValues("copies");
    setCopiaLocations(Array(numberOfCopies).fill({ localizacion: "" }));

    // Move to step 2
    setActiveStep(2);
  };

  // Handle back action (from step 2 to 1 or between copies)
  const handleBack = () => {
    if (currentCopiaIndex === 0) {
      // Go back to step 1
      setActiveStep(1);
    } else {
      // Go to previous copy
      setCurrentCopiaIndex(currentCopiaIndex - 1);
    }
  };

  // Show the locations review dialog
  const handleReviewLocations = () => {
    setShowLocationsReviewDialog(true);
  };

  // Handle adding a copia location in step 2
  const onAddCopiaLocation = (data: CopiaLocationFormValues) => {
    // Validate that localization is not empty (extra check)
    if (!data.localizacion || data.localizacion.trim() === "") {
      toast({
        title: "Localización requerida",
        description: "Por favor, ingrese la localización del ejemplar",
        variant: "destructive",
      });
      return;
    }

    // Update the location at the current index
    const newLocations = [...copiaLocations];
    newLocations[currentCopiaIndex] = data;
    setCopiaLocations(newLocations);

    // If it's not the last copy, move to the next one
    if (currentCopiaIndex < copiaLocations.length - 1) {
      // Reset the form with the next copy's location if it exists
      const nextCopia = copiaLocations[currentCopiaIndex + 1];
      const nextCopiaLocation = nextCopia?.localizacion ?? "";
      copiaLocationForm.reset({ localizacion: nextCopiaLocation });
      setCurrentCopiaIndex(currentCopiaIndex + 1);
    }
    // Note: If it's the last copy, we don't auto-proceed anymore.
    // The user will click "Review" and see the LocationsReviewDialog
  };

  // Handle final submission after location review confirmation
  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    setFormError(null);

    try {
      // Get libro data from step 1
      const libroData = libroForm.getValues();

      // Final validation check before submission
      const hasEmptyLocations = copiaLocations.some(
        (copia) => !copia.localizacion || copia.localizacion.trim() === "",
      );

      if (hasEmptyLocations) {
        toast({
          title: "Localización incompleta",
          description: "Todos los ejemplares deben tener una localización",
          variant: "destructive",
        });
        setIsSubmitting(false);
        setShowLocationsReviewDialog(false);
        return;
      }

      // If we don't have a cover image URL yet, we need to show the uploader
      if (!libroData.coverImageUrl) {
        toast({
          title: "Imagen requerida",
          description:
            "Por favor, selecciona una imagen de portada para el libro",
          variant: "destructive",
        });
        setIsSubmitting(false);
        setShowLocationsReviewDialog(false);
        return;
      }

      // Submit to server action
      const result = await createLibroWithCopias(libroData, copiaLocations);

      if (!result.success) {
        throw new Error(result.error ?? "Error al guardar el libro");
      }

      // Show success message
      toast({
        title: "Libro agregado correctamente",
        description: `El libro "${libroData.title}" ha sido agregado al inventario con ${copiaLocations.length} ejemplares.`,
      });

      // Close the dialog
      setShowLocationsReviewDialog(false);

      // Redirect to inventory
      router.push("/admin/inventario");
    } catch (error) {
      console.error("Error occurred:", error);
      setFormError(
        error instanceof Error
          ? error.message
          : "Ocurrió un error al guardar el libro. Por favor, intente nuevamente.",
      );
      setShowLocationsReviewDialog(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset and start over
  const handleResetForm = () => {
    // Reset all state
    libroForm.reset();
    copiaLocationForm.reset();
    setCopiaLocations([]);
    setCurrentCopiaIndex(0);
    setActiveStep(1);
    setFormError(null);
    setShowLocationsReviewDialog(false);
  };

  // Check if current is the last copia
  const isLastCopia = currentCopiaIndex === copiaLocations.length - 1;

  return {
    // State
    activeStep,
    isSubmitting,
    formError,
    showConfirmDialog,
    showLocationsReviewDialog,
    copiaLocations,
    currentCopiaIndex,
    previewUrl,
    isLastCopia,

    // Forms
    libroForm,
    copiaLocationForm,

    // Setters
    setShowConfirmDialog,
    setShowLocationsReviewDialog,
    setPreviewUrl,
    setCurrentCopiaIndex,
    setFormError,

    // Handlers
    onStepOneSubmit,
    handleConfirmAndContinue,
    onAddCopiaLocation,
    handleBack,
    handleResetForm,
    handleReviewLocations,
    handleFinalSubmit,
  };
}
