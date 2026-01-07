import { connectToDatabase } from '../db/mongoose';
import User from '../db/models/user.model';

export async function getUserProfile(email: string) {
  await connectToDatabase();
  const user = await User.findOne({ email });
  if (!user) return null;
  return {
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    profileImage: user.profileImage || '',
    bio: user.bio || '',
  };
}
