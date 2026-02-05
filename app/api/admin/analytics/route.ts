import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../src/server/auth/session';
import mongoose from 'mongoose';
import UserModel from '@/server/db/models/user.model';
import EnrollmentModel from '@/server/db/models/enrollment.model';
import MembershipModel from '@/server/db/models/membership.model';
import CorporateProfileModel from '@/server/db/models/corporate.model';
import CorporateStaffModel from '@/server/db/models/staff.model';
import CourseModel from '@/server/db/models/course.model';
import EventModel from '@/server/db/models/event.model';

// Check for admin or subadmin role
async function isAdmin(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    return session?.user?.role === 'ADMIN' || session?.user?.role === 'SUB_ADMIN';
  } catch {
    return false;
  }
}

export async function GET(req: NextRequest) {
  try {
    if (!(await isAdmin(req))) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const metric = searchParams.get('metric');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const dateFilter = {
      ...(startDate || endDate ? {
        createdAt: {
          ...(startDate && { $gte: new Date(startDate) }),
          ...(endDate && { $lte: new Date(endDate) }),
        },
      } : {}),
    };

    // ===== PLATFORM OVERVIEW METRICS =====
    if (metric === 'overview' || !metric) {
      // Exclude admin and sub-admin users
      const totalUsers = await UserModel.countDocuments({ role: { $nin: ['ADMIN', 'SUB_ADMIN'] } });
      const totalSubscribed = await UserModel.countDocuments({ role: { $nin: ['ADMIN', 'SUB_ADMIN'] }, status: 'subscribed' });
      const usersByRole = await UserModel.aggregate([
        { $match: { role: { $nin: ['ADMIN', 'SUB_ADMIN'] } } },
        { $group: { _id: '$role', count: { $sum: 1 } } },
      ]);

      // Active users (last 7 days) - excluding admin and sub-admin
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const activeUsersLastWeek = await UserModel.countDocuments({
        role: { $nin: ['ADMIN', 'SUB_ADMIN'] },
        lastActivity: { $gte: sevenDaysAgo },
      });

      // Active users today - excluding admin and sub-admin
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const activeUsersToday = await UserModel.countDocuments({
        role: { $nin: ['ADMIN', 'SUB_ADMIN'] },
        lastActivity: { $gte: today },
      });

      // New users this month - excluding admin and sub-admin
      const monthStart = new Date();
      monthStart.setDate(1);
      monthStart.setHours(0, 0, 0, 0);
      const newUsersThisMonth = await UserModel.countDocuments({
        role: { $nin: ['ADMIN', 'SUB_ADMIN'] },
        createdAt: { $gte: monthStart },
      });

      // New users this year - excluding admin and sub-admin
      const yearStart = new Date();
      yearStart.setMonth(0);
      yearStart.setDate(1);
      yearStart.setHours(0, 0, 0, 0);
      const newUsersThisYear = await UserModel.countDocuments({
        role: { $nin: ['ADMIN', 'SUB_ADMIN'] },
        createdAt: { $gte: yearStart },
      });

      // Membership Statistics - Count actual users excluding admin/subadmin
      // Currently all users are unpaid since payment system is not yet implemented
      const totalIndividualUsers = await UserModel.countDocuments({ role: { $nin: ['ADMIN', 'SUB_ADMIN'] } });
      const paidIndividualUsers = 0; // No payment system yet
      const unpaidIndividualUsers = totalIndividualUsers;

      const corporateUsers = await UserModel.countDocuments({ role: 'CORPORATE' });
      const paidCorporateUsers = 0; // No payment system yet
      const unpaidCorporateUsers = corporateUsers;

      return NextResponse.json({
        success: true,
        data: {
          overview: {
            totalUsers,
            totalSubscribed,
            subscriptionRate: totalUsers > 0 ? ((totalSubscribed / totalUsers) * 100).toFixed(2) : 0,
            activeUsersToday,
            activeUsersLastWeek,
            newUsersThisMonth,
            newUsersThisYear,
            usersByRole,
            memberships: {
              users: {
                total: totalIndividualUsers,
                paid: paidIndividualUsers,
                unpaid: unpaidIndividualUsers,
              },
              corporates: {
                total: corporateUsers,
                paid: paidCorporateUsers,
                unpaid: unpaidCorporateUsers,
              },
            },
          },
        },
      });
    }

    // ===== COURSE ANALYTICS =====
    if (metric === 'courses') {
      // Total courses - count ALL courses regardless of status
      const totalCourses = await CourseModel.countDocuments({});

      // Get all courses with enrollment and price data
      const allCourses = await CourseModel.aggregate([
        {
          $lookup: {
            from: 'enrollments',
            let: { courseId: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ['$eventId', '$$courseId'] },
                  type: 'course'
                }
              }
            ],
            as: 'enrollmentData'
          }
        },
        {
          $addFields: {
            totalEnrollments: { $size: '$enrollmentData' },
            completedEnrollments: {
              $size: {
                $filter: {
                  input: '$enrollmentData',
                  as: 'e',
                  cond: { $eq: ['$$e.status', 'completed'] }
                }
              }
            },
            inProgressEnrollments: {
              $size: {
                $filter: {
                  input: '$enrollmentData',
                  as: 'e',
                  cond: { $eq: ['$$e.status', 'in_progress'] }
                }
              }
            },
            avgProgress: { $avg: '$enrollmentData.progress' },
            isPaid: { $gt: [{ $ifNull: ['$price', 0] }, 0] },
            totalRevenue: { $cond: [{ $gt: [{ $ifNull: ['$price', 0] }, 0] }, { $multiply: [{ $ifNull: ['$price', 0] }, '$totalEnrollments'] }, 0] },
          }
        },
        { $sort: { totalEnrollments: -1 } }
      ]);

      // Separate paid and free courses
      const paidCourses = allCourses.filter(c => c.isPaid).length;
      const freeCourses = totalCourses - paidCourses;

      // Calculate aggregated metrics
      const totalEnrollments = allCourses.reduce((sum, c) => sum + c.totalEnrollments, 0);
      const completedEnrollments = allCourses.reduce((sum, c) => sum + c.completedEnrollments, 0);
      const totalRevenue = allCourses.reduce((sum, c) => sum + (c.totalRevenue || 0), 0);

      const completionRate = totalEnrollments > 0
        ? ((completedEnrollments / totalEnrollments) * 100).toFixed(2)
        : 0;

      // Paid course metrics
      const paidCourseRevenue = allCourses
        .filter(c => c.isPaid)
        .reduce((sum, c) => sum + (c.totalRevenue || 0), 0);

      const paidCourseEnrollments = allCourses
        .filter(c => c.isPaid)
        .reduce((sum, c) => sum + c.totalEnrollments, 0);

      // Get top 15 courses with complete stats
      const topCourses = allCourses.slice(0, 15).map(course => ({
        id: course._id?.toString() || '',
        title: course.title,
        category: course.category || 'Uncategorized',
        level: course.level || 'beginner',
        price: course.price || 0,
        enrollments: course.totalEnrollments,
        completed: course.completedEnrollments,
        inProgress: course.inProgressEnrollments,
        avgProgress: (course.avgProgress || 0).toFixed(1),
        revenue: course.totalRevenue || 0,
        completionRate: course.totalEnrollments > 0
          ? ((course.completedEnrollments / course.totalEnrollments) * 100).toFixed(1)
          : 0,
        enrollmentRate: totalEnrollments > 0
          ? ((course.totalEnrollments / totalEnrollments) * 100).toFixed(1)
          : 0
      }));

      // Price distribution analysis
      const priceRanges = {
        free: allCourses.filter(c => !c.isPaid).length,
        lowPrice: allCourses.filter(c => c.price > 0 && c.price <= 50).length,
        mediumPrice: allCourses.filter(c => c.price > 50 && c.price <= 150).length,
        highPrice: allCourses.filter(c => c.price > 150).length,
      };

      return NextResponse.json({
        success: true,
        data: {
          courses: {
            totalCourses,
            paidCourses,
            freeCourses,
            totalEnrollments,
            completedEnrollments,
            completionRate,
            totalRevenue: parseFloat(totalRevenue.toFixed(2)),
            paidCourseRevenue: parseFloat(paidCourseRevenue.toFixed(2)),
            paidCourseEnrollments,
            averageEnrollmentPerCourse: totalCourses > 0
              ? (totalEnrollments / totalCourses).toFixed(1)
              : 0,
            priceDistribution: priceRanges,
            topCourses,
          },
        },
      });
    }

    // ===== EVENT ANALYTICS =====
    if (metric === 'events') {
      // Total events - count ALL events regardless of status
      const totalEvents = await EventModel.countDocuments({});

      // Get all events with enrollment and performance data
      const allEvents = await EventModel.aggregate([
        {
          $lookup: {
            from: 'enrollments',
            let: { eventId: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ['$eventId', '$$eventId'] },
                  type: 'event'
                }
              }
            ],
            as: 'enrollmentData'
          }
        },
        {
          $addFields: {
            totalRegistrations: { $size: '$enrollmentData' },
            attendedCount: {
              $size: {
                $filter: {
                  input: '$enrollmentData',
                  as: 'e',
                  cond: { $eq: ['$$e.status', 'completed'] }
                }
              }
            },
            noShowCount: {
              $size: {
                $filter: {
                  input: '$enrollmentData',
                  as: 'e',
                  cond: { $eq: ['$$e.status', 'cancelled'] }
                }
              }
            },
            pendingCount: {
              $size: {
                $filter: {
                  input: '$enrollmentData',
                  as: 'e',
                  cond: { $eq: ['$$e.status', 'in_progress'] }
                }
              }
            },
            capacityUtilization: {
              $cond: [
                { $gt: [{ $ifNull: ['$maxCapacity', 1] }, 0] },
                { $round: [{ $multiply: [{ $divide: ['$totalRegistrations', { $ifNull: ['$maxCapacity', 1] }] }, 100] }, 2] },
                0
              ]
            },
            isPaid: { $eq: ['$access', 'premium'] },
            isCorporate: { $eq: ['$access', 'corporate'] },
            daysUntilStart: {
              $cond: [
                { $gt: [{ $ifNull: ['$startDate', null] }, new Date()] },
                { $round: [{ $divide: [{ $subtract: [{ $ifNull: ['$startDate', new Date()] }, new Date()] }, 86400000] }] },
                null
              ]
            },
            isUpcoming: { $gt: [{ $ifNull: ['$startDate', new Date()] }, new Date()] },
            isCompleted: { $eq: ['$status', 'completed'] },
          }
        },
        { $sort: { totalRegistrations: -1 } }
      ]);

      // Calculate aggregated metrics
      const totalRegistrations = allEvents.reduce((sum, e) => sum + e.totalRegistrations, 0);
      const totalAttended = allEvents.reduce((sum, e) => sum + e.attendedCount, 0);
      const totalNoShows = allEvents.reduce((sum, e) => sum + e.noShowCount, 0);

      const attendanceRate = totalRegistrations > 0
        ? ((totalAttended / totalRegistrations) * 100).toFixed(2)
        : 0;

      const noShowRate = totalRegistrations > 0
        ? ((totalNoShows / totalRegistrations) * 100).toFixed(2)
        : 0;

      // Event type breakdowns - proper paid/unpaid categorization
      const paidEventsData = allEvents.filter(e => e.access === 'premium');
      const freeEventsData = allEvents.filter(e => e.access === 'free');
      const corporateEventsData = allEvents.filter(e => e.access === 'corporate');

      const paidEvents = paidEventsData.length;
      const freeEvents = freeEventsData.length;
      const corporateEvents = corporateEventsData.length;

      // Performance metrics by event type
      const paidEventsTotalRegistrations = paidEventsData.reduce((sum, e) => sum + e.totalRegistrations, 0);
      const paidEventsTotalAttended = paidEventsData.reduce((sum, e) => sum + e.attendedCount, 0);
      const paidEventsAttendanceRate = paidEvents > 0 && paidEventsTotalRegistrations > 0
        ? ((paidEventsTotalAttended / paidEventsTotalRegistrations) * 100).toFixed(2)
        : 0;

      const freeEventsTotalRegistrations = freeEventsData.reduce((sum, e) => sum + e.totalRegistrations, 0);
      const freeEventsTotalAttended = freeEventsData.reduce((sum, e) => sum + e.attendedCount, 0);
      const freeEventsAttendanceRate = freeEvents > 0 && freeEventsTotalRegistrations > 0
        ? ((freeEventsTotalAttended / freeEventsTotalRegistrations) * 100).toFixed(2)
        : 0;

      const corporateEventsTotalRegistrations = corporateEventsData.reduce((sum, e) => sum + e.totalRegistrations, 0);
      const corporateEventsTotalAttended = corporateEventsData.reduce((sum, e) => sum + e.attendedCount, 0);

      // Average metrics
      const avgRegistrationsPerPaidEvent = paidEvents > 0 ? (paidEventsTotalRegistrations / paidEvents).toFixed(1) : 0;
      const avgRegistrationsPerFreeEvent = freeEvents > 0 ? (freeEventsTotalRegistrations / freeEvents).toFixed(1) : 0;
      const avgRegistrationsPerCorporateEvent = corporateEvents > 0 ? (corporateEventsTotalRegistrations / corporateEvents).toFixed(1) : 0;

      const upcomingEvents = allEvents.filter(e => e.isUpcoming).length;
      const completedEvents = allEvents.filter(e => e.isCompleted).length;

      // Format analysis
      const eventsByFormat = {
        online: allEvents.filter(e => e.format === 'online').length,
        offline: allEvents.filter(e => e.format === 'offline').length,
        hybrid: allEvents.filter(e => e.format === 'hybrid').length,
        unspecified: allEvents.filter(e => !e.format).length,
      };

      // Capacity analysis
      const eventsWithCapacity = allEvents.filter(e => e.maxCapacity && e.maxCapacity > 0);
      const avgCapacityUtilization = eventsWithCapacity.length > 0
        ? (eventsWithCapacity.reduce((sum, e) => sum + e.capacityUtilization, 0) / eventsWithCapacity.length).toFixed(1)
        : 0;

      const totalCapacity = eventsWithCapacity.reduce((sum, e) => sum + e.maxCapacity, 0);
      const capacityUtilizationPercentage = totalCapacity > 0
        ? ((totalRegistrations / totalCapacity) * 100).toFixed(1)
        : 0;

      // Top events with detailed stats
      const topEvents = allEvents.slice(0, 15).map(event => ({
        id: event._id?.toString() || '',
        title: event.title,
        category: event.category || 'Uncategorized',
        format: event.format || 'Not specified',
        access: event.access,
        status: event.status,
        startDate: event.startDate || null,
        registrations: event.totalRegistrations,
        attended: event.attendedCount,
        noShows: event.noShowCount,
        pending: event.pendingCount,
        maxCapacity: event.maxCapacity || 'Unlimited',
        capacityUtilization: event.capacityUtilization || 0,
        attendanceRate: event.totalRegistrations > 0
          ? ((event.attendedCount / event.totalRegistrations) * 100).toFixed(1)
          : 0,
        noShowRate: event.totalRegistrations > 0
          ? ((event.noShowCount / event.totalRegistrations) * 100).toFixed(1)
          : 0,
      }));

      return NextResponse.json({
        success: true,
        data: {
          events: {
            totalEvents,
            paidEvents,
            freeEvents,
            corporateEvents,
            upcomingEvents,
            completedEvents,
            totalRegistrations,
            totalAttended,
            totalNoShows,
            attendanceRate,
            noShowRate,
            avgCapacityUtilization,
            capacityUtilizationPercentage,
            eventsByFormat,
            paidEventsMetrics: {
              count: paidEvents,
              totalRegistrations: paidEventsTotalRegistrations,
              totalAttended: paidEventsTotalAttended,
              attendanceRate: paidEventsAttendanceRate,
              avgRegistrationsPerEvent: avgRegistrationsPerPaidEvent,
            },
            freeEventsMetrics: {
              count: freeEvents,
              totalRegistrations: freeEventsTotalRegistrations,
              totalAttended: freeEventsTotalAttended,
              attendanceRate: freeEventsAttendanceRate,
              avgRegistrationsPerEvent: avgRegistrationsPerFreeEvent,
            },
            corporateEventsMetrics: {
              count: corporateEvents,
              totalRegistrations: corporateEventsTotalRegistrations,
              totalAttended: corporateEventsTotalAttended,
              avgRegistrationsPerEvent: avgRegistrationsPerCorporateEvent,
            },
            topEvents,
          },
        },
      });
    }

    // ===== USER BEHAVIOR ANALYTICS =====
    if (metric === 'userBehavior') {
      // User growth over last 30 days - EXCLUDING ADMIN AND SUBADMIN
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const userGrowth = await UserModel.aggregate([
        {
          $match: {
            createdAt: { $gte: thirtyDaysAgo },
            role: { $nin: ['ADMIN', 'SUB_ADMIN'] }
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
            },
            newUsers: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]);

      // User engagement by role - EXCLUDING ADMIN AND SUBADMIN
      const engagementByRole = await UserModel.aggregate([
        {
          $match: { role: { $nin: ['ADMIN', 'SUB_ADMIN'] } }
        },
        {
          $group: {
            _id: '$role',
            totalUsers: { $sum: 1 },
            subscribed: { $sum: { $cond: [{ $eq: ['$status', 'subscribed'] }, 1, 0] } },
            activeLastWeek: {
              $sum: {
                $cond: [
                  {
                    $gte: [
                      '$lastActivity',
                      new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                    ],
                  },
                  1,
                  0,
                ],
              },
            },
            activeToday: {
              $sum: {
                $cond: [
                  {
                    $gte: [
                      '$lastActivity',
                      (() => {
                        const d = new Date();
                        d.setHours(0, 0, 0, 0);
                        return d;
                      })()
                    ],
                  },
                  1,
                  0,
                ],
              },
            },
          },
        },
        { $sort: { totalUsers: -1 } }
      ]);

      // Total users excluding admin/subadmin
      const totalUsers = engagementByRole.reduce((sum: number, role: any) => sum + role.totalUsers, 0);
      const totalSubscribed = engagementByRole.reduce((sum: number, role: any) => sum + role.subscribed, 0);
      const totalActiveLastWeek = engagementByRole.reduce((sum: number, role: any) => sum + role.activeLastWeek, 0);
      const totalActiveToday = engagementByRole.reduce((sum: number, role: any) => sum + role.activeToday, 0);

      return NextResponse.json({
        success: true,
        data: {
          userBehavior: {
            userGrowth,
            engagementByRole,
            summary: {
              totalUsers,
              totalSubscribed,
              totalActiveLastWeek,
              totalActiveToday,
              subscriptionRate: totalUsers > 0 ? ((totalSubscribed / totalUsers) * 100).toFixed(2) : 0,
              weeklyEngagementRate: totalUsers > 0 ? ((totalActiveLastWeek / totalUsers) * 100).toFixed(2) : 0,
            },
          },
        },
      });
    }

    // ===== USER ACTIVITY ANALYTICS =====
    if (metric === 'userActivity') {
      // Daily active users over last 30 days
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const dailyActiveUsers = await UserModel.aggregate([
        {
          $match: { lastActivity: { $gte: thirtyDaysAgo } },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$lastActivity' },
            },
            activeUsers: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]);

      // Peak activity hours (from lastActivity timestamps)
      const peakActivityHours = await UserModel.aggregate([
        {
          $group: {
            _id: { $hour: '$lastActivity' },
            activityCount: { $sum: 1 },
          },
        },
        { $sort: { activityCount: -1 } },
      ]);

      // User retention (users active in both this week and last week)
      const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
      const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const retentionMetrics = await UserModel.countDocuments({
        lastActivity: {
          $gte: oneWeekAgo,
          $lte: today,
        },
      });

      return NextResponse.json({
        success: true,
        data: {
          userActivity: {
            dailyActiveUsers,
            peakActivityHours: peakActivityHours.slice(0, 24),
            retentionThisWeek: retentionMetrics,
          },
        },
      });
    }

    // ===== ENGAGEMENT ANALYTICS =====
    if (metric === 'engagement') {
      // Enrollment trends
      const enrollmentTrends = await EnrollmentModel.aggregate([
        {
          $match: dateFilter,
        },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
            },
            courseEnrollments: {
              $sum: { $cond: [{ $eq: ['$type', 'course'] }, 1, 0] },
            },
            eventEnrollments: {
              $sum: { $cond: [{ $eq: ['$type', 'event'] }, 1, 0] },
            },
            completions: {
              $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] },
            },
          },
        },
        { $sort: { _id: 1 } },
      ]);

      // Most active users
      const mostActiveUsers = await EnrollmentModel.aggregate([
        {
          $group: {
            _id: '$userId',
            enrollmentCount: { $sum: 1 },
            completionCount: {
              $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] },
            },
          },
        },
        { $sort: { enrollmentCount: -1 } },
        { $limit: 10 },
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: '_id',
            as: 'user',
          },
        },
        {
          $project: {
            _id: 1,
            enrollmentCount: 1,
            completionCount: 1,
            userName: { $arrayElemAt: ['$user.email', 0] },
            userRole: { $arrayElemAt: ['$user.role', 0] },
          },
        },
      ]);

      return NextResponse.json({
        success: true,
        data: {
          engagement: {
            enrollmentTrends,
            mostActiveUsers,
          },
        },
      });
    }

    // ===== MEMBERSHIP ANALYTICS =====
    if (metric === 'memberships') {
      // Overall membership stats
      const totalMemberships = await MembershipModel.countDocuments();
      const activeMemberships = await MembershipModel.countDocuments({ status: 'active' });
      const userMemberships = await MembershipModel.countDocuments({ subjectType: 'USER' });
      const corporateMemberships = await MembershipModel.countDocuments({ subjectType: 'CORPORATE' });

      // Memberships by status
      const membershipsByStatus = await MembershipModel.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
      ]);

      // Memberships by type
      const membershipsByType = await MembershipModel.aggregate([
        {
          $group: {
            _id: '$subjectType',
            count: { $sum: 1 },
            activeCount: {
              $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] },
            },
          },
        },
      ]);

      // Memberships by plan
      const membershipsByPlan = await MembershipModel.aggregate([
        {
          $group: {
            _id: '$planId',
            totalCount: { $sum: 1 },
            activeCount: { $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] } },
            expiredCount: { $sum: { $cond: [{ $eq: ['$status', 'expired'] }, 1, 0] } },
            cancelledCount: { $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] } },
          },
        },
        { $sort: { totalCount: -1 } },
      ]);

      // User memberships breakdown (paid vs non-paid)
      const userMembershipsBreakdown = await UserModel.aggregate([
        {
          $lookup: {
            from: 'memberships',
            localField: '_id',
            foreignField: 'subjectId',
            as: 'membership',
          },
        },
        {
          $group: {
            _id: null,
            totalUsers: { $sum: 1 },
            paidUsers: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      { $gt: [{ $size: '$membership' }, 0] },
                      {
                        $eq: [
                          { $arrayElemAt: ['$membership.status', 0] },
                          'active',
                        ],
                      },
                    ],
                  },
                  1,
                  0,
                ],
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            totalUsers: 1,
            paidUsers: 1,
            unpaidUsers: { $subtract: ['$totalUsers', '$paidUsers'] },
            paidPercentage: {
              $round: [
                { $multiply: [{ $divide: ['$paidUsers', '$totalUsers'] }, 100] },
                2,
              ],
            },
          },
        },
      ]);

      return NextResponse.json({
        success: true,
        data: {
          memberships: {
            totalMemberships,
            activeMemberships,
            userMemberships,
            corporateMemberships,
            membershipsByStatus,
            membershipsByType,
            membershipsByPlan,
            userBreakdown: userMembershipsBreakdown[0] || {
              totalUsers: 0,
              paidUsers: 0,
              unpaidUsers: 0,
              paidPercentage: 0,
            },
          },
        },
      });
    }

    // ===== CORPORATE ANALYTICS =====
    if (metric === 'corporates') {
      // Overall corporate stats
      const totalCorporates = await CorporateProfileModel.countDocuments();
      const activeCorporates = await CorporateProfileModel.countDocuments({ status: 'active' });
      const verifiedCorporates = await CorporateProfileModel.countDocuments({ status: 'verified' });

      // Corporates by status
      const corporatesByStatus = await CorporateProfileModel.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
          },
        },
      ]);

      // Corporates by industry
      const corporatesByIndustry = await CorporateProfileModel.aggregate([
        {
          $match: { industry: { $exists: true, $ne: null } },
        },
        {
          $group: {
            _id: '$industry',
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]);

      // Corporates with staff counts and subscriptions
      const corporatesWithStaffStats = await CorporateProfileModel.aggregate([
        {
          $lookup: {
            from: 'corporateStaffs',
            localField: '_id',
            foreignField: 'corporateId',
            as: 'staffMembers',
          },
        },
        {
          $lookup: {
            from: 'memberships',
            localField: '_id',
            foreignField: 'subjectId',
            as: 'membership',
          },
        },
        {
          $project: {
            _id: 1,
            companyName: 1,
            status: 1,
            industry: 1,
            staffCount: { $size: '$staffMembers' },
            hasMembership: { $gt: [{ $size: '$membership' }, 0] },
            membershipStatus: { $arrayElemAt: ['$membership.status', 0] },
            membershipPlan: { $arrayElemAt: ['$membership.planId', 0] },
          },
        },
        { $sort: { staffCount: -1 } },
        { $limit: 15 },
      ]);

      // Corporate tiers based on staff volume
      const corporateTiers = await CorporateProfileModel.aggregate([
        {
          $lookup: {
            from: 'corporateStaffs',
            localField: '_id',
            foreignField: 'corporateId',
            as: 'staffMembers',
          },
        },
        {
          $lookup: {
            from: 'memberships',
            localField: '_id',
            foreignField: 'subjectId',
            as: 'membership',
          },
        },
        {
          $project: {
            staffCount: { $size: '$staffMembers' },
            hasPaidMembership: {
              $cond: [
                {
                  $and: [
                    { $gt: [{ $size: '$membership' }, 0] },
                    { $eq: [{ $arrayElemAt: ['$membership.status', 0] }, 'active'] },
                  ],
                },
                true,
                false,
              ],
            },
            tier: {
              $cond: [
                { $gte: [{ $size: '$staffMembers' }, 100] },
                'Enterprise',
                {
                  $cond: [
                    { $gte: [{ $size: '$staffMembers' }, 50] },
                    'Professional',
                    {
                      $cond: [
                        { $gte: [{ $size: '$staffMembers' }, 10] },
                        'Business',
                        'Starter',
                      ],
                    },
                  ],
                },
              ],
            },
          },
        },
        {
          $group: {
            _id: '$tier',
            count: { $sum: 1 },
            avgStaffCount: { $avg: '$staffCount' },
            paidCount: { $sum: { $cond: ['$hasPaidMembership', 1, 0] } },
            unpaidCount: { $sum: { $cond: ['$hasPaidMembership', 0, 1] } },
          },
        },
        {
          $project: {
            _id: 1,
            count: 1,
            avgStaffCount: { $round: ['$avgStaffCount', 1] },
            paidCount: 1,
            unpaidCount: 1,
            paidPercentage: {
              $round: [
                { $multiply: [{ $divide: ['$paidCount', '$count'] }, 100] },
                2,
              ],
            },
          },
        },
        { $sort: { _id: 1 } },
      ]);

      return NextResponse.json({
        success: true,
        data: {
          corporates: {
            totalCorporates,
            activeCorporates,
            verifiedCorporates,
            corporatesByStatus,
            corporatesByIndustry,
            corporatesWithStaffStats,
            corporateTiers,
          },
        },
      });
    }

    // ===== INDIVIDUALS ANALYTICS =====
    if (metric === 'individuals') {
      // Get all individual users (INDIVIDUAL role)
      const totalIndividuals = await UserModel.countDocuments({ role: 'INDIVIDUAL' });
      const subscribedIndividuals = await UserModel.countDocuments({ role: 'INDIVIDUAL', status: 'subscribed' });
      const subscriptionRate = totalIndividuals > 0 ? ((subscribedIndividuals / totalIndividuals) * 100).toFixed(2) : 0;

      // Get enrollment stats for individuals
      const enrollmentStats = await EnrollmentModel.aggregate([
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'userdata',
          },
        },
        {
          $match: { 'userdata.role': 'INDIVIDUAL' },
        },
        {
          $group: {
            _id: null,
            totalEnrollments: { $sum: 1 },
            completedEnrollments: {
              $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] },
            },
            inProgressEnrollments: {
              $sum: { $cond: [{ $eq: ['$status', 'in-progress'] }, 1, 0] },
            },
            courseEnrollments: {
              $sum: { $cond: [{ $eq: ['$enrollmentType', 'course'] }, 1, 0] },
            },
            eventRegistrations: {
              $sum: { $cond: [{ $eq: ['$enrollmentType', 'event'] }, 1, 0] },
            },
          },
        },
      ]);

      const stats = enrollmentStats[0] || {
        totalEnrollments: 0,
        completedEnrollments: 0,
        inProgressEnrollments: 0,
        courseEnrollments: 0,
        eventRegistrations: 0,
      };

      const avgEnrollmentsPerUser = totalIndividuals > 0 ? (stats.totalEnrollments / totalIndividuals).toFixed(2) : 0;

      // Get top individuals by enrollment count
      const topIndividuals = await EnrollmentModel.aggregate([
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'userdata',
          },
        },
        {
          $match: { 'userdata.role': 'INDIVIDUAL' },
        },
        {
          $group: {
            _id: '$userId',
            userName: { $first: { $arrayElemAt: ['$userdata.name', 0] } },
            email: { $first: { $arrayElemAt: ['$userdata.email', 0] } },
            subscriptionStatus: { $first: { $arrayElemAt: ['$userdata.status', 0] } },
            lastActive: { $first: { $arrayElemAt: ['$userdata.lastActivity', 0] } },
            enrollments: { $sum: 1 },
            completed: {
              $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] },
            },
          },
        },
        {
          $addFields: {
            completionRate: {
              $cond: [
                { $gt: ['$enrollments', 0] },
                { $round: [{ $multiply: [{ $divide: ['$completed', '$enrollments'] }, 100] }, 0] },
                0,
              ],
            },
          },
        },
        { $sort: { enrollments: -1 } },
        { $limit: 15 },
      ]);

      return NextResponse.json({
        success: true,
        data: {
          individuals: {
            totalIndividuals,
            subscribedIndividuals,
            subscriptionRate,
            totalEnrollments: stats.totalEnrollments,
            completedEnrollments: stats.completedEnrollments,
            inProgressEnrollments: stats.inProgressEnrollments,
            courseEnrollments: stats.courseEnrollments,
            eventRegistrations: stats.eventRegistrations,
            avgEnrollmentsPerUser,
            topIndividuals,
          },
        },
      });
    }

    // Default: return all metrics
    return NextResponse.json({
      success: true,
      data: {
        message: 'Use metric parameter: overview, courses, events, userBehavior, individuals, memberships, or corporates',
      },
    });
  } catch (error) {
    console.error('[Analytics API] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
