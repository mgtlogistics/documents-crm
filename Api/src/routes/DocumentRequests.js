import express from "express"
import axios from "axios"
import JSZip from "jszip"
import DocumentRequest from "../models/DocumentRequest.js"
import Document from "../models/Document.js"
import UploadCatalog from "../models/UploadCatalog.js"
import DocumentFolderPreset from "../models/DocumentFolderPreset.js"
import { documentRequestPopulate, updateDocumentRequestStatus } from "../utils/documentRequests.utils.js"
import { sendDocumentRequestCompletedEmail } from "../emails/email.handler.js"
import { uploadDocumentRequestFile } from "../utils/public.utils.js"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const router = express.Router()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const documentRequestUploadsDir = path.join(__dirname, '..', 'public', 'uploads', 'document-requests')
const documentRequestUploadsPrefix = '/publics/uploads/document-requests/'

const FORM_STATUSES = new Set(["pending", "in_progress", "completed"])
const UPLOAD_STATUSES = new Set(["pending", "uploaded", "rejected"])

const isValidEmail = (value) => {
  if (typeof value !== "string") {
    return false
  }

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

const uniqueIds = (values = []) => {
  if (!Array.isArray(values)) {
    return []
  }

  return [...new Set(values.map((value) => String(value).trim()).filter(Boolean))]
}

const normalizeAttachments = (attachments = []) => {
  if (!Array.isArray(attachments)) {
    return []
  }

  return attachments.map((attachment) => ({
    title: typeof attachment?.title === "string" ? attachment.title.trim() : "",
    fileUrl: typeof attachment?.fileUrl === "string" ? attachment.fileUrl.trim() : "",
    description: typeof attachment?.description === "string" ? attachment.description.trim() : "",
  }))
}

const validateAttachments = (attachments) => {
  const invalidAttachment = attachments.find((attachment) => !attachment.title || !attachment.fileUrl)
  if (invalidAttachment) {
    return "Cada anexo debe incluir title y fileUrl"
  }

  return null
}

const populateDocumentRequestQuery = (query) => query.populate(documentRequestPopulate)

const loadDocumentRequestById = async (id) => populateDocumentRequestQuery(
  DocumentRequest.findById(id)
).lean()

const hasAllFormsCompleted = (forms = []) => forms.every((item) => item.status === "completed")
const hasAllUploadsUploaded = (uploads = []) => uploads.every((item) => item.status === "uploaded")

const normalizeStoredFileUrl = (value) => {
  if (typeof value !== "string") {
    return ""
  }

  return value.trim()
}

const sanitizeZipSegment = (value, fallback = "archivo") => {
  const normalized = String(value || fallback)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, "_")
    .replace(/\s+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "")

  return normalized || fallback
}

const getLocalFilePathFromUrl = (fileUrl) => {
  if (typeof fileUrl !== "string" || !fileUrl.trim()) {
    return null
  }

  const trimmedUrl = fileUrl.trim()

  if (trimmedUrl.startsWith(documentRequestUploadsPrefix)) {
    return path.join(documentRequestUploadsDir, path.basename(trimmedUrl))
  }

  if (path.isAbsolute(trimmedUrl)) {
    return trimmedUrl
  }

  return path.join(__dirname, "..", trimmedUrl.replace(/^\/+/, ""))
}

const getFileExtension = (value) => {
  if (typeof value !== "string" || !value.trim()) {
    return ""
  }

  const trimmedValue = value.trim()

  try {
    if (/^https?:\/\//i.test(trimmedValue)) {
      return path.extname(new URL(trimmedValue).pathname)
    }
  } catch (error) {
    // Fall through to the generic path handling below.
  }

  return path.extname(trimmedValue.split("?")[0].split("#")[0])
}

