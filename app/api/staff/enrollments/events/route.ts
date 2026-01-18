import { NextResponse } from 'next/server';
import { getServerAuthSession } from '@/server/auth/session';
import { connectToDatabase } from '@/server/db/mongoose';
import UserModel from '@/server/db/models/user.model';
import EnrollmentModel from '@/server/db/models/enrollment.model';
import EventModel from '@/server/db/models/event.model';

export async function GET(req: Request) {
  try {
    const session: any = await getServerAuthSession();
    if (!session || session.user?.role !== 'STAFF') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    const user = await UserModel.findById(session.user?.id);
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    // Get all event enrollments for this staff member
    const enrollments = await EnrollmentModel.find({ userId: user._id }).lean();
    
    // Filter for events only and populate event details
    const eventEnrollments = [];
    for (const enrollment of enrollments) {
      const event = await EventModel.findById(enrollment.eventId).lean();
      if (event) {
        eventEnrollments.push({
          ...enrollment,
          eventId: event,
        });
      }
    }

    return NextResponse.json({
      success: true,
      enrollments: eventEnrollments,
    });
  } catch (error) {
    console.error('Error fetching staff events:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch staff events' },
      { status: 500 }
    );
  }
}
