import { useEffect, useMemo, useState } from "react"
import { Pencil, Plus, Trash2 } from "lucide-react"
import { toast } from "react-toastify"

import api from "@/utils/api"
import { Badge } from "@/components/ui/badge"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import type {
  DocumentFolderPresetItem,
  DocumentItem,
  PresetAttachment,
  UploadCatalogItem,
  UserType,
} from "./types"

interface PresetDialogProps {
  item?: DocumentFolderPresetItem
  uploads: UploadCatalogItem[]
  documents: DocumentItem[]
  onSuccess?: () => void | Promise<void>
}

interface PresetFormState {
  title: string
  userType: UserType
  uploads: string[]
  documents: string[]
  attachments: PresetAttachment[]
  isActive: boolean
}

const emptyForm = (): PresetFormState => ({
  title: "",
  userType: "client",
  uploads: [],
  documents: [],
  attachments: [],
  isActive: true,
})

function emptyAttachment(): PresetAttachment {
  return {
    title: "",
    fileUrl: "",
    description: "",
  }
}

function toggleInCollection(collection: string[], value: string, checked: boolean) {
  if (checked) {
    return collection.includes(value) ? collection : [...collection, value]
  }

  return collection.filter((current) => current !== value)
}

export default function PresetDialog({ item, uploads, documents, onSuccess }: PresetDialogProps) {
  const [open, setOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState<PresetFormState>(emptyForm)

  useEffect(() => {
    if (!open) {
      setForm(emptyForm())
      return
    }

    if (item) {
      setForm({
        title: item.title,
        userType: item.userType,
        uploads: item.uploads.map((upload) => upload._id),
        documents: item.documents.map((document) => document._id),
        attachments: item.attachments.length > 0 ? item.attachments : [],
        isActive: item.isActive,
      })
    }
  }, [item, open])

  const filteredDocuments = useMemo(
    () => documents.filter((document) => document.userType === form.userType),
    [documents, form.userType]
  )

  const handleSubmit = async () => {
    if (!form.title.trim()) {
      toast.error("El titulo del preset es obligatorio")
      return
    }

    const invalidAttachment = form.attachments.find(
      (attachment) => !attachment.title.trim() || !attachment.fileUrl.trim()
    )

    if (invalidAttachment) {
      toast.error("Todos los anexos deben incluir titulo y URL")
      return
    }

    setSubmitting(true)
    try {
      const payload = {
        title: form.title.trim(),
        userType: form.userType,
        uploads: form.uploads,
        documents: form.documents,
        attachments: form.attachments.map((attachment) => ({
          title: attachment.title.trim(),
          fileUrl: attachment.fileUrl.trim(),
          description: attachment.description?.trim() ?? "",
        })),
        isActive: form.isActive,
      }

      if (item?._id) {
        await api.put(`/api/document-folders/presets/${item._id}`, payload)
        toast.success("Preset actualizado correctamente")
      } else {
        await api.post("/api/document-folders/presets", payload)
        toast.success("Preset creado correctamente")
      }

      await onSuccess?.()
      setOpen(false)
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "No fue posible guardar el preset"
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
            Nuevo preset
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>{item ? "Editar preset" : "Nuevo preset de carpeta"}</DialogTitle>
          <DialogDescription>
            Combina requisitos de subida, formularios y anexos para crear una carpeta reusable.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-2">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="preset-title">Titulo</Label>
              <Input
                id="preset-title"
                value={form.title}
                onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
                placeholder="Expediente de alta de cliente"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="preset-user-type">Tipo de usuario</Label>
              <Select
                value={form.userType}
                onValueChange={(value) => setForm((prev) => ({ ...prev, userType: value as UserType, documents: [] }))}
              >
                <SelectTrigger id="preset-user-type">
                  <SelectValue placeholder="Selecciona un tipo de usuario" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="client">Persona fisica</SelectItem>
                  <SelectItem value="company">Persona moral</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-md border px-3 py-2">
            <Checkbox
              id="preset-active"
              checked={form.isActive}
              onCheckedChange={(checked) => setForm((prev) => ({ ...prev, isActive: checked === true }))}
            />
            <Label htmlFor="preset-active">Preset activo</Label>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-3 rounded-lg border p-4">
              <div>
                <h3 className="font-medium">Requisitos de subida</h3>
                <p className="text-sm text-muted-foreground">Selecciona los archivos que deberan cargarse.</p>
              </div>

              <div className="space-y-3">
                {uploads.length > 0 ? (
                  uploads.map((upload) => {
                    const checked = form.uploads.includes(upload._id)

                    return (
                      <label key={upload._id} className="flex items-start gap-3 rounded-md border p-3">
                        <Checkbox
                          checked={checked}
                          onCheckedChange={(value) =>
                            setForm((prev) => ({
                              ...prev,
                              uploads: toggleInCollection(prev.uploads, upload._id, value === true),
                            }))
                          }
                        />
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-medium">{upload.title}</span>
                            <Badge variant={upload.isActive ? "default" : "secondary"}>{upload.key}</Badge>
                          </div>
                          {upload.description ? (
                            <p className="text-sm text-muted-foreground">{upload.description}</p>
                          ) : null}
                        </div>
                      </label>
                    )
                  })
                ) : (
                  <p className="text-sm text-muted-foreground">Aun no hay requisitos registrados.</p>
                )}
              </div>
            </div>

            <div className="space-y-3 rounded-lg border p-4">
              <div>
                <h3 className="font-medium">Formularios</h3>
                <p className="text-sm text-muted-foreground">Solo se muestran documentos del tipo seleccionado.</p>
              </div>

              <div className="space-y-3">
                {filteredDocuments.length > 0 ? (
                  filteredDocuments.map((document) => {
                    const checked = form.documents.includes(document._id)

                    return (
                      <label key={document._id} className="flex items-start gap-3 rounded-md border p-3">
                        <Checkbox
                          checked={checked}
                          onCheckedChange={(value) =>
                            setForm((prev) => ({
                              ...prev,
                              documents: toggleInCollection(prev.documents, document._id, value === true),
                            }))
                          }
                        />
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-medium">{document.name}</span>
                            <Badge variant={document.status ? "default" : "secondary"}>{document.key}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{document.downloadEndpoint}</p>
                        </div>
                      </label>
                    )
                  })
                ) : (
                  <p className="text-sm text-muted-foreground">No hay documentos para este tipo de usuario.</p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-3 rounded-lg border p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="font-medium">Anexos del admin</h3>
                <p className="text-sm text-muted-foreground">Adjunta referencias a archivos o recursos fijos.</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setForm((prev) => ({ ...prev, attachments: [...prev.attachments, emptyAttachment()] }))}
              >
                <Plus className="mr-2 h-4 w-4" />
                Agregar anexo
              </Button>
            </div>

            {form.attachments.length > 0 ? (
              <div className="space-y-4">
                {form.attachments.map((attachment, index) => (
                  <div key={`${attachment.title}-${index}`} className="grid gap-3 rounded-md border p-4">
                    <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
                      <Input
                        value={attachment.title}
                        onChange={(event) =>
                          setForm((prev) => ({
                            ...prev,
                            attachments: prev.attachments.map((current, currentIndex) =>
                              currentIndex === index ? { ...current, title: event.target.value } : current
                            ),
                          }))
                        }
                        placeholder="Titulo del anexo"
                      />
                      <Input
                        value={attachment.fileUrl}
                        onChange={(event) =>
                          setForm((prev) => ({
                            ...prev,
                            attachments: prev.attachments.map((current, currentIndex) =>
                              currentIndex === index ? { ...current, fileUrl: event.target.value } : current
                            ),
                          }))
                        }
                        placeholder="https://..."
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          setForm((prev) => ({
                            ...prev,
                            attachments: prev.attachments.filter((_, currentIndex) => currentIndex !== index),
                          }))
                        }
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>

                    <textarea
                      value={attachment.description ?? ""}
                      onChange={(event) =>
                        setForm((prev) => ({
                          ...prev,
                          attachments: prev.attachments.map((current, currentIndex) =>
                            currentIndex === index ? { ...current, description: event.target.value } : current
                          ),
                        }))
                      }
                      placeholder="Descripcion opcional"
                      className="min-h-20 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Este preset no tiene anexos fijos.</p>
            )}
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

interface DeletePresetButtonProps {
  item: DocumentFolderPresetItem
  onSuccess?: () => void | Promise<void>
}

export function DeletePresetButton({ item, onSuccess }: DeletePresetButtonProps) {
  const [submitting, setSubmitting] = useState(false)

  const handleDelete = async () => {
    const confirmed = window.confirm(`Se eliminara el preset ${item.title}. Deseas continuar?`)
    if (!confirmed) {
      return
    }

    setSubmitting(true)
    try {
      await api.delete(`/api/document-folders/presets/${item._id}`)
      toast.success("Preset eliminado correctamente")
      await onSuccess?.()
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "No fue posible eliminar el preset"
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