import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { API_ENDPOINTS } from '@/config/api'
import { useAuthStore } from '@/store/authStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'

type AddressForm = {
	street: string
	exteriorNumber: string
	interiorNumber: string
	neighborhood: string
	locality: string
	postalCode: string
	city: string
	state: string
	country: string
}

type PersonForm = {
	names: string
	surnames: string
	rfc: string
}

type CompanyForm = {
	socialReason: string
	rfc: string
	legalRepresentativeName: string
	legalRepresentativeRfc: string
	legalRepresentativePosition: string
	formFillerName: string
	scripture: string
	notaryName: string
	notaryNumber: string
	notaryCity: string
	notaryState: string
	powerOfAttorneyNumber: string
	powerOfAttorneyVolume: string
	powerOfAttorneyDate: string
}

const defaultAddress: AddressForm = {
	street: '',
	exteriorNumber: '',
	interiorNumber: '',
	neighborhood: '',
	locality: '',
	postalCode: '',
	city: '',
	state: '',
	country: '',
}

const defaultPerson: PersonForm = {
	names: '',
	surnames: '',
	rfc: '',
}

const defaultCompany: CompanyForm = {
	socialReason: '',
	rfc: '',
	legalRepresentativeName: '',
	legalRepresentativeRfc: '',
	legalRepresentativePosition: '',
	formFillerName: '',
	scripture: '',
	notaryName: '',
	notaryNumber: '',
	notaryCity: '',
	notaryState: '',
	powerOfAttorneyNumber: '',
	powerOfAttorneyVolume: '',
	powerOfAttorneyDate: '',
}

const personRequiredKeys: Array<keyof PersonForm> = ['names', 'surnames', 'rfc']
const companyRequiredKeys: Array<keyof CompanyForm> = [
	'socialReason',
	'rfc',
	'legalRepresentativeName',
	'legalRepresentativeRfc',
	'legalRepresentativePosition',
	'formFillerName',
	'scripture',
	'notaryName',
	'notaryNumber',
	'notaryCity',
	'notaryState',
	'powerOfAttorneyNumber',
	'powerOfAttorneyVolume',
	'powerOfAttorneyDate',
]
const addressRequiredKeys: Array<keyof AddressForm> = [
	'street',
	'exteriorNumber',
	'neighborhood',
	'locality',
	'postalCode',
	'city',
	'state',
	'country',
]

const toLabel = (value: string) => {
	return value
		.replace(/([A-Z])/g, ' $1')
		.replace(/^./, (char) => char.toUpperCase())
}

const labelOverrides: Partial<Record<keyof CompanyForm | keyof PersonForm | keyof AddressForm, string>> = {
	street: 'Calle',
	exteriorNumber: 'Número exterior',
	interiorNumber: 'Número interior',
	neighborhood: 'Colonia',
	locality: 'Localidad',
	postalCode: 'Código postal',
	city: 'Ciudad',
	state: 'Estado',
	country: 'País',
	names: 'Nombre(s)',
	surnames: 'Apellidos',
	rfc: 'RFC',
	socialReason: 'Razón social',
	legalRepresentativeName: 'Nombre del representante legal',
	legalRepresentativeRfc: 'RFC del representante legal',
	legalRepresentativePosition: 'Puesto del representante legal',
	formFillerName: 'Nombre de quien llena el formulario',
	scripture: 'Escritura',
	notaryName: 'Nombre del notario',
	notaryNumber: 'Número de notaría',
	notaryCity: 'Ciudad de la notaría',
	notaryState: 'Estado de la notaría',
	powerOfAttorneyNumber: 'Número de poder notarial',
	powerOfAttorneyVolume: 'Volumen del poder notarial',
	powerOfAttorneyDate: 'Fecha del poder notarial',
}

const normalizeObject = <T extends Record<string, string>>(value: T): T => {
	return Object.fromEntries(
		Object.entries(value).map(([key, val]) => [key, val.trim()])
	) as T
}

