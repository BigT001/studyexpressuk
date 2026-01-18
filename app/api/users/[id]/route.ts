import { NextResponse, NextRequest } from 'next/server';
import { getServerAuthSession } from '@/server/auth/session';
import { connectToDatabase } from '@/server/db/mongoose';
import UserModel from '@/server/db/models/user.model';
import IndividualProfileModel from '@/server/db/models/individualProfile.model';
import CorporateProfileModel from '@/server/db/models/corporate.model';
import CorporateStaffModel from '@/server/db/models/staff.model';
import EnrollmentModel from '@/server/db/models/enrollment.model';
import EventModel from '@/server/db/models/event.model';
import CourseModel from '@/server/db/models/course.model';
import MembershipModel from '@/server/db/models/membership.model';
import MessageModel from '@/server/db/models/message.model';
import { getEngagementSummary, updateUserActivity } from '@/server/utils/login-tracker';

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

// Enhanced GET with comprehensive data for admin dashboard
export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerAuthSession();
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }
    
    // Track admin's activity
    try {
      updateUserActivity((session.user as any).id, false).catch(() => {
        // Silently fail - don't block the request
      });
    } catch (err) {
      console.error('[ActivityTracking] Error:', err);
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

    // Enrollments with detailed progress information
    // Note: eventId can point to either Event or Course collection
    const enrollments = await EnrollmentModel.find({ userId: user._id }).lean();

    // Separate events and courses by checking which collection eventId belongs to
    // Events and Courses are stored in different collections
    let events: any[] = [];
    let courses: any[] = [];
    
    if (enrollments.length > 0) {
      const eventIds = enrollments.map((e: any) => e.eventId).filter(Boolean);
      
      // Query both collections to see which IDs belong where
      const eventDocs = await EventModel.find({ _id: { $in: eventIds } })
        .select('_id title description imageUrl status startDate endDate')
        .lean();
      const courseDocs = await CourseModel.find({ _id: { $in: eventIds } })
        .select('_id title description imageUrl status duration')
        .lean();
      
      const eventDocIds = new Set(eventDocs.map((e: any) => e._id.toString()));
      const courseDocIds = new Set(courseDocs.map((c: any) => c._id.toString()));
      
      // Enrich enrollments with the actual event/course data
      events = enrollments
        .filter((e: any) => eventDocIds.has(e.eventId?.toString()))
        .map((e: any) => ({
          ...e,
          eventId: eventDocs.find((ed: any) => ed._id.toString() === e.eventId.toString())
        }));
      
      courses = enrollments
        .filter((e: any) => courseDocIds.has(e.eventId?.toString()))
        .map((e: any) => ({
          ...e,
          eventId: courseDocs.find((cd: any) => cd._id.toString() === e.eventId.toString())
        }));
    }

    // Membership information
    const membership = await MembershipModel.findOne({ userId: user._id })
      .sort({ createdAt: -1 })
      .lean();

    // Calculate engagement metrics using utility function
    const engagement = getEngagementSummary(user);

    // Calculate completion rates for courses/events
    const completionStats = {
      enrolledCount: enrollments.length,
      completedCount: enrollments.filter((e: any) => e.status === 'completed').length,
      inProgressCount: enrollments.filter((e: any) => e.status === 'in_progress').length,
      completionRate: enrollments.length > 0 
        ? Math.round((enrollments.filter((e: any) => e.status === 'completed').length / enrollments.length) * 100)
        : 0
    };

    // Get corporate team info if corporate user with ENHANCED data
    let corporateTeam: any = null;
    let corporateStats: any = null;
    if (user.role === 'CORPORATE' && profile) {
      // Find all STAFF members related to this corporate using CorporateStaffModel
      const corporateStaffRecords = await CorporateStaffModel.find({ 
        corporateId: (profile as any)._id 
      })
        .populate('userId', '_id email firstName lastName role status createdAt')
        .lean();

      // Extract and map staff info
      corporateTeam = corporateStaffRecords.map((record: any) => ({
        _id: record.userId._id,
        email: record.userId.email,
        firstName: record.userId.firstName,
        lastName: record.userId.lastName,
        role: record.userId.role,
        status: record.userId.status,
        createdAt: record.userId.createdAt,
        staffRole: record.role,
        department: record.department,
        joinDate: record.joinDate,
        approvalStatus: record.approvalStatus
      }));

      // If no staff found, use empty array
      if (!corporateTeam) {
        corporateTeam = [];
      }

      // Get detailed enrollment data for each team member
      const teamMemberIds = corporateTeam.map((member: any) => member._id);
      const staffEnrollments = await EnrollmentModel.find({ userId: { $in: teamMemberIds } }).lean();

      // Build maps of which IDs belong to events vs courses
      const staffEventIds = staffEnrollments.map((e: any) => e.eventId).filter(Boolean);
      const eventDocs = await EventModel.find({ _id: { $in: staffEventIds } })
        .select('_id title description imageUrl status startDate endDate')
        .lean();
      const courseDocs = await CourseModel.find({ _id: { $in: staffEventIds } })
        .select('_id title description imageUrl status duration')
        .lean();
      
      const eventDocIds = new Set(eventDocs.map((e: any) => e._id.toString()));
      const courseDocIds = new Set(courseDocs.map((c: any) => c._id.toString()));

      // Enrich enrollments with full event/course data
      const enrichedStaffEnrollments = staffEnrollments.map((enrollment: any) => {
        const eventIdStr = enrollment.eventId?.toString();
        if (eventDocIds.has(eventIdStr)) {
          return {
            ...enrollment,
            eventId: eventDocs.find((e: any) => e._id.toString() === eventIdStr),
            type: 'event'
          };
        } else if (courseDocIds.has(eventIdStr)) {
          return {
            ...enrollment,
            eventId: courseDocs.find((c: any) => c._id.toString() === eventIdStr),
            type: 'course'
          };
        }
        return enrollment;
      });

      // Enrich team members with their enrollment data
      corporateTeam = corporateTeam.map((member: any) => {
        const memberEnrollments = enrichedStaffEnrollments.filter((e: any) => e.userId.toString() === member._id.toString());
        
        // Separate member's courses and events based on type
        const memberCourses = memberEnrollments.filter((e: any) => e.type === 'course');
        const memberEvents = memberEnrollments.filter((e: any) => e.type === 'event');
        const completedEnrollments = memberEnrollments.filter((e: any) => e.status === 'completed');
        
        return {
          ...member,
          enrollments: memberEnrollments,
          courses: memberCourses,
          events: memberEvents,
          stats: {
            totalEnrolled: memberEnrollments.length,
            totalCourses: memberCourses.length,
            totalEvents: memberEvents.length,
            completed: completedEnrollments.length,
            inProgress: memberEnrollments.filter((e: any) => e.status === 'in_progress').length,
            completionRate: memberEnrollments.length > 0 
              ? Math.round((completedEnrollments.length / memberEnrollments.length) * 100)
              : 0
          }
        };
      });

      // Corporate-wide statistics - fetch the CORPORATE USER's own enrollments
      // These are courses/events the corporation itself has enrolled in
      // courses and events were already separated above using collection queries
      
      corporateStats = {
        totalStaff: corporateTeam.length,
        totalCourses: courses.length,
        totalEvents: events.length,
        totalEnrollments: enrollments.length,
        averageCompletionRate: corporateTeam.length > 0
          ? Math.round(corporateTeam.reduce((sum: number, member: any) => sum + member.stats.completionRate, 0) / corporateTeam.length)
          : 0,
        staffCoursesBreakdown: corporateTeam.map((member: any) => ({
          name: `${member.firstName} ${member.lastName}`,
          totalCourses: member.stats.totalCourses,
          completedCourses: member.courses.filter((c: any) => c.status === 'completed').length,
          inProgressCourses: member.courses.filter((c: any) => c.status === 'in_progress').length,
        }))
      };
    }

    // Get staff content info if staff user
    let staffContent = null;
    let staffCorporation = null;
    if (user.role === 'STAFF') {
      const createdEvents = await EventModel.countDocuments({ createdBy: user._id });
      const createdCourses = await CourseModel.countDocuments({ createdBy: user._id });
      staffContent = {
        eventsCreated: createdEvents,
        coursesCreated: createdCourses
      };

      // Find the corporation this staff member belongs to
      const staffRecord = await CorporateStaffModel.findOne({ userId: user._id })
        .populate('corporateId')
        .lean();
      
      if (staffRecord && staffRecord.corporateId) {
        const corpProfile = await CorporateProfileModel.findOne({ _id: (staffRecord as any).corporateId })
          .lean();
        staffCorporation = {
          _id: (staffRecord as any).corporateId,
          name: corpProfile?.companyName || 'Unknown',
          logo: corpProfile?.logo,
          staffRole: staffRecord.role,
          department: staffRecord.department,
          joinDate: staffRecord.joinDate,
          approvalStatus: staffRecord.approvalStatus
        };
      }
    }

    return NextResponse.json({
      success: true,
      user,
      profile,
      enrollments,
      events,
      courses,
      membership,
      completionStats,
      engagement,
      corporateTeam,
      corporateStats,
      staffContent,
      staffCorporation
    });
  } catch (err) {
    console.error('Error fetching user details:', err);
    return NextResponse.json({ success: false, error: 'Failed to fetch user details' }, { status: 500 });
  }
}
