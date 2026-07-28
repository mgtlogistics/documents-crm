import mongoose from "mongoose"

// Sub-schema para Notaría (reutilizable tanto en Escritura como en Poder)
const notarySchema = new mongoose.Schema({
  number: { type: String, required: true, trim: true, default: "" },
  name: { type: String, required: true, trim: true, default: "" },
  city: { type: String, required: true, trim: true, default: "" },
  state: { type: String, required: true, trim: true, default: "" },
}, { _id: false });

// Sub-schema para Escritura Constitutiva / Pública
const publicDeedSchema = new mongoose.Schema({
  number: { type: String, required: true, trim: true, default: "" },
  volume: { type: String, required: true, trim: true, default: "" },
  date: { type: Date },
  registrationDate: { type: Date },

  notary: { type: notarySchema, default: () => ({}) },
  publicRegistry: {
    mercantileFolio: { type: String, required: true, trim: true, default: "" },
  },
}, { _id: false });

// Sub-schema para Poder Notarial
const powerOfAttorneySchema = new mongoose.Schema({
  number: { type: String, required: true, trim: true, default: "" },
  volume: { type: String, required: true, trim: true, default: "" },
  date: { type: Date },
  notary: { type: notarySchema, default: () => ({}) },
}, { _id: false });

// Sub-schema opcional para Representante Legal (para agrupar sus campos)
const legalRepresentativeSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  paternalLastName: { type: String, required: true },
  maternalLastName: { type: String, default: "" },
  rfc: { type: String, required: true, trim: true, default: "" },
  position: { type: String, required: true, trim: true, default: "" },
}, { _id: false });

// Schema Principal de la Empresa
const companySchema = new mongoose.Schema({
  socialReason: { type: String, required: true, trim: true, default: "" },
  rfc: { type: String, required: true, trim: true, default: "" },
  email: { type: String, required: true, trim: true, default: "" },
  formFillerName: { type: String, required: true, trim: true, default: "" },

  legalRepresentative: { type: legalRepresentativeSchema, default: () => ({}) },
  publicDeed: { type: publicDeedSchema, default: () => ({}) },
  powerOfAttorney: { type: powerOfAttorneySchema, default: () => ({}) },
}, {
  id: false,
  timestamps: true,
});

export default companySchema