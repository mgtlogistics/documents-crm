import DocumentRequest from "../models/DocumentRequest.js";

export async function updateDocumentRequestStatus(documentRequestId, newStatus) {
	const updatePayload = {
		status: newStatus,
		completedAt: newStatus === "completed" ? new Date() : null,
	};

	const documentRequest = await DocumentRequest.findByIdAndUpdate(
		documentRequestId,
		updatePayload,
		{
			new: true,
			runValidators: true,
		}
	)
		.populate("documentId")
		.lean();

	if (!documentRequest) {
		throw new Error("Solicitud de documento no encontrada");
	}

	return documentRequest;
}
