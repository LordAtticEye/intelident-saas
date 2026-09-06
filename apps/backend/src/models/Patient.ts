import mongoose, { Document, Schema } from 'mongoose';

export interface IDentalNoteDocument {
  _id:       mongoose.Types.ObjectId;
  date:      Date;
  dentistId: mongoose.Types.ObjectId;
  note:      string;
  treatment: string;
  tooth?:    number;
  images?:   string[];
}

export interface IPatientDocument extends Document {
  userId?:     mongoose.Types.ObjectId;
  firstName:   string;
  lastName:    string;
  dateOfBirth: Date;
  phone:       string;
  email:       string;
  address:     string;
  gender:      'M' | 'F' | 'OTHER';
  medicalHistory: {
    allergies:   string[];
    medications: string[];
    conditions:  string[];
    bloodType?:  string;
    notes?:      string;
    dentalNotes: IDentalNoteDocument[];
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const dentalNoteSchema = new Schema<IDentalNoteDocument>({
  date:      { type: Date, default: Date.now },
  dentistId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  note:      { type: String, required: true },
  treatment: { type: String, required: true },
  tooth:     { type: Number, min: 1, max: 32 },
  images:    [{ type: String }],
});

const patientSchema = new Schema<IPatientDocument>(
  {
    userId:      { type: Schema.Types.ObjectId, ref: 'User' },
    firstName:   { type: String, required: true, trim: true, index: true },
    lastName:    { type: String, required: true, trim: true, index: true },
    dateOfBirth: { type: Date, required: true },
    phone:       { type: String, required: true, trim: true },
    email:       { type: String, required: true, lowercase: true, trim: true },
    address:     { type: String, trim: true },
    gender:      { type: String, enum: ['M', 'F', 'OTHER'], required: true },
    medicalHistory: {
      allergies:   [{ type: String }],
      medications: [{ type: String }],
      conditions:  [{ type: String }],
      bloodType:   { type: String },
      notes:       { type: String },
      dentalNotes: [dentalNoteSchema],
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

// Índice de texto para búsquedas
patientSchema.index({ firstName: 'text', lastName: 'text', email: 'text' });

export const Patient = mongoose.model<IPatientDocument>('Patient', patientSchema);