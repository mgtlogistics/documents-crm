import React, { useEffect, useMemo, useState } from "react"
import { PlusCircleIcon, PlusIcon, Trash2Icon } from "lucide-react"
import { toast } from "react-toastify"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// ─── Types ────────────────────────────────────────────────────────────────────

type FieldType = "text" | "number" | "date" | "select" | "checkbox" | "textarea"

type ApiUserRole = "client" | "company"

interface FieldOption {
  label: string
  value: string | number | boolean
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
  userType: ApiUserRole
}

interface DocumentDetails {
  _id: string
  key: string
  name: string
  downloadEndpoint: string
  status: boolean
  userType: ApiUserRole
  documentStructureId?: {
    fields?: FieldConfig[]
  }
}

interface StructureResponse {
  document: DocumentDetails
  structure?: {
    fields?: FieldConfig[]
  }
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

function normalizeField(field: Partial<FieldConfig>): FieldConfig {
  return {
    fieldKey: field.fieldKey ?? "",
    tag: field.tag ?? "",
    type: field.type ?? "text",
    required: field.required ?? false,
    placeholder: field.placeholder ?? "",
    options: field.options ?? [],
  }
}

interface EditDocumentModalProps {
  documentId: string
  onSuccess?: () => void | Promise<void>
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export default function EditDocumentModal({
  documentId,
  onSuccess,
  trigger,
  open: controlledOpen,
  onOpenChange,
}: EditDocumentModalProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [requestError, setRequestError] = useState<string | null>(null)
  const [documentDetails, setDocumentDetails] = useState<DocumentDetails | null>(null)
  const [form, setForm] = useState<DocumentForm>({
    key: "",
    name: "",
    downloadEndpoint: "",
    status: true,
    userType: "client",
  })
  const [fields, setFields] = useState<FieldConfig[]>([emptyField()])

  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : internalOpen

  const title = useMemo(() => {
    if (!documentDetails) return "Editar documento"
    return `Editar ${documentDetails.name}`
  }, [documentDetails])

  const resetForm = () => {
    setLoading(false)
    setSubmitting(false)
    setRequestError(null)
    setDocumentDetails(null)
    setForm({
      key: "",
      name: "",
      downloadEndpoint: "",
      status: true,
      userType: "client",
    })
    setFields([emptyField()])
  }

  const handleOpenChange = (nextOpen: boolean) => {
    if (!isControlled) {
      setInternalOpen(nextOpen)
    }

    if (!nextOpen) {
      resetForm()
    }

    onOpenChange?.(nextOpen)
  }

  useEffect(() => {
    if (!open) return

    const loadDocument = async () => {
      setLoading(true)
      setRequestError(null)

      try {
        const { data } = await api.get<StructureResponse>(`/api/documents/${documentId}`)
        const responseFields = data.structure?.fields ?? data.document.documentStructureId?.fields ?? []
        const normalizedFields = responseFields.map((field) => normalizeField(field))

        setDocumentDetails(data.document)
        setForm({
          key: data.document.key,
          name: data.document.name,
          downloadEndpoint: data.document.downloadEndpoint,
          status: data.document.status,
          userType: data.document.userType ?? "client",
        })
        setFields(normalizedFields.length > 0 ? normalizedFields : [emptyField()])
      } catch (err: unknown) {
        const message =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
          "No fue posible cargar el documento"

        setRequestError(message)
      } finally {
        setLoading(false)
      }
    }

    loadDocument()
  }, [documentId, open])

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
      prev.map((field, fieldIndex) =>
        fieldIndex === index ? { ...field, [name]: type === "checkbox" ? checked : value } : field
      )
    )
  }

  function addField() {
    setFields((prev) => [...prev, emptyField()])
  }

  function removeField(index: number) {
    setFields((prev) => prev.filter((_, fieldIndex) => fieldIndex !== index))
  }

  function addOption(fieldIndex: number) {
    setFields((prev) =>
      prev.map((field, index) =>
        index === fieldIndex ? { ...field, options: [...field.options, { label: "", value: "" }] } : field
      )
    )
  }

