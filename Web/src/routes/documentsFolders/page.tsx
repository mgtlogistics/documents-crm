import { Suspense, use, useState, type ReactNode } from "react"
import { Folders, FolderOpen, ShieldCheck } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PageHeader } from "@/components/global/PageHeader"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"
import api from "@/utils/api"

import PresetDialog, { DeletePresetButton } from "@/components/documentsFolders/PresetDialog"
import type { DocumentFoldersOverview } from "@/components/documentsFolders/types"
import UploadCatalogDialog, { DeleteUploadButton } from "@/components/documentsFolders/UploadCatalogDialog"

async function getOverview(): Promise<{ data: DocumentFoldersOverview | null; error: string | null }> {
	try {
		const response = await api.get<DocumentFoldersOverview>("/api/document-folders/overview")
		return { data: response.data, error: null }
	} catch (err: unknown) {
		const message =
			(err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
			"No fue posible cargar la configuracion de carpetas documentales"

		return { data: null, error: message }
	}
}

export default function DocumentsFoldersPage() {
	const [overviewPromise, setOverviewPromise] = useState(() => getOverview())

	const refreshOverview = () => setOverviewPromise(getOverview())

	return (
		<div className="space-y-6">
			<PageHeader
				title="Carpetas documentales"
				description="Administra requisitos de subida y presets reutilizables para clientes y empresas."
				icon={<Folders size={20} />}
				breadcrumbs={[
					{ label: "Home", href: "/" },
					{ label: "Carpetas documentales" },
				]}
				actions={
					<div className="flex flex-wrap items-center gap-2">
						<UploadCatalogDialog onSuccess={refreshOverview} />
					</div>
				}
			/>

			<Suspense fallback={<p className="text-sm text-muted-foreground">Cargando configuracion...</p>}>
				<DocumentsFoldersContent overviewPromise={overviewPromise} onRefresh={refreshOverview} />
			</Suspense>
		</div>
	)
}

interface DocumentsFoldersContentProps {
	overviewPromise: Promise<{ data: DocumentFoldersOverview | null; error: string | null }>
	onRefresh: () => void
}

function DocumentsFoldersContent({ overviewPromise, onRefresh }: DocumentsFoldersContentProps) {
	const { data, error } = use(overviewPromise)

	if (error || !data) {
		return <p className="text-sm text-destructive">{error ?? "No hay informacion disponible"}</p>
	}

	return (
		<div className="space-y-6">
			<section className="grid gap-4 md:grid-cols-3">
				<SummaryCard
					title="Requisitos"
					description="Items del catalogo de subida"
					value={data.uploads.length}
					icon={<ShieldCheck className="h-4 w-4" />}
				/>
				<SummaryCard
					title="Documentos"
					description="Formularios disponibles"
					value={data.documents.length}
					icon={<FolderOpen className="h-4 w-4" />}
				/>
				<SummaryCard
					title="Presets"
					description="Carpetas reutilizables"
					value={data.presets.length}
					icon={<Folders className="h-4 w-4" />}
				/>
			</section>

			<Card>
				<CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<CardTitle className="text-xl">Catalogo de requisitos de subida</CardTitle>
						<CardDescription>Estos items se reutilizan al crear presets.</CardDescription>
					</div>
					<UploadCatalogDialog onSuccess={onRefresh} />
				</CardHeader>
				<CardContent>
					<div className="rounded-md border">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Requisito</TableHead>
									<TableHead>Clave</TableHead>
									<TableHead>Regla</TableHead>
									<TableHead>Extensiones</TableHead>
									<TableHead>Estado</TableHead>
									<TableHead className="w-32">Acciones</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{data.uploads.length > 0 ? (
									data.uploads.map((upload) => (
										<TableRow key={upload._id}>
											<TableCell>
												<div>
													<p className="font-medium">{upload.title}</p>
													<p className="text-sm text-muted-foreground">Maximo {upload.maxSizeMB} MB</p>
												</div>
											</TableCell>
											<TableCell>{upload.key}</TableCell>
											<TableCell>{upload.description || "Sin descripcion"}</TableCell>
											<TableCell>{upload.allowedExtensions.join(", ")}</TableCell>
											<TableCell>
												<Badge variant={upload.isActive ? "default" : "secondary"}>
													{upload.isActive ? "Activo" : "Inactivo"}
												</Badge>
											</TableCell>
											<TableCell>
												<div className="flex items-center justify-end gap-1">
													<UploadCatalogDialog item={upload} onSuccess={onRefresh} />
													<DeleteUploadButton item={upload} onSuccess={onRefresh} />
												</div>
											</TableCell>
										</TableRow>
									))
								) : (
									<TableRow>
										<TableCell colSpan={6} className="h-24 text-center">
											Aun no hay requisitos registrados.
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<CardTitle className="text-xl">Presets de carpetas documentales</CardTitle>
						<CardDescription>Combina requisitos, formularios y anexos para cada escenario.</CardDescription>
					</div>
					<PresetDialog uploads={data.uploads} documents={data.documents} onSuccess={onRefresh} />
				</CardHeader>
				<CardContent>
					<div className="rounded-md border">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Preset</TableHead>
									<TableHead>Tipo</TableHead>
									<TableHead>Requisitos</TableHead>
									<TableHead>Formularios</TableHead>
									<TableHead>Anexos</TableHead>
									<TableHead>Estado</TableHead>
									<TableHead className="w-32">Acciones</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{data.presets.length > 0 ? (
									data.presets.map((preset) => (
										<TableRow key={preset._id}>
											<TableCell>
												<div>
													<p className="font-medium">{preset.title}</p>
													<p className="text-sm text-muted-foreground">
														{preset.uploads.length} requisito(s), {preset.documents.length} documento(s)
													</p>
												</div>
											</TableCell>
											<TableCell>{preset.userType === "client" ? "Persona fisica" : "Persona moral"}</TableCell>
											<TableCell>{preset.uploads.map((upload) => upload.title).join(", ") || "Sin requisitos"}</TableCell>
											<TableCell>{preset.documents.map((document) => document.name).join(", ") || "Sin formularios"}</TableCell>
											<TableCell>{preset.attachments.length}</TableCell>
											<TableCell>
												<Badge variant={preset.isActive ? "default" : "secondary"}>
													{preset.isActive ? "Activo" : "Inactivo"}
												</Badge>
											</TableCell>
											<TableCell>
												<div className="flex items-center justify-end gap-1">
													<PresetDialog item={preset} uploads={data.uploads} documents={data.documents} onSuccess={onRefresh} />
													<DeletePresetButton item={preset} onSuccess={onRefresh} />
												</div>
											</TableCell>
										</TableRow>
									))
								) : (
									<TableRow>
										<TableCell colSpan={7} className="h-24 text-center">
											Aun no hay presets registrados.
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}

interface SummaryCardProps {
	title: string
	description: string
	value: number
	icon: ReactNode
}

function SummaryCard({ title, description, value, icon }: SummaryCardProps) {
	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<div>
					<CardTitle className="text-base">{title}</CardTitle>
					<CardDescription>{description}</CardDescription>
				</div>
				<div className="rounded-md bg-muted p-2">{icon}</div>
			</CardHeader>
			<CardContent>
				<p className="text-3xl font-semibold tracking-tight">{value}</p>
			</CardContent>
		</Card>
	)
}
