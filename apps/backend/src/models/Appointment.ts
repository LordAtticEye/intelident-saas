import mongoose, { Document, Schema } from 'mongoose';
import { AppointmentStatus } from '@intelident/shared';

export interface IAppointmentDocument extends Document {
  patientId:   mongoose.Types.ObjectId;
  dentistId:   mongoose.Types.ObjectId;
  date:        Date;
  duration:    number;
  status:      AppointmentStatus;
  amount?: number;
  treatment?:  string;
  notes?:      string;
  cost?:       number;
  isPaid:      boolean;
  createdBy:   mongoose.Types.ObjectId;
  createdAt:   Date;
  updatedAt:   Date;
}

const appointmentSchema = new Schema<IAppointmentDocument>(
  {
    patientId:  { type: Schema.Types.ObjectId, ref: 'Patient', required: true, index: true },
    dentistId:  { type: Schema.Types.ObjectId, ref: 'User',    required: true, index: true },
    date:       { type: Date, required: true, index: true },
    duration:   { type: Number, default: 30 },
    status: {
      type:    String,
      enum:    Object.values(AppointmentStatus),
      default: AppointmentStatus.SCHEDULED,
    },
    treatment: { type: String },
    amount: { type: Number, required: false },
    notes:     { type: String },
    cost:      { type: Number, min: 0 },
    isPaid:    { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true },
);

export const Appointment = mongoose.model<IAppointmentDocument>('Appointment', appointmentSchema);