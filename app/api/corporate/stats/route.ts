import { NextResponse } from 'next/server';
import { getServerAuthSession } from '@/server/auth/session';
import { connectToDatabase } from '@/server/db/mongoose';
import CorporateStaffModel from '@/server/db/models/staff.model';
import CourseModel from '@/server/db/models/course.model';
import EventModel from '@/server/db/models/event.model';
import EnrollmentModel from '@/server/db/models/enrollment.model';
import CorporateProfileModel from '@/server/db/models/corporate.model';

export async function GET() {
  try {
    const session = await getServerAuthSession();
    if (!session?.user?.id || session.user?.role !== 'CORPORATE') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectToDatabase();

    // Get corporate profile ID
    const corporateProfile = await CorporateProfileModel.findOne({
      ownerId: session.user.id,
    }).lean();

    if (!corporateProfile) {
      return NextResponse.json(
        {
          totalStaff: 0,
          activeCourses: 0,
          totalEvents: 0,
        }
      );
    }

    // Count total active staff for this corporate
    const totalStaff = await CorporateStaffModel.countDocuments({
      corporateId: corporateProfile._id,
      status: 'active',
      approvalStatus: 'approved',
    });

    // Count active courses
    const activeCourses = await CourseModel.countDocuments({
      status: { $in: ['active', 'published'] },
    });

    // Count active events for this corporate user
    // Get user's event enrollments
    const enrollments = await EnrollmentModel.find({
      userId: session.user.id
    }).lean();
    const eventIds = enrollments.map((e: any) => e.eventId);
    
    // Count all enrolled events (regardless of status)
    const totalEvents = await EventModel.countDocuments({
      _id: { $in: eventIds }
    });

    return NextResponse.json({
      totalStaff,
      activeCourses,
      totalEvents,
    });
  } catch (error) {
    console.error('Error fetching corporate stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
