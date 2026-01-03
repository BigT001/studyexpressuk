import mongoose, { Schema, Document } from 'mongoose';

export enum SubAdminPermissionLevel {
  FULL_ADMIN = 'FULL_ADMIN',
  CONTENT_ADMIN = 'CONTENT_ADMIN',
  USER_ADMIN = 'USER_ADMIN',
}

export interface ISubAdmin extends Document {
  userId: mongoose.Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  permissionLevel: SubAdminPermissionLevel;
  permissions: {
    manageEvents: boolean;
    manageCourses: boolean;
    manageContent: boolean;
    manageUsers: boolean;
    manageMemberships: boolean;
    viewAnalytics: boolean;
    managePayments: boolean;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SubAdminSchema = new Schema<ISubAdmin>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    permissionLevel: {
      type: String,
      enum: Object.values(SubAdminPermissionLevel),
      default: SubAdminPermissionLevel.USER_ADMIN,
      required: true,
    },
    permissions: {
      manageEvents: { type: Boolean, default: false },
      manageCourses: { type: Boolean, default: false },
      manageContent: { type: Boolean, default: false },
      manageUsers: { type: Boolean, default: false },
      manageMemberships: { type: Boolean, default: false },
      viewAnalytics: { type: Boolean, default: false },
      managePayments: { type: Boolean, default: false },
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const SubAdminModel = (mongoose.models.SubAdmin as mongoose.Model<ISubAdmin>) || mongoose.model<ISubAdmin>('SubAdmin', SubAdminSchema);
export default SubAdminModel;
