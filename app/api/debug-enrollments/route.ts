import { NextRequest, NextResponse } from 'next/server';
import Enrollment from '@/server/db/models/enrollment.model';
import User from '@/server/db/models/user.model';
import { connectToDatabase } from '@/server/db/mongoose';

export async function GET(req: NextRequest) {
  await connectToDatabase();
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');
  if (!email) {
    return NextResponse.json({ error: 'Missing email' }, { status: 400 });
  }
  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  const enrollments = await Enrollment.find({ userId: user._id });
  return NextResponse.json({ count: enrollments.length, enrollments });
}
