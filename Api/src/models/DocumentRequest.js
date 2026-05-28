import mongoose from 'mongoose';

const DocumentRequestSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: () => new mongoose.Types.ObjectId().toString()
  },
  // Referencia al documento base para saber qué campos y endpoint usar
  documentId: {
    type: String,
    required: true,
    ref: 'Document',
    description: 'El documento específico que se le solicita llenar al usuario'
  },
  // Identificador del usuario (puede ser String o ObjectId dependiendo de tu Auth)
  userId: {
    type: String,
    required: true,
    index: true, // Indexado para buscar rápido los requests de un usuario
    description: 'ID del usuario (cliente o empresa) que debe responder la solicitud'
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'in_progress', 'completed', 'rejected'],
    default: 'pending',
    description: 'Estado actual del flujo de la solicitud'
  },
  requestedAt: {
    type: Date,
    default: Date.now,
    description: 'Fecha en la que el administrador o el sistema generó la solicitud'
  },
  completedAt: {
    type: Date,
    description: 'Fecha exacta en la que el usuario finalizó el llenado'
  },
  expiresAt: {
    type: Date,
    description: 'Fecha límite opcional para que el usuario llene el documento'
  }
}, {
  timestamps: true // Nos da automáticamente createdAt y updatedAt para auditoría interna
});

// Índice compuesto para optimizar la query típica del tablero del usuario
DocumentRequestSchema.index({ userId: 1, status: 1 });

const DocumentRequest = mongoose.model('DocumentRequest', DocumentRequestSchema);
export default DocumentRequest;