import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IMessage extends Document {
  sender: Types.ObjectId;
  receiver: Types.ObjectId;
  content: string;
  createdAt: Date;
  threadId: Types.ObjectId;
  isRead: boolean;
}

const MessageSchema = new Schema<IMessage>({
  sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  threadId: { type: Schema.Types.ObjectId, ref: 'Thread', required: false },
  isRead: { type: Boolean, default: false },
});

export default mongoose.models.Message || mongoose.model<IMessage>('Message', MessageSchema);
