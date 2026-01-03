import mongoose, { Schema, Document } from 'mongoose';

export type PaymentStatus = 'pending' | 'succeeded' | 'failed' | 'refunded';
export type PaymentSubjectType = 'USER' | 'CORPORATE';

export interface IPayment extends Document {
  subjectType: PaymentSubjectType;
  subjectId: mongoose.Types.ObjectId; // userId or corporateId
  stripeSessionId?: string;
  amount: number; // smallest currency unit (e.g., cents)
  currency: string;
  status: PaymentStatus;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    subjectType: { type: String, enum: ['USER', 'CORPORATE'], required: true },
    subjectId: { type: Schema.Types.ObjectId, required: true, index: true },
    stripeSessionId: { type: String },
    amount: { type: Number, required: true },
    currency: { type: String, required: true, default: 'usd' },
    status: { type: String, enum: ['pending', 'succeeded', 'failed', 'refunded'], default: 'pending' },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

const PaymentModel = (mongoose.models.Payment as mongoose.Model<IPayment>) || mongoose.model<IPayment>('Payment', PaymentSchema);
export default PaymentModel;
