import mongoose, { Document, Schema } from 'mongoose';

export interface IPatientCRM extends Document {
  patientId: mongoose.Types.ObjectId;
  status: 'lead' | 'active' | 'inactive' | 'archived';
  source: 'web' | 'referral' | 'social' | 'walk-in' | 'call' | 'admin';
  tags: string[];
  lastContact: Date;
  nextFollowUp: Date;
  interactions: Array<{
    type: 'call' | 'email' | 'whatsapp' | 'sms' | 'visit' | 'web';
    date: Date;
    notes: string;
    handledBy: mongoose.Types.ObjectId;
  }>;
  satisfactionScore: number;
  lifetimeValue: number;
  campaigns: Array<{
    name: string;
    sentAt: Date;
    opened: boolean;
    clicked: boolean;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const PatientCRMSchema = new Schema<IPatientCRM>(
  {
    patientId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    status: { type: String, enum: ['lead', 'active', 'inactive', 'archived'], default: 'lead' },
    source: { type: String, enum: ['web', 'referral', 'social', 'walk-in', 'call', 'admin'], default: 'web' },
    tags: [{ type: String }],
    lastContact: { type: Date },
    nextFollowUp: { type: Date },
    interactions: [{
      type: { type: String, enum: ['call', 'email', 'whatsapp', 'sms', 'visit', 'web'] },
      date: { type: Date, default: Date.now },
      notes: String,
      handledBy: { type: Schema.Types.ObjectId, ref: 'User' },
    }],
    satisfactionScore: { type: Number, min: 0, max: 10, default: 0 },
    lifetimeValue: { type: Number, default: 0 },
    campaigns: [{
      name: String,
      sentAt: Date,
      opened: Boolean,
      clicked: Boolean,
    }],
  },
  { timestamps: true }
);

export const PatientCRM = mongoose.model<IPatientCRM>('PatientCRM', PatientCRMSchema);