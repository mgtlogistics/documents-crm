import React, { useState } from "react"
import { PlusIcon, Trash2Icon, PlusCircleIcon } from "lucide-react"
import api from "@/utils/api"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

// ─── Types ────────────────────────────────────────────────────────────────────

type FieldType = "text" | "number" | "date" | "select" | "checkbox" | "textarea"

interface FieldOption {
  label: string
  value: string | number
}

interface FieldConfig {
  fieldKey: string
  tag: string
  type: FieldType
  required: boolean
  placeholder: string
  options: FieldOption[]
}

interface DocumentForm {
  key: string
  name: string
  downloadEndpoint: string
  status: boolean
}

const FIELD_TYPES: { label: string; value: FieldType }[] = [
  { label: "Texto", value: "text" },
  { label: "Número", value: "number" },
  { label: "Fecha", value: "date" },
  { label: "Lista desplegable", value: "select" },
  { label: "Casilla de verificación", value: "checkbox" },
  { label: "Área de texto", value: "textarea" },
]

function emptyField(): FieldConfig {
  return { fieldKey: "", tag: "", type: "text", required: false, placeholder: "", options: [] }
}

// ─── Component ────────────────────────────────────────────────────────────────

interface NewDocumentModalProps {
  onSuccess?: () => void
}

