import { NextResponse } from 'next/server';
import { getServerAuthSession } from '@/server/auth/session';
import { connectToDatabase } from '@/server/db/mongoose';
import UserModel from '@/server/db/models/user.model';
import EventModel from '@/server/db/models/event.model';
import EnrollmentModel from '@/server/db/models/enrollment.model';

export async function POST(req: Request) {
  try {
    const session: any = await getServerAuthSession();
    if (!session || !session.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    await connectToDatabase();
    const body = await req.json();
    const { eventId } = body;
    
    // Only eventId is required - user data comes from session
    if (!eventId) {
      return NextResponse.json({ success: false, error: 'Event ID is required' }, { status: 400 });
    }

    // Find user by ID from session
    const user = await UserModel.findById(session.user.id).lean();
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    // Find event
    const event = await EventModel.findById(eventId).lean();
    if (!event) {
      return NextResponse.json({ success: false, error: 'Event not found' }, { status: 404 });
    }

    // Check if already registered
    const existing = await EnrollmentModel.findOne({ userId: user._id, eventId: event._id });
    if (existing) {
      return NextResponse.json({ success: false, error: 'Already registered' }, { status: 409 });
    }

    // Create enrollment
    await EnrollmentModel.create({
      userId: user._id,
      eventId: event._id,
      status: 'enrolled',
      progress: 0,
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Server error' }, { status: 500 });
  }
}
