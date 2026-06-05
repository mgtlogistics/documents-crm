import express from "express";
import Document from "../models/Document.js";
import DocumentStructure from "../models/DocumentStructure.js";

const router = express.Router();

// ─── GET ALL ─────────────────────────────────────────────────────────────────
// GET /api/documents
router.get("/", async (req, res) => {
  try {
    const documents = await Document.find();
    return res.status(200).json(documents);
  } catch (error) {
    return res.status(500).json({ message: "Error al obtener documentos", error: error.message });
  }
});

// ─── GET BY ID (document + structure) ────────────────────────────────────────
// GET /api/documents/:id
router.get("/:id", async (req, res) => {
  try {
    const document = await Document.findById(req.params.id)
      .populate("documentStructureId")
      .lean();
    if (!document) return res.status(404).json({ message: "Documento no encontrado" });

    const structure = await DocumentStructure.findById(document.documentStructureId);
    return res.status(200).json({ document, structure });
  } catch (error) {
    return res.status(500).json({ message: "Error al obtener el documento", error: error.message });
  }
});

// ─── CREATE (document + structure together) ───────────────────────────────────
// POST /api/documents
// Body: { key, name, downloadEndpoint, status?, fields: [...] }
router.post("/", async (req, res) => {
  try {
    const { key, name, downloadEndpoint, status, fields = [] } = req.body;

    const structure = await DocumentStructure.create({ fields });

    const document = await Document.create({
      documentStructureId: structure._id,
      key,
      name,
      downloadEndpoint,
      status,
    });

    return res.status(201).json({ document, structure });
  } catch (error) {
    return res.status(400).json({ message: "Error al crear el documento", error: error.message });
  }
});

// ─── UPDATE DOCUMENT (metadata only) ─────────────────────────────────────────
// PUT /api/documents/:id/document
// Body: { key?, name?, downloadEndpoint?, status?, userType?, fields?: [...] }
router.put("/:id/document", async (req, res) => {
  try {
    const { key, name, downloadEndpoint, status, userType, fields } = req.body;

    const document = await Document.findByIdAndUpdate(
      req.params.id,
      { key, name, downloadEndpoint, status, userType },
      { new: true, runValidators: true, omitUndefined: true }
    );

    if (!document) return res.status(404).json({ message: "Documento no encontrado" });

    let structure = null;

    if (Array.isArray(fields)) {
      structure = await DocumentStructure.findByIdAndUpdate(
        document.documentStructureId,
        { fields },
        { new: true, runValidators: true, omitUndefined: true }
      );

      if (!structure) return res.status(404).json({ message: "Estructura no encontrada" });
    }

    return res.status(200).json({ document, structure });
  } catch (error) {
    return res.status(400).json({ message: "Error al actualizar el documento", error: error.message });
  }
});

// ─── UPDATE STRUCTURE (fields only) ──────────────────────────────────────────
// PUT /api/documents/:id/structure
// Body: { fields: [...] }
router.put("/:id/structure", async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) return res.status(404).json({ message: "Documento no encontrado" });

    const structure = await DocumentStructure.findByIdAndUpdate(
      document.documentStructureId,
      { fields: req.body.fields },
      { new: true, runValidators: true }
    );

    if (!structure) return res.status(404).json({ message: "Estructura no encontrada" });

    return res.status(200).json(structure);
  } catch (error) {
    return res.status(400).json({ message: "Error al actualizar la estructura", error: error.message });
  }
});

// ─── DELETE (document + structure) ───────────────────────────────────────────
// DELETE /api/documents/:id
router.delete("/:id", async (req, res) => {
  try {
    const document = await Document.findByIdAndDelete(req.params.id);
    if (!document) return res.status(404).json({ message: "Documento no encontrado" });

    await DocumentStructure.findByIdAndDelete(document.documentStructureId);

    return res.status(200).json({ message: "Documento y estructura eliminados correctamente" });
  } catch (error) {
    return res.status(500).json({ message: "Error al eliminar el documento", error: error.message });
  }
});


export const routeConfig = { path: "/api/documents", router }