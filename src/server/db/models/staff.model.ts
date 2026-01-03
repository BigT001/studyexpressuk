import mongoose, { Schema, Document } from 'mongoose';

export type StaffStatus = 'active' | 'inactive' | 'terminated';
export type StaffApprovalStatus = 'pending' | 'approved' | 'rejected';

export interface ICorporateStaff extends Document {
  userId: mongoose.Types.ObjectId; // reference to User
  corporateId: mongoose.Types.ObjectId; // reference to CorporateProfile
  role: string; // e.g., 'manager', 'trainer', 'admin'
  department?: string;
  joinDate?: Date;
  status: StaffStatus;
  // Approval workflow
  approvalStatus: StaffApprovalStatus;
  approvedBy?: mongoose.Types.ObjectId; // ref: User (SubAdmin)
  approvalDate?: Date;
  rejectionReason?: string;
  // Qualifications
  skills?: string[];
  certifications?: string[];
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const CorporateStaffSchema = new Schema<ICorporateStaff>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    corporateId: { type: Schema.Types.ObjectId, ref: 'CorporateProfile', required: true, index: true },
    role: { type: String, required: true },
    department: { type: String },
    joinDate: { type: Date },
    status: { type: String, enum: ['active', 'inactive', 'terminated'], default: 'active' },
    approvalStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    approvedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    approvalDate: { type: Date },
    rejectionReason: { type: String },
    skills: [{ type: String }],
    certifications: [{ type: String }],
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

const CorporateStaffModel =
  (mongoose.models.CorporateStaff as mongoose.Model<ICorporateStaff>) ||
  mongoose.model<ICorporateStaff>('CorporateStaff', CorporateStaffSchema);

export default CorporateStaffModel;
