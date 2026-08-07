import express from "express"
import Document from "../models/Document.js"
import DocumentFolderPreset from "../models/DocumentFolderPreset.js"
import UploadCatalog from "../models/UploadCatalog.js"

const router = express.Router()

const VALID_USER_TYPES = new Set(["client", "company"])

const buildPopulatePresetQuery = (query) => (
  query
    .populate({
      path: "uploads",
      select: "key title description maxSizeMB allowedExtensions isActive createdAt updatedAt",
    })
    .populate({
      path: "documents",
      select: "key name downloadEndpoint userType status createdAt updatedAt",
    })
)

const uniqueIds = (values = []) => {
  if (!Array.isArray(values)) {
    return []
  }

  return [...new Set(values.map((value) => String(value).trim()).filter(Boolean))]
}

const normalizeExtensions = (extensions = []) => {
  if (!Array.isArray(extensions) || extensions.length === 0) {
    return ["pdf", "png", "jpg", "jpeg"]
  }

  return [...new Set(
    extensions
      .map((extension) => String(extension).trim().toLowerCase().replace(/^\./, ""))
      .filter(Boolean)
  )]
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

const buildUploadPayload = (body = {}) => ({
  key: typeof body.key === "string" ? body.key.trim() : "",
  title: typeof body.title === "string" ? body.title.trim() : "",
  description: typeof body.description === "string" ? body.description.trim() : "",
  maxSizeMB:
    body.maxSizeMB === undefined || body.maxSizeMB === null || body.maxSizeMB === ""
      ? 10
      : Number(body.maxSizeMB),
  allowedExtensions: normalizeExtensions(body.allowedExtensions),
  isActive: body.isActive === undefined ? true : Boolean(body.isActive),
})

const buildPresetPayload = (body = {}) => ({
  title: typeof body.title === "string" ? body.title.trim() : "",
  userType: typeof body.userType === "string" ? body.userType.trim() : "",
  uploads: uniqueIds(body.uploads),
  documents: uniqueIds(body.documents),
  attachments: normalizeAttachments(body.attachments),
  isActive: body.isActive === undefined ? true : Boolean(body.isActive),
})

const validateUploadPayload = (payload) => {
  if (!payload.key) {
    return "La clave del requisito es requerida"
  }

  if (!payload.title) {
    return "El titulo del requisito es requerido"
  }

  if (Number.isNaN(payload.maxSizeMB) || payload.maxSizeMB <= 0) {
    return "maxSizeMB debe ser un numero mayor a 0"
  }

  if (!payload.allowedExtensions.length) {
    return "Debes indicar al menos una extension permitida"
  }

  return null
}

const validatePresetPayload = (payload) => {
  if (!payload.title) {
    return "El titulo del preset es requerido"
  }

  if (!VALID_USER_TYPES.has(payload.userType)) {
    return "userType debe ser client o company"
  }

  const invalidAttachment = payload.attachments.find((attachment) => !attachment.title || !attachment.fileUrl)
  if (invalidAttachment) {
    return "Cada anexo debe incluir title y fileUrl"
  }

  return null
}

const ensureUploadReferencesExist = async (uploadIds) => {
  if (!uploadIds.length) {
    return []
  }

  const uploads = await UploadCatalog.find({ _id: { $in: uploadIds } }).select("_id").lean()
  if (uploads.length !== uploadIds.length) {
    const foundIds = new Set(uploads.map((upload) => String(upload._id)))
    return uploadIds.filter((id) => !foundIds.has(id))
  }

  return []
}

const ensureDocumentReferencesExist = async (documentIds) => {
  if (!documentIds.length) {
    return []
  }

  const documents = await Document.find({ _id: { $in: documentIds } }).select("_id").lean()
  if (documents.length !== documentIds.length) {
    const foundIds = new Set(documents.map((document) => String(document._id)))
    return documentIds.filter((id) => !foundIds.has(id))
  }

  return []
}

const buildActiveFilter = (value) => {
  if (value === undefined) {
    return undefined
  }

  return value === "true"
}

router.get("/overview", async (req, res) => {
  try {
    const { userType } = req.query
    const isActive = buildActiveFilter(req.query.isActive)

    const uploadFilters = {}
    const documentFilters = {}
    const presetFilters = {}

    if (typeof isActive === "boolean") {
      uploadFilters.isActive = isActive
      documentFilters.status = isActive
      presetFilters.isActive = isActive
    }

    if (typeof userType === "string" && VALID_USER_TYPES.has(userType)) {
      documentFilters.userType = userType
      presetFilters.userType = userType
    }

    const [uploads, documents, presets] = await Promise.all([
      UploadCatalog.find(uploadFilters).sort({ title: 1 }).lean(),
      Document.find(documentFilters).sort({ name: 1 }).lean(),
      buildPopulatePresetQuery(DocumentFolderPreset.find(presetFilters).sort({ title: 1 })).lean(),
    ])

    return res.status(200).json({ uploads, documents, presets })
  } catch (error) {
    return res.status(500).json({
      message: "Error al obtener la configuracion de carpetas de documentos",
      error: error.message,
    })
  }
})

router.get("/uploads", async (req, res) => {
  try {
    const filters = {}
    const isActive = buildActiveFilter(req.query.isActive)

    if (typeof isActive === "boolean") {
      filters.isActive = isActive
    }

    const uploads = await UploadCatalog.find(filters).sort({ title: 1 }).lean()
    return res.status(200).json(uploads)
  } catch (error) {
    return res.status(500).json({
      message: "Error al obtener el catalogo de requisitos",
      error: error.message,
    })
  }
})

router.get("/uploads/:id", async (req, res) => {
  try {
    const upload = await UploadCatalog.findById(req.params.id).lean()
    if (!upload) {
      return res.status(404).json({ message: "Requisito no encontrado" })
    }

    return res.status(200).json(upload)
  } catch (error) {
    return res.status(500).json({
      message: "Error al obtener el requisito",
      error: error.message,
    })
  }
})

router.post("/uploads", async (req, res) => {
  try {
    const payload = buildUploadPayload(req.body)
    const validationError = validateUploadPayload(payload)

    if (validationError) {
      return res.status(400).json({ message: validationError })
    }

    const upload = await UploadCatalog.create(payload)
    return res.status(201).json(upload)
  } catch (error) {
    return res.status(400).json({
      message: "Error al crear el requisito",
      error: error.message,
    })
  }
})

router.put("/uploads/:id", async (req, res) => {
  try {
    const payload = buildUploadPayload(req.body)
    const validationError = validateUploadPayload(payload)

    if (validationError) {
      return res.status(400).json({ message: validationError })
    }

    const upload = await UploadCatalog.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true,
    }).lean()

    if (!upload) {
      return res.status(404).json({ message: "Requisito no encontrado" })
    }

    return res.status(200).json(upload)
  } catch (error) {
    return res.status(400).json({
      message: "Error al actualizar el requisito",
      error: error.message,
    })
  }
})

