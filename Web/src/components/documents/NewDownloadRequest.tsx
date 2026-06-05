import { useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import { PlusIcon } from 'lucide-react'
import api from '@/utils/api'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type ApiUserRole = 'client' | 'company'

const CLIENT_ROLE_ID = '6a156a603a5d7ea978fbb13c'
const COMPANY_ROLE_ID = '6a156a6d3a5d7ea978fbb13d'

type UserRoleId = typeof CLIENT_ROLE_ID | typeof COMPANY_ROLE_ID

interface RoleUser {
  _id: string
  label: string
  subtitle?: string
}

interface DocumentItem {
  _id: string
  key: string
  name: string
  userType: ApiUserRole
  status: boolean
}

interface NewDownloadRequestProps {
  onSuccess?: () => void | Promise<void>
}

const DOCUMENT_FOLDERS: Array<{
  id: string
  title: string
  userType: ApiUserRole
  docIds: string[]
}> = [
    {
      id: 'folder-identificacion-cliente',
      title: 'Identificacion del cliente',
      userType: 'client',
      docIds: ['doc-client-1', 'doc-client-2'],
    },
    {
      id: 'folder-operacion-cliente',
      title: 'Operacion del cliente',
      userType: 'client',
      docIds: ['doc-client-3', 'doc-client-4'],
    },
    {
      id: 'folder-identificacion-empresa',
      title: 'Pat. 1623 AA CESAR AUGUSTO SAVIÑON RUELAS',
      userType: 'company',
      docIds: [
        '6a0d4e07b7f39dad350caa1c',
        '6a0d1f78c3ee69d3ddcdae37',
        '6a0d11d923d5c0b1dd085bc3',
        '6a0bf8b4e85e516399e449ef',
        '6a0bf3dd9ac4a39b23bd6468',
        '6a0be8cd881e88b2445f23a0',
      ],
    },
    {
      id: 'folder-operacion-empresa',
      title: 'Pat. 1615 AA LEONEL ERNESTO CANTU',
      userType: 'company',
      docIds: [
        '6a0bebb844002b88d8f01d63'
      ],
    },
  ]

function normalizeRoleById(roleId: UserRoleId): ApiUserRole {
  return roleId === COMPANY_ROLE_ID ? 'company' : 'client'
}

export default function NewDownloadRequest({ onSuccess }: NewDownloadRequestProps) {
  const [open, setOpen] = useState(false)
  const [loadingUsers, setLoadingUsers] = useState(false)
  const [loadingDocuments, setLoadingDocuments] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const [selectedRoleId, setSelectedRoleId] = useState<UserRoleId | ''>('')
  const [selectedUserId, setSelectedUserId] = useState('')
  const [users, setUsers] = useState<RoleUser[]>([])
  const [documents, setDocuments] = useState<DocumentItem[]>([])
  const [selectedDocumentIds, setSelectedDocumentIds] = useState<string[]>([])

  const filteredDocuments = useMemo(() => {
    if (!selectedRoleId) return []
    const role = normalizeRoleById(selectedRoleId)
    return documents.filter((document) => document.userType === role)
  }, [documents, selectedRoleId])

  const filteredDocumentsById = useMemo(() => {
    return new Map(filteredDocuments.map((document) => [document._id, document]))
  }, [filteredDocuments])

  const visibleFolders = useMemo(() => {
    if (!selectedRoleId) return []
    const role = normalizeRoleById(selectedRoleId)
    return DOCUMENT_FOLDERS.filter((folder) => folder.userType === role)
  }, [selectedRoleId])

  const resetState = () => {
    setSelectedRoleId('')
    setSelectedUserId('')
    setUsers([])
    setSelectedDocumentIds([])
  }

  useEffect(() => {
    if (!open) return

    const loadDocuments = async () => {
      setLoadingDocuments(true)
      try {
        const { data } = await api.get<DocumentItem[]>('/api/documents')
        setDocuments(data)
      } catch (err: unknown) {
        const message =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
          'No fue posible cargar los documentos'
        toast.error(message)
      } finally {
        setLoadingDocuments(false)
      }
    }

    loadDocuments()
  }, [open])

  const handleRoleChange = async (roleId: UserRoleId) => {
    setSelectedRoleId(roleId)
    setSelectedUserId('')
    setSelectedDocumentIds([])
    setUsers([])
    setLoadingUsers(true)

    try {
      const { data } = await api.get<RoleUser[]>(`/v1/staff/by-role/${roleId}`)
      setUsers(data || [])
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'No fue posible cargar los usuarios del rol seleccionado'
      toast.error(message)
    } finally {
      setLoadingUsers(false)
    }
  }

  const toggleDocument = (documentId: string, checked: boolean) => {
    setSelectedDocumentIds((prev) => {
      if (checked) {
        if (prev.includes(documentId)) return prev
        return [...prev, documentId]
      }

      return prev.filter((id) => id !== documentId)
    })
  }

  const toggleFolderDocuments = (documentIds: string[], checked: boolean) => {
    setSelectedDocumentIds((prev) => {
      if (checked) {
        const next = new Set(prev)
        documentIds.forEach((id) => next.add(id))
        return Array.from(next)
      }

      const folderIds = new Set(documentIds)
      return prev.filter((id) => !folderIds.has(id))
    })
  }

  const handleSubmit = async () => {
    if (!selectedRoleId) {
      toast.error('Debes seleccionar un tipo de usuario')
      return
    }

    if (!selectedUserId) {
      toast.error('Debes seleccionar un usuario')
      return
    }

    if (selectedDocumentIds.length === 0) {
      toast.error('Debes seleccionar al menos un documento')
      return
    }

    setSubmitting(true)
    try {
      await api.post('/api/document-requests/bulk', {
        userId: selectedUserId,
        documentIds: selectedDocumentIds,
      })

      toast.success('Solicitudes creadas correctamente')
      await onSuccess?.()
      setOpen(false)
      resetState()
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'No fue posible crear las solicitudes'
      toast.error(message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen)
        if (!nextOpen) resetState()
      }}
    >
      <DialogTrigger asChild>
        <Button>
          <PlusIcon className="mr-2 h-4 w-4" />
          Nueva solicitud
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Nueva solicitud de documentos</DialogTitle>
          <DialogDescription>
            Selecciona el tipo de usuario, el usuario destino y los documentos que deseas solicitar.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid gap-2">
            <Label>Tipo de usuario</Label>
            <Select value={selectedRoleId} onValueChange={(value) => void handleRoleChange(value as UserRoleId)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={CLIENT_ROLE_ID}>Persona Fisica</SelectItem>
                <SelectItem value={COMPANY_ROLE_ID}>Empresa</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label>Usuario</Label>
            <Select value={selectedUserId} onValueChange={setSelectedUserId} disabled={!selectedRoleId || loadingUsers}>
              <SelectTrigger>
                <SelectValue placeholder={loadingUsers ? 'Cargando usuarios...' : 'Selecciona un usuario'} />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user._id} value={user._id}>
                    {user.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label>Documentos disponibles</Label>
            <div className="max-h-64 space-y-2 overflow-y-auto rounded-md border p-3">
              {loadingDocuments ? (
                <p className="text-sm text-muted-foreground">Cargando documentos...</p>
              ) : !selectedRoleId ? (
                <p className="text-sm text-muted-foreground">
                  Selecciona un tipo de usuario para ver documentos
                </p>
              ) : (
                <Accordion type="multiple" className="w-full">
                  {visibleFolders.map((folder) => {
                    const folderDocuments = folder.docIds
                      .map((docId) => filteredDocumentsById.get(docId))
                      .filter((document): document is DocumentItem => Boolean(document))
                    const allSelected =
                      folderDocuments.length > 0 &&
                      folderDocuments.every((document) => selectedDocumentIds.includes(document._id))

                    return (
                      <AccordionItem key={folder.id} value={folder.id}>
                        <AccordionTrigger>
                          <div className="flex w-full items-center gap-3 pr-2">
                            <Checkbox
                              onClick={(event) => event.stopPropagation()}
                              checked={allSelected}
                              onCheckedChange={(value) => {
                                toggleFolderDocuments(
                                  folderDocuments.map((document) => document._id),
                                  value === true,
                                )
                              }}
                            />
                            <span className="text-sm font-medium">{folder.title}</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="space-y-2 pt-1">
                          {folderDocuments.length === 0 ? (
                            <p className="text-sm text-muted-foreground">
                              No hay documentos disponibles en esta carpeta
                            </p>
                          ) : (
                            folderDocuments.map((document) => {
                              const checked = selectedDocumentIds.includes(document._id)

                              return (
                                <div key={document._id} className="flex items-start gap-3 rounded-md border p-2">
                                  <Checkbox
                                    id={`document-${document._id}`}
                                    checked={checked}
                                    onCheckedChange={(value) => toggleDocument(document._id, value === true)}
                                  />
                                  <div className="flex-1">
                                    <Label htmlFor={`document-${document._id}`} className="cursor-pointer font-medium">
                                      {document.name}
                                    </Label>
                                    <p className="text-xs text-muted-foreground">{document.key}</p>
                                  </div>
                                </div>
                              )
                            })
                          )}
                        </AccordionContent>
                      </AccordionItem>
                    )
                  })}
                </Accordion>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={submitting}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? 'Guardando...' : 'Guardar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
