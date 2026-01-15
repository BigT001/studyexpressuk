import { NextResponse } from 'next/server';
import { getServerAuthSession } from '@/server/auth/session';
import { connectToDatabase } from '@/server/db/mongoose';
import UserModel from '@/server/db/models/user.model';
import CourseModel from '@/server/db/models/course.model';
import EnrollmentModel from '@/server/db/models/enrollment.model';

export async function POST(req: Request) {
  try {
    const session: any = await getServerAuthSession();
    if (!session || !session.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const body = await req.json();
    const { courseId } = body;

    // Only courseId is required - user data comes from session
    if (!courseId) {
      return NextResponse.json({ success: false, error: 'Course ID is required' }, { status: 400 });
    }

    // Find user by ID from session
    const user = await UserModel.findById(session.user.id).lean();
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    // Find course
    const course = await CourseModel.findById(courseId).lean();
    if (!course) {
      return NextResponse.json({ success: false, error: 'Course not found' }, { status: 404 });
    }

    // Check if already enrolled
    const courseIdToUse = Array.isArray(course) ? course[0]?._id : course?._id;
    const existing = await EnrollmentModel.findOne({ userId: user._id, eventId: courseIdToUse });
    if (existing) {
      return NextResponse.json({ success: false, error: 'Already enrolled in this course' }, { status: 409 });
    }

    // Create enrollment using user data from session/database
    const enrollment = await EnrollmentModel.create({
      userId: user._id,
      eventId: courseIdToUse,
      status: 'enrolled',
      progress: 0,
      metadata: {
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        enrolledAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Enrollment successful',
      enrollment,
    });
  } catch (err: any) {
    console.error('Enrollment error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Enrollment failed' },
      { status: 500 }
    );
  }
}
