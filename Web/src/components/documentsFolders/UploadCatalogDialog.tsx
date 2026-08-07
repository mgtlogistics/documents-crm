import { useEffect, useState } from "react"
import { Pencil, Plus, Trash2 } from "lucide-react"
import { toast } from "react-toastify"

import api from "@/utils/api"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import type { UploadCatalogItem } from "./types"

interface UploadCatalogDialogProps {
  item?: UploadCatalogItem
  onSuccess?: () => void | Promise<void>
}

interface UploadFormState {
  key: string
  title: string
  description: string
  maxSizeMB: string
  allowedExtensions: string
  isActive: boolean
}

const emptyForm = (): UploadFormState => ({
  key: "",
  title: "",
  description: "",
  maxSizeMB: "10",
  allowedExtensions: "pdf, png, jpg, jpeg",
  isActive: true,
})

export default function UploadCatalogDialog({ item, onSuccess }: UploadCatalogDialogProps) {
  const [open, setOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState<UploadFormState>(emptyForm)

  useEffect(() => {
    if (!open) {
      setForm(emptyForm())
      return
    }

    if (item) {
      setForm({
        key: item.key,
        title: item.title,
        description: item.description ?? "",
        maxSizeMB: String(item.maxSizeMB ?? 10),
        allowedExtensions: item.allowedExtensions.join(", "),
        isActive: item.isActive,
      })
    }
  }, [item, open])

  const handleSubmit = async () => {
    if (!form.key.trim() || !form.title.trim()) {
      toast.error("La clave y el titulo son obligatorios")
      return
    }

    setSubmitting(true)
    try {
      const payload = {
        key: form.key.trim(),
        title: form.title.trim(),
        description: form.description.trim(),
        maxSizeMB: Number(form.maxSizeMB),
        allowedExtensions: form.allowedExtensions
          .split(",")
          .map((value) => value.trim())
          .filter(Boolean),
        isActive: form.isActive,
      }

      if (item?._id) {
        await api.put(`/api/document-folders/uploads/${item._id}`, payload)
        toast.success("Requisito actualizado correctamente")
      } else {
        await api.post("/api/document-folders/uploads", payload)
        toast.success("Requisito creado correctamente")
      }

      await onSuccess?.()
      setOpen(false)
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "No fue posible guardar el requisito"
      toast.error(message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {item ? (
          <Button variant="ghost" size="icon">
            <Pencil className="h-4 w-4" />
          </Button>
        ) : (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo requisito
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{item ? "Editar requisito" : "Nuevo requisito de subida"}</DialogTitle>
          <DialogDescription>
            Configura los archivos que podran pedirse dentro de una carpeta documental.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="upload-key">Clave</Label>
            <Input
              id="upload-key"
              value={form.key}
              onChange={(event) => setForm((prev) => ({ ...prev, key: event.target.value }))}
              placeholder="constancia_fiscal"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="upload-title">Titulo</Label>
            <Input
              id="upload-title"
              value={form.title}
              onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
              placeholder="Constancia de situacion fiscal"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="upload-description">Descripcion</Label>
            <textarea
              id="upload-description"
              value={form.description}
              onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
              placeholder="Antiguedad maxima 3 meses"
              className="min-h-24 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="upload-size">Tamano maximo (MB)</Label>
              <Input
                id="upload-size"
                type="number"
                min="1"
                value={form.maxSizeMB}
                onChange={(event) => setForm((prev) => ({ ...prev, maxSizeMB: event.target.value }))}
              />
            </div>

            <div className="flex items-end gap-3 rounded-md border px-3 py-2">
              <Checkbox
                id="upload-active"
                checked={form.isActive}
                onCheckedChange={(checked) => setForm((prev) => ({ ...prev, isActive: checked === true }))}
              />
              <Label htmlFor="upload-active">Requisito activo</Label>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="upload-extensions">Extensiones permitidas</Label>
            <Input
              id="upload-extensions"
              value={form.allowedExtensions}
              onChange={(event) => setForm((prev) => ({ ...prev, allowedExtensions: event.target.value }))}
              placeholder="pdf, png, jpg"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={submitting}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Guardando..." : item ? "Actualizar" : "Crear"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

interface DeleteUploadButtonProps {
  item: UploadCatalogItem
  onSuccess?: () => void | Promise<void>
}

export function DeleteUploadButton({ item, onSuccess }: DeleteUploadButtonProps) {
  const [submitting, setSubmitting] = useState(false)

  const handleDelete = async () => {
    const confirmed = window.confirm(`Se eliminara el requisito ${item.title}. Deseas continuar?`)
    if (!confirmed) {
      return
    }

    setSubmitting(true)
    try {
      await api.delete(`/api/document-folders/uploads/${item._id}`)
      toast.success("Requisito eliminado correctamente")
      await onSuccess?.()
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "No fue posible eliminar el requisito"
      toast.error(message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Button variant="ghost" size="icon" onClick={handleDelete} disabled={submitting}>
      <Trash2 className="h-4 w-4 text-destructive" />
    </Button>
  )
}