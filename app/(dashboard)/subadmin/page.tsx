import Link from 'next/link';
import { Users, Calendar, BookOpen, MessageSquare, CheckCircle, Clock, AlertCircle, ArrowUpRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function fetchSubAdminDashboardData() {
  try {
    const { connectToDatabase } = await import('@/server/db/mongoose');
    const UserModel = (await import('@/server/db/models/user.model')).default;
    const EventModel = (await import('@/server/db/models/event.model')).default;
    const CourseModel = (await import('@/server/db/models/course.model')).default;
    const EnrollmentModel = (await import('@/server/db/models/enrollment.model')).default;
    const MembershipModel = (await import('@/server/db/models/membership.model')).default;
    const MessageModel = (await import('@/server/db/models/message.model')).default;
    const Announcement = (await import('@/server/db/models/announcement.model')).Announcement;

    await connectToDatabase();

    // Get date ranges
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Count member data (individuals and corporates only - no admin/staff counts)
    const totalMembers = await UserModel.countDocuments({
      role: { $in: ['INDIVIDUAL', 'CORPORATE'] }
    });
    const totalIndividuals = await UserModel.countDocuments({ role: 'INDIVIDUAL' });
    const totalCorporates = await UserModel.countDocuments({ role: 'CORPORATE' });
    const newMembersWeek = await UserModel.countDocuments({
      role: { $in: ['INDIVIDUAL', 'CORPORATE'] },
      createdAt: { $gte: weekAgo }
    });
    const newMembersMonth = await UserModel.countDocuments({
      role: { $in: ['INDIVIDUAL', 'CORPORATE'] },
      createdAt: { $gte: monthAgo }
    });

    // Active members (logged in within last 7 days)
    const activeMembers = await UserModel.countDocuments({
      role: { $in: ['INDIVIDUAL', 'CORPORATE'] },
      lastLoginAt: { $gte: weekAgo }
    });

    // Event and course data
    const totalEvents = await EventModel.countDocuments();
    const activeEvents = await EventModel.countDocuments({ status: { $in: ['active', 'published'] } });
    const upcomingEvents = await EventModel.countDocuments({
      status: { $in: ['active', 'published'] },
      startDate: { $gte: now }
    });

    const totalCourses = await CourseModel.countDocuments();
    const activeCourses = await CourseModel.countDocuments({ status: 'active' });

    // Enrollment data
    const totalEnrollments = await EnrollmentModel.countDocuments();
    const activeEnrollments = await EnrollmentModel.countDocuments({
      status: { $in: ['enrolled', 'in_progress'] }
    });
    const pendingEnrollments = await EnrollmentModel.countDocuments({
      status: 'pending'
    });

    // Membership data
    const totalMemberships = await MembershipModel.countDocuments();
    const activeMemberships = await MembershipModel.countDocuments({ status: 'active' });
    const expiringMemberships = await MembershipModel.countDocuments({
      status: 'active',
      endDate: {
        $gte: now,
        $lte: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000) // Expiring in next 30 days
      }
    });

    // Message data
    const totalMessages = await MessageModel.countDocuments();
    const unreadMessages = await MessageModel.countDocuments({ readAt: null });
    const newMessagesWeek = await MessageModel.countDocuments({
      createdAt: { $gte: weekAgo }
    });

    // Announcements
    const totalAnnouncements = await Announcement.countDocuments({ isActive: true });

    // Recent members
    const recentMembers = await UserModel.find({
      role: { $in: ['INDIVIDUAL', 'CORPORATE'] }
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('email firstName lastName role createdAt')
      .lean();

    // Recent enrollments
    const recentEnrollments = await EnrollmentModel.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('userId', 'email firstName lastName')
      .populate('eventId', 'title')
      .lean();

    // Pending staff registrations (if applicable)
    const pendingStaffRegistrations = await UserModel.countDocuments({
      role: 'STAFF',
      status: 'pending'
    });

    return {
      members: {
        total: totalMembers,
        individuals: totalIndividuals,
        corporates: totalCorporates,
        newWeek: newMembersWeek,
        newMonth: newMembersMonth,
        active: activeMembers,
      },
      events: {
        total: totalEvents,
        active: activeEvents,
        upcoming: upcomingEvents,
      },
      courses: {
        total: totalCourses,
        active: activeCourses,
      },
      enrollments: {
        total: totalEnrollments,
        active: activeEnrollments,
        pending: pendingEnrollments,
      },
      memberships: {
        total: totalMemberships,
        active: activeMemberships,
        expiring: expiringMemberships,
      },
      messages: {
        total: totalMessages,
        unread: unreadMessages,
        newWeek: newMessagesWeek,
      },
      announcements: {
        total: totalAnnouncements,
      },
      staffRegistrations: {
        pending: pendingStaffRegistrations,
      },
      recentMembers,
      recentEnrollments,
    };
  } catch (error) {
    console.error('Error fetching sub-admin dashboard data:', error);
    return null;
  }
}

export default async function SubAdminDashboard() {
  const data = await fetchSubAdminDashboardData();

  if (!data) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Connection Error</h2>
          <p className="text-gray-600">Unable to load dashboard data. Please try again later.</p>
        </div>
      </div>
    );
  }

  const memberEngagementRate = data.members.total > 0
    ? ((data.members.active / data.members.total) * 100).toFixed(1)
    : 0;

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Account Manager Dashboard</h1>
              <p className="text-gray-600 mt-1">Member support and engagement overview</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-green-700">Online</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Members */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm font-medium">Total Members</p>
                  <h3 className="text-2xl font-bold text-gray-900">{data.members.total}</h3>
                </div>
              </div>
              <div className="flex items-center gap-1 text-green-600 text-sm font-semibold">
                <ArrowUpRight className="w-4 h-4" />
                <span>+{data.members.newWeek}</span>
              </div>
            </div>
            <div className="text-xs text-gray-500">+{data.members.newMonth} this month</div>
          </div>

          {/* Unread Messages */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-red-100 rounded-lg">
                  <MessageSquare className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm font-medium">Unread Messages</p>
                  <h3 className="text-2xl font-bold text-gray-900">{data.messages.unread}</h3>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                {data.messages.total} total
              </div>
            </div>
            <div className="text-xs text-gray-500">+{data.messages.newWeek} this week</div>
          </div>

          {/* Upcoming Events */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm font-medium">Upcoming Events</p>
                  <h3 className="text-2xl font-bold text-gray-900">{data.events.upcoming}</h3>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                {data.events.active} active
              </div>
            </div>
            <div className="text-xs text-gray-500">{data.events.total} total events</div>
          </div>

          {/* Pending Items */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm font-medium">Pending Items</p>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {data.enrollments.pending + data.staffRegistrations.pending}
                  </h3>
                </div>
              </div>
            </div>
            <div className="text-xs text-gray-500">
              {data.enrollments.pending} enrollments · {data.staffRegistrations.pending} staff
            </div>
          </div>
        </div>

        {/* Secondary Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Member Engagement */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm font-medium">Member Engagement</p>
                  <h3 className="text-2xl font-bold text-gray-900">{memberEngagementRate}%</h3>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-600">Active Members</span>
                <span className="font-semibold text-gray-900">{data.members.active}/{data.members.total}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: `${memberEngagementRate}%` }}
                />
              </div>
            </div>
          </div>

          {/* Active Memberships */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <p className="text-gray-600 text-sm font-medium mb-4">Active Memberships</p>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Active</span>
                <span className="font-semibold text-green-600">{data.memberships.active}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Expiring Soon</span>
                <span className="font-semibold text-orange-600">{data.memberships.expiring}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Total</span>
                <span className="font-semibold text-gray-900">{data.memberships.total}</span>
              </div>
            </div>
          </div>

          {/* Member Distribution */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <p className="text-gray-600 text-sm font-medium mb-4">Member Distribution</p>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Individuals</span>
                <span className="font-semibold text-gray-900">{data.members.individuals}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Corporates</span>
                <span className="font-semibold text-gray-900">{data.members.corporates}</span>
              </div>
              <div className="flex justify-between items-center text-sm border-t pt-2">
                <span className="text-gray-600 font-medium">Total Members</span>
                <span className="font-semibold text-gray-900">{data.members.total}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Link
            href="/subadmin/messages"
            className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg p-6 hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg"
          >
            <MessageSquare className="w-8 h-8 mb-3" />
            <h3 className="font-semibold text-lg mb-1">Messages</h3>
            <p className="text-sm text-blue-100">Respond to member inquiries</p>
          </Link>

          <Link
            href="/subadmin/communications"
            className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg p-6 hover:from-purple-600 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
          >
            <div className="text-3xl mb-3">📢</div>
            <h3 className="font-semibold text-lg mb-1">Announcements</h3>
            <p className="text-sm text-purple-100">Create member notifications</p>
          </Link>

          <Link
            href="/subadmin/staff-registrations"
            className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg p-6 hover:from-green-600 hover:to-green-700 transition-all shadow-md hover:shadow-lg"
          >
            <CheckCircle className="w-8 h-8 mb-3" />
            <h3 className="font-semibold text-lg mb-1">Staff Approvals</h3>
            <p className="text-sm text-green-100">Review pending registrations</p>
          </Link>

          <Link
            href="/subadmin/reports"
            className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-lg p-6 hover:from-orange-600 hover:to-orange-700 transition-all shadow-md hover:shadow-lg"
          >
            <div className="text-3xl mb-3">📋</div>
            <h3 className="font-semibold text-lg mb-1">Reports</h3>
            <p className="text-sm text-orange-100">View member activity</p>
          </Link>
        </div>

        {/* Recent Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Members */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">Recent Members</h2>
              <Link href="/subadmin/users" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                View All →
              </Link>
            </div>
            <div className="space-y-4">
              {data.recentMembers.length === 0 ? (
                <p className="text-gray-500 text-sm">No recent members</p>
              ) : (
                data.recentMembers.map((member: any) => (
                  <div key={member._id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                        {member.firstName?.[0] || member.email?.[0]?.toUpperCase() || '?'}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{member.firstName} {member.lastName}</p>
                        <p className="text-xs text-gray-500 truncate">{member.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                      <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded">
                        {member.role === 'INDIVIDUAL' ? 'Individual' : 'Corporate'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Enrollments */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">Recent Enrollments</h2>
              <Link href="/subadmin/events" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                View All →
              </Link>
            </div>
            <div className="space-y-4">
              {data.recentEnrollments.length === 0 ? (
                <p className="text-gray-500 text-sm">No recent enrollments</p>
              ) : (
                data.recentEnrollments.map((enrollment: any) => (
                  <div key={enrollment._id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                        📚
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{enrollment.eventId?.title || 'Event'}</p>
                        <p className="text-xs text-gray-500 truncate">{enrollment.userId?.firstName} {enrollment.userId?.lastName}</p>
                      </div>
                    </div>
                    <div className="flex-shrink-0 ml-2">
                      <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ${enrollment.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                          enrollment.status === 'enrolled' || enrollment.status === 'in_progress' ? 'bg-green-100 text-green-700' :
                            'bg-gray-100 text-gray-700'
                        }`}>
                        {enrollment.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