const loadFileBuffer = async (fileUrl) => {
  if (!fileUrl) {
    throw new Error("fileUrl es requerido")
  }

  if (/^https?:\/\//i.test(fileUrl)) {
    const response = await axios.get(fileUrl, { responseType: "arraybuffer" })
    return Buffer.from(response.data)
  }

  const localFilePath = getLocalFilePathFromUrl(fileUrl)
  if (!localFilePath || !fs.existsSync(localFilePath)) {
    throw new Error(`No se encontró el archivo en ${fileUrl}`)
  }

  return fs.promises.readFile(localFilePath)
}

const buildDocumentRequestZip = async (documentRequest) => {
  const zip = new JSZip()
  const uploads = Array.isArray(documentRequest?.uploads) ? documentRequest.uploads : []

  for (let index = 0; index < uploads.length; index += 1) {
    const upload = uploads[index]
    if (upload?.status !== "uploaded" || !upload?.fileUrl) {
      throw new Error(`El archivo ${upload?.uploadCatalogId?.title || upload?.uploadCatalogId?.key || index + 1} no está disponible para empaquetar`)
    }

    const uploadLabel = sanitizeZipSegment(upload?.uploadCatalogId?.title || upload?.uploadCatalogId?.key || `subida_${index + 1}`)
    const sourceBuffer = await loadFileBuffer(upload.fileUrl)
    const extension = getFileExtension(upload?.fileName || upload?.fileUrl)
    const fallbackUploadName = sanitizeZipSegment(path.basename(upload?.fileUrl || `archivo_${index + 1}`))
    const rootFileName = `${String(index + 1).padStart(2, "0")}_${uploadLabel}${extension || getFileExtension(fallbackUploadName) || ""}`
    zip.file(rootFileName, sourceBuffer)
  }

  return zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE", compressionOptions: { level: 9 } })
}

const removeStoredRequestFile = (fileUrl) => {
  if (typeof fileUrl !== 'string' || !fileUrl.startsWith('/publics/uploads/document-requests/')) {
    return
  }

  const fileName = fileUrl.split('/').pop()
  if (!fileName) {
    return
  }

  const filePath = path.join(documentRequestUploadsDir, fileName)
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath)
  }
}

async function createGroupedRequest(body) {
  const {
    userId,
    assignedAdminEmail,
    expiresAt,
    presetId,
  } = body

  if (!userId) {
    throw new Error("userId es requerido")
  }

  if (!isValidEmail(assignedAdminEmail)) {
    throw new Error("assignedAdminEmail es requerido y debe ser un correo valido")
  }

  const selectedDocumentIds = uniqueIds(body.selectedDocumentIds ?? body.documentIds)
  const selectedUploadIds = uniqueIds(body.selectedUploadIds ?? body.uploadIds)

  let attachments = normalizeAttachments(body.attachments)

  if (presetId) {
    const preset = await DocumentFolderPreset.findById(presetId).lean()
    if (!preset) {
      throw new Error("Preset no encontrado")
    }

    if (attachments.length === 0 && Array.isArray(preset.attachments)) {
      attachments = normalizeAttachments(preset.attachments)
    }
  }

  const attachmentsError = validateAttachments(attachments)
  if (attachmentsError) {
    throw new Error(attachmentsError)
  }

  const [documents, uploads] = await Promise.all([
    selectedDocumentIds.length > 0
      ? Document.find({ _id: { $in: selectedDocumentIds } }).select("_id status").lean()
      : [],
    selectedUploadIds.length > 0
      ? UploadCatalog.find({ _id: { $in: selectedUploadIds } }).select("_id isActive").lean()
      : [],
  ])

  if (documents.length !== selectedDocumentIds.length) {
    const foundIds = new Set(documents.map((document) => String(document._id)))
    const missingDocumentIds = selectedDocumentIds.filter((id) => !foundIds.has(id))
    throw new Error(`Algunos documentos no existen: ${missingDocumentIds.join(", ")}`)
  }

  if (uploads.length !== selectedUploadIds.length) {
    const foundIds = new Set(uploads.map((upload) => String(upload._id)))
    const missingUploadIds = selectedUploadIds.filter((id) => !foundIds.has(id))
    throw new Error(`Algunos requisitos de subida no existen: ${missingUploadIds.join(", ")}`)
  }

  const inactiveDocuments = documents.filter((document) => !document.status)
  if (inactiveDocuments.length > 0) {
    throw new Error("No se pueden solicitar formularios inactivos")
  }

  const inactiveUploads = uploads.filter((upload) => !upload.isActive)
  if (inactiveUploads.length > 0) {
    throw new Error("No se pueden solicitar requisitos de subida inactivos")
  }

  const forms = selectedDocumentIds.map((documentId) => ({
    documentId,
    status: "pending",
  }))

  const uploadItems = selectedUploadIds.map((uploadCatalogId) => ({
    uploadCatalogId,
    status: "pending",
    fileUrl: null,
    fileName: null,
  }))

  const createdRequest = await DocumentRequest.create({
    presetId: presetId || undefined,
    userId,
    assignedAdminEmail: String(assignedAdminEmail).trim(),
    forms,
    uploads: uploadItems,
    attachments,
    expiresAt: expiresAt ? new Date(expiresAt) : undefined,
  })

  return loadDocumentRequestById(createdRequest._id)
}

