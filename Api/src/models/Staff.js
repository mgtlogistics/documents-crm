import mongoose from 'mongoose';


const personSchema = new mongoose.Schema({
  names: { type: String, required: true, trim: true, default: "" },
  surnames: { type: String, required: true, trim: true, default: "" },
  rfc: { type: String, required: true, trim: true, default: "" },
}, {
  id: false,
  timestamps: true,
})

/*  powerOfAttorneyVolume en realidad hace referencia al volumen 
    de la escritura, fue un fallo de en la explicación de como
    funcionaba el tema de la información de persona moral
*/
const companySchema = new mongoose.Schema({
  socialReason: { type: String, required: true, trim: true, default: "" },
  rfc: { type: String, required: true, trim: true, default: "" },
  legalRepresentativeName: { type: String, required: true, trim: true, default: "" },
  legalRepresentativeRfc: { type: String, required: true, trim: true, default: "" },
  legalRepresentativePosition: { type: String, required: true, trim: true, default: "" },
  formFillerName: { type: String, required: true, trim: true, default: "" },
  scripture: { type: String, required: true, trim: true, default: "" },
  notaryName: { type: String, required: true, trim: true, default: "" },
  notaryNumber: { type: String, required: true, trim: true, default: "" },
  notaryCity: { type: String, required: true, trim: true, default: "" },
  notaryState: { type: String, required: true, trim: true, default: "" },
  powerOfAttorneyNumber: { type: String, required: true, trim: true, default: "" },
  powerOfAttorneyVolume: { type: String, required: true, trim: true, default: "" },
  powerOfAttorneyDate: { type: Date, required: true },
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