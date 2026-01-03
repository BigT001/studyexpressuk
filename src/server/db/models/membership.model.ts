import mongoose, { Schema, Document } from 'mongoose';

export type MembershipStatus = 'active' | 'inactive' | 'cancelled' | 'expired' | 'pending';
export type MembershipSubjectType = 'USER' | 'CORPORATE';

export interface IMembership extends Document {
  subjectType: MembershipSubjectType;
  subjectId: mongoose.Types.ObjectId; // userId or corporateId
  planId: string; // reference to plan (string for now)
  status: MembershipStatus;
  startDate?: Date;
  endDate?: Date;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const MembershipSchema = new Schema<IMembership>(
  {
    subjectType: { type: String, enum: ['USER', 'CORPORATE'], required: true },
    subjectId: { type: Schema.Types.ObjectId, required: true, index: true },
    planId: { type: String, required: true },
    status: { type: String, enum: ['active', 'inactive', 'cancelled', 'expired', 'pending'], default: 'pending' },
    startDate: { type: Date },
    endDate: { type: Date },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

const MembershipModel = (mongoose.models.Membership as mongoose.Model<IMembership>) || mongoose.model<IMembership>('Membership', MembershipSchema);
export default MembershipModel;