// GET /api/document-requests?userId=&status=&presetId=
router.get("/", async (req, res) => {
  try {
    const { userId, status, presetId } = req.query
    const filters = {}

    if (userId) filters.userId = userId
    if (status) filters.status = status
    if (presetId) filters.presetId = presetId

    const requests = await populateDocumentRequestQuery(DocumentRequest.find(filters))
      .sort({ createdAt: -1 })
      .lean()

    return res.status(200).json(requests)
  } catch (error) {
    return res.status(500).json({
      message: "Error al obtener las solicitudes de documentos",
      error: error.message,
    })
  }
})

// POST /api/document-requests
// Body: { userId, assignedAdminEmail, selectedDocumentIds, selectedUploadIds, attachments?, presetId? }
router.post("/", async (req, res) => {
  try {
    const createdRequest = await createGroupedRequest(req.body)

    return res.status(201).json({
      message: "Expediente creado exitosamente",
      documentRequest: createdRequest,
    })
  } catch (error) {
    console.log(error)
    return res.status(400).json({
      message: "Error al crear el expediente",
      error: error.message,
    })
  }
})

// Alias legacy: POST /api/document-requests/bulk
router.post("/bulk", async (req, res) => {
  try {
    const createdRequest = await createGroupedRequest(req.body)

    return res.status(201).json({
      message: "Expediente creado exitosamente",
      documentRequest: createdRequest,
    })
  } catch (error) {
    return res.status(400).json({
      message: "Error al crear el expediente",
      error: error.message,
    })
  }
})

// GET /api/document-requests/:id
router.get("/:id", async (req, res) => {
  try {
    const documentRequest = await loadDocumentRequestById(req.params.id)

    if (!documentRequest) {
      return res.status(404).json({ message: "Solicitud de documento no encontrada" })
    }

    return res.status(200).json(documentRequest)
  } catch (error) {
    return res.status(500).json({
      message: "Error al obtener la solicitud de documento",
      error: error.message,
    })
  }
})

