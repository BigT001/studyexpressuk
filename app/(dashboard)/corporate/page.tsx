'use client';

import Link from 'next/link';

export default function CorporateDashboardPage() {
  const quickStats = [
    {
      icon: '👥',
      label: 'Total Staff',
      value: '45',
      change: '+5 this month',
      color: 'blue',
    },
    {
      icon: '📚',
      label: 'Active Courses',
      value: '12',
      change: '3 in progress',
      color: 'green',
    },
    {
      icon: '📈',
      label: 'Completion Rate',
      value: '78%',
      change: '+12% from last month',
      color: 'purple',
    },
    {
      icon: '📊',
      label: 'Avg. Progress',
      value: '65%',
      change: 'Staff learning progress',
      color: 'orange',
    },
  ];

  const quickActions = [
    {
      icon: '👥',
      label: 'Add Staff Member',
      href: '/corporate/staff',
      color: 'blue',
    },
    {
      icon: '📚',
      label: 'Browse Courses',
      href: '/corporate/courses',
      color: 'green',
    },
    {
      icon: '💬',
      label: 'View Messages',
      href: '/corporate/messages',
      color: 'purple',
    },
    {
      icon: '🔔',
      label: 'Notifications',
      href: '/corporate/notifications',
      color: 'orange',
    },
  ];

  const recentActivity = [
    {
      type: 'enrollment',
      title: 'Staff Enrolled: Advanced TypeScript',
      description: '5 staff members just enrolled',
      time: '2 hours ago',
    },
    {
      type: 'completion',
      title: 'Course Completed: Leadership Excellence',
      description: 'John Smith completed the course',
      time: '4 hours ago',
    },
    {
      type: 'notification',
      title: 'New Course Available',
      description: 'Data Analytics Fundamentals is now available',
      time: '1 day ago',
    },
    {
      type: 'membership',
      title: 'Membership Renewal',
      description: 'Your Enterprise plan renews in 30 days',
      time: '2 days ago',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg shadow-lg p-6 md:p-8 text-white">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Welcome Back!</h1>
              <p className="text-blue-100 mt-2 text-sm md:text-base">Tech Solutions Ltd • Enterprise Member</p>
            </div>
            <span className="text-5xl md:text-6xl opacity-30">🏢</span>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
            <div className="bg-white bg-opacity-10 rounded-lg p-4">
              <p className="text-blue-100 text-xs md:text-sm">Next Renewal</p>
              <p className="text-xl md:text-2xl font-bold mt-1">30 Days</p>
            </div>
            <div className="bg-white bg-opacity-10 rounded-lg p-4">
              <p className="text-blue-100 text-xs md:text-sm">Staff Training</p>
              <p className="text-xl md:text-2xl font-bold mt-1">12 Active</p>
            </div>
            <div className="bg-white bg-opacity-10 rounded-lg p-4">
              <p className="text-blue-100 text-xs md:text-sm">Support</p>
              <p className="text-xl md:text-2xl font-bold mt-1">24/7 Available</p>
            </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Key Metrics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {quickStats.map((stat, idx) => {
            const colorClasses = {
              blue: 'bg-blue-50 border-blue-200 text-blue-600',
              green: 'bg-green-50 border-green-200 text-green-600',
              purple: 'bg-purple-50 border-purple-200 text-purple-600',
              orange: 'bg-orange-50 border-orange-200 text-orange-600',
            };

            return (
              <div key={idx} className={`${colorClasses[stat.color as keyof typeof colorClasses]} rounded-lg border p-4 md:p-6`}>
                <span className="text-2xl md:text-3xl mb-3 block">{stat.icon}</span>
                <p className="text-gray-600 text-xs md:text-sm font-medium">{stat.label}</p>
                <p className="text-2xl md:text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                <p className="text-xs text-gray-600 mt-2">{stat.change}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {quickActions.map((action, idx) => {
            const colorClasses = {
              blue: 'bg-blue-600 hover:bg-blue-700',
              green: 'bg-green-600 hover:bg-green-700',
              purple: 'bg-purple-600 hover:bg-purple-700',
              orange: 'bg-orange-600 hover:bg-orange-700',
            };

            return (
              <Link
                key={idx}
                href={action.href}
                className={`${colorClasses[action.color as keyof typeof colorClasses]} text-white rounded-lg p-4 md:p-6 flex items-center justify-between transition-colors group`}
              >
                <div className="flex items-center gap-2 md:gap-3">
                  <span className="text-xl md:text-2xl">{action.icon}</span>
                  <span className="font-medium text-sm md:text-base">{action.label}</span>
                </div>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 md:p-6 border-b border-gray-200">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">Recent Activity</h2>
          <p className="text-gray-600 mt-1 text-sm md:text-base">Latest updates from your organization</p>
        </div>

        <div className="divide-y divide-gray-200">
          {recentActivity.map((activity, idx) => (
            <div key={idx} className="p-4 md:p-6 hover:bg-gray-50 transition-colors cursor-pointer">
              <div className="flex flex-col sm:flex-row items-start justify-between gap-2 sm:gap-4">
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 text-sm md:text-base">{activity.title}</h3>
                  <p className="text-gray-600 text-xs md:text-sm mt-1">{activity.description}</p>
                </div>
                <span className="text-gray-600 text-xs md:text-sm whitespace-nowrap">{activity.time}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gray-50 border-t border-gray-200 p-4 md:p-6">
          <Link href="/corporate/notifications" className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2 text-sm md:text-base">
            View All Activity
            <span>→</span>
          </Link>
        </div>
      </div>

      {/* Getting Started Section */}
      <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200 p-6 md:p-8">
        <div className="max-w-2xl">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Getting Started</h2>
          <p className="text-gray-700 mt-2 text-sm md:text-base">New to our platform? Here are some helpful resources:</p>

          <div className="mt-6 space-y-3">
            <Link href="/corporate/staff" className="block p-4 bg-white rounded-lg hover:shadow-md transition-shadow">
              <h3 className="font-bold text-gray-900 text-sm md:text-base">Add Staff Members</h3>
              <p className="text-gray-600 text-xs md:text-sm mt-1">Invite your team and manage their accounts</p>
            </Link>

            <Link href="/corporate/courses" className="block p-4 bg-white rounded-lg hover:shadow-md transition-shadow">
              <h3 className="font-bold text-gray-900 text-sm md:text-base">Assign Courses</h3>
              <p className="text-gray-600 text-xs md:text-sm mt-1">Browse and assign training courses to your staff</p>
            </Link>

            <Link href="/corporate/profile" className="block p-4 bg-white rounded-lg hover:shadow-md transition-shadow">
              <h3 className="font-bold text-gray-900 text-sm md:text-base">Update Your Profile</h3>
              <p className="text-gray-600 text-xs md:text-sm mt-1">Manage your company information and settings</p>
            </Link>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
