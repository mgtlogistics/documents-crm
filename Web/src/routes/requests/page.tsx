import { Suspense, use, useMemo, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PageHeader } from '@/components/global/PageHeader'
import DownloadDocumentModal from '@/components/documents/DownloadDocumentModal'
import api from '@/utils/api'
import { useAuthStore } from '@/store/authStore'
import { FileText, RefreshCcw, UploadCloud, Send, ClipboardList, Paperclip } from 'lucide-react'
import { toast } from 'react-toastify'

type DocumentRequestStatus = 'pending' | 'in_progress' | 'completed' | 'sent'
type FormProgressStatus = 'pending' | 'in_progress' | 'completed'
type UploadProgressStatus = 'pending' | 'uploaded' | 'rejected'

interface DocumentDetails {
  _id: string
  key: string
  name: string
  downloadEndpoint: string
}

interface UploadCatalogDetails {
  _id: string
  key: string
  title: string
  description?: string
  maxSizeMB: number
  allowedExtensions: string[]
}

interface PresetDetails {
  _id: string
  title: string
  userType: 'client' | 'company'
}

interface FormProgressItem {
  _id: string
  documentId: DocumentDetails
  status: FormProgressStatus
  completedAt?: string | null
}

interface UploadProgressItem {
  _id: string
  uploadCatalogId: UploadCatalogDetails
  status: UploadProgressStatus
  fileUrl?: string | null
  fileName?: string | null
  uploadedAt?: string | null
}

interface AttachmentItem {
  title: string
  fileUrl: string
  description?: string
}

interface DocumentRequestItem {
  _id: string
  presetId?: PresetDetails | null
  userId: string
  assignedAdminEmail: string
  forms: FormProgressItem[]
  uploads: UploadProgressItem[]
  attachments: AttachmentItem[]
  status: DocumentRequestStatus
  zipSentAt?: string | null
  expiresAt?: string | null
  createdAt: string
  updatedAt: string
}

interface DocumentRequestsResponse {
  documentRequests: DocumentRequestItem[]
  error: string | null
}