// PUT /api/document-requests/:id
// Allows updating metadata while preserving grouped progress arrays.
router.put("/:id", async (req, res) => {
  try {
    const updates = {
      assignedAdminEmail:
        req.body.assignedAdminEmail !== undefined
          ? String(req.body.assignedAdminEmail).trim()
          : undefined,
      status: req.body.status,
      expiresAt:
        req.body.expiresAt !== undefined
          ? (req.body.expiresAt ? new Date(req.body.expiresAt) : null)
          : undefined,
      attachments:
        req.body.attachments !== undefined
          ? normalizeAttachments(req.body.attachments)
          : undefined,
    }

    if (updates.assignedAdminEmail !== undefined && !isValidEmail(updates.assignedAdminEmail)) {
      return res.status(400).json({ message: "assignedAdminEmail debe ser un correo valido" })
    }

    if (updates.attachments !== undefined) {
      const attachmentsError = validateAttachments(updates.attachments)
      if (attachmentsError) {
        return res.status(400).json({ message: attachmentsError })
      }
    }

    const documentRequest = await DocumentRequest.findById(req.params.id)
    if (!documentRequest) {
      return res.status(404).json({ message: "Solicitud de documento no encontrada" })
    }

    if (updates.assignedAdminEmail !== undefined) {
      documentRequest.assignedAdminEmail = updates.assignedAdminEmail
    }

    if (updates.status !== undefined) {
      documentRequest.status = updates.status
    }

    if (updates.expiresAt !== undefined) {
      documentRequest.expiresAt = updates.expiresAt
    }

    if (updates.attachments !== undefined) {
      documentRequest.attachments = updates.attachments
    }

    await documentRequest.save()

    const updatedRequest = await loadDocumentRequestById(documentRequest._id)
    return res.status(200).json(updatedRequest)
  } catch (error) {
    return res.status(400).json({
      message: "Error al actualizar la solicitud de documento",
      error: error.message,
    })
  }
})

// PATCH /api/document-requests/:id/forms/:formItemId/status
router.patch("/:id/forms/:formItemId/status", async (req, res) => {
  try {
    const { status } = req.body
    if (!FORM_STATUSES.has(status)) {
      return res.status(400).json({ message: "Status de formulario invalido" })
    }

    const documentRequest = await DocumentRequest.findById(req.params.id)
    if (!documentRequest) {
      return res.status(404).json({ message: "Solicitud de documento no encontrada" })
    }

    const formItem = documentRequest.forms.id(req.params.formItemId)
    if (!formItem) {
      return res.status(404).json({ message: "Formulario no encontrado en la solicitud" })
    }

    formItem.status = status
    formItem.completedAt = status === "completed" ? new Date() : null

    if (documentRequest.status === "sent") {
      documentRequest.status = "in_progress"
      documentRequest.zipSentAt = null
    }

    documentRequest.refreshStatusFromProgress()
    await documentRequest.save()

    const updatedRequest = await loadDocumentRequestById(documentRequest._id)
    return res.status(200).json(updatedRequest)
  } catch (error) {
    return res.status(400).json({
      message: "Error al actualizar el status del formulario",
      error: error.message,
    })
  }
})

const updateUploadItem = async (req, res) => {
  try {
    const { status, fileUrl, fileName, uploadItemId } = req.body
    const nextStatus = status || (req.file ? 'uploaded' : undefined)

    if (!UPLOAD_STATUSES.has(nextStatus)) {
      return res.status(400).json({ message: "Status de subida invalido" })
    }

    const documentRequest = await DocumentRequest.findById(req.params.id)
    if (!documentRequest) {
      return res.status(404).json({ message: "Solicitud de documento no encontrada" })
    }

    const resolvedUploadItemId = uploadItemId || req.params.uploadItemId
    if (!resolvedUploadItemId) {
      return res.status(400).json({ message: "uploadItemId es requerido" })
    }

    const uploadItem = documentRequest.uploads.id(resolvedUploadItemId)
    if (!uploadItem) {
      return res.status(404).json({ message: "Requisito de subida no encontrado en la solicitud" })
    }

    const storedFileUrl = req.file
      ? `/publics/uploads/document-requests/${req.file.filename}`
      : normalizeStoredFileUrl(fileUrl)

    if (nextStatus === "uploaded" && !storedFileUrl) {
      return res.status(400).json({ message: "fileUrl o archivo es requerido cuando status es uploaded" })
    }

    if (uploadItem.fileUrl && req.file) {
      removeStoredRequestFile(uploadItem.fileUrl)
    }

    uploadItem.status = nextStatus
    uploadItem.fileUrl = nextStatus === "uploaded" ? storedFileUrl : null
    uploadItem.fileName = nextStatus === "uploaded" ? String(fileName || req.file?.originalname || "").trim() || null : null
    uploadItem.uploadedAt = nextStatus === "uploaded" ? new Date() : null

    if (documentRequest.status === "sent") {
      documentRequest.status = "in_progress"
      documentRequest.zipSentAt = null
    }

    documentRequest.refreshStatusFromProgress()
    await documentRequest.save()

    const updatedRequest = await loadDocumentRequestById(documentRequest._id)
    return res.status(200).json(updatedRequest)
  } catch (error) {
    return res.status(400).json({
      message: "Error al actualizar el status del archivo",
      error: error.message,
    })
  }
}

