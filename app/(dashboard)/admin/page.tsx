import Link from 'next/link';

// Mark as dynamic to prevent build-time data fetching
export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  let userCount = 0;
  let eventCount = 0;
  let membershipCount = 0;
  let connectionError = false;

  try {
    const { connectToDatabase } = await import('@/server/db/mongoose');
    const UserModel = (await import('@/server/db/models/user.model')).default;
    const EventModel = (await import('@/server/db/models/event.model')).default;
    const MembershipModel = (await import('@/server/db/models/membership.model')).default;

    // Wrap connection in timeout to prevent hanging
    const connectionPromise = connectToDatabase();
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Connection timeout')), 45000)
    );

    try {
      await Promise.race([connectionPromise, timeoutPromise]);
      userCount = await UserModel.countDocuments().maxTimeMS(30000);
      eventCount = await EventModel.countDocuments().maxTimeMS(30000);
      membershipCount = await MembershipModel.countDocuments().maxTimeMS(30000);
    } catch (err) {
      console.error('Error fetching stats:', err instanceof Error ? err.message : err);
      connectionError = true;
      // Continue with default values (0) if connection fails
    }
  } catch (error) {
    console.error('Error importing models:', error);
    connectionError = true;
  }

  const adminSections = [
    {
      title: 'User & Account Management',
      icon: '👥',
      bgColor: 'from-blue-600 to-blue-700',
      accentColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      items: [
        { label: 'Manage Individual Members', href: '/admin/users?type=individual' },
        { label: 'Manage Corporate Members', href: '/admin/users?type=corporate' },
        { label: 'Approve/Reject Registrations', href: '/admin/users?status=pending' },
        { label: 'Edit/Deactivate Accounts', href: '/admin/users?action=manage' },
      ],
    },
    {
      title: 'Corporate & Staff Oversight',
      icon: '🏢',
      bgColor: 'from-purple-600 to-purple-700',
      accentColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      items: [
        { label: 'Manage Corporate Accounts', href: '/admin/corporate' },
        { label: 'Approve Staff Linkages', href: '/admin/corporate?action=approve-staff' },
        { label: 'View Corporate-Staff Structure', href: '/admin/corporate?view=structure' },
      ],
    },
    {
      title: 'Events & Trainings',
      icon: '📅',
      bgColor: 'from-cyan-600 to-cyan-700',
      accentColor: 'bg-cyan-50',
      borderColor: 'border-cyan-200',
      items: [
        { label: 'Create & Publish Events', href: '/admin/events?action=create' },
        { label: 'Manage Trainings', href: '/admin/events?action=trainings' },
        { label: 'Set Access Rules', href: '/admin/events?action=access-rules' },
      ],
    },
    {
      title: 'Courses',
      icon: '📚',
      bgColor: 'from-teal-600 to-teal-700',
      accentColor: 'bg-teal-50',
      borderColor: 'border-teal-200',
      items: [
        { label: 'Manage Courses', href: '/admin/courses' },
        { label: 'Add Course Content', href: '/admin/courses?action=add-content' },
        { label: 'Course Analytics', href: '/admin/courses?action=analytics' },
      ],
    },
    {
      title: 'Membership & Payments',
      icon: '💳',
      bgColor: 'from-emerald-600 to-emerald-700',
      accentColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      items: [
        { label: 'Manage Membership Plans', href: '/admin/memberships' },
        { label: 'View Transactions', href: '/admin/payments?view=transactions' },
        { label: 'Handle Renewals & Refunds', href: '/admin/payments?action=manage' },
      ],
    },
    {
      title: 'Messaging & Communications',
      icon: '💬',
      bgColor: 'from-amber-600 to-amber-700',
      accentColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      items: [
        { label: 'System Announcements', href: '/admin/communications?type=announcements' },
        { label: 'Group Messaging', href: '/admin/communications?type=messaging' },
        { label: 'Email Notifications', href: '/admin/communications?type=email' },
      ],
    },
    {
      title: 'Analytics & Reporting',
      icon: '📊',
      bgColor: 'from-indigo-600 to-indigo-700',
      accentColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200',
      items: [
        { label: 'Platform Metrics', href: '/admin/analytics?metric=platform' },
        { label: 'Engagement Analytics', href: '/admin/analytics?metric=engagement' },
        { label: 'Exportable Reports', href: '/admin/analytics?action=reports' },
      ],
    },
    {
      title: 'System Configuration',
      icon: '⚙️',
      bgColor: 'from-slate-600 to-slate-700',
      accentColor: 'bg-slate-50',
      borderColor: 'border-slate-200',
      items: [
        { label: 'Registration Settings', href: '/admin/settings?section=registration' },
        { label: 'Security Rules', href: '/admin/settings?section=security' },
        { label: 'Feature Toggles', href: '/admin/settings?section=features' },
      ],
    },
    {
      title: 'Sub-Admin Management',
      icon: '🔑',
      bgColor: 'from-rose-600 to-rose-700',
      accentColor: 'bg-rose-50',
      borderColor: 'border-rose-200',
      items: [
        { label: 'Create Sub-Admins', href: '/admin/subadmins?action=create' },
        { label: 'Assign Permissions', href: '/admin/subadmins?action=permissions' },
      ],
    },
  ];

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Connection Error Banner */}
      {connectionError && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded">
          <div className="flex items-center">
            <span className="text-2xl mr-3">⚠️</span>
            <div>
              <p className="font-semibold text-yellow-900">Database Connection Issue</p>
              <p className="text-sm text-yellow-800 mt-1">
                Unable to connect to MongoDB. Stats are showing default values. Please check your internet connection or database status.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Key Metrics Section - Responsive Grid */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-10">
        {/* Total Users Card */}
        <div className="group relative overflow-hidden bg-white rounded-2xl shadow-md border border-gray-200 p-6 md:p-8 hover:shadow-lg transition-shadow duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-100 rounded-full -mr-12 -mt-12 opacity-50 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm md:text-base text-gray-600 font-medium">Total Users</p>
              <span className="text-3xl md:text-4xl">👥</span>
            </div>
            <div className="mb-4">
              <p className="text-4xl md:text-5xl font-black text-gray-900">{userCount}</p>
              <p className="text-xs md:text-sm text-gray-500 mt-2">Active accounts on platform</p>
            </div>
            <div className="flex items-center gap-2 text-xs md:text-sm text-blue-600 font-semibold">
              <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
              Operational
            </div>
          </div>
        </div>

        {/* Events & Trainings Card */}
        <div className="group relative overflow-hidden bg-white rounded-2xl shadow-md border border-gray-200 p-6 md:p-8 hover:shadow-lg transition-shadow duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-100 rounded-full -mr-12 -mt-12 opacity-50 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm md:text-base text-gray-600 font-medium">Events & Trainings</p>
              <span className="text-3xl md:text-4xl">📅</span>
            </div>
            <div className="mb-4">
              <p className="text-4xl md:text-5xl font-black text-gray-900">{eventCount}</p>
              <p className="text-xs md:text-sm text-gray-500 mt-2">Published items</p>
            </div>
            <div className="flex items-center gap-2 text-xs md:text-sm text-cyan-600 font-semibold">
              <span className="w-2 h-2 bg-cyan-600 rounded-full"></span>
              Active
            </div>
          </div>
        </div>

        {/* Courses Card */}
        <div className="group relative overflow-hidden bg-white rounded-2xl shadow-md border border-gray-200 p-6 md:p-8 hover:shadow-lg transition-shadow duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-teal-100 rounded-full -mr-12 -mt-12 opacity-50 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm md:text-base text-gray-600 font-medium">Courses</p>
              <span className="text-3xl md:text-4xl">📚</span>
            </div>
            <div className="mb-4">
              <p className="text-4xl md:text-5xl font-black text-gray-900">{eventCount}</p>
              <p className="text-xs md:text-sm text-gray-500 mt-2">Available courses</p>
            </div>
            <div className="flex items-center gap-2 text-xs md:text-sm text-teal-600 font-semibold">
              <span className="w-2 h-2 bg-teal-600 rounded-full"></span>
              Active
            </div>
          </div>
        </div>

        {/* Memberships Card */}
        <div className="group relative overflow-hidden bg-white rounded-2xl shadow-md border border-gray-200 p-6 md:p-8 hover:shadow-lg transition-shadow duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-100 rounded-full -mr-12 -mt-12 opacity-50 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm md:text-base text-gray-600 font-medium">Active Memberships</p>
              <span className="text-3xl md:text-4xl">💳</span>
            </div>
            <div className="mb-4">
              <p className="text-4xl md:text-5xl font-black text-gray-900">{membershipCount}</p>
              <p className="text-xs md:text-sm text-gray-500 mt-2">Paid subscriptions</p>
            </div>
            <div className="flex items-center gap-2 text-xs md:text-sm text-amber-600 font-semibold">
              <span className="w-2 h-2 bg-amber-600 rounded-full"></span>
              Current
            </div>
          </div>
        </div>
      </div>

      {/* Admin Sections */}
      <div className="space-y-8 md:space-y-12 mb-8 md:mb-12">
        {adminSections.map((section, idx) => (
          <div key={idx} className="space-y-3 md:space-y-4">
            {/* Section Header */}
            <div className={`bg-gradient-to-r ${section.bgColor} rounded-2xl p-4 md:p-6 text-white shadow-lg`}>
              <div className="flex items-start md:items-center gap-3 md:gap-4">
                <span className="text-3xl md:text-5xl flex-shrink-0">{section.icon}</span>
                <div className="flex-1">
                  <h2 className="text-xl md:text-2xl font-black">{section.title}</h2>
                  <p className="text-blue-100 text-xs md:text-sm mt-1">Manage and configure settings</p>
                </div>
              </div>
            </div>

            {/* Section Items Grid - Responsive */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              {section.items.map((item, itemIdx) => (
                <Link
                  key={itemIdx}
                  href={item.href}
                  className={`${section.accentColor} ${section.borderColor} border-2 rounded-xl p-4 md:p-5 transition-all duration-300 hover:shadow-lg hover:border-opacity-100 group cursor-pointer`}
                >
                  <p className="font-semibold text-gray-900 text-sm group-hover:text-[#008200] transition-colors">
                    {item.label}
                  </p>
                  <p className="text-xs text-gray-500 mt-3 group-hover:text-gray-700 transition-colors">
                    → Access
                  </p>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions Section */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 md:p-8 mb-8 md:mb-10">
        <h3 className="text-xl md:text-2xl font-black text-gray-900 mb-6">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <button className="group p-4 md:p-6 bg-gradient-to-br from-[#008200] to-[#006600] text-white rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 font-semibold flex flex-col items-center gap-2">
            <span className="text-3xl">⚡</span>
            <span className="text-sm md:text-base">Emergency Alert</span>
          </button>
          <button className="group p-4 md:p-6 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 font-semibold flex flex-col items-center gap-2">
            <span className="text-3xl">📧</span>
            <span className="text-sm md:text-base">Mass Email</span>
          </button>
          <button className="group p-4 md:p-6 bg-gradient-to-br from-purple-600 to-purple-700 text-white rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 font-semibold flex flex-col items-center gap-2">
            <span className="text-3xl">📥</span>
            <span className="text-sm md:text-base">Bulk Import</span>
          </button>
          <button className="group p-4 md:p-6 bg-gradient-to-br from-slate-600 to-slate-700 text-white rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 font-semibold flex flex-col items-center gap-2">
            <span className="text-3xl">⬇️</span>
            <span className="text-sm md:text-base">Export Data</span>
          </button>
        </div>
      </div>

      {/* System Health Section */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 md:p-8">
        <h3 className="text-xl md:text-2xl font-black text-gray-900 mb-6 md:mb-8">System Health</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
          {/* API Status */}
          <div className="relative p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border-2 border-green-200 overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-green-200 rounded-full -mr-8 -mt-8 opacity-50"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <p className="text-gray-700 font-semibold text-sm">API Status</p>
                <span className="text-2xl">⚙️</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-base md:text-lg font-black text-green-900">Operational</span>
              </div>
            </div>
          </div>

          {/* Database Status */}
          <div className="relative p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border-2 border-blue-200 overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-blue-200 rounded-full -mr-8 -mt-8 opacity-50"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <p className="text-gray-700 font-semibold text-sm">Database</p>
                <span className="text-2xl">🗄️</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-base md:text-lg font-black text-blue-900">Connected</span>
              </div>
            </div>
          </div>

          {/* System Load */}
          <div className="relative p-6 bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl border-2 border-amber-200 overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-amber-200 rounded-full -mr-8 -mt-8 opacity-50"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <p className="text-gray-700 font-semibold text-sm">System Load</p>
                <span className="text-2xl">📊</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></span>
                <span className="text-base md:text-lg font-black text-amber-900">Normal</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
