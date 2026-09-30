import mongoose, { Document, Schema } from 'mongoose';

export type AcademicYear = '1st Year' | '2nd Year' | '3rd Year' | '4th Year' | 'Post Graduate' | 'Other';
export type RegistrationStatus = 'Confirmed' | 'Waitlisted' | 'Cancelled';

export interface IRegistration extends Document {
  _id: mongoose.Types.ObjectId;
  registrationId: string; // Unique human-readable code e.g. CC-2026-X9B2F
  event: mongoose.Types.ObjectId | any;
  fullName: string;
  email: string;
  college: string;
  academicYear: AcademicYear;
  phone: string;
  status: RegistrationStatus;
  notes?: string;
  registeredAt: Date;
}

const RegistrationSchema = new Schema<IRegistration>(
  {
    registrationId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    event: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    college: {
      type: String,
      required: true,
      trim: true,
    },
    academicYear: {
      type: String,
      enum: ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Post Graduate', 'Other'],
      required: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['Confirmed', 'Waitlisted', 'Cancelled'],
      default: 'Confirmed',
    },
    notes: {
      type: String,
      default: '',
    },
    registeredAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to guarantee one registration per email per event
RegistrationSchema.index({ event: 1, email: 1 }, { unique: true });

export const Registration =
  mongoose.models.Registration ||
  mongoose.model<IRegistration>('Registration', RegistrationSchema);