// PATCH /api/document-requests/:requestId/upload-item
router.patch("/:id/upload-item", (req, res) => {
  uploadDocumentRequestFile(req, res, async (error) => {
    if (error) {
      return res.status(400).json({
        message: "No fue posible subir el archivo",
        error: error.message,
      })
    }

    return updateUploadItem(req, res)
  })
})

// Legacy alias for existing clients
router.patch("/:id/uploads/:uploadItemId/status", async (req, res) => {
  return updateUploadItem(req, res)
})

const submitDocumentRequest = async (req, res) => {
  try {
    const documentRequest = await populateDocumentRequestQuery(DocumentRequest.findById(req.params.id))
    if (!documentRequest) {
      return res.status(404).json({ message: "Solicitud de documento no encontrada" })
    }

    if (documentRequest.status === "sent" && documentRequest.zipSentAt) {
      console.log(123)
      return res.status(400).json({
        message: "El expediente ya fue enviado",
      })
    }

    if (!hasAllFormsCompleted(documentRequest.forms) || !hasAllUploadsUploaded(documentRequest.uploads)) {
      console.log(2)
      return res.status(400).json({
        message: "No puedes finalizar el expediente hasta completar todos los formularios y subidas",
      })
    }

    const completionTimestamp = new Date()
    const zipBuffer = await buildDocumentRequestZip({
      ...documentRequest.toObject(),
      status: "sent",
      zipSentAt: completionTimestamp,
    })
    const zipFileName = `Expediente_${sanitizeZipSegment(documentRequest._id || "sin_id")}.zip`

    await sendDocumentRequestCompletedEmail(
      {
        ...documentRequest.toObject(),
        status: "sent",
        zipSentAt: completionTimestamp,
      },
      zipBuffer,
      zipFileName
    )

    documentRequest.status = "sent"
    documentRequest.zipSentAt = completionTimestamp
    await documentRequest.save()

    const updatedRequest = await loadDocumentRequestById(documentRequest._id)
    return res.status(200).json(updatedRequest)
  } catch (error) {
    console.error('Error finalizando el expediente:', error)
    return res.status(400).json({
      message: "Error al finalizar el expediente",
      error: error.message,
    })
  }
}

// POST /api/document-requests/:requestId/submit
router.post("/:id/submit", async (req, res) => {
  return submitDocumentRequest(req, res)
})

// Legacy alias for existing clients
router.patch("/:id/finalize", async (req, res) => {
  return submitDocumentRequest(req, res)
})

// PATCH /api/document-requests/:id/status
router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body

    if (!status) {
      return res.status(400).json({ message: "El nuevo status es requerido" })
    }

    const updatedDocumentRequest = await updateDocumentRequestStatus(req.params.id, status)

    return res.status(200).json(updatedDocumentRequest)
  } catch (error) {
    if (error.message === "Solicitud de documento no encontrada") {
      return res.status(404).json({ message: error.message })
    }

    return res.status(400).json({
      message: "Error al actualizar el status de la solicitud",
      error: error.message,
    })
  }
})

// DELETE /api/document-requests/:id
router.delete("/:id", async (req, res) => {
  try {
    const documentRequest = await DocumentRequest.findByIdAndDelete(req.params.id)

    if (!documentRequest) {
      return res.status(404).json({ message: "Solicitud de documento no encontrada" })
    }

    return res.status(200).json({ message: "Solicitud de documento eliminada correctamente" })
  } catch (error) {
    return res.status(500).json({
      message: "Error al eliminar la solicitud de documento",
      error: error.message,
    })
  }
})

export const routeConfig = { path: "/api/document-requests", router }
