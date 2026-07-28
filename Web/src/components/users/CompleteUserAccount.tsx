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

type NotaryForm = {
  number: string
  name: string
  city: string
  state: string
}

type PublicRegistryForm = {
  mercantileFolio: string
}

type PublicDeedForm = {
  number: string
  volume: string
  date: string
  registrationDate: string
  notary: NotaryForm
  publicRegistry: PublicRegistryForm
}

type PowerOfAttorneyForm = {
  number: string
  volume: string
  date: string
  notary: NotaryForm
}

type LegalRepresentativeForm = {
  firstName: string
  paternalLastName: string
  maternalLastName: string
  rfc: string
  position: string
}

type CompanyForm = {
  socialReason: string
  rfc: string
  email: string
  formFillerName: string
  legalRepresentative: LegalRepresentativeForm
  publicDeed: PublicDeedForm
  powerOfAttorney: PowerOfAttorneyForm
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
  email: '',
  formFillerName: '',
  legalRepresentative: {
    firstName: '',
    paternalLastName: '',
    maternalLastName: '',
    rfc: '',
    position: '',
  },
  publicDeed: {
    number: '',
    volume: '',
    date: '',
    registrationDate: '',
    notary: {
      number: '',
      name: '',
      city: '',
      state: '',
    },
    publicRegistry: {
      mercantileFolio: '',
    },
  },
  powerOfAttorney: {
    number: '',
    volume: '',
    date: '',
    notary: {
      number: '',
      name: '',
      city: '',
      state: '',
    },
  },
}

const personRequiredKeys: Array<keyof PersonForm> = ['names', 'surnames', 'rfc']
const companyRequiredPaths = [
  'socialReason',
  'rfc',
  'email',
  'formFillerName',
  'legalRepresentative.firstName',
  'legalRepresentative.paternalLastName',
  'legalRepresentative.rfc',
  'legalRepresentative.position',
  'publicDeed.number',
  'publicDeed.volume',
  'publicDeed.notary.number',
  'publicDeed.notary.name',
  'publicDeed.notary.city',
  'publicDeed.notary.state',
  'publicDeed.publicRegistry.mercantileFolio',
  'powerOfAttorney.number',
  'powerOfAttorney.volume',
  'powerOfAttorney.notary.number',
  'powerOfAttorney.notary.name',
  'powerOfAttorney.notary.city',
  'powerOfAttorney.notary.state',
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

const labelOverrides: Record<string, string> = {
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
  email: 'Correo electrónico',
  'legalRepresentative.firstName': 'Nombre del representante legal',
  'legalRepresentative.paternalLastName': 'Apellido paterno del representante legal',
  'legalRepresentative.maternalLastName': 'Apellido materno del representante legal',
  'legalRepresentative.rfc': 'RFC del representante legal',
  'legalRepresentative.position': 'Puesto del representante legal',
  formFillerName: 'Nombre de quien llena el formulario',
  'publicDeed.number': 'Número de escritura pública',
  'publicDeed.volume': 'Volumen de escritura pública',
  'publicDeed.date': 'Fecha de escritura pública',
  'publicDeed.registrationDate': 'Fecha de inscripción en registro público',
  'publicDeed.notary.number': 'Número de notaría (escritura)',
  'publicDeed.notary.name': 'Nombre del notario (escritura)',
  'publicDeed.notary.city': 'Ciudad de la notaría (escritura)',
  'publicDeed.notary.state': 'Estado de la notaría (escritura)',
  'publicDeed.publicRegistry.mercantileFolio': 'Folio mercantil de la notaría pública',
  'powerOfAttorney.number': 'Número de poder notarial',
  'powerOfAttorney.volume': 'Volumen de poder notarial',
  'powerOfAttorney.date': 'Fecha de poder notarial',
  'powerOfAttorney.notary.number': 'Número de notaría (poder)',
  'powerOfAttorney.notary.name': 'Nombre del notario (poder)',
  'powerOfAttorney.notary.city': 'Ciudad de la notaría (poder)',
  'powerOfAttorney.notary.state': 'Estado de la notaría (poder)',
}

const normalizeObject = <T extends Record<string, string>>(value: T): T => {
  return Object.fromEntries(
    Object.entries(value).map(([key, val]) => [key, val.trim()])
  ) as T
}

const isPlainObject = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null && !Array.isArray(value) && !(value instanceof Date)
}

