import React, { useEffect, useMemo, useState } from "react"
import { ArrowDownIcon, ArrowUpIcon, PlusCircleIcon, PlusIcon, Trash2Icon } from "lucide-react"
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

type FieldType =
  | "text"
  | "number"
  | "date"
  | "select"
  | "checkbox"
  | "textarea"
  | "yes_no_comment"
  | "string_list"

type ApiUserRole = "client" | "company"

interface FieldOption {
  label: string
  value: string | number | boolean
}

interface YesNoConfig {
  commentPlaceholder: string
  commentRequired: boolean
}

interface FieldConfig {
  fieldKey: string
  tag: string
  type: FieldType
  required: boolean
  placeholder: string
  options: FieldOption[]
  yesNoConfig?: YesNoConfig
}

interface SectionConfig {
  title: string
  description: string
  fields: FieldConfig[]
}

interface DocumentForm {
  key: string
  name: string
  downloadEndpoint: string
  status: boolean
  userType: ApiUserRole
  structureTitle: string
}

interface StructurePayload {
  title?: string
  sections?: SectionConfig[]
  fields?: FieldConfig[]
}

interface DocumentDetails {
  _id: string
  key: string
  name: string
  downloadEndpoint: string
  status: boolean
  userType: ApiUserRole
  documentStructureId?: StructurePayload
}

interface StructureResponse {
  document: DocumentDetails
  structure?: StructurePayload
}

const FIELD_TYPES: { label: string; value: FieldType }[] = [
  { label: "Texto", value: "text" },
  { label: "Numero", value: "number" },
  { label: "Fecha", value: "date" },
  { label: "Lista desplegable", value: "select" },
  { label: "Casilla de verificacion", value: "checkbox" },
  { label: "Area de texto", value: "textarea" },
  { label: "Si/No con observaciones", value: "yes_no_comment" },
  { label: "Lista dinamica de texto", value: "string_list" },
]

function emptyYesNoConfig(): YesNoConfig {
  return {
    commentPlaceholder: "Observaciones...",
    commentRequired: false,
  }
}

function emptyField(): FieldConfig {
  return {
    fieldKey: "",
    tag: "",
    type: "text",
    required: false,
    placeholder: "",
    options: [],
  }
}

function emptySection(sectionNumber: number): SectionConfig {
  return {
    title: `Seccion ${sectionNumber}`,
    description: "",
    fields: [emptyField()],
  }
}

function normalizeField(field?: Partial<FieldConfig>): FieldConfig {
  return {
    fieldKey: field?.fieldKey ?? "",
    tag: field?.tag ?? "",
    type: field?.type ?? "text",
    required: Boolean(field?.required),
    placeholder: field?.placeholder ?? "",
    options: field?.options ?? [],
    yesNoConfig:
      field?.type === "yes_no_comment"
        ? {
            commentPlaceholder: field?.yesNoConfig?.commentPlaceholder ?? "Observaciones...",
            commentRequired: Boolean(field?.yesNoConfig?.commentRequired),
          }
        : undefined,
  }
}

