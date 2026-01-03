import mongoose, { Schema, Document } from 'mongoose';

export type NotificationStatus = 'unread' | 'read' | 'archived';

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId; // recipient
  type: string; // e.g., 'membership', 'message', 'system'
  title?: string;
  body?: string;
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