  function removeOption(fieldIndex: number, optionIndex: number) {
    setFields((prev) =>
      prev.map((field, index) =>
        index === fieldIndex
          ? { ...field, options: field.options.filter((_, currentIndex) => currentIndex !== optionIndex) }
          : field
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
      prev.map((field, index) =>
        index === fieldIndex
          ? {
              ...field,
              options: field.options.map((option, currentIndex) =>
                currentIndex === optionIndex ? { ...option, [key]: value } : option
              ),
            }
          : field
      )
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!documentDetails) return

    setRequestError(null)
    setSubmitting(true)

    try {
      await api.put(`/api/documents/${documentDetails._id}/document`, {
        ...form,
        fields,
      })

      toast.success("Documento actualizado correctamente")
      await onSuccess?.()
      handleOpenChange(false)
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Error al actualizar el documento"
      setRequestError(message)
      toast.error(message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}

      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Edita los datos del documento y los campos que utiliza el formulario de generación de PDF.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <p className="text-sm text-muted-foreground">Cargando documento...</p>
        ) : requestError ? (
          <p className="text-sm text-destructive">{requestError}</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <section className="flex flex-col gap-4">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
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
                    disabled={submitting}
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
                    disabled={submitting}
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
                    disabled={submitting}
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="userType">Tipo de usuario</Label>
                  <Select
                    value={form.userType}
                    onValueChange={(value) => setForm((prev) => ({ ...prev, userType: value as ApiUserRole }))}
                    disabled={submitting}
                  >
                    <SelectTrigger id="userType">
                      <SelectValue placeholder="Selecciona un tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="client">Persona Física</SelectItem>
                      <SelectItem value="company">Empresa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2 pt-7">
                  <input
                    id="status"
                    name="status"
                    type="checkbox"
                    checked={form.status}
                    onChange={handleFormChange}
                    disabled={submitting}
                    className="size-4 rounded border"
                  />
                  <Label htmlFor="status">Activo</Label>
                </div>
              </div>
            </section>

            <section className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Campos del formulario
                </h3>
                <Button type="button" variant="outline" size="sm" onClick={addField} disabled={submitting}>
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
                    onRemoveOption={(optionIndex) => removeOption(index, optionIndex)}
                    onOptionChange={(optionIndex, key, value) => handleOptionChange(index, optionIndex, key, value)}
                    canRemove={fields.length > 1}
                    disabled={submitting}
                  />
                ))}
              </div>
            </section>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => handleOpenChange(false)} disabled={submitting}>
                Cancelar
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Guardando..." : "Guardar cambios"}
              </Button>
            </DialogFooter>
          </form>
        )}
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
  disabled?: boolean
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
  disabled,
}: FieldRowProps) {
  return (
    <div className="relative flex flex-col gap-3 rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">Campo #{index + 1}</span>
        {canRemove ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="text-destructive hover:text-destructive"
            disabled={disabled}
          >
            <Trash2Icon className="size-4" />
          </Button>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label>Clave del campo (fieldKey)</Label>
          <Input
            name="fieldKey"
            placeholder="Ej: nombre_representante"
            value={field.fieldKey}
            onChange={(e) => onChange(index, e)}
            disabled={disabled}
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
            disabled={disabled}
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Tipo de campo</Label>
          <select
            name="type"
            value={field.type}
            onChange={(e) => onChange(index, e)}
            disabled={disabled}
            className="border-input bg-background flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {FIELD_TYPES.map((fieldType) => (
              <option key={fieldType.value} value={fieldType.value}>
                {fieldType.label}
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
            disabled={disabled}
          />
        </div>

        <div className="flex items-center gap-2 sm:col-span-2">
          <input
            name="required"
            type="checkbox"
            checked={field.required}
            onChange={(e) => onChange(index, e)}
            disabled={disabled}
            className="size-4 rounded border"
          />
          <Label>Campo obligatorio</Label>
        </div>
      </div>

      {field.type === "select" ? (
        <div className="mt-1 flex flex-col gap-2 border-t pt-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Opciones del desplegable</span>
            <Button type="button" variant="outline" size="sm" onClick={onAddOption} disabled={disabled}>
              <PlusIcon className="size-3" />
              Opción
            </Button>
          </div>

          {field.options.map((option, optionIndex) => (
            <div key={optionIndex} className="flex items-center gap-2">
              <Input
                placeholder="Etiqueta (lo que ve el usuario)"
                value={option.label}
                onChange={(e) => onOptionChange(optionIndex, "label", e.target.value)}
                disabled={disabled}
                required
              />
              <Input
                placeholder="Valor (lo que procesa el código)"
                value={String(option.value)}
                onChange={(e) => onOptionChange(optionIndex, "value", e.target.value)}
                disabled={disabled}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onRemoveOption(optionIndex)}
                className="shrink-0 text-destructive hover:text-destructive"
                disabled={disabled}
              >
                <Trash2Icon className="size-4" />
              </Button>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}
