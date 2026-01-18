import mongoose, { Schema, Document } from 'mongoose';

export enum UserRole {
  INDIVIDUAL = 'INDIVIDUAL',
  CORPORATE = 'CORPORATE',
  SUB_ADMIN = 'SUB_ADMIN',
  ADMIN = 'ADMIN',
  STAFF = 'STAFF',
}

export type UserStatus = 'subscribed' | 'not-subscribed';

export interface IUser extends Document {
  email: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  dob?: Date;
  bio?: string;
  interests?: string;
  qualifications?: string;
  profileImage?: string;
  password: string;
  passwordHash?: string;
  role: UserRole;
  status: UserStatus;
  lastLogin?: Date;
  lastActivity?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    phone: { type: String, required: false },
    firstName: { type: String, required: false },
    lastName: { type: String, required: false },
    dob: { type: Date, required: false },
    bio: { type: String, required: false, maxlength: 500 },
    interests: { type: String, required: false },
    qualifications: { type: String, required: false },
    profileImage: { type: String, required: false },
    password: { type: String, required: false },
    passwordHash: { type: String, required: false },
    role: { type: String, enum: Object.values(UserRole), default: UserRole.INDIVIDUAL },
    status: { type: String, enum: ['subscribed', 'not-subscribed'], default: 'not-subscribed' },
    lastLogin: { type: Date, required: false },
    lastActivity: { type: Date, required: false },
  },
  { timestamps: true }
);

const UserModel = (mongoose.models.User as mongoose.Model<IUser>) || mongoose.model<IUser>('User', UserSchema);
export default UserModel;
