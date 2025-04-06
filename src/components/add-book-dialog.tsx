"use client"

import type React from "react"

import { Button } from "~/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { Textarea } from "~/components/ui/textarea"
import { useState } from "react"

interface AddBookDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddBookDialog({ open, onOpenChange }: AddBookDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simular una petición al servidor
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsSubmitting(false)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Agregar Nuevo Libro</DialogTitle>
          <DialogDescription>Complete el formulario para agregar un nuevo libro al inventario.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Título</Label>
              <Input id="title" placeholder="Ingrese el título del libro" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="author">Autor</Label>
              <Input id="author" placeholder="Ingrese el nombre del autor" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="isbn">ISBN</Label>
              <Input id="isbn" placeholder="Ej: 978-3-16-148410-0" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">Categoría</Label>
              <Select>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Seleccionar categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="novela">Novela</SelectItem>
                  <SelectItem value="ensayo">Ensayo</SelectItem>
                  <SelectItem value="poesia">Poesía</SelectItem>
                  <SelectItem value="historia">Historia</SelectItem>
                  <SelectItem value="ciencia">Ciencia</SelectItem>
                  <SelectItem value="biografia">Biografía</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="copies">Ejemplares</Label>
              <Input id="copies" type="number" min="1" defaultValue="1" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea id="description" placeholder="Ingrese una descripción del libro..." />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : "Guardar Libro"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

