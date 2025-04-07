"use client";

import React from "react";
import { type UseFormReturn } from "react-hook-form";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Book } from "lucide-react";
import { type libroFormSchema } from "../schemas";
import { type z } from "zod";

type DialogImagePreviewProps = {
  form: UseFormReturn<z.infer<typeof libroFormSchema>>;
};

export const DialogImagePreview: React.FC<DialogImagePreviewProps> = ({
  form,
}) => {
  const imageUrl = form.getValues("coverImageUrl");

  return (
    <Avatar className="h-24 w-24 border">
      <AvatarImage src={imageUrl ?? ""} alt="Portada del libro" />
      <AvatarFallback className="text-sm">
        <Book className="h-8 w-8 text-gray-400" />
      </AvatarFallback>
    </Avatar>
  );
};
