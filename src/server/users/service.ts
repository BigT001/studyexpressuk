import { connectToDatabase } from '../db/mongoose';
import UserModel, { IUser, UserRole } from '../db/models/user.model';
import bcrypt from 'bcryptjs';
import { messageService } from '../messages/service';

export async function createUser({ email, password, phone, role = UserRole.INDIVIDUAL, firstName = '', lastName = '' }: { email: string; password: string; phone?: string; role?: UserRole; firstName?: string; lastName?: string; }) {
  await connectToDatabase();
  const existing = await UserModel.findOne({ email }).lean();
  if (existing) throw new Error('Email already in use');
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  const user = await UserModel.create({ 
    email, 
    passwordHash: hash, 
    phone, 
    role, 
    firstName: firstName || '', 
    lastName: lastName || '' 
  });
  console.log('User created:', user._id, user.email);
  // Send welcome message from admin to new user
  try {
    // Find admin user
    const admin = await UserModel.findOne({ role: UserRole.ADMIN });
    console.log('Admin found:', admin ? admin._id : 'No admin found');
    const MessageModel = (await import('../db/models/message.model')).default;
    if (admin) {
      const msg = await MessageModel.create({
        senderId: admin._id,
        recipientId: user._id,
        content: 'Welcome to StudyExpress! Your account has been created successfully. Explore our courses and get started on your learning journey.',
      });
      console.log('Welcome message sent (private):', msg._id);
    } else {
      // Fallback: send with generic senderId if no admin found
      const msg = await MessageModel.create({
        senderId: null,
        recipientId: user._id,
        content: 'Welcome to StudyExpress! Your account has been created successfully. Explore our courses and get started on your learning journey.',
      });
      console.warn('No admin user found, sent welcome message with generic senderId:', msg._id);
    }
  } catch (e) {
    // Log but do not block user creation if message fails
    console.error('Failed to send welcome message:', e);
  }
  return user.toObject();
}

export async function listUsers(limit = 50) {
  await connectToDatabase();
  return UserModel.find().limit(limit).lean();
}
