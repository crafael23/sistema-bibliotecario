"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Resolver } from "react-hook-form";
import type { z } from "zod";
import { toast } from "sonner";
import { PageHeader } from "~/components/page-header";
import { User, Save, ArrowLeft } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Checkbox } from "~/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { updateUsuario } from "../actions";
import { usuarioFormSchema } from "../schemas";
import { descifrarIdentidad } from "~/lib/random-utils";

// Define the shape of our user type
type Usuario = {
  clerkId: string;
  nombre: string;
  email: string;
  telefono: string | null;
  direccion: string | null;
  identidad: string | null;
  tipoDeUsuario: "externos" | "estudiantes" | "docentes" | "bibliotecarios";
  nuevo: boolean;
};

// Define props for our component
interface UsuarioDetailComponentProps {
  usuario: Usuario;
  usuarioId: string;
}

// Define form values type explicitly matching the schema
type FormValues = {
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
  identidad: string;
  tipoDeUsuario: "externos" | "estudiantes" | "docentes" | "bibliotecarios";
  nuevo: boolean;
};

export default function UsuarioDetailComponent({
  usuario,
  usuarioId,
}: UsuarioDetailComponentProps) {
  const router = useRouter();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Decrypt the identidad if it exists
  const decryptedIdentidad = usuario.identidad
    ? descifrarIdentidad(usuario.identidad)
    : "";

  // Initialize form with user data
  const form = useForm<FormValues>({
    resolver: zodResolver(usuarioFormSchema) as Resolver<FormValues>,
    defaultValues: {
      nombre: usuario.nombre,
      email: usuario.email,
      telefono: usuario.telefono ?? "",
      direccion: usuario.direccion ?? "",
      identidad: decryptedIdentidad,
      tipoDeUsuario: usuario.tipoDeUsuario,
      nuevo: usuario.nuevo,
    },
  });

  // Function to handle form submission
  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      // The encryption will happen in the server action
      const result = await updateUsuario(usuarioId, values);

      if (result.success) {
        toast.success("Usuario actualizado correctamente");
        router.refresh();
        setShowConfirmDialog(false);
      } else {
        toast.error(`Error al actualizar usuario: ${result.error}`);
      }
    } catch (error) {
      toast.error("Ocurrió un error al actualizar el usuario");
      console.error("Error updating user:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to handle form submission confirmation
  const handleConfirm = () => {
    void form.handleSubmit(onSubmit)();
  };

  // Navigate back to users list
  const handleBack = () => {
    router.push("/admin/usuarios");
  };

  return (
    <>
      <PageHeader
        title="Detalles del Usuario"
        icon={<User className="h-6 w-6" />}
        backUrl="/admin/usuarios"
      />

      <main className="w-full flex-1 overflow-auto px-4 pb-6 md:px-6">
        <Card className="bg-gray-100 shadow-md">
          <CardHeader>
            <CardTitle>Información del Usuario</CardTitle>
            <CardDescription>
              Ver y editar la información del usuario en el sistema.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form
                className="space-y-6"
                onSubmit={form.handleSubmit(() => setShowConfirmDialog(true))}
              >
                {/* Nombre */}
                <FormField
                  control={form.control}
                  name="nombre"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre</FormLabel>
                      <FormControl>
                        <Input placeholder="Nombre completo" {...field} />
                      </FormControl>
                      <FormDescription>
                        Nombre completo del usuario
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="correo@ejemplo.com" {...field} />
                      </FormControl>
                      <FormDescription>
                        Dirección de correo electrónico
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Teléfono */}
                <FormField
                  control={form.control}
                  name="telefono"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Teléfono</FormLabel>
                      <FormControl>
                        <Input placeholder="(+504) 1234-5678" {...field} />
                      </FormControl>
                      <FormDescription>
                        Número de teléfono de contacto
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Dirección */}
                <FormField
                  control={form.control}
                  name="direccion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dirección</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Dirección completa"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormDescription>
                        Dirección física del usuario
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Identidad */}
                <FormField
                  control={form.control}
                  name="identidad"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Identidad</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Número de identidad"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormDescription>
                        Número de identidad o documento oficial
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Tipo de Usuario */}
                <FormField
                  control={form.control}
                  name="tipoDeUsuario"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Usuario</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione un tipo de usuario" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="externos">Externo</SelectItem>
                          <SelectItem value="estudiantes">
                            Estudiante
                          </SelectItem>
                          <SelectItem value="docentes">Docente</SelectItem>
                          <SelectItem value="bibliotecarios">
                            Bibliotecario
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Categoría del usuario en el sistema
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Estado (Nuevo) */}
                <FormField
                  control={form.control}
                  name="nuevo"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Usuario Nuevo</FormLabel>
                        <FormDescription>
                          Marque esta casilla si el usuario es nuevo en el
                          sistema
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={handleBack}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Volver
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    <Save className="mr-2 h-4 w-4" />
                    Guardar Cambios
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar cambios</DialogTitle>
            <DialogDescription>
              ¿Está seguro que desea actualizar la información de este usuario?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button onClick={handleConfirm} disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : "Confirmar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
