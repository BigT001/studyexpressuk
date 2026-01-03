import mongoose, { Schema, Document } from 'mongoose';

export type EventAccess = 'free' | 'premium' | 'corporate';
export type EventType = 'event' | 'course';
export type EventStatus = 'draft' | 'published' | 'active' | 'completed' | 'cancelled';

export interface IEvent extends Document {
  title: string;
  description?: string;
  type: EventType;
  category?: string; // e.g., 'technology', 'business', 'health'
  access: EventAccess;
  startDate?: Date;
  endDate?: Date;
  maxCapacity?: number;
  currentEnrollment?: number;
  location?: string; // Physical or virtual location
  instructor?: mongoose.Types.ObjectId; // ref: User
  imageUrl?: string; // Cloudinary URL
  status: EventStatus;
  featured?: boolean;
  createdBy?: mongoose.Types.ObjectId;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true },
    description: { type: String },
    type: { type: String, enum: ['event', 'course'], default: 'event' },
    category: { type: String },
    access: { type: String, enum: ['free', 'premium', 'corporate'], default: 'free' },
    startDate: { type: Date },
    endDate: { type: Date },
    maxCapacity: { type: Number },
    currentEnrollment: { type: Number, default: 0 },
    location: { type: String },
    instructor: { type: Schema.Types.ObjectId, ref: 'User' },
    imageUrl: { type: String },
    status: { type: String, enum: ['draft', 'published', 'active', 'completed', 'cancelled'], default: 'draft' },
    featured: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

const EventModel = (mongoose.models.Event as mongoose.Model<IEvent>) || mongoose.model<IEvent>('Event', EventSchema);
export default EventModel;
