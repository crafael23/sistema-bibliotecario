"use client";

import React from "react";
import { type UseFormReturn } from "react-hook-form";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { type libroCopiaLocationSchema } from "../schemas";
import { type z } from "zod";

type CopiaLocationFormProps = {
  form: UseFormReturn<z.infer<typeof libroCopiaLocationSchema>>;
  isSubmitting: boolean;
  currentCopiaIndex: number;
  totalCopias: number;
  onSubmit: (data: z.infer<typeof libroCopiaLocationSchema>) => void;
  onBack: () => void;
  onReview: () => void;
  isLastCopia: boolean;
};

export const CopiaLocationForm: React.FC<CopiaLocationFormProps> = ({
  form,
  isSubmitting,
  currentCopiaIndex,
  totalCopias,
  onSubmit,
  onBack,
  onReview,
  isLastCopia,
}) => {
  const handleSubmit = (data: z.infer<typeof libroCopiaLocationSchema>) => {
    if (isLastCopia) {
      void form.trigger().then((isValid) => {
        if (isValid) {
          onSubmit(data);
          onReview();
        }
      });
    } else {
      onSubmit(data);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="localizacion"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Localización <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className="bg-white"
                  placeholder="Ej: 005-003-012 (Estantería-Estante-Posición)"
                  onBlur={(e) => {
                    field.onChange(e.target.value);
                    field.onBlur();
                  }}
                />
              </FormControl>
              <FormMessage />
              <p className="mt-1 text-xs text-muted-foreground">
                Formato recomendado: XXX-XXX-XXX (Estantería-Estante-Posición)
              </p>
            </FormItem>
          )}
        />

        <div className="flex justify-between">
          <Button type="button" variant="outline" onClick={onBack}>
            Atrás
          </Button>

          <Button
            type="submit"
            className="bg-blue-600 text-white hover:bg-blue-700"
            disabled={isSubmitting}
          >
            {isLastCopia ? "Revisar ejemplares" : "Siguiente ejemplar"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
