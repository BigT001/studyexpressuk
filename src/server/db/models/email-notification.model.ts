import mongoose from 'mongoose';

export interface IEmailNotification {
  _id: string;
  subject: string;
  htmlContent: string;
  recipients: string[]; // email addresses or 'all', 'students', 'corporate', 'subadmin'
  recipientCount?: number;
  sentAt: Date;
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed';
  failedCount?: number;
  successCount?: number;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const emailNotificationSchema = new mongoose.Schema<IEmailNotification>(
  {
    subject: { type: String, required: true, trim: true },
    htmlContent: { type: String, required: true },
    recipients: {
      type: [String],
      required: true,
      default: ['all'],
    },
    recipientCount: { type: Number, default: 0 },
    sentAt: { type: Date },
    status: {
      type: String,
      enum: ['draft', 'scheduled', 'sending', 'sent', 'failed'],
      default: 'draft',
    },
    failedCount: { type: Number, default: 0 },
    successCount: { type: Number, default: 0 },
    createdBy: { type: String, required: true },
  },
  { timestamps: true }
);

export const EmailNotification =
  mongoose.models.EmailNotification ||
  mongoose.model<IEmailNotification>('EmailNotification', emailNotificationSchema);
