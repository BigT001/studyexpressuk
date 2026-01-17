import { NextResponse } from 'next/server';
import { getServerAuthSession } from '@/server/auth/session';
import { connectToDatabase } from '@/server/db/mongoose';
import UserModel from '@/server/db/models/user.model';
import IndividualProfileModel from '@/server/db/models/individualProfile.model';
import CorporateProfileModel from '@/server/db/models/corporate.model';
import EnrollmentModel from '@/server/db/models/enrollment.model';
import EventModel from '@/server/db/models/event.model';
import CourseModel from '@/server/db/models/course.model';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerAuthSession();
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }
    await connectToDatabase();
    const user = await UserModel.findById(id).lean();
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }
    let profile = null;
    if (user.role === 'INDIVIDUAL') {
      profile = await IndividualProfileModel.findOne({ userId: user._id }).lean();
    } else if (user.role === 'CORPORATE') {
      profile = await CorporateProfileModel.findOne({ ownerId: user._id }).lean();
    }
    // Enrollments (courses/events)
    const enrollments = await EnrollmentModel.find({ userId: user._id }).lean();
    // Get event/course details for each enrollment
    const eventIds = enrollments.map(e => e.eventId);
    const events = await EventModel.find({ _id: { $in: eventIds } }).lean();
    const courses = await CourseModel.find({ _id: { $in: eventIds } }).lean();
    return NextResponse.json({
      success: true,
      user,
      profile,
      enrollments,
      events,
      courses
    });
  } catch (err) {
    console.error('Error fetching user details:', err);
    return NextResponse.json({ success: false, error: 'Failed to fetch user details' }, { status: 500 });
  }
}