async function getDocumentRequests(userId: string | null): Promise<DocumentRequestsResponse> {
  if (!userId) {
    return {
      documentRequests: [],
      error: 'Debes iniciar sesión para ver tus solicitudes de documentos',
    }
  }

  try {
    const { data } = await api.get<DocumentRequestItem[]>('/api/document-requests', {
      params: { userId },
    })

    return { documentRequests: data, error: null }
  } catch (err: unknown) {
    const message =
      (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
      'No fue posible cargar tus solicitudes'

    return { documentRequests: [], error: message }
  }
}

function formatDate(dateValue?: string | null) {
  if (!dateValue) return 'N/A'

  return new Date(dateValue).toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function getStatusBadge(status: DocumentRequestStatus) {
  const variants: Record<DocumentRequestStatus, 'default' | 'secondary' | 'outline' | 'destructive'> = {
    pending: 'secondary',
    in_progress: 'outline',
    completed: 'default',
    sent: 'default',
  }

  const labels: Record<DocumentRequestStatus, string> = {
    pending: 'Pendiente',
    in_progress: 'En progreso',
    completed: 'Completado',
    sent: 'Enviado',
  }

  return <Badge variant={variants[status]}>{labels[status]}</Badge>
}

function getFormStatusBadge(status: FormProgressStatus) {
  const labels: Record<FormProgressStatus, string> = {
    pending: 'Pendiente',
    in_progress: 'En progreso',
    completed: 'Completado',
  }

  const variants: Record<FormProgressStatus, 'default' | 'secondary' | 'outline' | 'destructive'> = {
    pending: 'secondary',
    in_progress: 'outline',
    completed: 'default',
  }

  return <Badge variant={variants[status]}>{labels[status]}</Badge>
}

function getUploadStatusBadge(status: UploadProgressStatus) {
  const labels: Record<UploadProgressStatus, string> = {
    pending: 'Pendiente',
    uploaded: 'Subido',
    rejected: 'Rechazado',
  }

  const variants: Record<UploadProgressStatus, 'default' | 'secondary' | 'outline' | 'destructive'> = {
    pending: 'secondary',
    uploaded: 'default',
    rejected: 'destructive',
  }

  return <Badge variant={variants[status]}>{labels[status]}</Badge>
}

function canFinalizeRequest(documentRequest: DocumentRequestItem) {
  const allFormsCompleted = documentRequest.forms.every((form) => form.status === 'completed')
  const allUploadsUploaded = documentRequest.uploads.every((upload) => upload.status === 'uploaded')
  return allFormsCompleted && allUploadsUploaded
}

function getRequestProgress(documentRequest: DocumentRequestItem) {
  const totalItems = documentRequest.forms.length + documentRequest.uploads.length
  const completedItems = documentRequest.forms.filter((form) => form.status === 'completed').length +
    documentRequest.uploads.filter((upload) => upload.status === 'uploaded').length

  return {
    totalItems,
    completedItems,
    percentage: totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0,
  }
}

export default function Page() {
  const userId = useAuthStore((state) => state.getUserId())
  const [refreshCount, setRefreshCount] = useState(0)

  const documentRequestsPromise = useMemo(
    () => {
      void refreshCount
      return getDocumentRequests(userId)
    },
    [userId, refreshCount]
  )

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={[
          { label: 'Solicitudes', href: '/requests' },
          { label: 'Expedientes' },
        ]}
        title="Mis solicitudes"
        description="Gestiona formularios, archivos por subir y anexos dentro de cada expediente"
        icon={<FileText className="h-5 w-5" />}
        actions={
          <div className="flex items-center gap-2">
            {/* <NewDownloadRequest onSuccess={() => setRefreshCount((value) => value + 1)} /> */}
            <Button variant="outline" size="sm" onClick={() => setRefreshCount((value) => value + 1)}>
              <RefreshCcw className="mr-2 h-4 w-4" />
              Actualizar
            </Button>
          </div>
        }
      />

      <Suspense fallback={<p className="text-sm text-muted-foreground">Cargando solicitudes...</p>}>
        <DocumentRequestsContent
          documentRequestsPromise={documentRequestsPromise}
          onRefresh={() => setRefreshCount((value) => value + 1)}
        />
      </Suspense>
    </div>
  )
}

interface DocumentRequestsContentProps {
  documentRequestsPromise: Promise<DocumentRequestsResponse>
  onRefresh: () => void
}

function DocumentRequestsContent({ documentRequestsPromise, onRefresh }: DocumentRequestsContentProps) {
  const { documentRequests, error } = use(documentRequestsPromise)

  if (error) {
    return <p className="text-sm text-destructive">{error}</p>
  }

  return <DocumentRequestsTable documentRequests={documentRequests} onRefresh={onRefresh} />
}

interface DocumentRequestsTableProps {
  documentRequests: DocumentRequestItem[]
  onRefresh: () => void
}

function DocumentRequestsTable({ documentRequests, onRefresh }: DocumentRequestsTableProps) {
  const [globalFilter, setGlobalFilter] = useState('')

  const filteredDocumentRequests = useMemo(() => {
    const normalizedFilter = globalFilter.trim().toLowerCase()
    if (!normalizedFilter) {
      return documentRequests
    }

    return documentRequests.filter((documentRequest) => {
      const baseInfo = [
        documentRequest.presetId?.title,
        documentRequest.status,
        documentRequest.assignedAdminEmail,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      const formsInfo = documentRequest.forms
        .map((form) => `${form.documentId?.name ?? ''} ${form.documentId?.key ?? ''}`)
        .join(' ')
        .toLowerCase()

      const uploadsInfo = documentRequest.uploads
        .map((upload) => `${upload.uploadCatalogId?.title ?? ''} ${upload.uploadCatalogId?.key ?? ''}`)
        .join(' ')
        .toLowerCase()

      return `${baseInfo} ${formsInfo} ${uploadsInfo}`.includes(normalizedFilter)
    })
  }, [documentRequests, globalFilter])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">
          {filteredDocumentRequests.length} expediente(s) encontrados
        </p>
        <Input
          placeholder="Buscar por expediente, documento o estado..."
          value={globalFilter}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="space-y-4">
        {filteredDocumentRequests.length > 0 ? (
          filteredDocumentRequests.map((documentRequest) => (
            <DocumentRequestCard key={documentRequest._id} documentRequest={documentRequest} onRefresh={onRefresh} />
          ))
        ) : (
          <Card>
            <CardContent className="py-10 text-center text-muted-foreground">
              No tienes expedientes registrados.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

interface DocumentRequestCardProps {
  documentRequest: DocumentRequestItem
  onRefresh: () => void
}

function DocumentRequestCard({ documentRequest, onRefresh }: DocumentRequestCardProps) {
  const [isSavingUpload, setIsSavingUpload] = useState<string | null>(null)
  const [isFinalizing, setIsFinalizing] = useState(false)
  const [activeSection, setActiveSection] = useState<'forms' | 'uploads' | 'attachments'>('forms')

  const canFinalize = canFinalizeRequest(documentRequest)
  const progress = getRequestProgress(documentRequest)

  const handleUploadFileSelection = async (uploadItem: UploadProgressItem, file: File | null) => {
    if (!file) {
      return
    }

    setIsSavingUpload(uploadItem._id)
    try {
      const formData = new FormData()
      formData.append('uploadItemId', uploadItem._id)
      formData.append('file', file)

      await api.patch(`/api/document-requests/${documentRequest._id}/upload-item`, formData)

      toast.success('Archivo subido correctamente')
      onRefresh()
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'No fue posible guardar el archivo'
      toast.error(message)
    } finally {
      setIsSavingUpload(null)
    }
  }

  const handleFinalizeRequest = async () => {
    if (!canFinalize) {
      toast.error('Completa todos los formularios y subidas antes de finalizar')
      return
    }

    setIsFinalizing(true)
    try {
      await api.post(`/api/document-requests/${documentRequest._id}/submit`)
      toast.success('Expediente finalizado y enviado correctamente')
      onRefresh()
    } catch (err: unknown) {
      console.error('Error finalizando el expediente:', err)
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'No fue posible finalizar el expediente'
      toast.error(message)
    } finally {
      setIsFinalizing(false)
    }
  }

  return (
    <Card>
      <CardHeader className="gap-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle className="text-xl">
              {documentRequest.presetId?.title ?? 'Expediente sin preset'}
            </CardTitle>
            <CardDescription>
              Admin asignado: {documentRequest.assignedAdminEmail}
            </CardDescription>
            <p className="mt-1 text-xs text-muted-foreground">
              Creado: {formatDate(documentRequest.createdAt)}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            {getStatusBadge(documentRequest.status)}
            {documentRequest.zipSentAt ? (
              <p className="text-xs text-muted-foreground">Enviado: {formatDate(documentRequest.zipSentAt)}</p>
            ) : null}
          </div>
        </div>

        <div className="space-y-2 rounded-lg border bg-muted/20 p-3">
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="font-medium">Progreso del expediente</span>
            <span className="text-muted-foreground">
              {progress.completedItems} de {progress.totalItems} requisitos completados
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${progress.percentage}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground">{progress.percentage}% completado</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant={activeSection === 'forms' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveSection('forms')}
          >
            Formularios
          </Button>
          <Button
            type="button"
            variant={activeSection === 'uploads' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveSection('uploads')}
          >
            Archivos por subir
          </Button>
          <Button
            type="button"
            variant={activeSection === 'attachments' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveSection('attachments')}
          >
            Anexos
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {activeSection === 'forms' ? (
          <section className="space-y-3 rounded-lg border p-4">
            <div className="flex items-center gap-2">
              <ClipboardList className="h-4 w-4" />
              <h3 className="font-medium">Formularios por llenar</h3>
            </div>
            {documentRequest.forms.length > 0 ? (
              <div className="space-y-3">
                {documentRequest.forms.map((formItem) => (
                  <div key={formItem._id} className="flex flex-wrap items-center justify-between gap-3 rounded-md border p-3">
                    <div>
                      <p className="font-medium">{formItem.documentId?.name ?? 'Documento sin nombre'}</p>
                      <p className="text-xs text-muted-foreground">{formItem.documentId?.key ?? formItem.documentId?._id}</p>
                      {formItem.completedAt ? (
                        <p className="text-xs text-muted-foreground">Completado: {formatDate(formItem.completedAt)}</p>
                      ) : null}
                    </div>

                    <div className="flex items-center gap-2">
                      {getFormStatusBadge(formItem.status)}
                      <DownloadDocumentModal
                        documentId={formItem.documentId._id}
                        documentRequestId={documentRequest._id}
                        formProgressId={formItem._id}
                        onSuccess={onRefresh}
                        trigger={<Button size="sm">Llenar formulario</Button>}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Este expediente no tiene formularios.</p>
            )}
          </section>
        ) : null}

        {activeSection === 'uploads' ? (
          <section className="space-y-3 rounded-lg border p-4">
            <div className="flex items-center gap-2">
              <UploadCloud className="h-4 w-4" />
              <h3 className="font-medium">Archivos por subir</h3>
            </div>
            {documentRequest.uploads.length > 0 ? (
              <div className="space-y-4">
                {documentRequest.uploads.map((uploadItem) => {
                  return (
                    <div key={uploadItem._id} className="space-y-3 rounded-md border p-3">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="font-medium">{uploadItem.uploadCatalogId?.title ?? 'Requisito sin titulo'}</p>
                          <p className="text-xs text-muted-foreground">
                            {uploadItem.uploadCatalogId?.description || uploadItem.uploadCatalogId?.key}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Maximo: {uploadItem.uploadCatalogId?.maxSizeMB ?? '-'} MB
                          </p>
                        </div>
                        {getUploadStatusBadge(uploadItem.status)}
                      </div>

                      <div className="grid gap-3 md:grid-cols-[1fr_auto]">
                        <div className="space-y-2">
                          <div className="rounded-md border border-dashed p-3">
                            <Label className="text-xs text-muted-foreground">Seleccionar archivo</Label>
                            <Input
                              type="file"
                              accept={uploadItem.uploadCatalogId?.allowedExtensions?.length
                                ? uploadItem.uploadCatalogId.allowedExtensions.map((ext) => `.${ext}`).join(',')
                                : '.pdf,.png,.jpg,.jpeg'}
                              onChange={(event) => void handleUploadFileSelection(uploadItem, event.target.files?.[0] ?? null)}
                              disabled={isSavingUpload === uploadItem._id}
                            />
                            <p className="mt-2 text-xs text-muted-foreground">
                              Al elegir un archivo se guarda de inmediato en el servidor.
                            </p>
                          </div>
                        </div>

                        <div className="space-y-2 rounded-md border p-3">
                          <p className="text-xs font-medium text-muted-foreground">Archivo actual</p>
                          {uploadItem.fileUrl ? (
                            <a
                              href={uploadItem.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-primary underline"
                            >
                              {uploadItem.fileName || 'Ver archivo subido'}
                            </a>
                          ) : (
                            <p className="text-sm text-muted-foreground">Aun no hay archivo cargado.</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs text-muted-foreground">
                          {uploadItem.uploadedAt ? `Subido: ${formatDate(uploadItem.uploadedAt)}` : 'Pendiente de subir'}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Este expediente no requiere subidas.</p>
            )}
          </section>
        ) : null}

        {activeSection === 'attachments' ? (
          <section className="space-y-3 rounded-lg border p-4">
            <div className="flex items-center gap-2">
              <Paperclip className="h-4 w-4" />
              <h3 className="font-medium">Archivos adjuntos (anexos)</h3>
            </div>
            {documentRequest.attachments.length > 0 ? (
              <div className="space-y-2">
                {documentRequest.attachments.map((attachment, index) => (
                  <div key={`${attachment.title}-${index}`} className="rounded-md border p-3">
                    <p className="font-medium">{attachment.title}</p>
                    <a
                      href={attachment.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary underline"
                    >
                      Ver / descargar archivo
                    </a>
                    {attachment.description ? (
                      <p className="mt-1 text-xs text-muted-foreground">{attachment.description}</p>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No hay anexos disponibles en este expediente.</p>
            )}
          </section>
        ) : null}

        <div className="flex items-center justify-end">
          <Button
            onClick={() => void handleFinalizeRequest()}
            disabled={!canFinalize || isFinalizing || documentRequest.status === 'sent'}
          >
            <Send className="mr-2 h-4 w-4" />
            {isFinalizing ? 'Finalizando...' : canFinalize ? 'Finalizar y Enviar Expediente' : 'Completa el expediente al 100%'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}