const normalizeDeepStrings = <T extends Record<string, unknown>>(value: T): T => {
  return Object.fromEntries(
    Object.entries(value).map(([key, currentValue]) => {
      if (typeof currentValue === 'string') {
        return [key, currentValue.trim()]
      }

      if (isPlainObject(currentValue)) {
        return [key, normalizeDeepStrings(currentValue)]
      }

      return [key, currentValue]
    })
  ) as T
}

const mergeWithDefaultsDeep = <T extends Record<string, unknown>>(defaults: T, value?: unknown): T => {
  const source = isPlainObject(value) ? value : {}

  return Object.fromEntries(
    Object.entries(defaults).map(([key, defaultValue]) => {
      const sourceValue = source[key]

      if (isPlainObject(defaultValue)) {
        return [key, mergeWithDefaultsDeep(defaultValue, sourceValue)]
      }

      if (typeof defaultValue === 'string') {
        return [key, typeof sourceValue === 'string' ? sourceValue : defaultValue]
      }

      return [key, sourceValue ?? defaultValue]
    })
  ) as T
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

const getValueByPath = (obj: Record<string, unknown>, path: string): unknown => {
  return path.split('.').reduce<unknown>((currentValue, segment) => {
    if (!isPlainObject(currentValue)) {
      return undefined
    }

    return currentValue[segment]
  }, obj)
}

const setValueByPath = <T extends Record<string, unknown>>(source: T, path: string, value: string): T => {
  const segments = path.split('.')
  const next = { ...source } as Record<string, unknown>

  let sourceCursor: Record<string, unknown> = source
  let nextCursor: Record<string, unknown> = next

  for (let index = 0; index < segments.length - 1; index += 1) {
    const segment = segments[index]
    const sourceChild = sourceCursor?.[segment]
    const nextChild = isPlainObject(sourceChild) ? { ...sourceChild } : {}

    nextCursor[segment] = nextChild
    nextCursor = nextChild
    sourceCursor = isPlainObject(sourceChild) ? sourceChild : {}
  }

  nextCursor[segments[segments.length - 1]] = value
  return next as T
}

const getMissingFieldsByPaths = (value: Record<string, unknown>, requiredPaths: string[]) => {
  return requiredPaths.filter((path) => {
    const fieldValue = getValueByPath(value, path)

    if (typeof fieldValue === 'string') {
      return fieldValue.trim().length === 0
    }

    return fieldValue === null || fieldValue === undefined
  })
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

  const updateCompanyField = (path: string, value: string) => {
    setCompany((current) => setValueByPath(current as unknown as Record<string, unknown>, path, value) as CompanyForm)
  }

  const getFieldLabel = (key: string) => {
    return labelOverrides[key] || toLabel(key)
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

        setAddress(mergeWithDefaultsDeep(defaultAddress, user.address))
        setPerson(mergeWithDefaultsDeep(defaultPerson, user.person))

        const nextCompany = mergeWithDefaultsDeep(defaultCompany, user.company)
        nextCompany.publicDeed.date = normalizeDateForInput(user.company?.publicDeed?.date)
        nextCompany.publicDeed.registrationDate = normalizeDateForInput(user.company?.publicDeed?.registrationDate)
        nextCompany.powerOfAttorney.date = normalizeDateForInput(user.company?.powerOfAttorney?.date)
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
      const normalizedCompany = normalizeDeepStrings(company as unknown as Record<string, unknown>) as CompanyForm
      const missingCompany = getMissingFieldsByPaths(
        normalizedCompany as unknown as Record<string, unknown>,
        companyRequiredPaths
      )

      if (missingCompany.length > 0) {
        toast.error(`Completa los campos de Persona Moral: ${missingCompany.map((field) => getFieldLabel(field)).join(', ')}`)
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
    <div className="mx-auto w-full max-w-5xl">
      <Card>
        <CardHeader>
          <CardTitle>Información del perfil</CardTitle>
          <CardDescription>
            Tipo detectado por rol: {roleLabel}. Debes completar tu domicilio y los datos de tu tipo de usuario para continuar.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form className="space-y-8" onSubmit={handleSubmit}>
            <fieldset className="space-y-8" disabled={loading || isHydrating}>
              {roleType === 'person' && (
                <section className="space-y-4 rounded-lg border bg-card p-4 md:p-6">
                  <div className="border-b pb-3">
                    <h3 className="text-lg font-semibold">Sección 1: Identidad de Persona Física</h3>
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
                    <h3 className="text-lg font-semibold">Sección 1: Datos de Persona Moral</h3>
                    <p className="text-sm text-muted-foreground">Completa cada bloque para validar la información legal de la empresa.</p>
                  </div>

                  <div className="space-y-4 rounded-md border p-4">
                    <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Datos generales de la empresa</h4>
                    <div className="grid gap-4 md:grid-cols-2">
                      {(['socialReason', 'rfc', 'email'] as string[]).map((path) => (
                        <div key={path} className="space-y-2">
                          <Label htmlFor={`company-${path.replaceAll('.', '-')}`}>{getFieldLabel(path)}</Label>
                          <Input
                            type={path === 'email' ? 'email' : 'text'}
                            id={`company-${path.replaceAll('.', '-')}`}
                            value={String(getValueByPath(company as unknown as Record<string, unknown>, path) ?? '')}
                            onChange={(event) => updateCompanyField(path, event.target.value)}
                            placeholder={`Ingresa ${getFieldLabel(path).toLowerCase()}`}
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
                      {([
                        'legalRepresentative.firstName',
                        'legalRepresentative.paternalLastName',
                        'legalRepresentative.maternalLastName',
                        'legalRepresentative.position',
                        'legalRepresentative.rfc',
                        'formFillerName',
                      ] as string[]).map((path) => (
                        <div key={path} className="space-y-2">
                          <Label htmlFor={`company-${path.replaceAll('.', '-')}`}>{getFieldLabel(path)}</Label>
                          <Input
                            id={`company-${path.replaceAll('.', '-')}`}
                            value={String(getValueByPath(company as unknown as Record<string, unknown>, path) ?? '')}
                            onChange={(event) => updateCompanyField(path, event.target.value)}
                            placeholder={`Ingresa ${getFieldLabel(path).toLowerCase()}`}
                            disabled={loading}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4 rounded-md border p-4">
                    <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Escritura pública y registro mercantil</h4>
                    <div className="grid gap-4 md:grid-cols-2">
                      {([
                        'publicDeed.number',
                        'publicDeed.volume',
                        'publicDeed.date',
                        'publicDeed.registrationDate',
                        'publicDeed.notary.number',
                        'publicDeed.notary.name',
                        'publicDeed.notary.city',
                        'publicDeed.notary.state',
                        'publicDeed.publicRegistry.mercantileFolio',
                      ] as string[]).map((path) => (
                        <div key={path} className="space-y-2">
                          <Label htmlFor={`company-${path.replaceAll('.', '-')}`}>{getFieldLabel(path)}</Label>
                          <Input
                            type={getInputType(path)}
                            id={`company-${path.replaceAll('.', '-')}`}
                            value={String(getValueByPath(company as unknown as Record<string, unknown>, path) ?? '')}
                            onChange={(event) => updateCompanyField(path, event.target.value)}
                            placeholder={getInputType(path) === 'date' ? undefined : `Ingresa ${getFieldLabel(path).toLowerCase()}`}
                            disabled={loading}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4 rounded-md border p-4">
                    <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Poder notarial</h4>
                    <div className="grid gap-4 md:grid-cols-2">
                      {([
                        'powerOfAttorney.number',
                        'powerOfAttorney.volume',
                        'powerOfAttorney.date',
                        'powerOfAttorney.notary.number',
                        'powerOfAttorney.notary.name',
                        'powerOfAttorney.notary.city',
                        'powerOfAttorney.notary.state',
                      ] as string[]).map((path) => (
                        <div key={path} className="space-y-2">
                          <Label htmlFor={`company-${path.replaceAll('.', '-')}`}>{getFieldLabel(path)}</Label>
                          <Input
                            type={getInputType(path)}
                            id={`company-${path.replaceAll('.', '-')}`}
                            value={String(getValueByPath(company as unknown as Record<string, unknown>, path) ?? '')}
                            onChange={(event) => updateCompanyField(path, event.target.value)}
                            placeholder={getInputType(path) === 'date' ? undefined : `Ingresa ${getFieldLabel(path).toLowerCase()}`}
                            disabled={loading}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              )}
              <section className="space-y-4 rounded-lg border bg-card p-4 md:p-6">
                <div className="border-b pb-3">
                  <h3 className="text-lg font-semibold">Sección 2: Domicilio</h3>
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
  )
}
