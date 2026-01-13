import mongoose, { Schema, Document } from 'mongoose';

export type CorporateStatus = 'pending' | 'verified' | 'active' | 'suspended';

export interface ICorporateProfile extends Document {
  ownerId: mongoose.Types.ObjectId; // user who owns the corporate account
  companyName: string;
  address?: string;
  website?: string;
  logo?: string; // Cloudinary URL
  industry?: string; // e.g., 'Technology', 'Finance', 'Healthcare'
  employeeCount?: number;
  registrationNumber?: string; // Company registration number
  taxId?: string; // Tax identification
  registeredCourses?: mongoose.Types.ObjectId[]; // ref: Course (courses registered by this corporate)
  status: CorporateStatus;
  approvedBy?: mongoose.Types.ObjectId; // ref: User (SubAdmin/Admin)
  approvalDate?: Date;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const CorporateProfileSchema = new Schema<ICorporateProfile>(
  {
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    companyName: { type: String, required: true },
    address: { type: String },
    website: { type: String },
    logo: { type: String },
    industry: { type: String },
    employeeCount: { type: Number },
    registrationNumber: { type: String },
    taxId: { type: String },
    registeredCourses: [{ type: Schema.Types.ObjectId, ref: 'Course' }],
    status: { type: String, enum: ['pending', 'verified', 'active', 'suspended'], default: 'pending' },
    approvedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    approvalDate: { type: Date },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

const CorporateProfileModel =
  (mongoose.models.CorporateProfile as mongoose.Model<ICorporateProfile>) ||
  mongoose.model<ICorporateProfile>('CorporateProfile', CorporateProfileSchema);

export default CorporateProfileModel;
