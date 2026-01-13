import { NextRequest, NextResponse } from 'next/server';
import { getServerAuthSession } from '@/server/auth/session';
import { connectToDatabase } from '@/server/db/mongoose';
import EnrollmentModel from '@/server/db/models/enrollment.model';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerAuthSession();

    if (!session || session.user?.role !== 'STAFF') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    // Fetch all course enrollments for this staff member
    const enrollments = await EnrollmentModel.find({
      userId: session.user.id,
      type: 'course',
    })
      .populate('eventId', 'title description')
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, enrollments });
  } catch (error) {
    console.error('Error fetching course enrollments:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
