import Link from 'next/link';
import { TrendingUp, Users, Calendar, BookOpen, CreditCard, Activity, AlertCircle, CheckCircle, Clock, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import DashboardChart from '@/components/DashboardChart';

export const dynamic = 'force-dynamic';

async function fetchDashboardData() {
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

    // Count data
    const totalUsers = await UserModel.countDocuments();
    const totalIndividuals = await UserModel.countDocuments({ role: 'INDIVIDUAL' });
    const totalCorporates = await UserModel.countDocuments({ role: 'CORPORATE' });
    const totalStaff = await UserModel.countDocuments({ role: 'STAFF' });
    const totalSubAdmins = await UserModel.countDocuments({ role: 'SUB_ADMIN' });
    
    const newUsersWeek = await UserModel.countDocuments({ createdAt: { $gte: weekAgo } });
    const newUsersMonth = await UserModel.countDocuments({ createdAt: { $gte: monthAgo } });

    const totalEvents = await EventModel.countDocuments();
    const activeEvents = await EventModel.countDocuments({ status: { $in: ['active', 'published'] } });
    const newEventsWeek = await EventModel.countDocuments({ createdAt: { $gte: weekAgo } });

    const totalCourses = await CourseModel.countDocuments();
    const activeCourses = await CourseModel.countDocuments({ status: 'active' });

    const totalEnrollments = await EnrollmentModel.countDocuments();
    const activeEnrollments = await EnrollmentModel.countDocuments({ status: { $in: ['enrolled', 'in_progress'] } });
    const completedEnrollments = await EnrollmentModel.countDocuments({ status: 'completed' });

    const totalMemberships = await MembershipModel.countDocuments();
    const activeMemberships = await MembershipModel.countDocuments({ status: 'active' });

    const totalMessages = await MessageModel.countDocuments();
    const unreadMessages = await MessageModel.countDocuments({ readAt: null });

    const totalAnnouncements = await Announcement.countDocuments({ isActive: true });

    // Get enrollment trend data for past 7 days
    const enrollmentTrend = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const nextDate = new Date(date.getTime() + 24 * 60 * 60 * 1000);
      const dayEnrollments = await EnrollmentModel.countDocuments({
        createdAt: { $gte: date, $lt: nextDate }
      });
      enrollmentTrend.push({
        date: date.toLocaleDateString('en-US', { weekday: 'short' }),
        enrollments: dayEnrollments,
        timestamp: date.toISOString()
      });
    }

    // Top courses
    const topCourses = await CourseModel.find()
      .limit(5)
      .select('title students')
      .sort({ students: -1 })
      .lean();

    // Recent activity
    const recentUsers = await UserModel.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('email firstName lastName role createdAt')
      .lean();

    const recentEnrollments = await EnrollmentModel.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('userId', 'email firstName lastName')
      .populate('eventId', 'title')
      .lean();

    return {
      users: {
        total: totalUsers,
        individuals: totalIndividuals,
        corporates: totalCorporates,
        staff: totalStaff,
        subAdmins: totalSubAdmins,
        newWeek: newUsersWeek,
        newMonth: newUsersMonth,
      },
      events: {
        total: totalEvents,
        active: activeEvents,
        newWeek: newEventsWeek,
      },
      courses: {
        total: totalCourses,
        active: activeCourses,
      },
      enrollments: {
        total: totalEnrollments,
        active: activeEnrollments,
        completed: completedEnrollments,
        trend: enrollmentTrend,
      },
      memberships: {
        total: totalMemberships,
        active: activeMemberships,
      },
      messages: {
        total: totalMessages,
        unread: unreadMessages,
      },
      announcements: {
        total: totalAnnouncements,
      },
      topCourses,
      recentUsers,
      recentEnrollments,
    };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return null;
  }
}

