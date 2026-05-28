import { useEffect, useMemo, useState } from "react"
import { toast } from "react-toastify"
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
import api, { postDownloadDocumentFromEndpoint } from "@/utils/api"

type FieldType = "text" | "number" | "date" | "select" | "checkbox" | "textarea"

interface FieldOption {
	label: string
	value: string | number | boolean
}

interface FieldValidations {
	min?: number
	max?: number
	regex?: string
}

interface DocumentField {
	fieldKey: string
	tag: string
	type: FieldType
	required?: boolean
	placeholder?: string
	options?: FieldOption[]
	validations?: FieldValidations
}

interface DocumentDetails {
	_id: string
	key: string
	name: string
	downloadEndpoint: string
	documentStructureId?: {
		fields?: DocumentField[]
	}
}

interface StructureResponse {
	document: DocumentDetails
	structure?: {
		fields?: DocumentField[]
	}
}

interface DownloadDocumentModalProps {
	documentId: string
	documentRequestId?: string | null
	onSuccess?: () => void | Promise<void>
	trigger?: React.ReactNode
	open?: boolean
	onOpenChange?: (open: boolean) => void
}

function getInitialValue(field: DocumentField): string | boolean {
	if (field.type === "checkbox") return false
	return ""
}

function getFieldError(
	field: DocumentField,
	rawValue: unknown
): string | null {
	const isEmpty = rawValue === "" || rawValue === null || rawValue === undefined

	if (field.required) {
		if (field.type === "checkbox") {
			if (rawValue !== true) {
				return `${field.tag} es requerido`
			}
		} else if (isEmpty) {
			return `${field.tag} es requerido`
		}
	}

	if (isEmpty || field.type === "checkbox") return null

	if (field.type === "number") {
		const numberValue = Number(rawValue)
		if (Number.isNaN(numberValue)) {
			return `${field.tag} debe ser un numero valido`
		}
		if (field.validations?.min !== undefined && numberValue < field.validations.min) {
			return `${field.tag} debe ser mayor o igual a ${field.validations.min}`
		}
		if (field.validations?.max !== undefined && numberValue > field.validations.max) {
			return `${field.tag} debe ser menor o igual a ${field.validations.max}`
		}
	}

	if (field.validations?.regex && typeof rawValue === "string") {
		try {
			const regex = new RegExp(field.validations.regex)
			if (!regex.test(rawValue)) {
				return `${field.tag} no cumple con el formato requerido`
			}
		} catch {
			return "Validacion regex invalida en la configuracion del documento"
		}
	}

	return null
}

