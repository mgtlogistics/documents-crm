import { Suspense, use, useMemo, useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { PageHeader } from '@/components/global/PageHeader'
import DownloadDocumentModal from '@/components/documents/DownloadDocumentModal'
import NewDownloadRequest from '@/components/documents/NewDownloadRequest'
import api from '@/utils/api'
import { useAuthStore } from '@/store/authStore'
import { FileText, RefreshCcw } from 'lucide-react'

type DocumentRequestStatus = 'pending' | 'in_progress' | 'completed' | 'rejected'

interface DocumentDetails {
  _id: string
  key: string
  name: string
  downloadEndpoint: string
}

interface DocumentRequestItem {
  _id: string
  documentId: DocumentDetails
  userId: string
  status: DocumentRequestStatus
  requestedAt: string
  completedAt?: string | null
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
    rejected: 'destructive',
  }

  const labels: Record<DocumentRequestStatus, string> = {
    pending: 'Pendiente',
    in_progress: 'En progreso',
    completed: 'Completado',
    rejected: 'Rechazado',
  }

  return <Badge variant={variants[status]}>{labels[status]}</Badge>
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
          { label: 'Documentos' },
        ]}
        title="Mis solicitudes"
        description="Consulta los documentos solicitados y genera el PDF cuando lo necesites"
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

  const columns: ColumnDef<DocumentRequestItem>[] = [
    {
      id: 'document',
      header: 'Documento',
      accessorFn: (row) => row.documentId?.name ?? 'Documento sin nombre',
      cell: ({ row }) => (
        <div>
          <p className="font-medium">{row.original.documentId?.name ?? 'Documento sin nombre'}</p>
          <p className="text-xs text-muted-foreground">{row.original.documentId?.key ?? row.original.documentId?._id}</p>
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Estado',
      cell: ({ row }) => getStatusBadge(row.original.status),
    },
    {
      id: 'requestedAt',
      header: 'Solicitado',
      accessorFn: (row) => row.requestedAt,
      cell: ({ row }) => <span className="text-sm">{formatDate(row.original.requestedAt)}</span>,
    },
    {
      id: 'expiresAt',
      header: 'Vence',
      accessorFn: (row) => row.expiresAt ?? '',
      cell: ({ row }) => <span className="text-sm text-muted-foreground">{formatDate(row.original.expiresAt)}</span>,
    },
    {
      id: 'completedAt',
      header: 'Completado',
      accessorFn: (row) => row.completedAt ?? '',
      cell: ({ row }) => <span className="text-sm text-muted-foreground">{formatDate(row.original.completedAt)}</span>,
    },
    {
      id: 'actions',
      header: 'Acciones',
      cell: ({ row }) => (
        <DownloadDocumentModal
          documentId={row.original.documentId._id}
          documentRequestId={row.original._id}
          onSuccess={onRefresh}
          trigger={<Button size="sm">Generar PDF</Button>}
        />
      ),
    },
  ]

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: documentRequests,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">
          {documentRequests.length} solicitud(es) encontradas
        </p>
        <Input
          placeholder="Buscar por documento o estado..."
          value={globalFilter}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No tienes solicitudes registradas.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}