export default async function AdminDashboard() {
  const data = await fetchDashboardData();

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

  const conversionRate = data.users.total > 0 
    ? ((data.memberships.active / data.users.total) * 100).toFixed(1)
    : 0;

  const enrollmentRate = data.users.total > 0
    ? ((data.enrollments.active / data.users.total) * 100).toFixed(1)
    : 0;

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">Monitor and manage your platform in real-time</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-green-700">System Online</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Users */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm font-medium">Total Users</p>
                  <h3 className="text-2xl font-bold text-gray-900">{data.users.total}</h3>
                </div>
              </div>
              <div className="flex items-center gap-1 text-green-600 text-sm font-semibold">
                <ArrowUpRight className="w-4 h-4" />
                <span>+{data.users.newWeek}</span>
              </div>
            </div>
            <div className="text-xs text-gray-500">+{data.users.newMonth} this month</div>
          </div>

          {/* Active Events */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm font-medium">Active Events</p>
                  <h3 className="text-2xl font-bold text-gray-900">{data.events.active}/{data.events.total}</h3>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                {data.events.total > 0 ? Math.round((data.events.active / data.events.total) * 100) : 0}%
              </div>
            </div>
            <div className="text-xs text-gray-500">+{data.events.newWeek} this week</div>
          </div>

          {/* Active Courses */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-100 rounded-lg">
                  <BookOpen className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm font-medium">Active Courses</p>
                  <h3 className="text-2xl font-bold text-gray-900">{data.courses.active}/{data.courses.total}</h3>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                {data.courses.total > 0 ? Math.round((data.courses.active / data.courses.total) * 100) : 0}%
              </div>
            </div>
            <div className="text-xs text-gray-500">Learning platform</div>
          </div>

          {/* Active Enrollments */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Activity className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm font-medium">Enrollment Rate</p>
                  <h3 className="text-2xl font-bold text-gray-900">{enrollmentRate}%</h3>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                {data.enrollments.active} active
              </div>
            </div>
            <div className="text-xs text-gray-500">{data.enrollments.completed} completed</div>
          </div>
        </div>

        {/* Secondary Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Membership Conversion */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-indigo-100 rounded-lg">
                  <CreditCard className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm font-medium">Conversion Rate</p>
                  <h3 className="text-2xl font-bold text-gray-900">{conversionRate}%</h3>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-600">Active Members</span>
                <span className="font-semibold text-gray-900">{data.memberships.active}/{data.memberships.total}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-indigo-600 h-2 rounded-full" 
                  style={{width: data.memberships.total > 0 ? `${(data.memberships.active/data.memberships.total)*100}%` : '0%'}}
                />
              </div>
            </div>
          </div>

          {/* Messages Status */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-red-100 rounded-lg">
                  <Clock className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm font-medium">Unread Messages</p>
                  <h3 className="text-2xl font-bold text-gray-900">{data.messages.unread}</h3>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-600">Total Messages</span>
                <span className="font-semibold text-gray-900">{data.messages.total}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-red-600 h-2 rounded-full" 
                  style={{width: data.messages.total > 0 ? `${(data.messages.unread/data.messages.total)*100}%` : '0%'}}
                />
              </div>
            </div>
          </div>

          {/* User Distribution */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <p className="text-gray-600 text-sm font-medium mb-4">User Distribution</p>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Individuals</span>
                <span className="font-semibold text-gray-900">{data.users.individuals}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Corporates</span>
                <span className="font-semibold text-gray-900">{data.users.corporates}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Staff</span>
                <span className="font-semibold text-gray-900">{data.users.staff}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Sub-Admins</span>
                <span className="font-semibold text-gray-900">{data.users.subAdmins}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Enrollment Trend */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Enrollment Trend (Last 7 Days)</h2>
            <DashboardChart chartData={data.enrollments.trend.map(item => ({ name: item.date, enrollments: item.enrollments }))} />
          </div>

          {/* Active Status */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Platform Status</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-gray-900">Database</span>
                </div>
                <span className="text-xs font-semibold text-green-600">Connected</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-gray-900">Server</span>
                </div>
                <span className="text-xs font-semibold text-green-600">Online</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-gray-900">API</span>
                </div>
                <span className="text-xs font-semibold text-green-600">Operational</span>
              </div>
              <div className="pt-3 border-t border-gray-200">
                <p className="text-xs text-gray-500">Last updated: {new Date().toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Users */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Recent Sign-ups</h2>
            <div className="space-y-4">
              {data.recentUsers.length === 0 ? (
                <p className="text-gray-500 text-sm">No recent users</p>
              ) : (
                data.recentUsers.map((user: any) => (
                  <div key={user._id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                        {user.firstName?.[0] || user.email?.[0]?.toUpperCase() || '?'}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{user.firstName} {user.lastName}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                      <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded">
                        {user.role?.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Enrollments */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Recent Enrollments</h2>
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
                        <p className="text-sm font-medium text-gray-900 truncate">{enrollment.eventId?.title || 'Course'}</p>
                        <p className="text-xs text-gray-500 truncate">{enrollment.userId?.firstName} {enrollment.userId?.lastName}</p>
                      </div>
                    </div>
                    <div className="flex-shrink-0 ml-2">
                      <span className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">
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
