'use client';

import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  Users,
  TrendingUp,
  BookOpen,
  Zap,
  Activity,
  Download,
  Filter,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

export default function SubAdminReportsPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState('30days');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>({});
  const [error, setError] = useState('');

  // Calculate date range
  useEffect(() => {
    const today = new Date();
    let start = new Date();

    switch (dateRange) {
      case '7days':
        start.setDate(today.getDate() - 7);
        break;
      case '30days':
        start.setDate(today.getDate() - 30);
        break;
      case '90days':
        start.setDate(today.getDate() - 90);
        break;
      case 'custom':
        if (!startDate || !endDate) return;
        start = new Date(startDate);
        today.setHours(23, 59, 59, 999);
        break;
      default:
        start.setDate(today.getDate() - 30);
    }

    start.setHours(0, 0, 0, 0);
    today.setHours(23, 59, 59, 999);

    const startStr = start.toISOString();
    const endStr = today.toISOString();

    fetchMetrics(activeTab, startStr, endStr);
  }, [activeTab, dateRange, startDate, endDate]);

  const fetchMetrics = async (metric: string, start: string, end: string) => {
    try {
      setLoading(true);
      setError('');
      // Using the same endpoint as admin, thanks to updated permissions
      const response = await fetch(
        `/api/admin/analytics?metric=${metric}&startDate=${start}&endDate=${end}`
      );
      if (!response.ok) throw new Error('Failed to fetch metrics');
      const json = await response.json();
      if (json.success) {
        setData(json.data);
      } else {
        setError(json.error || 'Failed to load data');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const generateReport = () => {
    const reportData = JSON.stringify(data, null, 2);
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(reportData));
    element.setAttribute('download', `analytics-report-${new Date().toISOString().split('T')[0]}.json`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Reports & Insights</h1>
          <p className="text-gray-600 mt-2">Comprehensive platform analytics and reporting</p>
        </div>
        <button
          onClick={generateReport}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
        >
          <Download className="w-4 h-4" />
          Export Report
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-gray-200 overflow-x-auto">
        {[
          { id: 'overview', label: '📊 Overview', icon: Users },
          { id: 'courses', label: '📚 Courses', icon: BookOpen },
          { id: 'events', label: '⚡ Events', icon: Zap },
          { id: 'userBehavior', label: '👥 User Behavior', icon: TrendingUp },
          { id: 'individuals', label: '👤 Individuals', icon: Users },
          { id: 'memberships', label: '💳 Memberships', icon: Users },
          { id: 'corporates', label: '🏢 Corporates', icon: Users },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 font-medium transition border-b-2 whitespace-nowrap ${activeTab === tab.id
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}

      {!loading && (
        <>
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && data.overview && (
            <div className="space-y-6">
              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Total Users */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200 shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-600 text-sm font-semibold uppercase">Total Users</p>
                      <p className="text-3xl font-bold text-blue-900 mt-2">{data.overview.totalUsers}</p>
                      <p className="text-blue-700 text-xs mt-2">
                        {data.overview.newUsersThisMonth} new this month
                      </p>
                    </div>
                    <Users className="w-12 h-12 text-blue-400" />
                  </div>
                </div>

                {/* Active Users */}
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200 shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-600 text-sm font-semibold uppercase">Active Today</p>
                      <p className="text-3xl font-bold text-green-900 mt-2">{data.overview.activeUsersToday}</p>
                      <p className="text-green-700 text-xs mt-2">
                        {data.overview.activeUsersLastWeek} active last week
                      </p>
                    </div>
                    <Activity className="w-12 h-12 text-green-400" />
                  </div>
                </div>

                {/* Subscription Rate */}
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200 shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-600 text-sm font-semibold uppercase">Subscription Rate</p>
                      <p className="text-3xl font-bold text-purple-900 mt-2">{data.overview.subscriptionRate}%</p>
                      <p className="text-purple-700 text-xs mt-2">
                        {data.overview.totalSubscribed} subscribers
                      </p>
                    </div>
                    <TrendingUp className="w-12 h-12 text-purple-400" />
                  </div>
                </div>
              </div>

              {/* Membership Statistics */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Membership Statistics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* User Memberships - Paid */}
                  <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-4 border border-emerald-200 shadow">
                    <p className="text-emerald-600 text-xs font-semibold uppercase">Paid Memberships (Users)</p>
                    <p className="text-2xl font-bold text-emerald-900 mt-2">{data.overview.memberships?.users?.paid || 0}</p>
                  </div>

                  {/* User Memberships - Unpaid */}
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200 shadow">
                    <p className="text-orange-600 text-xs font-semibold uppercase">Unpaid Memberships (Users)</p>
                    <p className="text-2xl font-bold text-orange-900 mt-2">{data.overview.memberships?.users?.unpaid || 0}</p>
                  </div>

                  {/* Corporate Memberships - Paid */}
                  <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-lg p-4 border border-cyan-200 shadow">
                    <p className="text-cyan-600 text-xs font-semibold uppercase">Paid Memberships (Corporates)</p>
                    <p className="text-2xl font-bold text-cyan-900 mt-2">{data.overview.memberships?.corporates?.paid || 0}</p>
                  </div>

                  {/* Corporate Memberships - Unpaid */}
                  <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg p-4 border border-pink-200 shadow">
                    <p className="text-pink-600 text-xs font-semibold uppercase">Unpaid Memberships (Corporates)</p>
                    <p className="text-2xl font-bold text-pink-900 mt-2">{data.overview.memberships?.corporates?.unpaid || 0}</p>
                  </div>
                </div>
              </div>

              {/* Users by Role */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg p-6 border border-gray-200 shadow">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Users by Role</h3>
                  <div className="space-y-3">
                    {data.overview.usersByRole?.map((role: any) => (
                      <div key={role._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium text-gray-700">{role._id}</span>
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">
                          {role.count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pie Chart */}
                <div className="bg-white rounded-lg p-6 border border-gray-200 shadow">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">User Distribution</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={data.overview.usersByRole || []}
                        dataKey="count"
                        nameKey="_id"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label
                      >
                        {data.overview.usersByRole?.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* COURSES TAB */}
          {activeTab === 'courses' && data.courses && (
            <div className="space-y-6">
              {/* Top KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Courses */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200 shadow">
                  <p className="text-blue-600 text-xs font-semibold uppercase">Total Courses</p>
                  <p className="text-3xl font-bold text-blue-900 mt-2">{data.courses.totalCourses}</p>
                  <p className="text-blue-700 text-xs mt-2">{data.courses.paidCourses} paid · {data.courses.freeCourses} free</p>
                </div>

                {/* Total Enrollments */}
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200 shadow">
                  <p className="text-purple-600 text-xs font-semibold uppercase">Total Enrollments</p>
                  <p className="text-3xl font-bold text-purple-900 mt-2">{data.courses.totalEnrollments}</p>
                  <p className="text-purple-700 text-xs mt-2">{data.courses.averageEnrollmentPerCourse} avg per course</p>
                </div>

                {/* Completion Rate */}
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200 shadow">
                  <p className="text-green-600 text-xs font-semibold uppercase">Completion Rate</p>
                  <p className="text-3xl font-bold text-green-900 mt-2">{data.courses.completionRate}%</p>
                  <p className="text-green-700 text-xs mt-2">{data.courses.completedEnrollments} completed</p>
                </div>

                {/* Total Revenue */}
                <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-4 border border-amber-200 shadow">
                  <p className="text-amber-600 text-xs font-semibold uppercase">Total Revenue</p>
                  <p className="text-3xl font-bold text-amber-900 mt-2">${data.courses.totalRevenue?.toFixed(2) || '0.00'}</p>
                  <p className="text-amber-700 text-xs mt-2">${data.courses.paidCourseRevenue?.toFixed(2) || '0.00'} from paid</p>
                </div>
              </div>

              {/* Top Courses Table */}
              <div className="bg-white rounded-lg p-6 border border-gray-200 shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Courses by Enrollment</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700">Course Title</th>
                        <th className="px-4 py-3 text-center font-semibold text-gray-700">Category</th>
                        <th className="px-4 py-3 text-center font-semibold text-gray-700">Level</th>
                        <th className="px-4 py-3 text-center font-semibold text-gray-700">Enrollments</th>
                        <th className="px-4 py-3 text-center font-semibold text-gray-700">Completion %</th>
                        <th className="px-4 py-3 text-right font-semibold text-gray-700">Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.courses.topCourses?.map((course: any, idx: number) => (
                        <tr key={idx} className="border-b hover:bg-gray-50 transition">
                          <td className="px-4 py-3 text-gray-900 font-medium max-w-xs truncate">{course.title}</td>
                          <td className="px-4 py-3 text-center text-gray-600">{course.category}</td>
                          <td className="px-4 py-3 text-center">
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs capitalize font-medium">
                              {course.level}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                              {course.enrollments}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center font-semibold text-gray-900">
                            {course.completionRate}%
                          </td>
                          <td className="px-4 py-3 text-right">
                            <span className={`font-bold ${course.revenue > 0 ? 'text-amber-600' : 'text-gray-500'}`}>
                              ${course.revenue ? course.revenue.toFixed(2) : '0.00'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* EVENTS TAB */}
          {activeTab === 'events' && data.events && (
            <div className="space-y-6">
              {/* Top KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Events */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200 shadow">
                  <p className="text-blue-600 text-xs font-semibold uppercase">Total Events</p>
                  <p className="text-3xl font-bold text-blue-900 mt-2">{data.events.totalEvents}</p>
                  <p className="text-blue-700 text-xs mt-2">{data.events.upcomingEvents} upcoming · {data.events.completedEvents} completed</p>
                </div>

                {/* Total Registrations */}
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200 shadow">
                  <p className="text-purple-600 text-xs font-semibold uppercase">Total Registrations</p>
                  <p className="text-3xl font-bold text-purple-900 mt-2">{data.events.totalRegistrations}</p>
                  <p className="text-purple-700 text-xs mt-2">{data.events.paidEvents} paid · {data.events.freeEvents} free</p>
                </div>

                {/* Attendance Rate */}
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200 shadow">
                  <p className="text-green-600 text-xs font-semibold uppercase">Attendance Rate</p>
                  <p className="text-3xl font-bold text-green-900 mt-2">{data.events.attendanceRate}%</p>
                  <p className="text-green-700 text-xs mt-2">{data.events.totalAttended} attended</p>
                </div>

                {/* Capacity Utilization */}
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200 shadow">
                  <p className="text-orange-600 text-xs font-semibold uppercase">Capacity Utilization</p>
                  <p className="text-3xl font-bold text-orange-900 mt-2">{data.events.capacityUtilizationPercentage}%</p>
                  <p className="text-orange-700 text-xs mt-2">Avg: {data.events.avgCapacityUtilization}% per event</p>
                </div>
              </div>
            </div>
          )}

          {/* USER BEHAVIOR TAB */}
          {activeTab === 'userBehavior' && data.userBehavior && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200 shadow">
                  <p className="text-blue-600 text-xs font-semibold uppercase">Total Users</p>
                  <p className="text-3xl font-bold text-blue-900 mt-2">{data.userBehavior.summary?.totalUsers || 0}</p>
                </div>
                {/* Additional metrics removed for brevity but can be added back */}
              </div>
              {/* User Growth Chart */}
              <div className="bg-white rounded-lg p-6 border border-gray-200 shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">User Growth Trend (Last 30 Days)</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={data.userBehavior.userGrowth || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="_id" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="newUsers" stroke="#3B82F6" strokeWidth={2} name="New Users" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Placeholder for other tabs if they exist in full admin version */}
          {['individuals', 'memberships', 'corporates'].includes(activeTab) && (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200 shadow">
              <h3 className="text-lg font-semibold text-gray-900">Detailed reports coming soon</h3>
              <p className="text-gray-500 mt-2">Use the Overview tab for summary statistics.</p>
            </div>
          )}

        </>
      )}
    </div>
  );
}
