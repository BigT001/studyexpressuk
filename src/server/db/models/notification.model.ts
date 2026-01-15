import mongoose, { Schema, Document } from 'mongoose';

export type NotificationStatus = 'unread' | 'read' | 'archived';

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId; // recipient
  type: string; // e.g., 'announcement', 'message', 'system'
  title?: string;
  body?: string;
  content?: string;
  priority?: 'normal' | 'high' | 'urgent';
  metadata?: Record<string, any>;
  status: NotificationStatus;
  readAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: { type: String, required: true },
    title: { type: String },
    body: { type: String },
    content: { type: String },
    priority: { type: String, enum: ['normal', 'high', 'urgent'], default: 'normal' },
    metadata: { type: Schema.Types.Mixed },
    status: { type: String, enum: ['unread', 'read', 'archived'], default: 'unread' },
    readAt: { type: Date },
  },
  { timestamps: true }
);

const NotificationModel =
  (mongoose.models.Notification as mongoose.Model<INotification>) ||
  mongoose.model<INotification>('Notification', NotificationSchema);

export default NotificationModel;
