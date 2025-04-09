"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Pencil, Info, Mail } from "lucide-react";
import {
  userProfileFormSchema,
  type UserProfileData,
  type UserProfileFormData,
} from "../schemas";
import { useProfile } from "../hooks/useProfile";
import { cn } from "~/lib/utils";

interface EditProfileDialogProps {
  userData: UserProfileData;
}

export const EditProfileDialog = ({ userData }: EditProfileDialogProps) => {
  const [open, setOpen] = useState(false);
  const { handleProfileUpdate } = useProfile();

  const form = useForm<UserProfileFormData>({
    resolver: zodResolver(userProfileFormSchema),
    defaultValues: {
      nombre: userData.nombre,
      telefono: userData.telefono,
      direccion: userData.direccion,
      avatarUrl: userData.avatarUrl,
    },
    mode: "onChange",
  });

  const onSubmit = async (data: UserProfileFormData) => {
    try {
      // Include email from userData when updating
      await handleProfileUpdate({
        ...data,
        email: userData.email,
      });
      setOpen(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Perfil</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Ingrese su nombre completo"
                    />
                  </FormControl>
                  <FormDescription>
                    Solo letras y espacios, entre 2 y 50 caracteres
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="space-y-2">
              <FormLabel>Email</FormLabel>
              <div className="flex items-center gap-2 rounded-md border border-input bg-muted px-3 py-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{userData.email}</span>
              </div>
              <FormDescription>
                El email no puede ser modificado
              </FormDescription>
            </div>
            <FormField
              control={form.control}
              name="telefono"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teléfono</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value ?? ""}
                      type="tel"
                      placeholder="12345678"
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "");
                        field.onChange(value || null);
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    Entre 8 y 15 dígitos numéricos
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="direccion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dirección</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value ?? ""}
                      placeholder="Ingrese su dirección completa"
                    />
                  </FormControl>
                  <FormDescription>Entre 10 y 200 caracteres</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-2 rounded-md bg-muted p-2 text-sm text-muted-foreground">
              <Info className="h-4 w-4" />
              <p>Los campos marcados con * son obligatorios</p>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={
                  !form.formState.isValid || form.formState.isSubmitting
                }
              >
                {form.formState.isSubmitting ? "Guardando..." : "Guardar"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
