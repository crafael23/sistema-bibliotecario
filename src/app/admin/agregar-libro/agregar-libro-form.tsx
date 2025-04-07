"use client";

import React, { useEffect } from "react";
import { PageHeader } from "~/components/page-header";
import { Plus, AlertCircle } from "lucide-react";
import { Card, CardContent } from "~/components/ui/card";
import { Alert, AlertDescription } from "~/components/ui/alert";
import {
  BookForm,
  CopiaLocationForm,
  CopiasProgress,
  StepIndicator,
  ConfirmationDialog,
  LocationsReviewDialog,
} from "./components";
import { useLibroForm } from "./hooks";

// Main component props
interface AgregarLibroFormProps {
  categorias: string[];
}

export default function AgregarLibroForm({
  categorias,
}: AgregarLibroFormProps) {
  const {
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

    // Handlers
    onStepOneSubmit,
    handleConfirmAndContinue,
    onAddCopiaLocation,
    handleBack,
    handleReviewLocations,
    handleFinalSubmit,
  } = useLibroForm();

  // Cleanup for preview URL object when component unmounts
  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <>
      <PageHeader
        title="Agregar Nuevo Libro"
        icon={<Plus className="h-6 w-6" />}
      />
      <main className="w-full flex-1 overflow-auto p-4 md:p-6">
        <Card className="w-full bg-gray-100 shadow-md">
          <CardContent className="p-6">
            {formError && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{formError}</AlertDescription>
              </Alert>
            )}

            {/* Progress indicator */}
            <StepIndicator activeStep={activeStep} />

            {/* Step 1: Libro details form */}
            {activeStep === 1 && (
              <BookForm
                form={libroForm}
                categorias={categorias}
                isSubmitting={isSubmitting}
                previewUrl={previewUrl}
                setPreviewUrl={setPreviewUrl}
                onSubmit={onStepOneSubmit}
              />
            )}

            {/* Step 2: Copia details form */}
            {activeStep === 2 && (
              <div className="space-y-6">
                <div className="mb-4 text-center">
                  <h2 className="text-lg font-semibold">
                    Ejemplar {currentCopiaIndex + 1} de {copiaLocations.length}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Ingrese la localización del ejemplar en la biblioteca
                  </p>
                </div>

                <CopiaLocationForm
                  form={copiaLocationForm}
                  isSubmitting={isSubmitting}
                  currentCopiaIndex={currentCopiaIndex}
                  totalCopias={copiaLocations.length}
                  onSubmit={onAddCopiaLocation}
                  onBack={handleBack}
                  onReview={handleReviewLocations}
                  isLastCopia={isLastCopia}
                />

                {/* Show progress of entered copies */}
                <CopiasProgress
                  copiaLocations={copiaLocations}
                  currentCopiaIndex={currentCopiaIndex}
                  onSelectCopia={setCurrentCopiaIndex}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Book confirmation dialog */}
      <ConfirmationDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        form={libroForm}
        onConfirm={handleConfirmAndContinue}
      />

      {/* Locations review dialog */}
      <LocationsReviewDialog
        open={showLocationsReviewDialog}
        onOpenChange={setShowLocationsReviewDialog}
        libroForm={libroForm}
        copiaLocations={copiaLocations}
        onConfirm={handleFinalSubmit}
        isSubmitting={isSubmitting}
      />
    </>
  );
}
