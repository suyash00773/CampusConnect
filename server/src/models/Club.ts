import mongoose, { Document, Schema } from 'mongoose';

export interface IClubSocials {
  instagram?: string;
  linkedin?: string;
  github?: string;
  website?: string;
}

export interface IClub extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  category: string;
  description: string;
  logoUrl: string;
  bannerUrl: string;
  leadName: string;
  leadEmail: string;
  memberCount: number;
  isFeatured: boolean;
  socialLinks: IClubSocials;
  createdAt: Date;
  updatedAt: Date;
}

const ClubSchema = new Schema<IClub>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        'Technology & Coding',
        'Arts & Culture',
        'Robotics & AI',
        'Entrepreneurship & Business',
        'Sports & Fitness',
        'Literature & Debate',
        'Social & Environmental',
      ],
      default: 'Technology & Coding',
    },
    description: {
      type: String,
      required: true,
    },
    logoUrl: {
      type: String,
      default: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=200&auto=format&fit=crop&q=80',
    },
    bannerUrl: {
      type: String,
      default: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&auto=format&fit=crop&q=80',
    },
    leadName: {
      type: String,
      required: true,
    },
    leadEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    memberCount: {
      type: Number,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    socialLinks: {
      instagram: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      github: { type: String, default: '' },
      website: { type: String, default: '' },
    },
  },
  {
    timestamps: true,
  }
);

export const Club = mongoose.models.Club || mongoose.model<IClub>('Club', ClubSchema);
