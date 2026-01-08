import Link from 'next/link';
import { FaUsers, FaCalendarAlt, FaBook, FaCrown, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import DashboardChart from '@/components/DashboardChart';

export const dynamic = 'force-dynamic';

async function fetchRecentMessages() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/messages?limit=5`, { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return data.messages || [];
  } catch {
    return [];
  }
}

export default async function AdminDashboard() {
  let userCount = 0;
  let eventCount = 0;
  let courseCount = 0;
  let membershipCount = 0;
  let newUsers = 0;
  let newEvents = 0;
  let connectionError = false;

  try {
    const { connectToDatabase } = await import('@/server/db/mongoose');
    const UserModel = (await import('@/server/db/models/user.model')).default;
    const EventModel = (await import('@/server/db/models/event.model')).default;
    const CourseModel = (await import('@/server/db/models/course.model')).default;
    const MembershipModel = (await import('@/server/db/models/membership.model')).default;

    const connectionPromise = connectToDatabase();
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Connection timeout')), 45000)
    );

    try {
      await Promise.race([connectionPromise, timeoutPromise]);
      userCount = await UserModel.countDocuments({ role: { $in: ['INDIVIDUAL', 'CORPORATE'] } }).maxTimeMS(30000);
      eventCount = await EventModel.countDocuments().maxTimeMS(30000);
      courseCount = await CourseModel.countDocuments().maxTimeMS(30000);
      membershipCount = await MembershipModel.countDocuments().maxTimeMS(30000);
      // New users/events in last 7 days
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      newUsers = await UserModel.countDocuments({
        role: { $in: ['INDIVIDUAL', 'CORPORATE'] },
        createdAt: { $gte: weekAgo }
      }).maxTimeMS(30000);
      newEvents = await EventModel.countDocuments({ createdAt: { $gte: weekAgo } }).maxTimeMS(30000);
    } catch (err) {
      connectionError = true;
    }
  } catch (error) {
    connectionError = true;
  }

  // Fetch recent messages for sidebar
  const recentMessages = await fetchRecentMessages();

  // Example chart data (replace with real data for trends)
  const chartData = [
    { name: '6d ago', Users: userCount - newUsers, Events: eventCount - newEvents },
    { name: 'Now', Users: userCount, Events: eventCount },
  ];

  // Card data for metrics
  const metrics = [
    {
      label: 'Total Users',
      value: userCount,
      icon: <FaUsers className="text-blue-500 text-3xl" />,
      change: newUsers,
      changeLabel: 'this week',
      color: 'from-blue-50 to-blue-100',
      text: 'text-blue-900',
      arrow: newUsers >= 0 ? <FaArrowUp className="text-green-500" /> : <FaArrowDown className="text-red-500" />,
    },
    {
      label: 'Events',
      value: eventCount,
      icon: <FaCalendarAlt className="text-cyan-500 text-3xl" />,
      change: newEvents,
      changeLabel: 'this week',
      color: 'from-cyan-50 to-cyan-100',
      text: 'text-cyan-900',
      arrow: newEvents >= 0 ? <FaArrowUp className="text-green-500" /> : <FaArrowDown className="text-red-500" />,
    },
    {
      label: 'Courses',
      value: courseCount,
      icon: <FaBook className="text-teal-500 text-3xl" />,
      color: 'from-teal-50 to-teal-100',
      text: 'text-teal-900',
    },
    {
      label: 'Memberships',
      value: membershipCount,
      icon: <FaCrown className="text-emerald-500 text-3xl" />,
      color: 'from-emerald-50 to-emerald-100',
      text: 'text-emerald-900',
    },
  ];

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center py-10 px-4">
      {/* Header */}
      <div className="w-full max-w-7xl flex flex-col md:flex-row items-center justify-between mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">Admin Dashboard</h1>
          <p className="text-gray-500 text-lg">Monitor, analyze, and manage your platform with real-time insights.</p>
        </div>
        {/* Action buttons removed as requested */}
      </div>
      <div className="w-full max-w-7xl flex flex-col lg:flex-row gap-8">
        {/* Main dashboard left */}
        <div className="flex-1 min-w-0">
          {/* Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full mb-10">
            {metrics.map((m, i) => (
              <div key={i} className={`bg-gradient-to-br ${m.color} rounded-2xl shadow-lg p-7 flex flex-col items-center relative overflow-hidden`}>
                <div className="absolute right-4 top-4 opacity-10 text-6xl pointer-events-none select-none">
                  {m.icon}
                </div>
                <div className="z-10 flex flex-col items-center">
                  <span className={`text-3xl font-bold ${m.text}`}>{m.value}</span>
                  <span className="text-gray-600 mt-1 font-medium">{m.label}</span>
                  {m.change !== undefined && (
                    <span className="flex items-center gap-1 text-xs mt-2 font-semibold">
                      {m.arrow}
                      <span className={m.change >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {m.change >= 0 ? '+' : ''}{m.change}
                      </span>
                      <span className="text-gray-400 ml-1">{m.changeLabel}</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
          {/* Charts Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-10">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">User & Event Growth (Last 7 Days)</h2>
            <DashboardChart chartData={chartData} />
          </div>
          {/* Main Actions for mobile removed as requested */}
        </div>
        {/* Recent Messages Sidebar */}
        <aside className="w-full lg:w-96 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Recent Messages</h2>
            <ul className="divide-y divide-gray-200">
              {recentMessages.length === 0 && <li className="text-gray-400 text-sm">No recent messages.</li>}
              {recentMessages.map((msg: any) => (
                <li key={msg._id} className="py-3">
                  <div className="font-medium text-gray-900">{msg.senderName || msg.senderEmail || 'User'}</div>
                  <div className="text-gray-600 text-sm truncate">{msg.content}</div>
                  <div className="text-xs text-gray-400 mt-1">{new Date(msg.createdAt).toLocaleString()}</div>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
