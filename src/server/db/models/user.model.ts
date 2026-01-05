import mongoose, { Schema, Document } from 'mongoose';

export enum UserRole {
  INDIVIDUAL = 'INDIVIDUAL',
  CORPORATE = 'CORPORATE',
  SUB_ADMIN = 'SUB_ADMIN',
  ADMIN = 'ADMIN',
}

export type UserStatus = 'subscribed' | 'not-subscribed';

export interface IUser extends Document {
  email: string;
  phone?: string;
  passwordHash: string;
  role: UserRole;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    phone: { type: String, required: false },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: Object.values(UserRole), default: UserRole.INDIVIDUAL },
    status: { type: String, enum: ['subscribed', 'not-subscribed'], default: 'not-subscribed' },
  },
  { timestamps: true }
);

const UserModel = (mongoose.models.User as mongoose.Model<IUser>) || mongoose.model<IUser>('User', UserSchema);
export default UserModel;
