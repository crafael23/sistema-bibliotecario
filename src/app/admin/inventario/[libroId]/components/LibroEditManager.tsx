"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Card, CardContent } from "~/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { BookOpen, Copy, Plus, AlertCircle } from "lucide-react";
import { LibroEditForm } from "./LibroEditForm";
import { CopiaEditForm } from "./CopiaEditForm";
import { NewCopiaForm } from "./NewCopiaForm";
import { useLibroEdit } from "../hooks/useLibroEdit";
import { useCopiaEdit } from "../hooks/useCopiaEdit";
import { useNewCopia } from "../hooks/useNewCopia";
import { Button } from "~/components/ui/button";
import { estadoLibroEnum } from "~/server/db/schema";

type EstadoLibro = (typeof estadoLibroEnum.enumValues)[number];

interface LibroWithCopias {
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
  copias: Array<{
    id: number;
    localizacion: string;
    estado: EstadoLibro;
    libroId: number | null;
  }>;
}

interface LibroEditManagerProps {
  libro: LibroWithCopias;
  categorias: string[];
}

export function LibroEditManager({ libro, categorias }: LibroEditManagerProps) {
  const initialCopiaId =
    libro.copias.length > 0 && libro.copias[0] ? libro.copias[0].id : null;
  const [selectedCopiaId, setSelectedCopiaId] = useState<number | null>(
    initialCopiaId,
  );

  // Get the selected copia
  const selectedCopia = libro.copias.find(
    (copia) => copia.id === selectedCopiaId,
  );

  // Use our custom hooks
  const {
    libroForm,
    isSubmitting: isLibroSubmitting,
    formError: libroFormError,
    showConfirmDialog: showLibroConfirmDialog,
    previewUrl,
    setShowConfirmDialog: setShowLibroConfirmDialog,
    setPreviewUrl,
    handlePrepareSubmit: handleLibroPrepareSubmit,
    handleConfirmAndSubmit: handleLibroConfirmSubmit,
  } = useLibroEdit(libro);

  const defaultCopia = {
    id: 0,
    localizacion: "",
    estado: "disponible" as EstadoLibro,
    libroId: libro.id,
  };

  const {
    copiaForm,
    isSubmitting: isCopiaSubmitting,
    formError: copiaFormError,
    showConfirmDialog: showCopiaConfirmDialog,
    setShowConfirmDialog: setShowCopiaConfirmDialog,
    handlePrepareSubmit: handleCopiaPrepareSubmit,
    handleConfirmAndSubmit: handleCopiaConfirmSubmit,
  } = useCopiaEdit(selectedCopia ?? defaultCopia);

  const {
    newCopiaForm,
    isSubmitting: isNewCopiaSubmitting,
    formError: newCopiaFormError,
    showConfirmDialog: showNewCopiaConfirmDialog,
    setShowConfirmDialog: setShowNewCopiaConfirmDialog,
    handlePrepareSubmit: handleNewCopiaPrepareSubmit,
    handleConfirmAndSubmit: handleNewCopiaConfirmSubmit,
  } = useNewCopia(libro.id);

  return (
    <Tabs defaultValue="libro">
      <TabsList className="mb-4 grid w-full grid-cols-3">
        <TabsTrigger value="libro" className="flex items-center gap-2">
          <BookOpen className="h-4 w-4" />
          <span>Editar Libro</span>
        </TabsTrigger>
        <TabsTrigger
          value="ejemplar"
          className="flex items-center gap-2"
          disabled={!selectedCopia}
        >
          <Copy className="h-4 w-4" />
          <span>Editar Ejemplar</span>
        </TabsTrigger>
        <TabsTrigger value="nuevo-ejemplar" className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          <span>Nuevo Ejemplar</span>
        </TabsTrigger>
      </TabsList>

      {/* Libro Edit Tab */}
      <TabsContent value="libro">
        <Card>
          <CardContent className="pt-6">
            {libroFormError && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{libroFormError}</AlertDescription>
              </Alert>
            )}
            <LibroEditForm
              form={libroForm} // Type cast to resolve type issues
              categorias={categorias}
              isSubmitting={isLibroSubmitting}
              previewUrl={previewUrl}
              showConfirmDialog={showLibroConfirmDialog}
              setPreviewUrl={setPreviewUrl}
              setShowConfirmDialog={setShowLibroConfirmDialog}
              onPrepareSubmit={handleLibroPrepareSubmit}
              onConfirmSubmit={handleLibroConfirmSubmit}
            />
          </CardContent>
        </Card>
      </TabsContent>

      {/* Ejemplar Edit Tab */}
      <TabsContent value="ejemplar">
        <Card>
          <CardContent className="pt-6">
            {copiaFormError && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{copiaFormError}</AlertDescription>
              </Alert>
            )}

            {/* Selector for copies */}
            <div className="mb-6">
              <h3 className="mb-2 text-sm font-medium">
                Seleccionar Ejemplar:
              </h3>
              <div className="flex flex-wrap gap-2">
                {libro.copias.map((copia) => (
                  <Button
                    key={copia.id}
                    variant={
                      copia.id === selectedCopiaId ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => setSelectedCopiaId(copia.id)}
                  >
                    #{copia.id}
                  </Button>
                ))}
              </div>
            </div>

            {selectedCopia ? (
              <CopiaEditForm
                form={copiaForm}
                isSubmitting={isCopiaSubmitting}
                showConfirmDialog={showCopiaConfirmDialog}
                setShowConfirmDialog={setShowCopiaConfirmDialog}
                onPrepareSubmit={handleCopiaPrepareSubmit}
                onConfirmSubmit={handleCopiaConfirmSubmit}
                copiaId={selectedCopia.id}
              />
            ) : (
              <Alert className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>No hay ejemplares</AlertTitle>
                <AlertDescription>
                  Este libro no tiene ejemplares para editar.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      {/* Nuevo Ejemplar Tab */}
      <TabsContent value="nuevo-ejemplar">
        <Card>
          <CardContent className="pt-6">
            {newCopiaFormError && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{newCopiaFormError}</AlertDescription>
              </Alert>
            )}
            <NewCopiaForm
              form={newCopiaForm}
              isSubmitting={isNewCopiaSubmitting}
              showConfirmDialog={showNewCopiaConfirmDialog}
              setShowConfirmDialog={setShowNewCopiaConfirmDialog}
              onPrepareSubmit={handleNewCopiaPrepareSubmit}
              onConfirmSubmit={handleNewCopiaConfirmSubmit}
              libroNombre={libro.nombre}
            />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
