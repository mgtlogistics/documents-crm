import express from "express";
import DocumentRequest from "../models/DocumentRequest.js";
import Document from "../models/Document.js";
import { updateDocumentRequestStatus } from "../utils/documentRequests.utils.js";

const router = express.Router();

function buildDocumentRequestPayload(body) {
	const {
		documentId,
		userId,
		status,
		requestedAt,
		completedAt,
		expiresAt,
	} = body;

	return {
		documentId,
		userId,
		status,
		requestedAt,
		completedAt,
		expiresAt,
	};
}

// GET /api/document-requests?userId=&status=&documentId=
router.get("/", async (req, res) => {
	try {
		const { userId, status, documentId } = req.query;
		const filters = {};

		if (userId) filters.userId = userId;
		if (status) filters.status = status;
		if (documentId) filters.documentId = documentId;

		const requests = await DocumentRequest.find(filters)
			.populate("documentId")
			.sort({ requestedAt: -1, createdAt: -1 })
			.lean();

		return res.status(200).json(requests);
	} catch (error) {
		return res.status(500).json({
			message: "Error al obtener las solicitudes de documentos",
			error: error.message,
		});
	}
});

// POST /api/document-requests/bulk
// Body: { userId: string, documentIds: string[] }
router.post("/bulk", async (req, res) => {
	try {
		const { userId, documentIds } = req.body;

		if (!userId || !Array.isArray(documentIds) || documentIds.length === 0) {
			return res.status(400).json({
				message: "userId y documentIds son requeridos",
			});
		}

		const uniqueDocumentIds = [...new Set(documentIds.map((id) => String(id)))];
		const documents = await Document.find({ _id: { $in: uniqueDocumentIds } })
			.select("_id userType status")
			.lean();

		if (documents.length !== uniqueDocumentIds.length) {
			const foundIds = new Set(documents.map((document) => String(document._id)));
			const missingDocumentIds = uniqueDocumentIds.filter((id) => !foundIds.has(id));

			return res.status(404).json({
				message: "Algunos documentos no existen",
				missingDocumentIds,
			});
		}

		const inactiveDocuments = documents.filter((document) => !document.status);
		if (inactiveDocuments.length > 0) {
			return res.status(400).json({
				message: "No se pueden solicitar documentos inactivos",
				inactiveDocumentIds: inactiveDocuments.map((document) => document._id),
			});
		}

		const requestsPayload = uniqueDocumentIds.map((documentId) => ({
			documentId,
			userId,
			status: "pending",
			requestedAt: new Date(),
		}));

		const createdRequests = await DocumentRequest.insertMany(requestsPayload);

		return res.status(201).json({
			message: "Solicitudes de documento creadas exitosamente",
			count: createdRequests.length,
			documentRequests: createdRequests,
		});
	} catch (error) {
		return res.status(400).json({
			message: "Error al crear solicitudes de documentos",
			error: error.message,
		});
	}
});

// GET /api/document-requests/:id
router.get("/:id", async (req, res) => {
	try {
		const documentRequest = await DocumentRequest.findById(req.params.id)
			.populate("documentId")
			.lean();

		if (!documentRequest) {
			return res.status(404).json({ message: "Solicitud de documento no encontrada" });
		}

		return res.status(200).json(documentRequest);
	} catch (error) {
		return res.status(500).json({
			message: "Error al obtener la solicitud de documento",
			error: error.message,
		});
	}
});

// POST /api/document-requests
router.post("/", async (req, res) => {
	try {
		const payload = buildDocumentRequestPayload(req.body);

		if (!payload.documentId || !payload.userId) {
			return res.status(400).json({
				message: "documentId y userId son requeridos",
			});
		}

		const document = await Document.findById(payload.documentId).select("_id").lean();
		if (!document) {
			return res.status(404).json({ message: "Documento no encontrado" });
		}

		const documentRequest = await DocumentRequest.create(payload);
		const populatedDocumentRequest = await DocumentRequest.findById(documentRequest._id)
			.populate("documentId")
			.lean();

		return res.status(201).json(populatedDocumentRequest);
	} catch (error) {
		return res.status(400).json({
			message: "Error al crear la solicitud de documento",
			error: error.message,
		});
	}
});

// PUT /api/document-requests/:id
router.put("/:id", async (req, res) => {
	try {
		const payload = buildDocumentRequestPayload(req.body);

		if (payload.documentId) {
			const document = await Document.findById(payload.documentId).select("_id").lean();
			if (!document) {
				return res.status(404).json({ message: "Documento no encontrado" });
			}
		}

		const documentRequest = await DocumentRequest.findByIdAndUpdate(
			req.params.id,
			payload,
			{ new: true, runValidators: true, omitUndefined: true }
		)
			.populate("documentId")
			.lean();

		if (!documentRequest) {
			return res.status(404).json({ message: "Solicitud de documento no encontrada" });
		}

		return res.status(200).json(documentRequest);
	} catch (error) {
		return res.status(400).json({
			message: "Error al actualizar la solicitud de documento",
			error: error.message,
		});
	}
});

// PATCH /api/document-requests/:id/status
router.patch("/:id/status", async (req, res) => {
	try {
		const { status } = req.body;

		if (!status) {
			return res.status(400).json({ message: "El nuevo status es requerido" });
		}

		const updatedDocumentRequest = await updateDocumentRequestStatus(req.params.id, status);

		return res.status(200).json(updatedDocumentRequest);
	} catch (error) {
		if (error.message === "Solicitud de documento no encontrada") {
			return res.status(404).json({ message: error.message });
		}

		return res.status(400).json({
			message: "Error al actualizar el status de la solicitud",
			error: error.message,
		});
	}
});

// DELETE /api/document-requests/:id
router.delete("/:id", async (req, res) => {
	try {
		const documentRequest = await DocumentRequest.findByIdAndDelete(req.params.id);

		if (!documentRequest) {
			return res.status(404).json({ message: "Solicitud de documento no encontrada" });
		}

		return res.status(200).json({ message: "Solicitud de documento eliminada correctamente" });
	} catch (error) {
		return res.status(500).json({
			message: "Error al eliminar la solicitud de documento",
			error: error.message,
		});
	}
});

export const routeConfig = { path: "/api/document-requests", router };