export enum UserRole {
  ADMIN       = 'ADMIN',
  DENTIST     = 'DENTIST',
  RECEPTIONIST = 'RECEPTIONIST',
  PATIENT     = 'PATIENT',
}

export interface IUser {
  _id:       string;
  email:     string;
  firstName: string;
  lastName:  string;
  role:      UserRole;
  isActive:  boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPatient {
  _id:          string;
  userId?:      string;
  firstName:    string;
  lastName:     string;
  dateOfBirth:  Date;
  phone:        string;
  email:        string;
  address:      string;
  medicalHistory: IMedicalHistory;
  createdAt:    Date;
}

export interface IMedicalHistory {
  allergies:        string[];
  medications:      string[];
  conditions:       string[];
  dentalNotes:      IDentalNote[];
}

export interface IDentalNote {
  _id:       string;
  date:      Date;
  dentistId: string;
  note:      string;
  treatment: string;
  tooth?:    number;
}

export interface IAppointment {
  _id:        string;
  patientId:  string;
  dentistId:  string;
  date:       Date;
  duration:   number;
  status:     AppointmentStatus;
  notes?:     string;
  treatment?: string;
}

export enum AppointmentStatus {
  SCHEDULED  = 'SCHEDULED',
  CONFIRMED  = 'CONFIRMED',
  COMPLETED  = 'COMPLETED',
  CANCELLED  = 'CANCELLED',
  NO_SHOW    = 'NO_SHOW',
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?:   T;
  message?: string;
  errors?:  string[];
}

export interface JwtPayload {
  userId: string;
  email:  string;
  role:   UserRole;
  sessionId: string;
}

export interface Permission {
  resource: string;
  actions:  ('create' | 'read' | 'update' | 'delete')[];
}

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.ADMIN]: [
    { resource: '*', actions: ['create', 'read', 'update', 'delete'] },
  ],
  [UserRole.DENTIST]: [
    { resource: 'patients',     actions: ['create', 'read', 'update'] },
    { resource: 'appointments', actions: ['create', 'read', 'update'] },
    { resource: 'medical',      actions: ['create', 'read', 'update'] },
    { resource: 'dashboard',    actions: ['read'] },
  ],
  [UserRole.RECEPTIONIST]: [
    { resource: 'patients',     actions: ['create', 'read', 'update'] },
    { resource: 'appointments', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'dashboard',    actions: ['read'] },
  ],
  [UserRole.PATIENT]: [
    { resource: 'appointments', actions: ['create', 'read'] },
    { resource: 'profile',      actions: ['read', 'update'] },
  ],
};