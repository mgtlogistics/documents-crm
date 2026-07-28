import mongoose from 'mongoose';
import companySchema from './Company.js';


const personSchema = new mongoose.Schema({
  names: { type: String, required: true, trim: true, default: "" },
  surnames: { type: String, required: true, trim: true, default: "" },
  rfc: { type: String, required: true, trim: true, default: "" },
}, {
  id: false,
  timestamps: true,
})

const addressSchema = new mongoose.Schema({
  street: { type: String, required: true, trim: true, default: "" },
  exteriorNumber: { type: String, required: true, trim: true, default: "" },
  interiorNumber: { type: String, required: false, trim: true, default: "" },
  neighborhood: { type: String, required: true, trim: true, default: "" },
  locality: { type: String, required: true, trim: true, default: "" },
  postalCode: { type: String, required: true, trim: true, default: "" },
  city: { type: String, required: true, trim: true, default: "" },
  state: { type: String, required: true, trim: true, default: "" },
  country: { type: String, required: true, trim: true, default: "" },
}, {
  id: false,
  timestamps: true,
})

const staffSchema = new mongoose.Schema({
  _id: {
    type: String,
    // Genera un ObjectId nuevo y lo convierte a string por defecto
    default: () => new mongoose.Types.ObjectId().toString()
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },

  profile: {
    names: {
      type: String,
      required: true
    },
    lastNames: {
      type: String,
      required: false
    },
    phone: {
      type: String,
      required: false
    }
  },
  address: addressSchema,
  company: companySchema,
  person: personSchema,

  letterhead: {
    type: String,
    required: false,
    default: ''
  },

  isProfileComplete: {
    type: Boolean,
    default: false
  },

  status: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

const Staff = mongoose.model('Staff', staffSchema);
export default Staff;