export default function NewDocumentModal({ onSuccess }: NewDocumentModalProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState<DocumentForm>({
    key: "",
    name: "",
    downloadEndpoint: "",
    status: true,
  })

  const [fields, setFields] = useState<FieldConfig[]>([emptyField()])

  // ── Form handlers ──────────────────────────────────────────────────────────

  function handleFormChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }))
  }

  function handleFieldChange(
    index: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    setFields((prev) =>
      prev.map((f, i) =>
        i === index ? { ...f, [name]: type === "checkbox" ? checked : value } : f
      )
    )
  }

  function addField() {
    setFields((prev) => [...prev, emptyField()])
  }

  function removeField(index: number) {
    setFields((prev) => prev.filter((_, i) => i !== index))
  }

  // ── Select options handlers ────────────────────────────────────────────────

  function addOption(fieldIndex: number) {
    setFields((prev) =>
      prev.map((f, i) =>
        i === fieldIndex ? { ...f, options: [...f.options, { label: "", value: "" }] } : f
      )
    )
  }

  function removeOption(fieldIndex: number, optionIndex: number) {
    setFields((prev) =>
      prev.map((f, i) =>
        i === fieldIndex
          ? { ...f, options: f.options.filter((_, oi) => oi !== optionIndex) }
          : f
      )
    )
  }

  function handleOptionChange(
    fieldIndex: number,
    optionIndex: number,
    key: "label" | "value",
    value: string
  ) {
    setFields((prev) =>
      prev.map((f, i) =>
        i === fieldIndex
          ? {
              ...f,
              options: f.options.map((o, oi) =>
                oi === optionIndex ? { ...o, [key]: value } : o
              ),
            }
          : f
      )
    )
  }

  // ── Submit ─────────────────────────────────────────────────────────────────

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      await api.post("/api/documents", { ...form, fields })
      setOpen(false)
      resetForm()
      onSuccess?.()
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Error al crear el documento"
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  function resetForm() {
    setForm({ key: "", name: "", downloadEndpoint: "", status: true })
    setFields([emptyField()])
    setError(null)
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <Dialog open={open} onOpenChange={(val) => { setOpen(val); if (!val) resetForm() }}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon />
          Nuevo documento
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nuevo documento</DialogTitle>
          <DialogDescription>
            Define los datos del documento y los campos que necesitará el formulario de generación de PDF.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* ── Sección: Datos del documento ───────────────────────── */}
          <section className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Datos del documento
            </h3>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Ej: Convenio de Seguridad OEA"
                  value={form.name}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="key">Clave única (key)</Label>
                <Input
                  id="key"
                  name="key"
                  placeholder="Ej: CONVENIO_SEGURIDAD_V1"
                  value={form.key}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <Label htmlFor="downloadEndpoint">Endpoint de descarga</Label>
                <Input
                  id="downloadEndpoint"
                  name="downloadEndpoint"
                  placeholder="Ej: /api/clients/convenio-seguridad"
                  value={form.downloadEndpoint}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  id="status"
                  name="status"
                  type="checkbox"
                  checked={form.status}
                  onChange={handleFormChange}
                  className="size-4 rounded border"
                />
                <Label htmlFor="status">Activo</Label>
              </div>
            </div>
          </section>

          {/* ── Sección: Campos del formulario ─────────────────────── */}
          <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Campos del formulario
              </h3>
              <Button type="button" variant="outline" size="sm" onClick={addField}>
                <PlusCircleIcon />
                Agregar campo
              </Button>
            </div>

            <div className="flex flex-col gap-4">
              {fields.map((field, index) => (
                <FieldRow
                  key={index}
                  index={index}
                  field={field}
                  onChange={handleFieldChange}
                  onRemove={() => removeField(index)}
                  onAddOption={() => addOption(index)}
                  onRemoveOption={(oi) => removeOption(index, oi)}
                  onOptionChange={(oi, key, val) => handleOptionChange(index, oi, key, val)}
                  canRemove={fields.length > 1}
                />
              ))}
            </div>
          </section>

          {error && (
            <p className="text-sm text-destructive rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2">
              {error}
            </p>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => { setOpen(false); resetForm() }}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Guardando..." : "Crear documento"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// ─── FieldRow sub-component ───────────────────────────────────────────────────

interface FieldRowProps {
  index: number
  field: FieldConfig
  onChange: (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
  onRemove: () => void
  canRemove: boolean
  onAddOption: () => void
  onRemoveOption: (optionIndex: number) => void
  onOptionChange: (optionIndex: number, key: "label" | "value", value: string) => void
}

function FieldRow({
  index,
  field,
  onChange,
  onRemove,
  canRemove,
  onAddOption,
  onRemoveOption,
  onOptionChange,
}: FieldRowProps) {
  return (
    <div className="rounded-lg border p-4 flex flex-col gap-3 relative">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">Campo #{index + 1}</span>
        {canRemove && (
          <Button type="button" variant="ghost" size="sm" onClick={onRemove} className="text-destructive hover:text-destructive">
            <Trash2Icon className="size-4" />
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label>Clave del campo (fieldKey)</Label>
          <Input
            name="fieldKey"
            placeholder="Ej: nombre_representante"
            value={field.fieldKey}
            onChange={(e) => onChange(index, e)}
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Etiqueta (tag)</Label>
          <Input
            name="tag"
            placeholder="Ej: Nombre del representante"
            value={field.tag}
            onChange={(e) => onChange(index, e)}
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Tipo de campo</Label>
          <select
            name="type"
            value={field.type}
            onChange={(e) => onChange(index, e)}
            className="border-input bg-background flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1"
          >
            {FIELD_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Placeholder</Label>
          <Input
            name="placeholder"
            placeholder="Texto de ayuda en el input"
            value={field.placeholder}
            onChange={(e) => onChange(index, e)}
          />
        </div>

        <div className="flex items-center gap-2 sm:col-span-2">
          <input
            name="required"
            type="checkbox"
            checked={field.required}
            onChange={(e) => onChange(index, e)}
            className="size-4 rounded border"
          />
          <Label>Campo obligatorio</Label>
        </div>
      </div>

      {/* Opciones para tipo "select" */}
      {field.type === "select" && (
        <div className="flex flex-col gap-2 pt-1 border-t mt-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Opciones del desplegable</span>
            <Button type="button" variant="outline" size="sm" onClick={onAddOption}>
              <PlusIcon className="size-3" />
              Opción
            </Button>
          </div>
          {field.options.map((opt, oi) => (
            <div key={oi} className="flex gap-2 items-center">
              <Input
                placeholder="Etiqueta (lo que ve el usuario)"
                value={opt.label}
                onChange={(e) => onOptionChange(oi, "label", e.target.value)}
                required
              />
              <Input
                placeholder="Valor (lo que procesa el código)"
                value={String(opt.value)}
                onChange={(e) => onOptionChange(oi, "value", e.target.value)}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onRemoveOption(oi)}
                className="text-destructive hover:text-destructive shrink-0"
              >
                <Trash2Icon className="size-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
