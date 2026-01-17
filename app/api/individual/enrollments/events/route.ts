import { NextResponse } from 'next/server';
import { getServerAuthSession } from '@/server/auth/session';
import { connectToDatabase } from '@/server/db/mongoose';
import UserModel from '@/server/db/models/user.model';
import EnrollmentModel from '@/server/db/models/enrollment.model';
import EventModel from '@/server/db/models/event.model';

export async function GET(req: Request) {
  try {
    const session: any = await getServerAuthSession();
    if (!session || !session.user?.email) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const user = await UserModel.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    // Get all enrollments for this user
    const enrollments = await EnrollmentModel.find({ userId: user._id }).lean();
    
    // Filter for events only by checking if eventId exists in EventModel
    const eventEnrollments = [];
    for (const enrollment of enrollments) {
      const event = await EventModel.findById(enrollment.eventId).lean();
      if (event) {
        eventEnrollments.push({
          ...enrollment,
          event: event,
        });
      }
    }

    return NextResponse.json({
      success: true,
      enrollments: eventEnrollments || [],
    });
  } catch (error) {
    console.error('Error fetching event registrations:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch event registrations' },
      { status: 500 }
    );
  }
}