function normalizeSectionsFromResponse(
  documentName: string,
  structure?: StructurePayload,
  fallbackStructure?: StructurePayload
): { title: string; sections: SectionConfig[] } {
  const source = structure ?? fallbackStructure
  const structureTitle = source?.title ?? documentName ?? "Estructura de documento"

  if (Array.isArray(source?.sections) && source.sections.length > 0) {
    return {
      title: structureTitle,
      sections: source.sections.map((section, index) => ({
        title: section.title || `Seccion ${index + 1}`,
        description: section.description || "",
        fields:
          section.fields && section.fields.length > 0
            ? section.fields.map((field) => normalizeField(field))
            : [emptyField()],
      })),
    }
  }

  if (Array.isArray(source?.fields) && source.fields.length > 0) {
    return {
      title: structureTitle,
      sections: [
        {
          title: "Seccion general",
          description: "",
          fields: source.fields.map((field) => normalizeField(field)),
        },
      ],
    }
  }

  return {
    title: structureTitle,
    sections: [emptySection(1)],
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
    structureTitle: "",
  })
  const [sections, setSections] = useState<SectionConfig[]>([emptySection(1)])

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
      structureTitle: "",
    })
    setSections([emptySection(1)])
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
        const normalizedStructure = normalizeSectionsFromResponse(
          data.document.name,
          data.structure,
          data.document.documentStructureId
        )

        setDocumentDetails(data.document)
        setForm({
          key: data.document.key,
          name: data.document.name,
          downloadEndpoint: data.document.downloadEndpoint,
          status: data.document.status,
          userType: data.document.userType ?? "client",
          structureTitle: normalizedStructure.title,
        })
        setSections(normalizedStructure.sections)
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

  function handleFormChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, type, checked } = event.target
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }))
  }

  function updateFieldType(field: FieldConfig, nextType: FieldType): FieldConfig {
    return {
      ...field,
      type: nextType,
      options: nextType === "select" ? field.options ?? [] : [],
      yesNoConfig:
        nextType === "yes_no_comment"
          ? field.yesNoConfig ?? emptyYesNoConfig()
          : undefined,
    }
  }

  function handleSectionChange(sectionIndex: number, key: "title" | "description", value: string) {
    setSections((prev) =>
      prev.map((section, currentIndex) =>
        currentIndex === sectionIndex ? { ...section, [key]: value } : section
      )
    )
  }

  function addSection() {
    setSections((prev) => [...prev, emptySection(prev.length + 1)])
  }

  function removeSection(sectionIndex: number) {
    setSections((prev) => prev.filter((_, index) => index !== sectionIndex))
  }

  function moveSection(sectionIndex: number, direction: -1 | 1) {
    setSections((prev) => {
      const nextIndex = sectionIndex + direction
      if (nextIndex < 0 || nextIndex >= prev.length) {
        return prev
      }

      const next = [...prev]
      const current = next[sectionIndex]
      next[sectionIndex] = next[nextIndex]
      next[nextIndex] = current
      return next
    })
  }

  function addField(sectionIndex: number) {
    setSections((prev) =>
      prev.map((section, currentIndex) =>
        currentIndex === sectionIndex
          ? { ...section, fields: [...section.fields, emptyField()] }
          : section
      )
    )
  }

  function removeField(sectionIndex: number, fieldIndex: number) {
    setSections((prev) =>
      prev.map((section, currentIndex) =>
        currentIndex === sectionIndex
          ? { ...section, fields: section.fields.filter((_, index) => index !== fieldIndex) }
          : section
      )
    )
  }

  function moveField(sectionIndex: number, fieldIndex: number, direction: -1 | 1) {
    setSections((prev) =>
      prev.map((section, currentSectionIndex) => {
        if (currentSectionIndex !== sectionIndex) {
          return section
        }

        const nextIndex = fieldIndex + direction
        if (nextIndex < 0 || nextIndex >= section.fields.length) {
          return section
        }

        const nextFields = [...section.fields]
        const current = nextFields[fieldIndex]
        nextFields[fieldIndex] = nextFields[nextIndex]
        nextFields[nextIndex] = current

        return { ...section, fields: nextFields }
      })
    )
  }

  function handleFieldChange(
    sectionIndex: number,
    fieldIndex: number,
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value, type } = event.target
    const checked = (event.target as HTMLInputElement).checked

    setSections((prev) =>
      prev.map((section, currentSectionIndex) =>
        currentSectionIndex === sectionIndex
          ? {
              ...section,
              fields: section.fields.map((field, currentFieldIndex) => {
                if (currentFieldIndex !== fieldIndex) return field

                if (name === "type") {
                  return updateFieldType(field, value as FieldType)
                }

                return { ...field, [name]: type === "checkbox" ? checked : value }
              }),
            }
          : section
      )
    )
  }

  function addOption(sectionIndex: number, fieldIndex: number) {
    setSections((prev) =>
      prev.map((section, currentSectionIndex) =>
        currentSectionIndex === sectionIndex
          ? {
              ...section,
              fields: section.fields.map((field, currentFieldIndex) =>
                currentFieldIndex === fieldIndex
                  ? { ...field, options: [...field.options, { label: "", value: "" }] }
                  : field
              ),
            }
          : section
      )
    )
  }

  function removeOption(sectionIndex: number, fieldIndex: number, optionIndex: number) {
    setSections((prev) =>
      prev.map((section, currentSectionIndex) =>
        currentSectionIndex === sectionIndex
          ? {
              ...section,
              fields: section.fields.map((field, currentFieldIndex) =>
                currentFieldIndex === fieldIndex
                  ? {
                      ...field,
                      options: field.options.filter((_, currentOptionIndex) => currentOptionIndex !== optionIndex),
                    }
                  : field
              ),
            }
          : section
      )
    )
  }

  function handleOptionChange(
    sectionIndex: number,
    fieldIndex: number,
    optionIndex: number,
    key: "label" | "value",
    value: string
  ) {
    setSections((prev) =>
      prev.map((section, currentSectionIndex) =>
        currentSectionIndex === sectionIndex
          ? {
              ...section,
              fields: section.fields.map((field, currentFieldIndex) =>
                currentFieldIndex === fieldIndex
                  ? {
                      ...field,
                      options: field.options.map((option, currentOptionIndex) =>
                        currentOptionIndex === optionIndex ? { ...option, [key]: value } : option
                      ),
                    }
                  : field
              ),
            }
          : section
      )
    )
  }

  function updateYesNoConfig(
    sectionIndex: number,
    fieldIndex: number,
    patch: Partial<YesNoConfig>
  ) {
    setSections((prev) =>
      prev.map((section, currentSectionIndex) =>
        currentSectionIndex === sectionIndex
          ? {
              ...section,
              fields: section.fields.map((field, currentFieldIndex) =>
                currentFieldIndex === fieldIndex
                  ? {
                      ...field,
                      yesNoConfig: {
                        ...(field.yesNoConfig ?? emptyYesNoConfig()),
                        ...patch,
                      },
                    }
                  : field
              ),
            }
          : section
      )
    )
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!documentDetails) return

    setRequestError(null)
    setSubmitting(true)

    try {
      await api.put(`/api/documents/${documentDetails._id}/document`, {
        ...form,
        sections,
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

      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Edita los datos del documento y la estructura por secciones del formulario.
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
                  <Input id="name" name="name" value={form.name} onChange={handleFormChange} disabled={submitting} required />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="key">Clave unica (key)</Label>
                  <Input id="key" name="key" value={form.key} onChange={handleFormChange} disabled={submitting} required />
                </div>

                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <Label htmlFor="downloadEndpoint">Endpoint de descarga</Label>
                  <Input
                    id="downloadEndpoint"
                    name="downloadEndpoint"
                    value={form.downloadEndpoint}
                    onChange={handleFormChange}
                    disabled={submitting}
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <Label htmlFor="structureTitle">Titulo de la estructura</Label>
                  <Input
                    id="structureTitle"
                    name="structureTitle"
                    value={form.structureTitle}
                    onChange={handleFormChange}
                    disabled={submitting}
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
                      <SelectItem value="client">Persona Fisica</SelectItem>
                      <SelectItem value="company">Persona Moral</SelectItem>
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
                  Secciones del formulario
                </h3>
                <Button type="button" variant="outline" size="sm" onClick={addSection} disabled={submitting}>
                  <PlusCircleIcon className="size-4" />
                  Agregar seccion
                </Button>
              </div>

              <div className="flex flex-col gap-4">
                {sections.map((section, sectionIndex) => (
                  <div key={sectionIndex} className="rounded-lg border p-4">
                    <div className="mb-3 flex items-center justify-between gap-2">
                      <span className="text-xs font-medium text-muted-foreground">Seccion #{sectionIndex + 1}</span>
                      <div className="flex items-center gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => moveSection(sectionIndex, -1)}
                          disabled={sectionIndex === 0 || submitting}
                        >
                          <ArrowUpIcon className="size-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => moveSection(sectionIndex, 1)}
                          disabled={sectionIndex === sections.length - 1 || submitting}
                        >
                          <ArrowDownIcon className="size-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => removeSection(sectionIndex)}
                          disabled={sections.length === 1 || submitting}
                        >
                          <Trash2Icon className="size-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div className="flex flex-col gap-1.5">
                        <Label>Titulo de seccion</Label>
                        <Input
                          value={section.title}
                          onChange={(event) => handleSectionChange(sectionIndex, "title", event.target.value)}
                          placeholder="Ej: Datos notariales"
                          disabled={submitting}
                          required
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <Label>Descripcion</Label>
                        <Input
                          value={section.description}
                          onChange={(event) => handleSectionChange(sectionIndex, "description", event.target.value)}
                          placeholder="Descripcion opcional"
                          disabled={submitting}
                        />
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-muted-foreground">Campos</h4>
                      <Button type="button" variant="outline" size="sm" onClick={() => addField(sectionIndex)} disabled={submitting}>
                        <PlusCircleIcon className="size-4" />
                        Agregar campo
                      </Button>
                    </div>

                    <div className="mt-3 flex flex-col gap-3">
                      {section.fields.map((field, fieldIndex) => (
                        <FieldRow
                          key={`${sectionIndex}-${fieldIndex}`}
                          index={fieldIndex}
                          field={field}
                          disabled={submitting}
                          onChange={(event) => handleFieldChange(sectionIndex, fieldIndex, event)}
                          onRemove={() => removeField(sectionIndex, fieldIndex)}
                          onMoveUp={() => moveField(sectionIndex, fieldIndex, -1)}
                          onMoveDown={() => moveField(sectionIndex, fieldIndex, 1)}
                          canMoveUp={fieldIndex > 0}
                          canMoveDown={fieldIndex < section.fields.length - 1}
                          canRemove={section.fields.length > 1}
                          onAddOption={() => addOption(sectionIndex, fieldIndex)}
                          onRemoveOption={(optionIndex) => removeOption(sectionIndex, fieldIndex, optionIndex)}
                          onOptionChange={(optionIndex, key, value) =>
                            handleOptionChange(sectionIndex, fieldIndex, optionIndex, key, value)
                          }
                          onYesNoConfigChange={(patch) => updateYesNoConfig(sectionIndex, fieldIndex, patch)}
                        />
                      ))}
                    </div>
                  </div>
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

interface FieldRowProps {
  index: number
  field: FieldConfig
  disabled?: boolean
  onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
  onRemove: () => void
  onMoveUp: () => void
  onMoveDown: () => void
  canMoveUp: boolean
  canMoveDown: boolean
  canRemove: boolean
  onAddOption: () => void
  onRemoveOption: (optionIndex: number) => void
  onOptionChange: (optionIndex: number, key: "label" | "value", value: string) => void
  onYesNoConfigChange: (patch: Partial<YesNoConfig>) => void
}

function FieldRow({
  index,
  field,
  disabled,
  onChange,
  onRemove,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
  canRemove,
  onAddOption,
  onRemoveOption,
  onOptionChange,
  onYesNoConfigChange,
}: FieldRowProps) {
  return (
    <div className="relative flex flex-col gap-3 rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">Campo #{index + 1}</span>
        <div className="flex items-center gap-1">
          <Button type="button" variant="ghost" size="sm" onClick={onMoveUp} disabled={!canMoveUp || disabled}>
            <ArrowUpIcon className="size-4" />
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={onMoveDown} disabled={!canMoveDown || disabled}>
            <ArrowDownIcon className="size-4" />
          </Button>
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
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label>Clave del campo (fieldKey)</Label>
          <Input name="fieldKey" value={field.fieldKey} onChange={onChange} disabled={disabled} required />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Etiqueta (tag)</Label>
          <Input name="tag" value={field.tag} onChange={onChange} disabled={disabled} required />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Tipo de campo</Label>
          <select
            name="type"
            value={field.type}
            onChange={onChange}
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
          <Input name="placeholder" value={field.placeholder} onChange={onChange} disabled={disabled} />
        </div>

        <div className="flex items-center gap-2 sm:col-span-2">
          <input
            name="required"
            type="checkbox"
            checked={field.required}
            onChange={onChange}
            disabled={disabled}
            className="size-4 rounded border"
          />
          <Label>Campo obligatorio</Label>
        </div>
      </div>

      {field.type === "yes_no_comment" ? (
        <div className="mt-1 flex flex-col gap-2 border-t pt-2">
          <span className="text-xs font-medium text-muted-foreground">Configuracion Si/No con observaciones</span>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label>Placeholder de observaciones</Label>
              <Input
                value={field.yesNoConfig?.commentPlaceholder ?? "Observaciones..."}
                onChange={(event) => onYesNoConfigChange({ commentPlaceholder: event.target.value })}
                disabled={disabled}
              />
            </div>
            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                checked={Boolean(field.yesNoConfig?.commentRequired)}
                onChange={(event) => onYesNoConfigChange({ commentRequired: event.target.checked })}
                disabled={disabled}
                className="size-4 rounded border"
              />
              <Label>Observacion obligatoria</Label>
            </div>
          </div>
        </div>
      ) : null}

      {field.type === "select" ? (
        <div className="mt-1 flex flex-col gap-2 border-t pt-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Opciones del desplegable</span>
            <Button type="button" variant="outline" size="sm" onClick={onAddOption} disabled={disabled}>
              <PlusIcon className="size-3" />
              Opcion
            </Button>
          </div>

          {field.options.map((option, optionIndex) => (
            <div key={optionIndex} className="flex items-center gap-2">
              <Input
                placeholder="Etiqueta"
                value={option.label}
                onChange={(event) => onOptionChange(optionIndex, "label", event.target.value)}
                disabled={disabled}
                required
              />
              <Input
                placeholder="Valor"
                value={String(option.value)}
                onChange={(event) => onOptionChange(optionIndex, "value", event.target.value)}
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
