import mongoose from 'mongoose';

const UploadCatalogSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: () => new mongoose.Types.ObjectId().toString()
  },
  key: { 
    type: String, 
    required: true, 
    unique: true, 
    trim: true,
    description: 'Clave única del requisito (ej: csf, ine_frente, comprobante_domicilio)'
  },
  title: { 
    type: String, 
    required: true, 
    trim: true,
    description: 'Nombre visible (ej: Constancia de Situación Fiscal)'
  },
  description: { 
    type: String,
    description: 'Instrucción o regla predeterminada (ej: Antigüedad máxima 3 meses)'
  },
  maxSizeMB: { type: Number, default: 10 },
  allowedExtensions: [{ type: String, default: ['pdf', 'png', 'jpg', 'jpeg'] }],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const UploadCatalog = mongoose.model('UploadCatalog', UploadCatalogSchema);
export default UploadCatalog;