router.delete("/uploads/:id", async (req, res) => {
  try {
    const linkedPreset = await DocumentFolderPreset.findOne({ uploads: req.params.id })
      .select("_id title")
      .lean()

    if (linkedPreset) {
      return res.status(400).json({
        message: "No se puede eliminar el requisito porque esta en uso por un preset",
        preset: linkedPreset,
      })
    }

    const upload = await UploadCatalog.findByIdAndDelete(req.params.id)
    if (!upload) {
      return res.status(404).json({ message: "Requisito no encontrado" })
    }

    return res.status(200).json({ message: "Requisito eliminado correctamente" })
  } catch (error) {
    return res.status(500).json({
      message: "Error al eliminar el requisito",
      error: error.message,
    })
  }
})

router.get("/presets", async (req, res) => {
  try {
    const filters = {}
    const isActive = buildActiveFilter(req.query.isActive)

    if (typeof isActive === "boolean") {
      filters.isActive = isActive
    }

    if (typeof req.query.userType === "string" && VALID_USER_TYPES.has(req.query.userType)) {
      filters.userType = req.query.userType
    }

    const presets = await buildPopulatePresetQuery(
      DocumentFolderPreset.find(filters).sort({ title: 1 })
    ).lean()

    return res.status(200).json(presets)
  } catch (error) {
    return res.status(500).json({
      message: "Error al obtener los presets de carpetas",
      error: error.message,
    })
  }
})

router.get("/presets/:id", async (req, res) => {
  try {
    const preset = await buildPopulatePresetQuery(DocumentFolderPreset.findById(req.params.id)).lean()
    if (!preset) {
      return res.status(404).json({ message: "Preset no encontrado" })
    }

    return res.status(200).json(preset)
  } catch (error) {
    return res.status(500).json({
      message: "Error al obtener el preset",
      error: error.message,
    })
  }
})

router.post("/presets", async (req, res) => {
  try {
    const payload = buildPresetPayload(req.body)
    const validationError = validatePresetPayload(payload)

    if (validationError) {
      return res.status(400).json({ message: validationError })
    }

    const [missingUploadIds, missingDocumentIds] = await Promise.all([
      ensureUploadReferencesExist(payload.uploads),
      ensureDocumentReferencesExist(payload.documents),
    ])

    if (missingUploadIds.length > 0 || missingDocumentIds.length > 0) {
      return res.status(404).json({
        message: "Algunas referencias del preset no existen",
        missingUploadIds,
        missingDocumentIds,
      })
    }

    const preset = await DocumentFolderPreset.create(payload)
    const populatedPreset = await buildPopulatePresetQuery(
      DocumentFolderPreset.findById(preset._id)
    ).lean()

    return res.status(201).json(populatedPreset)
  } catch (error) {
    return res.status(400).json({
      message: "Error al crear el preset",
      error: error.message,
    })
  }
})

router.put("/presets/:id", async (req, res) => {
  try {
    const payload = buildPresetPayload(req.body)
    const validationError = validatePresetPayload(payload)

    if (validationError) {
      return res.status(400).json({ message: validationError })
    }

    const [missingUploadIds, missingDocumentIds] = await Promise.all([
      ensureUploadReferencesExist(payload.uploads),
      ensureDocumentReferencesExist(payload.documents),
    ])

    if (missingUploadIds.length > 0 || missingDocumentIds.length > 0) {
      return res.status(404).json({
        message: "Algunas referencias del preset no existen",
        missingUploadIds,
        missingDocumentIds,
      })
    }

    const preset = await DocumentFolderPreset.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true,
    })

    if (!preset) {
      return res.status(404).json({ message: "Preset no encontrado" })
    }

    const populatedPreset = await buildPopulatePresetQuery(
      DocumentFolderPreset.findById(preset._id)
    ).lean()

    return res.status(200).json(populatedPreset)
  } catch (error) {
    return res.status(400).json({
      message: "Error al actualizar el preset",
      error: error.message,
    })
  }
})

router.delete("/presets/:id", async (req, res) => {
  try {
    const preset = await DocumentFolderPreset.findByIdAndDelete(req.params.id)
    if (!preset) {
      return res.status(404).json({ message: "Preset no encontrado" })
    }

    return res.status(200).json({ message: "Preset eliminado correctamente" })
  } catch (error) {
    return res.status(500).json({
      message: "Error al eliminar el preset",
      error: error.message,
    })
  }
})

export const routeConfig = { path: "/api/document-folders", router }