import mongoose from "mongoose";
// SUB-SCHEMA: Define las reglas y propiedades de CADA campo individual
const FieldConfigSchema = new mongoose.Schema({
  fieldKey: {
    type: String,
    required: true,
    trim: true,
    description: 'La propiedad JSON que esperará el generador de PDF, ej: "monto_renta"'
  },
  tag: {
    type: String,
    required: true,
    description: 'El texto que verá el usuario en el formulario (Label), ej: "Monto de la Renta"'
  },
  type: {
    type: String,
    required: true,
    enum: ['text', 'number', 'date', 'select', 'checkbox', 'textarea'],
    description: 'Tipo de input que el frontend debe renderizar'
  },
  required: {
    type: Boolean,
    default: false,
    description: 'Define si el frontend y el backend deben exigir este campo'
  },
  placeholder: {
    type: String,
    default: '',
    description: 'Texto de ayuda dentro del input'
  },
  // Sub-schema para inputs tipo 'select' (Menús desplegables)
  options: [{
    label: { type: String, required: true }, // Lo que ve el usuario (ej: "Efectivo")
    value: { type: mongoose.Schema.Types.Mixed, required: true } // Lo que procesa el código (ej: "EFECTIVO" o 1)
  }],
  // Validaciones extra opcionales para robustecer el formulario
  validations: {
    min: { type: Number, description: 'Valor mínimo para números' },
    max: { type: Number, description: 'Valor máximo para números' },
    regex: { type: String, description: 'Expresión regular para validar texto (ej: RFC, Teléfono)' }
  }
}, { _id: false }); // _id: false evita que cada campo genere un ID propio innecesario


// SCHEMA PRINCIPAL: Une el documento con su listado de campos
const DocumentStructureSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: () => new mongoose.Types.ObjectId().toString()
  },
  fields: [FieldConfigSchema] // El arreglo que contiene todos los sub-schemas
}, {
  timestamps: true
});

const DocumentStructure = mongoose.model('DocumentStructure', DocumentStructureSchema);
export default DocumentStructure;