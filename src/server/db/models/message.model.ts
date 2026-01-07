import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
  senderId: mongoose.Types.ObjectId;
  recipientId: mongoose.Types.ObjectId;
  content: string;
  metadata?: Record<string, any>;
  readAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IGroupMessage extends Document {
  subject: string;
  body: string;
  senderName: string;
  recipientGroups: string[];
  status: 'draft' | 'scheduled' | 'sent' | 'failed';
  sentAt?: Date;
  recipientCount?: number;
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    recipientId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    content: { type: String, required: true },
    metadata: { type: Schema.Types.Mixed },
    readAt: { type: Date },
  },
  { timestamps: true }
);

const GroupMessageSchema = new Schema<IGroupMessage>(
  {
    subject: { type: String, required: true },
    body: { type: String, required: true },
    senderName: { type: String, required: true },
    recipientGroups: [{ type: String, enum: ['all', 'students', 'corporate', 'subadmin'] }],
    status: { type: String, enum: ['draft', 'scheduled', 'sent', 'failed'], default: 'draft' },
    sentAt: { type: Date },
    recipientCount: { type: Number, default: 0 },
    createdBy: { type: String },
  },
  { timestamps: true }
);

const MessageModel = (mongoose.models.Message as mongoose.Model<IMessage>) || mongoose.model<IMessage>('Message', MessageSchema);
const GroupMessage = (mongoose.models.GroupMessage as mongoose.Model<IGroupMessage>) || mongoose.model<IGroupMessage>('GroupMessage', GroupMessageSchema);

export { GroupMessage };
export default MessageModel;
