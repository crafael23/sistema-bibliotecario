"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
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
import { Textarea } from "~/components/ui/textarea";
import { Badge } from "~/components/ui/badge";
import { CheckCircle, User } from "lucide-react";
import {
  formSchema,
  FormValues,
} from "~/app/usuario/[userid]/new-user/form-schema";

// Definir el tipo de datos del usuario
interface UserData {
  clerkId: string;
  nombre: string;
  email: string;
  telefono: string | null;
  direccion: string | null;
  identidad: string | null;
  tipoDeUsuario: string;
  nuevo: boolean;
}

export function UserProfileForm({
  userData,
  action,
}: {
  userData: UserData;
  action: (formData: FormData) => Promise<Response | undefined>;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Inicializar el formulario con react-hook-form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      telefono: userData.telefono ?? "",
      direccion: userData.direccion ?? "",
      identidad: userData.identidad ?? "",
    },
  });

  // Función para manejar el envío del formulario
  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);

    try {
      // Aquí iría la lógica para enviar los datos al servidor
      console.log("Datos actualizados:", {
        ...userData,
        ...values,
        nuevo: false,
      });

      // Simular una petición al servidor
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const formData = new FormData();
      formData.append("telefono", values.telefono);
      formData.append("direccion", values.direccion);
      formData.append("identidad", values.identidad);

      await action(formData);
      setIsSuccess(true);
    } catch (error) {
      console.error("Error al actualizar los datos:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="grid gap-8 md:grid-cols-2">
      {/* Tarjeta con la información existente */}
      <Card>
        <CardHeader>
          <CardTitle>Información del Usuario</CardTitle>
          <CardDescription>Datos actuales del perfil</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <User className="h-10 w-10 text-muted-foreground" />
            <div>
              <p className="text-lg font-medium">{userData.nombre}</p>
              <p className="text-sm text-muted-foreground">{userData.email}</p>
            </div>
          </div>

          <div className="grid gap-2 pt-4">
            <div className="flex justify-between">
              <span className="text-sm font-medium">ID de Usuario:</span>
              <span className="text-sm text-muted-foreground">
                {userData.clerkId}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Tipo de Usuario:</span>
              <Badge variant="outline">{userData.tipoDeUsuario}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Estado:</span>
              <Badge variant={userData.nuevo ? "destructive" : "default"}>
                {userData.nuevo ? "Incompleto" : "Completo"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Formulario para completar la información faltante */}
      <Card>
        <CardHeader>
          <CardTitle>Completar Información</CardTitle>
          <CardDescription>
            Por favor completa los siguientes campos obligatorios
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isSuccess ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <CheckCircle className="mb-4 h-16 w-16 text-green-500" />
              <h3 className="mb-2 text-xl font-medium">
                ¡Información actualizada!
              </h3>
              <p className="text-muted-foreground">
                Tu perfil ha sido completado exitosamente.
              </p>
            </div>
          ) : (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="telefono"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número de Teléfono</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ej: 9991234567"
                          {...field}
                          type="number"
                        />
                      </FormControl>
                      <FormDescription>
                        Ingresa un número de teléfono válido.
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
                        <Textarea
                          placeholder="Ingresa tu dirección completa"
                          className="min-h-[80px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="identidad"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número de Identidad</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ingresa tu número de identidad"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Guardando..." : "Guardar Información"}
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