export default function DownloadDocumentModal({
	documentId,
	documentRequestId = null,
	onSuccess,
	trigger,
	open: controlledOpen,
	onOpenChange,
}: DownloadDocumentModalProps) {
	const [internalOpen, setInternalOpen] = useState(false)
	const [loading, setLoading] = useState(false)
	const [submitting, setSubmitting] = useState(false)
	const [documentDetails, setDocumentDetails] = useState<DocumentDetails | null>(null)
	const [fields, setFields] = useState<DocumentField[]>([])
	const [values, setValues] = useState<Record<string, string | boolean>>({})
	const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
	const [requestError, setRequestError] = useState<string | null>(null)

	const isControlled = controlledOpen !== undefined
	const open = isControlled ? controlledOpen : internalOpen

	const handleOpenChange = (nextOpen: boolean) => {
		if (!isControlled) {
			setInternalOpen(nextOpen)
		}
		onOpenChange?.(nextOpen)
	}

	const hasFields = fields.length > 0

	const title = useMemo(() => {
		if (!documentDetails) return "Descargar documento"
		return `Descargar ${documentDetails.name}`
	}, [documentDetails])

	useEffect(() => {
		if (!open) return

		const load = async () => {
			setLoading(true)
			setRequestError(null)

			try {
				const { data } = await api.get<StructureResponse>(`/api/documents/${documentId}`)

				const responseFields =
					data.structure?.fields ?? data.document.documentStructureId?.fields ?? []

				const initialValues = responseFields.reduce<Record<string, string | boolean>>((acc, field) => {
					acc[field.fieldKey] = getInitialValue(field)
					return acc
				}, {})

				setDocumentDetails(data.document)
				setFields(responseFields)
				setValues(initialValues)
				setFieldErrors({})
			} catch (err: unknown) {
				const message =
					(err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
					"No fue posible cargar la estructura del documento"

				setRequestError(message)
			} finally {
				setLoading(false)
			}
		}

		load()
	}, [documentId, open])

	const setFieldValue = (fieldKey: string, value: string | boolean) => {
		setValues((prev) => ({ ...prev, [fieldKey]: value }))
		setFieldErrors((prev) => {
			if (!prev[fieldKey]) return prev
			const next = { ...prev }
			delete next[fieldKey]
			return next
		})
	}

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		if (!documentDetails) return

		const nextErrors: Record<string, string> = {}

		for (const field of fields) {
			const error = getFieldError(field, values[field.fieldKey])
			if (error) {
				nextErrors[field.fieldKey] = error
			}
		}

		if (Object.keys(nextErrors).length > 0) {
			setFieldErrors(nextErrors)
			return
		}

		const payload = fields.reduce<Record<string, unknown>>((acc, field) => {
			const rawValue = values[field.fieldKey]

			if (field.type === "checkbox") {
				acc[field.fieldKey] = Boolean(rawValue)
				return acc
			}

			if (rawValue === "" || rawValue === null || rawValue === undefined) {
				return acc
			}

			if (field.type === "number") {
				acc[field.fieldKey] = Number(rawValue)
				return acc
			}

			if (field.type === "select") {
				const selectedOption = field.options?.find(
					(option) => String(option.value) === String(rawValue)
				)

				acc[field.fieldKey] = selectedOption ? selectedOption.value : rawValue
				return acc
			}

			acc[field.fieldKey] = rawValue
			return acc
		}, {})

		setSubmitting(true)
		setRequestError(null)

		try {
			await postDownloadDocumentFromEndpoint(
				documentDetails.downloadEndpoint,
				payload,
				documentDetails.key
			)

			if (documentRequestId) {
				try {
					await api.patch(`/api/document-requests/${documentRequestId}/status`, {
						status: "completed",
					})
				} catch {
					toast.warn("El documento se generó, pero no fue posible actualizar la solicitud")
				}
			}

			await onSuccess?.()

			toast.success("Documento generado correctamente")
			handleOpenChange(false)
		} catch (err: unknown) {
			const message =
				(err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
				"No fue posible generar el documento"

			setRequestError(message)
			toast.error(message)
		} finally {
			setSubmitting(false)
		}
	}

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			{trigger ? (
				<DialogTrigger asChild>
					{trigger}
				</DialogTrigger>
			) : null}

			<DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					<DialogDescription>
						Completa los campos requeridos para generar y descargar el PDF.
					</DialogDescription>
				</DialogHeader>

				{loading ? (
					<p className="text-sm text-muted-foreground">Cargando configuracion del documento...</p>
				) : requestError ? (
					<p className="text-sm text-destructive">{requestError}</p>
				) : (
					<form className="space-y-4" onSubmit={handleSubmit}>
						{hasFields ? (
							fields.map((field) => {
								const value = values[field.fieldKey]
								const error = fieldErrors[field.fieldKey]

								return (
									<div className="grid gap-2" key={field.fieldKey}>
										<Label htmlFor={field.fieldKey}>
											{field.tag}
											{field.required ? <span className="text-destructive"> *</span> : null}
										</Label>

										{field.type === "text" ? (
											<Input
												id={field.fieldKey}
												value={String(value ?? "")}
												onChange={(event) => setFieldValue(field.fieldKey, event.target.value)}
												placeholder={field.placeholder || ""}
												disabled={submitting}
											/>
										) : null}

										{field.type === "number" ? (
											<Input
												id={field.fieldKey}
												type="number"
												value={String(value ?? "")}
												onChange={(event) => setFieldValue(field.fieldKey, event.target.value)}
												placeholder={field.placeholder || ""}
												disabled={submitting}
											/>
										) : null}

										{field.type === "date" ? (
											<Input
												id={field.fieldKey}
												type="date"
												value={String(value ?? "")}
												onChange={(event) => setFieldValue(field.fieldKey, event.target.value)}
												disabled={submitting}
											/>
										) : null}

										{field.type === "textarea" ? (
											<textarea
												id={field.fieldKey}
												value={String(value ?? "")}
												onChange={(event) => setFieldValue(field.fieldKey, event.target.value)}
												placeholder={field.placeholder || ""}
												disabled={submitting}
												rows={4}
												className="border-input placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-24 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
											/>
										) : null}

										{field.type === "select" ? (
											<Select
												value={String(value ?? "")}
												onValueChange={(nextValue) => setFieldValue(field.fieldKey, nextValue)}
												disabled={submitting}
											>
												<SelectTrigger id={field.fieldKey}>
													<SelectValue placeholder={field.placeholder || "Selecciona una opcion"} />
												</SelectTrigger>
												<SelectContent>
													{(field.options || []).map((option) => (
														<SelectItem key={`${field.fieldKey}-${String(option.value)}`} value={String(option.value)}>
															{option.label}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										) : null}

										{field.type === "checkbox" ? (
											<div className="flex items-center gap-2">
												<Checkbox
													id={field.fieldKey}
													checked={Boolean(value)}
													onCheckedChange={(checked) => setFieldValue(field.fieldKey, checked === true)}
													disabled={submitting}
												/>
												<Label htmlFor={field.fieldKey}>{field.placeholder || field.tag}</Label>
											</div>
										) : null}

										{error ? <p className="text-sm text-destructive">{error}</p> : null}
									</div>
								)
							})
						) : (
							<p className="text-sm text-muted-foreground">
								Este documento no requiere datos adicionales. Puedes generar el PDF directamente.
							</p>
						)}

						<DialogFooter>
							<Button
								type="button"
								variant="outline"
								onClick={() => handleOpenChange(false)}
								disabled={submitting}
							>
								Cancelar
							</Button>
							<Button type="submit" disabled={submitting}>
								{submitting ? "Generando..." : "Generar y descargar"}
							</Button>
						</DialogFooter>
					</form>
				)}
			</DialogContent>
		</Dialog>
	)
}
