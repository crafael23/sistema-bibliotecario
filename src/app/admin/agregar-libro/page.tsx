"use client"

import type React from "react"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { PageHeader } from "~/components/page-header"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Textarea } from "~/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { Card, CardContent } from "~/components/ui/card"
import { Plus, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form"
import { Alert, AlertDescription } from "~/components/ui/alert"
import { useToast } from "~/hooks/use-toast"

// Esquema de validación con zod
const formSchema = z.object({
  title: z.string().min(2, { message: "El título debe tener al menos 2 caracteres" }).max(100),
  author: z.string().min(2, { message: "El autor debe tener al menos 2 caracteres" }).max(100),
  isbn: z
    .string()
    .min(10, { message: "El ISBN debe tener al menos 10 caracteres" })
    .max(17, { message: "El ISBN no debe exceder 17 caracteres" })
    .regex(/^(?:\d[- ]?){9}[\dXx]$|^(?:\d[- ]?){12}\d$/, {
      message: "Formato de ISBN inválido (10 o 13 dígitos)",
    }),
  category: z.string({ required_error: "Seleccione una categoría" }),
  copies: z.coerce.number().int().positive({ message: "Debe ser un número entero positivo" }),
  description: z.string().max(500, { message: "La descripción no debe exceder 500 caracteres" }).optional(),
})

type FormValues = z.infer<typeof formSchema>

export default function AgregarLibroPage() {
  const [bookImage, setBookImage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  // Inicializar formulario con React Hook Form y validación de Zod
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      author: "",
      isbn: "",
      category: "",
      copies: 1,
      description: "",
    },
  })

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validar tipo de archivo
      if (!file.type.includes("image/")) {
        toast({
          title: "Formato no soportado",
          description: "Por favor, sube solo archivos de imagen (JPG, PNG, GIF).",
          variant: "destructive",
        })
        return
      }

      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Archivo demasiado grande",
          description: "La imagen no debe exceder 5MB.",
          variant: "destructive",
        })
        return
      }

      const reader = new FileReader()
      reader.onload = (event) => {
        setBookImage(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true)
    setFormError(null)

    try {
      // Aquí iría la lógica para enviar los datos al servidor
      console.log("Datos del formulario:", data)
      console.log("Imagen:", bookImage)

      // Simular una petición al servidor
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Mostrar mensaje de éxito
      toast({
        title: "Libro agregado correctamente",
        description: `El libro "${data.title}" ha sido agregado al inventario.`,
      })

      // Redireccionar al inventario
      router.push("/admin/inventario")
    } catch (error) {
      console.error("Error al guardar el libro:", error)
      setFormError("Ocurrió un error al guardar el libro. Por favor, intente nuevamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <PageHeader title="Agregar Nuevo Libro" icon={<Plus className="h-6 w-6" />} />
      <main className="flex-1 p-4 md:p-6 overflow-auto w-full">
        <Card className="bg-gray-100 shadow-md w-full">
          <CardContent className="p-6">
            {formError && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{formError}</AlertDescription>
              </Alert>
            )}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Título <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input {...field} className="bg-white" placeholder="Ingrese el título del libro" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="author"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Autor <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input {...field} className="bg-white" placeholder="Ingrese el nombre del autor" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="isbn"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            ISBN <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input {...field} className="bg-white" placeholder="Ej: 978-3-16-148410-0" />
                          </FormControl>
                          <FormMessage />
                          <p className="text-xs text-muted-foreground mt-1">
                            Formato ISBN-10 o ISBN-13 (con o sin guiones)
                          </p>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Categoría <span className="text-red-500">*</span>
                          </FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-white">
                                <SelectValue placeholder="Seleccionar categoría" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="novela">Novela</SelectItem>
                              <SelectItem value="ensayo">Ensayo</SelectItem>
                              <SelectItem value="poesia">Poesía</SelectItem>
                              <SelectItem value="historia">Historia</SelectItem>
                              <SelectItem value="ciencia">Ciencia</SelectItem>
                              <SelectItem value="biografia">Biografía</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="copies"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Ejemplares <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="1"
                              className="bg-white"
                              {...field}
                              onChange={(e) => field.onChange(Number.parseInt(e.target.value) || 1)}
                            />
                          </FormControl>
                          <FormMessage />
                          <p className="text-xs text-muted-foreground mt-1">Debe ser un número entero positivo</p>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="book-image">Imagen de Portada</Label>
                      <div className="flex flex-col sm:flex-row gap-4 items-start">
                        <Avatar className="h-32 w-32 border">
                          <AvatarImage src={bookImage || ""} alt="Portada del libro" />
                          <AvatarFallback className="text-sm">Portada</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col gap-2 flex-1">
                          <Input
                            id="book-image"
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="w-full bg-white"
                          />
                          <p className="text-xs text-muted-foreground">
                            Sube una imagen de la portada del libro. Formatos aceptados: JPG, PNG, GIF. Tamaño máximo:
                            5MB.
                          </p>
                        </div>
                      </div>
                    </div>

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Descripción</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              className="min-h-[150px] bg-white"
                              placeholder="Ingrese una descripción del libro..."
                            />
                          </FormControl>
                          <FormMessage />
                          <p className="text-xs text-muted-foreground mt-1">Máximo 500 caracteres</p>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => router.push("/admin/inventario")}
                    disabled={isSubmitting}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" className="bg-gray-200 text-black hover:bg-gray-300" disabled={isSubmitting}>
                    {isSubmitting ? "Guardando..." : "Guardar Libro"}
                  </Button>
                </div>

                <div className="text-xs text-muted-foreground">
                  <p>
                    Los campos marcados con <span className="text-red-500">*</span> son obligatorios
                  </p>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>
    </>
  )
}

