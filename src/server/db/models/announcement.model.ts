import mongoose from 'mongoose';

export interface IAnnouncement {
  _id: string;
  title: string;
  content: string;
  type: 'info' | 'warning' | 'success' | 'urgent';
  targetAudience: 'all' | 'students' | 'corporate' | 'subadmin';
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date;
  isActive: boolean;
}

const announcementSchema = new mongoose.Schema<IAnnouncement>(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    type: {
      type: String,
      enum: ['info', 'warning', 'success', 'urgent'],
      default: 'info',
    },
    targetAudience: {
      type: String,
      enum: ['all', 'students', 'corporate', 'subadmin'],
      default: 'all',
    },
    createdBy: { type: String, required: true },
    expiresAt: { type: Date },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Announcement =
  mongoose.models.Announcement ||
  mongoose.model<IAnnouncement>('Announcement', announcementSchema);
