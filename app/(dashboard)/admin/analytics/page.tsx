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

export default function AnalyticsPage() {
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
          <h1 className="text-4xl font-bold text-gray-900">Analytics & Insights</h1>
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

      {/* Date Range & Filters */}
      {/* Removed - keeping default 30-day range */}

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
            className={`px-4 py-3 font-medium transition border-b-2 whitespace-nowrap ${
              activeTab === tab.id
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

              {/* Revenue & Enrollment Breakdown */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue Breakdown Card */}
                <div className="bg-white rounded-lg p-6 border border-gray-200 shadow">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Breakdown</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-700">Paid Course Revenue</p>
                        <p className="text-sm text-gray-600">{data.courses.paidCourseEnrollments} enrollments</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-amber-600">${data.courses.paidCourseRevenue?.toFixed(2) || '0.00'}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-700">Free Course Enrollments</p>
                        <p className="text-sm text-gray-600">{data.courses.totalEnrollments - data.courses.paidCourseEnrollments} enrollments</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-blue-600">$0.00</p>
                      </div>
                    </div>
                    <div className="border-t pt-3 flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-900">Average Revenue Per Paid Enrollment</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-green-600">
                          ${data.courses.paidCourseEnrollments > 0 
                            ? (data.courses.paidCourseRevenue / data.courses.paidCourseEnrollments).toFixed(2)
                            : '0.00'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enrollment Status */}
                <div className="bg-white rounded-lg p-6 border border-gray-200 shadow">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Enrollment Status</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <p className="font-medium text-gray-700">Completed</p>
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold">
                        {data.courses.completedEnrollments}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                      <p className="font-medium text-gray-700">In Progress</p>
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-bold">
                        {data.courses.totalEnrollments - data.courses.completedEnrollments}
                      </span>
                    </div>
                    <div className="border-t pt-3">
                      <p className="text-sm text-gray-600 mb-2">Completion Distribution</p>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{width: `${data.courses.completionRate}%`}}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-600 mt-2">{data.courses.completionRate}% of all enrollments completed</p>
                    </div>
                  </div>
                </div>

                {/* Price Distribution */}
                <div className="bg-white rounded-lg p-6 border border-gray-200 shadow">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Price Distribution</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Free Courses</span>
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">
                        {data.courses.priceDistribution?.free || 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">$1 - $50</span>
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold">
                        {data.courses.priceDistribution?.lowPrice || 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">$50 - $150</span>
                      <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-bold">
                        {data.courses.priceDistribution?.mediumPrice || 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">$150+</span>
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-bold">
                        {data.courses.priceDistribution?.highPrice || 0}
                      </span>
                    </div>
                  </div>
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
                        <th className="px-4 py-3 text-center font-semibold text-gray-700">Price</th>
                        <th className="px-4 py-3 text-center font-semibold text-gray-700">Enrollments</th>
                        <th className="px-4 py-3 text-center font-semibold text-gray-700">Completed</th>
                        <th className="px-4 py-3 text-center font-semibold text-gray-700">Completion %</th>
                        <th className="px-4 py-3 text-center font-semibold text-gray-700">Avg Progress</th>
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
                          <td className="px-4 py-3 text-center font-semibold text-gray-900">
                            ${course.price > 0 ? course.price.toFixed(2) : 'Free'}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                              {course.enrollments}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                              {course.completed}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center font-semibold text-gray-900">
                            {course.completionRate}%
                          </td>
                          <td className="px-4 py-3 text-center text-gray-900">{course.avgProgress}%</td>
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
                  <p className="text-green-700 text-xs mt-2">{data.events.totalAttended} attended · {data.events.totalNoShows} no-shows</p>
                </div>

                {/* Capacity Utilization */}
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200 shadow">
                  <p className="text-orange-600 text-xs font-semibold uppercase">Capacity Utilization</p>
                  <p className="text-3xl font-bold text-orange-900 mt-2">{data.events.capacityUtilizationPercentage}%</p>
                  <p className="text-orange-700 text-xs mt-2">Avg: {data.events.avgCapacityUtilization}% per event</p>
                </div>
              </div>

              {/* Event Analysis Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Event Type Breakdown */}
                <div className="bg-white rounded-lg p-6 border border-gray-200 shadow">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Format Distribution</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Online Events</span>
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">
                        {data.events.eventsByFormat?.online || 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Offline Events</span>
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold">
                        {data.events.eventsByFormat?.offline || 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Hybrid Events</span>
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-bold">
                        {data.events.eventsByFormat?.hybrid || 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Not Specified</span>
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-bold">
                        {data.events.eventsByFormat?.unspecified || 0}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Attendance Analysis */}
                <div className="bg-white rounded-lg p-6 border border-gray-200 shadow">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Attendance Analysis</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-700">Attended</p>
                        <p className="text-sm text-gray-600">{data.events.attendanceRate}% attendance rate</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-green-600">{data.events.totalAttended}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-700">No-Shows</p>
                        <p className="text-sm text-gray-600">{data.events.noShowRate}% no-show rate</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-red-600">{data.events.totalNoShows}</p>
                      </div>
                    </div>
                    <div className="border-t pt-3">
                      <p className="text-sm text-gray-600 mb-2">Attendance Distribution</p>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{width: `${data.events.attendanceRate}%`}}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-600 mt-2">{data.events.totalAttended}/{data.events.totalRegistrations} registrations attended</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Paid vs Free Events Performance Comparison */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Paid Events Performance */}
                <div className="bg-white rounded-lg p-6 border border-gray-200 shadow">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Paid Events</h3>
                    <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold">
                      {data.events.paidEventsMetrics?.count || 0}
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Total Registrations</span>
                      <span className="font-bold text-gray-900">{data.events.paidEventsMetrics?.totalRegistrations || 0}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Attended</span>
                      <span className="font-bold text-green-600">{data.events.paidEventsMetrics?.totalAttended || 0}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Attendance Rate</span>
                      <span className="font-bold text-blue-600">{data.events.paidEventsMetrics?.attendanceRate || 0}%</span>
                    </div>
                    <div className="border-t pt-3 flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Avg Registrations/Event</span>
                      <span className="font-bold text-gray-900">{data.events.paidEventsMetrics?.avgRegistrationsPerEvent || 0}</span>
                    </div>
                  </div>
                </div>

                {/* Free Events Performance */}
                <div className="bg-white rounded-lg p-6 border border-gray-200 shadow">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Free Events</h3>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                      {data.events.freeEventsMetrics?.count || 0}
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Total Registrations</span>
                      <span className="font-bold text-gray-900">{data.events.freeEventsMetrics?.totalRegistrations || 0}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Attended</span>
                      <span className="font-bold text-green-600">{data.events.freeEventsMetrics?.totalAttended || 0}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Attendance Rate</span>
                      <span className="font-bold text-blue-600">{data.events.freeEventsMetrics?.attendanceRate || 0}%</span>
                    </div>
                    <div className="border-t pt-3 flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Avg Registrations/Event</span>
                      <span className="font-bold text-gray-900">{data.events.freeEventsMetrics?.avgRegistrationsPerEvent || 0}</span>
                    </div>
                  </div>
                </div>

                {/* Corporate Events Performance */}
                <div className="bg-white rounded-lg p-6 border border-gray-200 shadow">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Corporate Events</h3>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                      {data.events.corporateEventsMetrics?.count || 0}
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Total Registrations</span>
                      <span className="font-bold text-gray-900">{data.events.corporateEventsMetrics?.totalRegistrations || 0}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Attended</span>
                      <span className="font-bold text-green-600">{data.events.corporateEventsMetrics?.totalAttended || 0}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Avg Registrations/Event</span>
                      <span className="font-bold text-blue-600">{data.events.corporateEventsMetrics?.avgRegistrationsPerEvent || 0}</span>
                    </div>
                    <div className="border-t pt-3">
                      <p className="text-xs text-gray-600">More metrics coming soon</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Top Events Table */}
              <div className="bg-white rounded-lg p-6 border border-gray-200 shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Events by Registration</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700">Event Title</th>
                        <th className="px-4 py-3 text-center font-semibold text-gray-700">Category</th>
                        <th className="px-4 py-3 text-center font-semibold text-gray-700">Format</th>
                        <th className="px-4 py-3 text-center font-semibold text-gray-700">Registrations</th>
                        <th className="px-4 py-3 text-center font-semibold text-gray-700">Attended</th>
                        <th className="px-4 py-3 text-center font-semibold text-gray-700">Attendance %</th>
                        <th className="px-4 py-3 text-center font-semibold text-gray-700">No-Shows %</th>
                        <th className="px-4 py-3 text-center font-semibold text-gray-700">Capacity Used</th>
                        <th className="px-4 py-3 text-center font-semibold text-gray-700">Type</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.events.topEvents?.map((event: any, idx: number) => (
                        <tr key={idx} className="border-b hover:bg-gray-50 transition">
                          <td className="px-4 py-3 text-gray-900 font-medium max-w-xs truncate">{event.title}</td>
                          <td className="px-4 py-3 text-center text-gray-600 text-xs">{event.category}</td>
                          <td className="px-4 py-3 text-center">
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs capitalize font-medium">
                              {event.format}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                              {event.registrations}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                              {event.attended}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center font-semibold text-gray-900">
                            {event.attendanceRate}%
                          </td>
                          <td className="px-4 py-3 text-center font-semibold text-gray-900">
                            {event.noShowRate}%
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs font-bold">
                              {event.capacityUtilization}%
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className={`px-2 py-1 rounded text-xs font-bold ${
                              event.access === 'premium' ? 'bg-amber-100 text-amber-700' :
                              event.access === 'corporate' ? 'bg-blue-100 text-blue-700' :
                              'bg-green-100 text-green-700'
                            }`}>
                              {event.access === 'premium' ? 'Paid' : event.access === 'corporate' ? 'Corporate' : 'Free'}
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

          {/* USER BEHAVIOR TAB */}
          {activeTab === 'userBehavior' && data.userBehavior && (
            <div className="space-y-6">
              {/* Summary Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200 shadow">
                  <p className="text-blue-600 text-xs font-semibold uppercase">Total Users</p>
                  <p className="text-3xl font-bold text-blue-900 mt-2">{data.userBehavior.summary?.totalUsers || 0}</p>
                  <p className="text-blue-700 text-xs mt-2">{data.userBehavior.summary?.totalSubscribed} subscribed</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200 shadow">
                  <p className="text-green-600 text-xs font-semibold uppercase">Active This Week</p>
                  <p className="text-3xl font-bold text-green-900 mt-2">{data.userBehavior.summary?.totalActiveLastWeek || 0}</p>
                  <p className="text-green-700 text-xs mt-2">{data.userBehavior.summary?.weeklyEngagementRate}% of users</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200 shadow">
                  <p className="text-purple-600 text-xs font-semibold uppercase">Active Today</p>
                  <p className="text-3xl font-bold text-purple-900 mt-2">{data.userBehavior.summary?.totalActiveToday || 0}</p>
                  <p className="text-purple-700 text-xs mt-2">Current day activity</p>
                </div>
                <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-4 border border-amber-200 shadow">
                  <p className="text-amber-600 text-xs font-semibold uppercase">Subscription Rate</p>
                  <p className="text-3xl font-bold text-amber-900 mt-2">{data.userBehavior.summary?.subscriptionRate || 0}%</p>
                  <p className="text-amber-700 text-xs mt-2">Of total users</p>
                </div>
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

              {/* Engagement by Role & Distribution */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg p-6 border border-gray-200 shadow">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Engagement by Role</h3>
                  <div className="space-y-3">
                    {data.userBehavior.engagementByRole?.map((role: any) => (
                      <div key={role._id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="font-semibold text-gray-900 mb-2 capitalize">{role._id?.toLowerCase()}</p>
                        <div className="grid grid-cols-4 gap-2 text-xs">
                          <div>
                            <p className="text-gray-600 text-xs">Total</p>
                            <p className="font-bold text-lg text-gray-900">{role.totalUsers}</p>
                          </div>
                          <div>
                            <p className="text-gray-600 text-xs">Subscribed</p>
                            <p className="font-bold text-lg text-green-600">{role.subscribed}</p>
                          </div>
                          <div>
                            <p className="text-gray-600 text-xs">Active Week</p>
                            <p className="font-bold text-lg text-blue-600">{role.activeLastWeek}</p>
                          </div>
                          <div>
                            <p className="text-gray-600 text-xs">Active Today</p>
                            <p className="font-bold text-lg text-purple-600">{role.activeToday}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-lg p-6 border border-gray-200 shadow">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Role Distribution</h3>
                  <ResponsiveContainer width="100%" height={500}>
                    <PieChart>
                      <Pie
                        data={data.userBehavior.engagementByRole || []}
                        dataKey="totalUsers"
                        nameKey="_id"
                        cx="50%"
                        cy="50%"
                        outerRadius={120}
                        label={(entry: any) => `${entry._id}: ${entry.totalUsers}`}
                      >
                        {data.userBehavior.engagementByRole?.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value} users`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* INDIVIDUALS TAB */}
          {activeTab === 'individuals' && data.individuals && (
            <div className="space-y-6">
              {/* Summary KPIs */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200 shadow">
                  <p className="text-blue-600 text-xs font-semibold uppercase">Total Individuals</p>
                  <p className="text-3xl font-bold text-blue-900 mt-2">{data.individuals.totalIndividuals || 0}</p>
                  <p className="text-blue-700 text-xs mt-2">Active users</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200 shadow">
                  <p className="text-green-600 text-xs font-semibold uppercase">Subscribed</p>
                  <p className="text-3xl font-bold text-green-900 mt-2">{data.individuals.subscribedIndividuals || 0}</p>
                  <p className="text-green-700 text-xs mt-2">{data.individuals.subscriptionRate || 0}% rate</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200 shadow">
                  <p className="text-purple-600 text-xs font-semibold uppercase">Total Enrollments</p>
                  <p className="text-3xl font-bold text-purple-900 mt-2">{data.individuals.totalEnrollments || 0}</p>
                  <p className="text-purple-700 text-xs mt-2">Courses & events</p>
                </div>
                <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-4 border border-amber-200 shadow">
                  <p className="text-amber-600 text-xs font-semibold uppercase">Avg Enrollments</p>
                  <p className="text-3xl font-bold text-amber-900 mt-2">{data.individuals.avgEnrollmentsPerUser || 0}</p>
                  <p className="text-amber-700 text-xs mt-2">Per individual</p>
                </div>
              </div>

              {/* Top Individuals Table */}
              <div className="bg-white rounded-lg p-6 border border-gray-200 shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Individuals by Engagement</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-gray-700 font-semibold">Name</th>
                        <th className="px-4 py-3 text-left text-gray-700 font-semibold">Email</th>
                        <th className="px-4 py-3 text-center text-gray-700 font-semibold">Enrollments</th>
                        <th className="px-4 py-3 text-center text-gray-700 font-semibold">Completed</th>
                        <th className="px-4 py-3 text-center text-gray-700 font-semibold">Completion %</th>
                        <th className="px-4 py-3 text-center text-gray-700 font-semibold">Status</th>
                        <th className="px-4 py-3 text-center text-gray-700 font-semibold">Last Active</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {data.individuals.topIndividuals?.map((user: any, idx: number) => (
                        <tr key={idx} className="hover:bg-gray-50 transition">
                          <td className="px-4 py-3 font-semibold text-gray-900">{user.userName || '-'}</td>
                          <td className="px-4 py-3 text-gray-600 text-xs">{user.email || '-'}</td>
                          <td className="px-4 py-3 text-center font-semibold text-blue-600">{user.enrollments || 0}</td>
                          <td className="px-4 py-3 text-center font-semibold text-green-600">{user.completed || 0}</td>
                          <td className="px-4 py-3 text-center font-semibold text-purple-600">{user.completionRate || 0}%</td>
                          <td className="px-4 py-3 text-center">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              user.subscriptionStatus === 'subscribed'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {user.subscriptionStatus || 'Free'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center text-gray-600 text-xs">{user.lastActive || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Enrollment Distribution */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg p-6 border border-gray-200 shadow">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Enrollment Distribution by Type</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Course Enrollments', value: data.individuals.courseEnrollments || 0 },
                          { name: 'Event Registrations', value: data.individuals.eventRegistrations || 0 },
                        ]}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        <Cell fill="#3B82F6" />
                        <Cell fill="#10B981" />
                      </Pie>
                      <Tooltip formatter={(value) => `${value} enrollments`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white rounded-lg p-6 border border-gray-200 shadow">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Completion Status</h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-blue-600 text-xs font-semibold uppercase">In Progress</p>
                      <p className="text-3xl font-bold text-blue-900 mt-2">{data.individuals.inProgressEnrollments || 0}</p>
                      <p className="text-blue-700 text-xs mt-1">Active enrollments</p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-green-600 text-xs font-semibold uppercase">Completed</p>
                      <p className="text-3xl font-bold text-green-900 mt-2">{data.individuals.completedEnrollments || 0}</p>
                      <p className="text-green-700 text-xs mt-1">Finished courses/events</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* MEMBERSHIPS TAB */}
          {activeTab === 'memberships' && data.memberships && (
            <div className="space-y-6">
              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200 shadow">
                  <p className="text-blue-600 text-sm font-semibold uppercase">Total Memberships</p>
                  <p className="text-3xl font-bold text-blue-900 mt-2">{data.memberships.totalMemberships}</p>
                  <p className="text-blue-700 text-xs mt-2">{data.memberships.activeMemberships} active</p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200 shadow">
                  <p className="text-green-600 text-sm font-semibold uppercase">Paid Users</p>
                  <p className="text-3xl font-bold text-green-900 mt-2">{data.memberships.userBreakdown.paidUsers}</p>
                  <p className="text-green-700 text-xs mt-2">{data.memberships.userBreakdown.paidPercentage}% of users</p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200 shadow">
                  <p className="text-purple-600 text-sm font-semibold uppercase">Unpaid Users</p>
                  <p className="text-3xl font-bold text-purple-900 mt-2">{data.memberships.userBreakdown.unpaidUsers}</p>
                  <p className="text-purple-700 text-xs mt-2">{data.memberships.userBreakdown.totalUsers} total users</p>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6 border border-orange-200 shadow">
                  <p className="text-orange-600 text-sm font-semibold uppercase">Corporate Plans</p>
                  <p className="text-3xl font-bold text-orange-900 mt-2">{data.memberships.corporateMemberships}</p>
                  <p className="text-orange-700 text-xs mt-2">{data.memberships.userMemberships} personal plans</p>
                </div>
              </div>

              {/* Memberships by Status and Type */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg p-6 border border-gray-200 shadow">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">By Status</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={data.memberships.membershipsByStatus || []}
                        dataKey="count"
                        nameKey="_id"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label
                      >
                        {data.memberships.membershipsByStatus?.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white rounded-lg p-6 border border-gray-200 shadow">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">By Type</h3>
                  <div className="space-y-4">
                    {data.memberships.membershipsByType?.map((type: any) => (
                      <div key={type._id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex justify-between items-center mb-2">
                          <p className="font-semibold text-gray-900">{type._id}</p>
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">{type.count}</span>
                        </div>
                        <div className="flex gap-4 text-xs">
                          <div>
                            <p className="text-gray-600">Active</p>
                            <p className="font-bold text-lg text-green-600">{type.activeCount}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Inactive</p>
                            <p className="font-bold text-lg text-gray-600">{type.count - type.activeCount}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Memberships by Plan */}
              <div className="bg-white rounded-lg p-6 border border-gray-200 shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Plans Breakdown</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700">Plan</th>
                        <th className="px-4 py-3 text-center font-semibold text-gray-700">Total</th>
                        <th className="px-4 py-3 text-center font-semibold text-gray-700">Active</th>
                        <th className="px-4 py-3 text-center font-semibold text-gray-700">Expired</th>
                        <th className="px-4 py-3 text-right font-semibold text-gray-700">Cancelled</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.memberships.membershipsByPlan?.map((plan: any, idx: number) => (
                        <tr key={idx} className="border-b hover:bg-gray-50 transition">
                          <td className="px-4 py-3 text-gray-900 font-medium">{plan._id}</td>
                          <td className="px-4 py-3 text-center">
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                              {plan.totalCount}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                              {plan.activeCount}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold">
                              {plan.expiredCount}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">
                              {plan.cancelledCount}
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

          {/* CORPORATES TAB */}
          {activeTab === 'corporates' && data.corporates && (
            <div className="space-y-6">
              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200 shadow">
                  <p className="text-blue-600 text-sm font-semibold uppercase">Total Corporates</p>
                  <p className="text-3xl font-bold text-blue-900 mt-2">{data.corporates.totalCorporates}</p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200 shadow">
                  <p className="text-green-600 text-sm font-semibold uppercase">Active</p>
                  <p className="text-3xl font-bold text-green-900 mt-2">{data.corporates.activeCorporates}</p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200 shadow">
                  <p className="text-purple-600 text-sm font-semibold uppercase">Verified</p>
                  <p className="text-3xl font-bold text-purple-900 mt-2">{data.corporates.verifiedCorporates}</p>
                </div>
              </div>

              {/* Corporate Tiers */}
              <div className="bg-white rounded-lg p-6 border border-gray-200 shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tiers by Staff Volume</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {data.corporates.corporateTiers?.map((tier: any) => (
                    <div key={tier._id} className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                      <p className="text-sm font-bold text-gray-700 mb-3 uppercase">{tier._id}</p>
                      <div className="space-y-2">
                        <div>
                          <p className="text-xs text-gray-600">Corporates</p>
                          <p className="text-2xl font-bold text-gray-900">{tier.count}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Avg Staff</p>
                          <p className="text-lg font-bold text-blue-600">{tier.avgStaffCount}</p>
                        </div>
                        <div className="pt-2 border-t border-gray-300">
                          <p className="text-xs text-gray-600 mb-2">Paid Plans</p>
                          <div className="flex justify-between">
                            <span className="text-sm font-bold text-green-600">{tier.paidCount} paid</span>
                            <span className="text-sm font-bold text-red-600">{tier.unpaidCount} unpaid</span>
                          </div>
                          <p className="text-xs text-gray-700 mt-1">{tier.paidPercentage}% paid</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Corporates by Status */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg p-6 border border-gray-200 shadow">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">By Status</h3>
                  <div className="space-y-3">
                    {data.corporates.corporatesByStatus?.map((status: any) => (
                      <div key={status._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium text-gray-700 capitalize">{status._id}</span>
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">
                          {status.count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-lg p-6 border border-gray-200 shadow">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">By Industry (Top 10)</h3>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {data.corporates.corporatesByIndustry?.map((industry: any) => (
                      <div key={industry._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium text-gray-700">{industry._id}</span>
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">
                          {industry.count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Top Corporates with Staff & Subscription */}
              <div className="bg-white rounded-lg p-6 border border-gray-200 shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Corporates (by Staff Count)</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700">Company</th>
                        <th className="px-4 py-3 text-center font-semibold text-gray-700">Staff</th>
                        <th className="px-4 py-3 text-center font-semibold text-gray-700">Status</th>
                        <th className="px-4 py-3 text-center font-semibold text-gray-700">Subscription</th>
                        <th className="px-4 py-3 text-right font-semibold text-gray-700">Plan</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.corporates.corporatesWithStaffStats?.map((corp: any, idx: number) => (
                        <tr key={idx} className="border-b hover:bg-gray-50 transition">
                          <td className="px-4 py-3 text-gray-900 font-medium">{corp.companyName}</td>
                          <td className="px-4 py-3 text-center">
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                              {corp.staffCount}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${
                              corp.status === 'active' ? 'bg-green-100 text-green-700' :
                              corp.status === 'verified' ? 'bg-blue-100 text-blue-700' :
                              'bg-yellow-100 text-yellow-700'
                            }`}>
                              {corp.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              corp.hasMembership ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                            }`}>
                              {corp.hasMembership ? 'Paid' : 'Free'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right text-gray-600 text-xs">
                            {corp.membershipPlan || '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
