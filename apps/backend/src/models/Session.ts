import mongoose, { Document, Schema } from 'mongoose';

export interface ISessionDocument extends Document {
  userId:       mongoose.Types.ObjectId;
  sessionId:    string;
  refreshToken: string;
  userAgent?:   string;
  ipAddress?:   string;
  isActive:     boolean;
  expiresAt:    Date;
  createdAt:    Date;
}

const sessionSchema = new Schema<ISessionDocument>(
  {
    userId:       { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    sessionId:    { type: String, required: true, unique: true, index: true },
    refreshToken: { type: String, required: true, select: false },
    userAgent:    { type: String },
    ipAddress:    { type: String },
    isActive:     { type: Boolean, default: true },
    expiresAt:    { type: Date, required: true, index: { expireAfterSeconds: 0 } },
  },
  { timestamps: true },
);

export const Session = mongoose.model<ISessionDocument>('Session', sessionSchema);