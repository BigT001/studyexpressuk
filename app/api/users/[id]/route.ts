export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Require admin role
    const session = await getServerAuthSession() as { user: { role: string } } | null;
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }
    const { id } = await params;
    await connectToDatabase();
    const user = await UserModel.findByIdAndDelete(id).lean().maxTimeMS(30000);
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }
    // Delete all sessions for this user (force logout)
    const mongoose = (await import('mongoose')).default;
    if (mongoose.connection.collections['sessions']) {
      await mongoose.connection.collections['sessions'].deleteMany({ userId: user._id });
    }
    // Optionally, delete related data (profiles, enrollments, etc.) here
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error('Error deleting user:', err);
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Failed to delete user' },
      { status: 500 }
    );
  }
}
import IndividualProfileModel from '@/server/db/models/individualProfile.model';
import CorporateProfileModel from '@/server/db/models/corporate.model';
import EnrollmentModel from '@/server/db/models/enrollment.model';
import EventModel from '@/server/db/models/event.model';
import CourseModel from '@/server/db/models/course.model';
export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerAuthSession();
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }
    await connectToDatabase();
    const { id } = await context.params;
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
import { NextResponse, NextRequest } from 'next/server';
import { getServerAuthSession } from '@/server/auth/session';
import { connectToDatabase } from '@/server/db/mongoose';
import UserModel from '@/server/db/models/user.model';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Require admin role
    const session = await getServerAuthSession() as { user: { role: string } } | null;
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();
    const { status } = body;

    if (!status || !['subscribed', 'not-subscribed'].includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid status' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const user = await UserModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).lean().maxTimeMS(30000);

    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, user });
  } catch (err: unknown) {
    console.error('Error updating user:', err);
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Failed to update user' },
      { status: 500 }
    );
  }
}
