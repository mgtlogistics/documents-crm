import mongoose from 'mongoose';

const DocumentFolderPresetSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: () => new mongoose.Types.ObjectId().toString()
  },
  title: { type: String, required: true, trim: true },
  userType: { type: String, enum: ['client', 'company'], required: true },

  // 1. Requisitos de SUBIDA (Referencias al catálogo UploadCatalog)
  uploads: [{
    type: String,
    ref: 'UploadCatalog',
    description: 'IDs de documentos requeridos del catálogo UploadCatalog'
  }],

  // 2. FORMULARIOS (Referencias al esquema preexistente Document)
  documents: [{
    type: String,
    ref: 'Document',
    description: 'IDs de formularios a llenar'
  }],

  // 3. ANEXOS DEL ADMIN
  attachments: [{
    title: { type: String, required: true },
    fileUrl: { type: String, required: true },
    description: { type: String }
  }],

  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const DocumentFolderPreset = mongoose.model('DocumentFolderPreset', DocumentFolderPresetSchema);
export default DocumentFolderPreset;