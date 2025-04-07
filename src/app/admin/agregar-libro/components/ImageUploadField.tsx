"use client";

import React from "react";
import { type UseFormReturn } from "react-hook-form";
import { Label } from "~/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Book, Check } from "lucide-react";
import { UploadButton } from "~/utils/uploadthing";
import { useToast } from "~/hooks/use-toast";
import { type libroFormSchema } from "../schemas";
import { type z } from "zod";

type ImageUploadFieldProps = {
  form: UseFormReturn<z.infer<typeof libroFormSchema>>;
  previewUrl: string | null;
  setPreviewUrl: React.Dispatch<React.SetStateAction<string | null>>;
};

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  form,
  previewUrl,
  setPreviewUrl,
}) => {
  const { toast } = useToast();
  const hasImage = !!form.getValues("coverImageUrl");

  // Handle image upload with UploadThing
  const handleImageUploadComplete = (
    res: Array<{ url: string; key: string }>,
  ) => {
    if (res?.[0]?.url) {
      const { url, key } = res[0];

      // Update form with the image URL and key
      form.setValue("coverImageUrl", url);
      if (key) form.setValue("coverImageKey", key);

      // Force form validation to run
      void form.trigger("coverImageUrl");

      // Update preview
      setPreviewUrl(url);

      toast({
        title: "Imagen subida correctamente",
        description: "La imagen de portada ha sido subida correctamente.",
      });
    } else {
      console.error("[Upload Complete] ERROR: Missing URL in upload response");
    }
  };

  return (
    <div className="space-y-4">
      <Label htmlFor="book-image">
        Imagen de Portada <span className="text-red-500">*</span>
      </Label>

      {/* Image preview */}
      {hasImage && (
        <div className="mb-2">
          <Avatar className="h-40 w-40 border">
            <AvatarImage
              src={previewUrl ?? form.getValues("coverImageUrl") ?? ""}
              alt="Portada del libro"
            />
            <AvatarFallback className="text-sm">
              <Book className="h-8 w-8 text-gray-400" />
            </AvatarFallback>
          </Avatar>
        </div>
      )}

      {/* Status message */}
      {hasImage && (
        <div className="mb-2 flex items-center text-sm text-green-600">
          <Check className="mr-1 h-4 w-4" />
          Imagen cargada correctamente
        </div>
      )}

      {/* Upload button */}
      <div className="flex flex-col gap-2">
        <UploadButton
          endpoint="imageUploader"
          onClientUploadComplete={handleImageUploadComplete}
          onUploadError={(error: Error) => {
            console.error("[ImageUploadField] Upload error:", error);
            toast({
              title: "Error al subir la imagen",
              description: error.message,
              variant: "destructive",
            });
          }}
          onUploadBegin={() => {
            // Upload starting
          }}
          appearance={{
            button: {
              background: hasImage ? "#4F46E5" : "#2563EB",
            },
          }}
        />
        <p className="text-xs text-muted-foreground">
          {hasImage
            ? "Puedes reemplazar la imagen seleccionando una nueva."
            : "Selecciona una imagen de la portada del libro. Formatos aceptados: JPG, PNG, GIF. Tamaño máximo: 4MB."}
        </p>
      </div>
    </div>
  );
};
