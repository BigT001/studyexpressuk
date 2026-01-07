import { NextResponse } from 'next/server';
import { getServerAuthSession } from '@/server/auth/session';
import { connectToDatabase } from '@/server/db/mongoose';
import UserModel from '@/server/db/models/user.model';
import CourseModel from '@/server/db/models/course.model';
import EnrollmentModel from '@/server/db/models/enrollment.model';

export async function POST(req: Request) {
  try {
    const session: any = await getServerAuthSession();
    if (!session || !session.user?.email) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    await connectToDatabase();
    const body = await req.json();
    const { courseId, firstName, lastName, email, phone, location, referralCode } = body;
    if (!courseId || !firstName || !lastName || !email || !phone || !location) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }
    // Find user
    const user = await UserModel.findOne({ email }).lean();
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }
    // Find course
    const course = await CourseModel.findById(courseId).lean();
    if (!course) {
      return NextResponse.json({ success: false, error: 'Course not found' }, { status: 404 });
    }
    // Check if already enrolled
    // Defensive: course could be array or object, handle both
    const courseIdToUse = Array.isArray(course) ? course[0]?._id : course?._id;
    const existing = await EnrollmentModel.findOne({ userId: user._id, eventId: courseIdToUse });
    if (existing) {
      return NextResponse.json({ success: false, error: 'Already enrolled' }, { status: 409 });
    }
    // Create enrollment
    await EnrollmentModel.create({
      userId: user._id,
      eventId: courseIdToUse,
      status: 'enrolled',
      progress: 0,
      metadata: {
        firstName,
        lastName,
        phone,
        location,
        referralCode: referralCode || null
      }
    });
    return NextResponse.json({ success: true, message: 'Enrollment successful' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Enrollment failed' }, { status: 500 });
  }
}