const mergeWithDefaults = <T extends Record<string, string>>(defaults: T, value?: Partial<T> | null): T => {
	const source: Partial<T> = value ?? {}

	return Object.fromEntries(
		Object.keys(defaults).map((key) => {
			const typedKey = key as keyof T
			const sourceValue = source[typedKey]

			return [typedKey, typeof sourceValue === 'string' ? sourceValue : defaults[typedKey]]
		})
	) as unknown as T
}

const normalizeDateForInput = (value?: string | Date | null) => {
	if (!value) {
		return ''
	}

	const parsedDate = value instanceof Date ? value : new Date(value)

	if (Number.isNaN(parsedDate.getTime())) {
		return ''
	}

	return parsedDate.toISOString().slice(0, 10)
}

const getMissingFields = <T extends Record<string, string>>(
	value: T,
	requiredKeys: Array<keyof T>
) => {
	return requiredKeys.filter((key) => !value[key]?.trim())
}

export function CompleteUserAccount() {
	const [address, setAddress] = useState<AddressForm>(defaultAddress)
	const [person, setPerson] = useState<PersonForm>(defaultPerson)
	const [company, setCompany] = useState<CompanyForm>(defaultCompany)
	const [logoFile, setLogoFile] = useState<File | null>(null)
	const [loading, setLoading] = useState(false)
	const [isHydrating, setIsHydrating] = useState(true)

	const userId = useAuthStore((state) => state.getUserId())
	const roleType = useAuthStore((state) => state.getRoleType())
	const role = useAuthStore((state) => state.getRole())
	const updateUser = useAuthStore((state) => state.updateUser)

	const roleLabel = useMemo(() => {
		if (roleType === 'person') {
			return 'Persona Física'
		}
		if (roleType === 'company') {
			return 'Persona Moral'
		}
		return role?.name || 'No definido'
	}, [role, roleType])

	const updateAddressField = (key: keyof AddressForm, value: string) => {
		setAddress((current) => ({ ...current, [key]: value }))
	}

	const updatePersonField = (key: keyof PersonForm, value: string) => {
		setPerson((current) => ({ ...current, [key]: value }))
	}

	const updateCompanyField = (key: keyof CompanyForm, value: string) => {
		setCompany((current) => ({ ...current, [key]: value }))
	}

	const getFieldLabel = (key: string) => {
		return labelOverrides[key as keyof typeof labelOverrides] || toLabel(key)
	}

	const getInputType = (key: string) => {
		if (key.toLowerCase().includes('date')) {
			return 'date'
		}

		return 'text'
	}

	useEffect(() => {
		const hydrateForm = async () => {
			if (!userId) {
				setIsHydrating(false)
				return
			}

			try {
				const response = await axios.get(API_ENDPOINTS.STAFF.GET_BY_ID(userId))
				const user = response.data?.user

				if (!user) {
					return
				}

				setAddress(mergeWithDefaults(defaultAddress, user.address))
				setPerson(mergeWithDefaults(defaultPerson, user.person))

				const nextCompany = mergeWithDefaults(defaultCompany, user.company)
				nextCompany.powerOfAttorneyDate = normalizeDateForInput(user.company?.powerOfAttorneyDate)
				setCompany(nextCompany)
			} catch (error) {
				console.error('Error al cargar datos previos del perfil:', error)
			} finally {
				setIsHydrating(false)
			}
		}

		hydrateForm()
	}, [userId])

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()

		if (!userId) {
			toast.error('No se pudo identificar al usuario autenticado')
			return
		}

		if (roleType !== 'person' && roleType !== 'company') {
			toast.error('No se pudo determinar el tipo de usuario desde el rol')
			return
		}

		const normalizedAddress = normalizeObject(address)
		const missingAddress = getMissingFields(normalizedAddress, addressRequiredKeys)

		if (missingAddress.length > 0) {
			toast.error(`Completa los campos de domicilio: ${missingAddress.map((field) => toLabel(field)).join(', ')}`)
			return
		}

		const payload: {
			userId: string
			roleType: 'person' | 'company'
			address: AddressForm
			person?: PersonForm
			company?: CompanyForm
		} = {
			userId,
			roleType,
			address: normalizedAddress,
		}

		if (roleType === 'person') {
			const normalizedPerson = normalizeObject(person)
			const missingPerson = getMissingFields(normalizedPerson, personRequiredKeys)

			if (missingPerson.length > 0) {
				toast.error(`Completa los campos de Persona Física: ${missingPerson.map((field) => toLabel(field)).join(', ')}`)
				return
			}

			payload.person = normalizedPerson
		}

		if (roleType === 'company') {
			const normalizedCompany = normalizeObject(company)
			const missingCompany = getMissingFields(normalizedCompany, companyRequiredKeys)

			if (missingCompany.length > 0) {
				toast.error(`Completa los campos de Persona Moral: ${missingCompany.map((field) => toLabel(field)).join(', ')}`)
				return
			}

			payload.company = normalizedCompany
		}

		setLoading(true)

		try {
			const response = await axios.put(API_ENDPOINTS.STAFF.UPDATE_PROFILE, payload)

			if (roleType === 'company' && logoFile) {
				const formData = new FormData()
				formData.append('userId', userId)
				formData.append('logo', logoFile)

				await axios.post(API_ENDPOINTS.STAFF.UPLOAD_LETTERHEAD, formData, {
					headers: {
						'Content-Type': 'multipart/form-data',
					},
				})
			}

			toast.success(response.data?.message || 'Perfil completado exitosamente')
			updateUser({ isProfileComplete: true })
			setLogoFile(null)
		} catch (error) {
			if (axios.isAxiosError<{ message?: string; missingFields?: string[] }>(error)) {
				const message = error.response?.data?.message || 'No se pudo actualizar el perfil'
				const missing = error.response?.data?.missingFields

				if (missing?.length) {
					toast.error(`${message}. Faltan: ${missing.join(', ')}`)
				} else {
					toast.error(message)
				}
			} else {
				toast.error('Error inesperado al actualizar el perfil')
			}
			console.error('Error en CompleteUserAccount:', error)
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="min-h-svh bg-muted/30 p-4 md:p-8">
			<div className="mx-auto w-full max-w-4xl">
				<Card>
					<CardHeader>
						<CardTitle>Completa tu cuenta</CardTitle>
						<CardDescription>
							Tipo detectado por rol: {roleLabel}. Debes completar tu domicilio y los datos de tu tipo de usuario para continuar.
						</CardDescription>
					</CardHeader>

					<CardContent>
						<form className="space-y-8" onSubmit={handleSubmit}>
							<fieldset className="space-y-8" disabled={loading || isHydrating}>
							<section className="space-y-4 rounded-lg border bg-card p-4 md:p-6">
								<div className="border-b pb-3">
									<h3 className="text-lg font-semibold">Sección 1: Domicilio</h3>
									<p className="text-sm text-muted-foreground">Completa la dirección fiscal del usuario.</p>
								</div>
								<div className="grid gap-4 md:grid-cols-2">
									{Object.keys(defaultAddress).map((fieldName) => {
										const key = fieldName as keyof AddressForm
										return (
											<div key={key} className="space-y-2">
												<Label htmlFor={`address-${key}`}>{getFieldLabel(key)}</Label>
												<Input
													id={`address-${key}`}
													value={address[key]}
													onChange={(event) => updateAddressField(key, event.target.value)}
													placeholder={`Ingresa ${getFieldLabel(key).toLowerCase()}`}
													disabled={loading}
												/>
											</div>
										)
									})}
								</div>
							</section>

							{roleType === 'person' && (
								<section className="space-y-4 rounded-lg border bg-card p-4 md:p-6">
									<div className="border-b pb-3">
										<h3 className="text-lg font-semibold">Sección 2: Identidad de Persona Física</h3>
										<p className="text-sm text-muted-foreground">Captura tus datos personales y fiscales.</p>
									</div>
									<div className="grid gap-4 md:grid-cols-2">
										{Object.keys(defaultPerson).map((fieldName) => {
											const key = fieldName as keyof PersonForm
											return (
												<div key={key} className="space-y-2">
													<Label htmlFor={`person-${key}`}>{getFieldLabel(key)}</Label>
													<Input
														id={`person-${key}`}
														value={person[key]}
														onChange={(event) => updatePersonField(key, event.target.value)}
														placeholder={`Ingresa ${getFieldLabel(key).toLowerCase()}`}
														disabled={loading}
													/>
												</div>
											)
										})}
									</div>
								</section>
							)}

							{roleType === 'company' && (
								<section className="space-y-6 rounded-lg border bg-card p-4 md:p-6">
									<div className="border-b pb-3">
										<h3 className="text-lg font-semibold">Sección 2: Datos de Persona Moral</h3>
										<p className="text-sm text-muted-foreground">Completa cada bloque para validar la informacion legal de la empresa.</p>
									</div>

									<div className="space-y-4 rounded-md border p-4">
										<h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Datos generales de la empresa</h4>
										<div className="grid gap-4 md:grid-cols-2">
											{(['socialReason', 'rfc'] as Array<keyof CompanyForm>).map((key) => (
												<div key={key} className="space-y-2">
													<Label htmlFor={`company-${key}`}>{getFieldLabel(key)}</Label>
													<Input
														id={`company-${key}`}
														value={company[key]}
														onChange={(event) => updateCompanyField(key, event.target.value)}
														placeholder={`Ingresa ${getFieldLabel(key).toLowerCase()}`}
														disabled={loading}
													/>
												</div>
											))}
											<div className="space-y-2 md:col-span-2">
												<Label htmlFor="company-letterhead">Logo de membrete (opcional)</Label>
												<Input
													id="company-letterhead"
													type="file"
													accept="image/png,image/jpeg,image/jpg"
													onChange={(event) => {
														setLogoFile(event.target.files?.[0] || null)
													}}
													disabled={loading}
												/>
												<p className="text-xs text-muted-foreground">Solo PNG o JPG, maximo 6 MB.</p>
											</div>
										</div>
									</div>

									<div className="space-y-4 rounded-md border p-4">
										<h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Representación legal</h4>
										<div className="grid gap-4 md:grid-cols-2">
											{(['legalRepresentativeName', 'legalRepresentativePosition','legalRepresentativeRfc', 'formFillerName'] as Array<keyof CompanyForm>).map((key) => (
												<div key={key} className="space-y-2">
													<Label htmlFor={`company-${key}`}>{getFieldLabel(key)}</Label>
													<Input
														id={`company-${key}`}
														value={company[key]}
														onChange={(event) => updateCompanyField(key, event.target.value)}
														placeholder={`Ingresa ${getFieldLabel(key).toLowerCase()}`}
														disabled={loading}
													/>
												</div>
											))}
										</div>
									</div>

									<div className="space-y-4 rounded-md border p-4">
										<h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Datos notariales y poderes</h4>
										<div className="grid gap-4 md:grid-cols-2">
											{([
												'scripture',
												'notaryName',
												'notaryNumber',
												'notaryCity',
												'notaryState',
												'powerOfAttorneyNumber',
												'powerOfAttorneyVolume',
												'powerOfAttorneyDate',
											] as Array<keyof CompanyForm>).map((key) => (
												<div key={key} className="space-y-2">
													<Label htmlFor={`company-${key}`}>{getFieldLabel(key)}</Label>
													<Input
														type={getInputType(key)}
														id={`company-${key}`}
														value={company[key]}
														onChange={(event) => updateCompanyField(key, event.target.value)}
														placeholder={getInputType(key) === 'date' ? undefined : `Ingresa ${getFieldLabel(key).toLowerCase()}`}
														disabled={loading}
													/>
												</div>
											))}
										</div>
									</div>
								</section>
							)}
							</fieldset>

							<div className="flex justify-end">
								<Button type="submit" disabled={loading || isHydrating}>
									{isHydrating ? 'Cargando datos...' : loading ? 'Guardando...' : 'Guardar perfil'}
								</Button>
							</div>
						</form>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
