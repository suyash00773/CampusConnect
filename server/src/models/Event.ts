import mongoose, { Document, Schema } from 'mongoose';

export type EventCategory =
  | 'Technical'
  | 'Cultural'
  | 'Sports'
  | 'Workshop'
  | 'Hackathon'
  | 'Seminar'
  | 'Social';

export interface IEvent extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  club: mongoose.Types.ObjectId | any;
  category: EventCategory;
  date: string; // YYYY-MM-DD
  startTime: string; // e.g. 10:00 AM
  endTime: string; // e.g. 04:00 PM
  venue: string;
  locationType: 'In-Person' | 'Virtual' | 'Hybrid';
  bannerUrl: string;
  capacity: number;
  registeredCount: number;
  status: 'published' | 'draft' | 'completed' | 'cancelled';
  featured: boolean;
  tags: string[];
  requirements: string[];
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
    },
    shortDescription: {
      type: String,
      required: true,
    },
    club: {
      type: Schema.Types.ObjectId,
      ref: 'Club',
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['Technical', 'Cultural', 'Sports', 'Workshop', 'Hackathon', 'Seminar', 'Social'],
      default: 'Technical',
    },
    date: {
      type: String,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
      default: '10:00 AM',
    },
    endTime: {
      type: String,
      required: true,
      default: '04:00 PM',
    },
    venue: {
      type: String,
      required: true,
    },
    locationType: {
      type: String,
      enum: ['In-Person', 'Virtual', 'Hybrid'],
      default: 'In-Person',
    },
    bannerUrl: {
      type: String,
      required: true,
    },
    capacity: {
      type: Number,
      required: true,
      min: 1,
      default: 100,
    },
    registeredCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: ['published', 'draft', 'completed', 'cancelled'],
      default: 'published',
    },
    featured: {
      type: Boolean,
      default: false,
    },
    tags: {
      type: [String],
      default: [],
    },
    requirements: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

EventSchema.index({ date: 1, category: 1, status: 1 });

export const Event = mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema);
