import { connectToDatabase } from '../db/mongoose';
import UserModel, { IUser, UserRole } from '../db/models/user.model';
import bcrypt from 'bcryptjs';

export async function createUser({ email, password, phone, role = UserRole.INDIVIDUAL }: { email: string; password: string; phone?: string; role?: UserRole; }) {
  await connectToDatabase();
  const existing = await UserModel.findOne({ email }).lean();
  if (existing) throw new Error('Email already in use');
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  const user = await UserModel.create({ email, passwordHash: hash, phone, role });
  return user.toObject();
}

export async function listUsers(limit = 50) {
  await connectToDatabase();
  return UserModel.find().limit(limit).lean();
}
