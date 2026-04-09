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
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-gray-100">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-3">
            Analytics & Insights <Activity className="text-blue-600" size={36} />
          </h1>
          <p className="text-lg text-gray-500 font-medium tracking-wide mt-2">Comprehensive telemetry, user metrics, and platform performance</p>
        </div>
        <button
          onClick={generateReport}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:bg-indigo-700 transition-all active:scale-95"
        >
          <Download className="w-5 h-5" />
          Export JSON Report
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-700 font-semibold flex items-center gap-3 shadow-inner">
          <Activity size={20} /> {error}
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-4 hide-scrollbar">
        {[
          { id: 'overview', label: 'Overview', icon: Activity },
          { id: 'courses', label: 'Courses', icon: BookOpen },
          { id: 'events', label: 'Events', icon: Zap },
          { id: 'userBehavior', label: 'Behavior', icon: TrendingUp },
          { id: 'individuals', label: 'Individuals', icon: Users },
          { id: 'memberships', label: 'Memberships', icon: Users },
          { id: 'corporates', label: 'Corporates', icon: Users },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm tracking-wide transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-gray-900 text-white shadow-xl shadow-gray-900/20'
                  : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <Icon size={16} className={isActive ? 'text-blue-400' : 'text-gray-400'} /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col justify-center items-center py-32 space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-100 border-b-blue-600 shadow-xl"></div>
          <p className="text-gray-500 font-bold tracking-widest text-sm uppercase">Syncing Telemetry...</p>
        </div>
      )}

      {!loading && (
        <>
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && data.overview && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Total Users */}
                <div className="bg-gradient-to-br from-indigo-900 to-blue-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl border border-indigo-700">
                  <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Users size={120} />
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-blue-200 text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                        <Users size={16} /> Total Users
                      </p>
                    </div>
                    <p className="text-6xl font-black mb-4">{data.overview.totalUsers}</p>
                    <div className="inline-flex items-center gap-2 bg-blue-500/20 px-3 py-1.5 rounded-full border border-blue-400/30">
                       <ArrowUpRight size={14} className="text-blue-300" />
                       <span className="text-sm font-bold text-blue-100">{data.overview.newUsersThisMonth} new this month</span>
                    </div>
                  </div>
                </div>

                {/* Active Users */}
                <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl shadow-emerald-900/20 border border-emerald-500">
                  <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Activity size={120} />
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-emerald-100 text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                        <Activity size={16} /> Active Today
                      </p>
                    </div>
                    <p className="text-6xl font-black mb-4">{data.overview.activeUsersToday}</p>
                    <div className="inline-flex items-center gap-2 bg-emerald-900/30 px-3 py-1.5 rounded-full border border-emerald-400/30">
                       <Activity size={14} className="text-emerald-200" />
                       <span className="text-sm font-bold text-emerald-50">{data.overview.activeUsersLastWeek} active this week</span>
                    </div>
                  </div>
                </div>

                {/* Subscription Rate */}
                <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-gray-200/50 relative">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-gray-500 text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                      <TrendingUp size={16} className="text-purple-500" /> Convert Rate
                    </p>
                  </div>
                  <div className="flex items-baseline gap-2 mb-4">
                    <p className="text-6xl font-black text-gray-900">{data.overview.subscriptionRate}%</p>
                  </div>
                  <div className="inline-flex items-center gap-2 bg-purple-50 px-3 py-1.5 rounded-full border border-purple-100">
                       <Users size={14} className="text-purple-600" />
                       <span className="text-sm font-bold text-purple-700">{data.overview.totalSubscribed} pro members</span>
                  </div>
                </div>
              </div>

              {/* Membership Statistics */}
              <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <BookOpen className="text-gray-400" size={24} /> Audience Breakdown
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* User Memberships - Paid */}
                  <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100/50">
                    <p className="text-emerald-700 text-xs font-bold uppercase tracking-widest mb-1">Individual Paid</p>
                    <p className="text-3xl font-black text-emerald-900">{data.overview.memberships?.users?.paid || 0}</p>
                  </div>

                  {/* User Memberships - Unpaid */}
                  <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Individual Free</p>
                    <p className="text-3xl font-black text-gray-900">{data.overview.memberships?.users?.unpaid || 0}</p>
                  </div>

                  {/* Corporate Memberships - Paid */}
                  <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100/50">
                    <p className="text-blue-700 text-xs font-bold uppercase tracking-widest mb-1">Corporate Paid</p>
                    <p className="text-3xl font-black text-blue-900">{data.overview.memberships?.corporates?.paid || 0}</p>
                  </div>

                  {/* Corporate Memberships - Unpaid */}
                  <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Corporate Free</p>
                    <p className="text-3xl font-black text-gray-900">{data.overview.memberships?.corporates?.unpaid || 0}</p>
                  </div>
                </div>
              </div>

              {/* Users by Role and Chart */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-gray-200/50">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 font-medium">Access Control Distribution</h3>
                  <div className="space-y-4">
                    {data.overview.usersByRole?.map((role: any) => (
                      <div key={role._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-blue-200 transition-colors">
                        <span className="font-bold text-gray-700 tracking-wide">{role._id}</span>
                        <span className="px-4 py-1.5 bg-gray-900 text-white rounded-full text-sm font-bold shadow-sm">
                          {role.count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pie Chart */}
                <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-gray-200/50">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 font-medium">Cohort Analytics</h3>
                  <div className="relative h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={data.overview.usersByRole || []}
                          dataKey="count"
                          nameKey="_id"
                          cx="50%"
                          cy="50%"
                          innerRadius={80}
                          outerRadius={110}
                          paddingAngle={5}
                          label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                          stroke="none"
                        >
                          {data.overview.usersByRole?.map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* COURSES TAB */}
          {activeTab === 'courses' && data.courses && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              {/* Top KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Courses */}
                <div className="bg-gradient-to-br from-indigo-900 to-blue-900 rounded-3xl p-6 border border-indigo-700 shadow-2xl relative overflow-hidden">
                  <p className="text-blue-200 text-xs font-bold uppercase tracking-widest">Total Courses</p>
                  <p className="text-4xl font-black text-white mt-2">{data.courses.totalCourses}</p>
                  <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full font-bold text-xs text-blue-100 shadow-inner">
                    <BookOpen size={12} /> {data.courses.paidCourses} paid · {data.courses.freeCourses} free
                  </div>
                </div>

                {/* Total Enrollments */}
                <div className="bg-gradient-to-br from-emerald-800 to-teal-900 rounded-3xl p-6 border border-emerald-700 shadow-2xl relative overflow-hidden">
                  <p className="text-emerald-200 text-xs font-bold uppercase tracking-widest">Total Enrollments</p>
                  <p className="text-4xl font-black text-white mt-2">{data.courses.totalEnrollments}</p>
                  <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full font-bold text-xs text-emerald-100 shadow-inner">
                    <Users size={12} /> {data.courses.averageEnrollmentPerCourse} avg per course
                  </div>
                </div>

                {/* Completion Rate */}
                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xl shadow-gray-200/50">
                  <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Completion Rate</p>
                  <p className="text-4xl font-black text-gray-900 mt-2">{data.courses.completionRate}%</p>
                  <p className="text-gray-500 text-sm mt-4 font-semibold">{data.courses.completedEnrollments} completed</p>
                </div>

                {/* Total Revenue */}
                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xl shadow-gray-200/50">
                  <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Total Revenue</p>
                  <p className="text-4xl font-black text-gray-900 mt-2">${data.courses.totalRevenue?.toFixed(2) || '0.00'}</p>
                  <p className="text-amber-600 text-sm mt-4 font-semibold">${data.courses.paidCourseRevenue?.toFixed(2) || '0.00'} from paid</p>
                </div>
              </div>

              {/* Revenue & Enrollment Breakdown */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Revenue Breakdown Card */}
                <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-gray-200/50">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Revenue Breakdown</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                      <div>
                        <p className="font-bold text-gray-700">Paid Course Revenue</p>
                        <p className="text-sm text-gray-500 font-medium">{data.courses.paidCourseEnrollments} enrollments</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-black text-amber-600">${data.courses.paidCourseRevenue?.toFixed(2) || '0.00'}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                      <div>
                        <p className="font-bold text-gray-700">Free Enrollments</p>
                        <p className="text-sm text-gray-500 font-medium">{data.courses.totalEnrollments - data.courses.paidCourseEnrollments} enrollments</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-black text-blue-600">$0.00</p>
                      </div>
                    </div>
                    <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-gray-900">Per Paid Enrollment</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-black text-emerald-600">
                          ${data.courses.paidCourseEnrollments > 0 
                            ? (data.courses.paidCourseRevenue / data.courses.paidCourseEnrollments).toFixed(2)
                            : '0.00'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enrollment Status */}
                <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-gray-200/50">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Enrollment Status</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-2xl border border-emerald-100/50">
                      <p className="font-bold text-gray-900">Completed</p>
                      <span className="px-4 py-1.5 bg-emerald-100 text-emerald-800 rounded-full text-sm font-black shadow-sm">
                        {data.courses.completedEnrollments}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-amber-50 rounded-2xl border border-amber-100/50">
                      <p className="font-bold text-gray-900">In Progress</p>
                      <span className="px-4 py-1.5 bg-amber-100 text-amber-800 rounded-full text-sm font-black shadow-sm">
                        {data.courses.totalEnrollments - data.courses.completedEnrollments}
                      </span>
                    </div>
                    <div className="border-t border-gray-100 pt-5">
                      <p className="text-sm font-bold text-gray-500 mb-3 uppercase tracking-wider">Completion Flow</p>
                      <div className="w-full bg-gray-100 rounded-full h-3 max-w-full overflow-hidden">
                        <div 
                          className="bg-emerald-500 h-3 rounded-full transition-all duration-1000" 
                          style={{width: `${data.courses.completionRate}%`}}
                        ></div>
                      </div>
                      <p className="text-sm font-medium text-gray-500 mt-2">{data.courses.completionRate}% of all enrollments completed</p>
                    </div>
                  </div>
                </div>

                {/* Price Distribution */}
                <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-gray-200/50">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Price Distribution</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-2xl">
                      <span className="text-sm font-bold text-gray-900">Free Courses</span>
                      <span className="px-3 py-1 bg-white shadow-sm text-blue-700 rounded-full text-sm font-black">
                        {data.courses.priceDistribution?.free || 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-2xl">
                      <span className="text-sm font-bold text-gray-900">$1 - $50</span>
                      <span className="px-3 py-1 bg-white shadow-sm text-emerald-700 rounded-full text-sm font-black">
                        {data.courses.priceDistribution?.lowPrice || 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-amber-50 rounded-2xl">
                      <span className="text-sm font-bold text-gray-900">$50 - $150</span>
                      <span className="px-3 py-1 bg-white shadow-sm text-amber-700 rounded-full text-sm font-black">
                        {data.courses.priceDistribution?.mediumPrice || 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-purple-50 rounded-2xl">
                      <span className="text-sm font-bold text-gray-900">$150+</span>
                      <span className="px-3 py-1 bg-white shadow-sm text-purple-700 rounded-full text-sm font-black">
                        {data.courses.priceDistribution?.highPrice || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Top Courses Table */}
              <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Top Courses by Enrollment</h3>
                <div className="overflow-x-auto pb-4">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50/50">
                      <tr>
                        <th className="px-4 py-4 font-bold text-gray-500 uppercase tracking-wider">Course Title</th>
                        <th className="px-4 py-4 text-center font-bold text-gray-500 uppercase tracking-wider">Category</th>
                        <th className="px-4 py-4 text-center font-bold text-gray-500 uppercase tracking-wider">Price</th>
                        <th className="px-4 py-4 text-center font-bold text-gray-500 uppercase tracking-wider">Enrollments</th>
                        <th className="px-4 py-4 text-center font-bold text-gray-500 uppercase tracking-wider">Completion</th>
                        <th className="px-4 py-4 text-right font-bold text-gray-500 uppercase tracking-wider">Revenue</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {data.courses.topCourses?.map((course: any, idx: number) => (
                        <tr key={idx} className="hover:bg-gray-50/50 transition">
                          <td className="px-4 py-4 text-gray-900 font-bold max-w-xs truncate">{course.title}</td>
                          <td className="px-4 py-4 text-center text-gray-600 font-medium">{course.category}</td>
                          <td className="px-4 py-4 text-center font-bold text-gray-900">
                            ${course.price > 0 ? course.price.toFixed(2) : 'Free'}
                          </td>
                          <td className="px-4 py-4 text-center">
                            <span className="px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-xs font-black">
                              {course.enrollments}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-center">
                            <span className="px-4 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-xs font-black mr-2">
                              {course.completed}
                            </span>
                            <span className="text-xs font-bold text-gray-500">{course.completionRate}%</span>
                          </td>
                          <td className="px-4 py-4 text-right">
                            <span className={`font-black text-lg ${course.revenue > 0 ? 'text-emerald-600' : 'text-gray-400'}`}>
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
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              {/* Top KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Events */}
                <div className="bg-gradient-to-br from-indigo-900 to-blue-900 rounded-3xl p-6 border border-indigo-700 shadow-2xl relative overflow-hidden">
                  <p className="text-blue-200 text-xs font-bold uppercase tracking-widest">Total Events</p>
                  <p className="text-4xl font-black text-white mt-2">{data.events.totalEvents}</p>
                  <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full font-bold text-xs text-blue-100 shadow-inner">
                    <Zap size={12} /> {data.events.upcomingEvents} upcoming · {data.events.completedEvents} done
                  </div>
                </div>

                {/* Total Registrations */}
                <div className="bg-gradient-to-br from-purple-800 to-fuchsia-900 rounded-3xl p-6 border border-purple-700 shadow-2xl relative overflow-hidden">
                  <p className="text-purple-200 text-xs font-bold uppercase tracking-widest">Total Registrations</p>
                  <p className="text-4xl font-black text-white mt-2">{data.events.totalRegistrations}</p>
                  <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full font-bold text-xs text-purple-100 shadow-inner">
                    <Users size={12} /> {data.events.paidEvents} paid · {data.events.freeEvents} free
                  </div>
                </div>

                {/* Attendance Rate */}
                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xl shadow-gray-200/50">
                  <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Attendance Rate</p>
                  <p className="text-4xl font-black text-gray-900 mt-2">{data.events.attendanceRate}%</p>
                  <p className="text-gray-500 text-sm mt-4 font-semibold">{data.events.totalAttended} attended · {data.events.totalNoShows} no-shows</p>
                </div>

                {/* Capacity Utilization */}
                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xl shadow-gray-200/50">
                  <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Capacity Utilization</p>
                  <p className="text-4xl font-black text-gray-900 mt-2">{data.events.capacityUtilizationPercentage}%</p>
                  <p className="text-gray-500 text-sm mt-4 font-semibold">Avg: {data.events.avgCapacityUtilization}% per event</p>
                </div>
              </div>

              {/* Event Analysis Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Event Type Breakdown */}
                <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-gray-200/50">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 font-medium">Event Format Distribution</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-2xl border border-blue-100 hover:border-blue-200 transition">
                      <span className="font-bold text-gray-700">Online Events</span>
                      <span className="px-4 py-1.5 bg-blue-600 text-white rounded-full text-sm font-bold shadow-sm">
                        {data.events.eventsByFormat?.online || 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-2xl border border-green-100 hover:border-green-200 transition">
                      <span className="font-bold text-gray-700">Offline Events</span>
                      <span className="px-4 py-1.5 bg-green-600 text-white rounded-full text-sm font-bold shadow-sm">
                        {data.events.eventsByFormat?.offline || 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-purple-50 rounded-2xl border border-purple-100 hover:border-purple-200 transition">
                      <span className="font-bold text-gray-700">Hybrid Events</span>
                      <span className="px-4 py-1.5 bg-purple-600 text-white rounded-full text-sm font-bold shadow-sm">
                        {data.events.eventsByFormat?.hybrid || 0}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Attendance Analysis */}
                <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-gray-200/50">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 font-medium">Attendance Analysis</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-2xl border border-emerald-100/50">
                      <div>
                        <p className="font-bold text-gray-900">Attended</p>
                        <p className="text-sm text-gray-500 font-medium">{data.events.attendanceRate}% conversion</p>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-black text-emerald-600">{data.events.totalAttended}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-red-50 rounded-2xl border border-red-100/50">
                      <div>
                        <p className="font-bold text-gray-900">No-Shows</p>
                        <p className="text-sm text-gray-500 font-medium">{data.events.noShowRate}% drop-off</p>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-black text-red-600">{data.events.totalNoShows}</p>
                      </div>
                    </div>
                    <div className="border-t border-gray-100 pt-5">
                      <p className="text-sm font-bold text-gray-500 mb-3 uppercase tracking-wider">Attendance Distribution</p>
                      <div className="w-full bg-gray-100 rounded-full h-3">
                        <div 
                          className="bg-emerald-500 h-3 rounded-full transition-all duration-1000" 
                          style={{width: `${data.events.attendanceRate}%`}}
                        ></div>
                      </div>
                      <p className="text-sm font-medium text-gray-500 mt-2">{data.events.totalAttended}/{data.events.totalRegistrations} registrations attended</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Top Events Table */}
              <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Top Events by Registration</h3>
                <div className="overflow-x-auto pb-4">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50/50">
                      <tr>
                        <th className="px-4 py-4 font-bold text-gray-500 uppercase tracking-wider">Event Title</th>
                        <th className="px-4 py-4 text-center font-bold text-gray-500 uppercase tracking-wider">Format</th>
                        <th className="px-4 py-4 text-center font-bold text-gray-500 uppercase tracking-wider">Regs</th>
                        <th className="px-4 py-4 text-center font-bold text-gray-500 uppercase tracking-wider">Attended</th>
                        <th className="px-4 py-4 text-center font-bold text-gray-500 uppercase tracking-wider">Rate</th>
                        <th className="px-4 py-4 text-right font-bold text-gray-500 uppercase tracking-wider">Type</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {data.events.topEvents?.map((event: any, idx: number) => (
                        <tr key={idx} className="hover:bg-gray-50 transition">
                          <td className="px-4 py-4 text-gray-900 font-bold max-w-xs truncate">{event.title}</td>
                          <td className="px-4 py-4 text-center">
                            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-bold uppercase">{event.format}</span>
                          </td>
                          <td className="px-4 py-4 text-center">
                            <span className="px-4 py-1.5 bg-blue-100 text-blue-800 rounded-full text-xs font-black">{event.registrations}</span>
                          </td>
                          <td className="px-4 py-4 text-center">
                            <span className="px-4 py-1.5 bg-emerald-100 text-emerald-800 rounded-full text-xs font-black">{event.attended}</span>
                          </td>
                          <td className="px-4 py-4 text-center font-bold text-gray-500">{event.attendanceRate}%</td>
                          <td className="px-4 py-4 text-right">
                            <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase ${
                              event.access === 'premium' ? 'bg-amber-100 text-amber-800' :
                              event.access === 'corporate' ? 'bg-indigo-100 text-indigo-800' :
                              'bg-emerald-100 text-emerald-800'
                            }`}>
                              {event.access === 'premium' ? 'Paid' : event.access === 'corporate' ? 'B2B' : 'Free'}
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
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              {/* Summary Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-indigo-900 to-blue-900 rounded-3xl p-6 border border-indigo-700 shadow-2xl relative overflow-hidden">
                  <p className="text-blue-200 text-xs font-bold uppercase tracking-widest">Total Users</p>
                  <p className="text-4xl font-black text-white mt-2">{data.userBehavior.summary?.totalUsers || 0}</p>
                  <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full font-bold text-xs text-blue-100 shadow-inner">
                    <Users size={12} /> {data.userBehavior.summary?.totalSubscribed} subscribed
                  </div>
                </div>
                <div className="bg-gradient-to-br from-emerald-800 to-teal-900 rounded-3xl p-6 border border-emerald-700 shadow-2xl relative overflow-hidden">
                  <p className="text-emerald-200 text-xs font-bold uppercase tracking-widest">Active This Week</p>
                  <p className="text-4xl font-black text-white mt-2">{data.userBehavior.summary?.totalActiveLastWeek || 0}</p>
                  <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full font-bold text-xs text-emerald-100 shadow-inner">
                    <Activity size={12} /> {data.userBehavior.summary?.weeklyEngagementRate}% engagement
                  </div>
                </div>
                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xl shadow-gray-200/50">
                  <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Active Today</p>
                  <p className="text-4xl font-black text-gray-900 mt-2">{data.userBehavior.summary?.totalActiveToday || 0}</p>
                  <p className="text-gray-500 text-sm mt-4 font-semibold">Current day activity</p>
                </div>
                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xl shadow-gray-200/50">
                  <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Convert Rate</p>
                  <p className="text-4xl font-black text-gray-900 mt-2">{data.userBehavior.summary?.subscriptionRate || 0}%</p>
                  <p className="text-amber-600 text-sm mt-4 font-semibold">Of total user base</p>
                </div>
              </div>

              {/* User Growth Chart */}
              <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-gray-200/50">
                <h3 className="text-xl font-bold text-gray-900 mb-6">User Growth Trend (Last 30 Days)</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={data.userBehavior.userGrowth || []} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis dataKey="_id" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
                    />
                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                    <Line type="monotone" dataKey="newUsers" stroke="#4F46E5" strokeWidth={4} activeDot={{ r: 8, fill: '#4F46E5', stroke: '#fff', strokeWidth: 3 }} name="New Users Added" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Engagement & Distribution */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-gray-200/50">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Engagement by Role</h3>
                  <div className="space-y-4">
                    {data.userBehavior.engagementByRole?.map((role: any) => (
                      <div key={role._id} className="p-5 bg-gray-50 rounded-2xl border border-gray-100 hover:border-indigo-200 transition-colors">
                        <p className="font-bold text-gray-900 tracking-wider mb-4 capitalize">{role._id?.toLowerCase()}</p>
                        <div className="grid grid-cols-4 gap-4 text-xs">
                          <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 text-center">
                            <p className="text-gray-400 font-bold uppercase tracking-wider mb-1">Total</p>
                            <p className="font-black text-xl text-gray-900">{role.totalUsers}</p>
                          </div>
                          <div className="bg-green-50 p-3 rounded-xl shadow-sm border border-green-100 text-center">
                            <p className="text-green-600 font-bold uppercase tracking-wider mb-1">Pro</p>
                            <p className="font-black text-xl text-green-700">{role.subscribed}</p>
                          </div>
                          <div className="bg-blue-50 p-3 rounded-xl shadow-sm border border-blue-100 text-center">
                            <p className="text-blue-600 font-bold uppercase tracking-wider mb-1">Week</p>
                            <p className="font-black text-xl text-blue-700">{role.activeLastWeek}</p>
                          </div>
                          <div className="bg-purple-50 p-3 rounded-xl shadow-sm border border-purple-100 text-center">
                            <p className="text-purple-600 font-bold uppercase tracking-wider mb-1">Today</p>
                            <p className="font-black text-xl text-purple-700">{role.activeToday}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-gray-200/50 flex flex-col">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Distribution Topology</h3>
                  <div className="flex-1 min-h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={data.userBehavior.engagementByRole || []}
                          dataKey="totalUsers"
                          nameKey="_id"
                          cx="50%"
                          cy="50%"
                          outerRadius={140}
                          innerRadius={90}
                          paddingAngle={3}
                          label={({ name }) => `${(name || '').toUpperCase()}`}
                          stroke="none"
                        >
                          {data.userBehavior.engagementByRole?.map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
                          formatter={(value) => `${value} active identities`} 
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* INDIVIDUALS TAB */}
          {activeTab === 'individuals' && data.individuals && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              {/* Summary KPIs */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-indigo-900 to-blue-900 rounded-3xl p-6 border border-indigo-700 shadow-2xl relative overflow-hidden">
                  <p className="text-blue-200 text-xs font-bold uppercase tracking-widest">Total Individuals</p>
                  <p className="text-4xl font-black text-white mt-2">{data.individuals.totalIndividuals || 0}</p>
                  <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full font-bold text-xs text-blue-100 shadow-inner">
                    Active users
                  </div>
                </div>
                <div className="bg-gradient-to-br from-emerald-800 to-teal-900 rounded-3xl p-6 border border-emerald-700 shadow-2xl relative overflow-hidden">
                  <p className="text-emerald-200 text-xs font-bold uppercase tracking-widest">Subscribed</p>
                  <p className="text-4xl font-black text-white mt-2">{data.individuals.subscribedIndividuals || 0}</p>
                  <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full font-bold text-xs text-emerald-100 shadow-inner">
                    {data.individuals.subscriptionRate || 0}% conversion
                  </div>
                </div>
                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xl shadow-gray-200/50">
                  <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Total Enrollments</p>
                  <p className="text-4xl font-black text-gray-900 mt-2">{data.individuals.totalEnrollments || 0}</p>
                  <p className="text-gray-500 text-sm mt-4 font-semibold">Courses & events</p>
                </div>
                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xl shadow-gray-200/50">
                  <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Avg Enrollments</p>
                  <p className="text-4xl font-black text-gray-900 mt-2">{data.individuals.avgEnrollmentsPerUser || 0}</p>
                  <p className="text-amber-600 text-sm mt-4 font-semibold">Per individual</p>
                </div>
              </div>

              {/* Top Individuals Table */}
              <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Top Individuals by Engagement</h3>
                <div className="overflow-x-auto pb-4">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50/50">
                      <tr>
                        <th className="px-4 py-4 font-bold text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-4 py-4 font-bold text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-4 py-4 text-center font-bold text-gray-500 uppercase tracking-wider">Enrolled</th>
                        <th className="px-4 py-4 text-center font-bold text-gray-500 uppercase tracking-wider">Completed</th>
                        <th className="px-4 py-4 text-center font-bold text-gray-500 uppercase tracking-wider">Completion</th>
                        <th className="px-4 py-4 text-center font-bold text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-4 py-4 text-center font-bold text-gray-500 uppercase tracking-wider">Last Active</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {data.individuals.topIndividuals?.map((user: any, idx: number) => (
                        <tr key={idx} className="hover:bg-gray-50/50 transition">
                          <td className="px-4 py-4 font-bold text-gray-900">{user.userName || '-'}</td>
                          <td className="px-4 py-4 text-gray-500 font-medium">{user.email || '-'}</td>
                          <td className="px-4 py-4 text-center">
                            <span className="px-4 py-1.5 bg-blue-100 text-blue-800 rounded-full text-xs font-black">{user.enrollments || 0}</span>
                          </td>
                          <td className="px-4 py-4 text-center">
                            <span className="px-4 py-1.5 bg-emerald-100 text-emerald-800 rounded-full text-xs font-black">{user.completed || 0}</span>
                          </td>
                          <td className="px-4 py-4 text-center font-bold text-gray-500">{user.completionRate || 0}%</td>
                          <td className="px-4 py-4 text-center">
                            <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${
                              user.subscriptionStatus === 'subscribed'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-gray-100 text-gray-500'
                            }`}>
                              {user.subscriptionStatus || 'Free'}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-center text-gray-500 font-medium text-xs">{user.lastActive || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Enrollment Distribution */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-gray-200/50 flex flex-col">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Volume Allocation</h3>
                  <div className="flex-1 min-h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
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
                          outerRadius={120}
                          innerRadius={80}
                          paddingAngle={5}
                          stroke="none"
                        >
                          <Cell fill="#4F46E5" />
                          <Cell fill="#10B981" />
                        </Pie>
                        <Tooltip 
                          contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
                        />
                        <Legend wrapperStyle={{ paddingTop: '20px' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-gray-200/50">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Progression Funnel</h3>
                  <div className="space-y-6 mt-10">
                    <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100 hover:border-blue-200 transition">
                      <p className="text-blue-600/80 text-xs font-bold uppercase tracking-widest mb-1">In Progress</p>
                      <p className="text-5xl font-black text-blue-900">{data.individuals.inProgressEnrollments || 0}</p>
                      <p className="text-blue-700 text-sm mt-3 font-medium">Active coursework tracking</p>
                    </div>
                    <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100 hover:border-emerald-200 transition">
                      <p className="text-emerald-600/80 text-xs font-bold uppercase tracking-widest mb-1">Completed</p>
                      <p className="text-5xl font-black text-emerald-900">{data.individuals.completedEnrollments || 0}</p>
                      <p className="text-emerald-700 text-sm mt-3 font-medium">Fully finished courses and events</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* MEMBERSHIPS TAB */}
          {activeTab === 'memberships' && data.memberships && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-indigo-900 to-blue-900 rounded-3xl p-6 border border-indigo-700 shadow-2xl relative overflow-hidden">
                  <p className="text-blue-200 text-xs font-bold uppercase tracking-widest">Total Active Plans</p>
                  <p className="text-4xl font-black text-white mt-2">{data.memberships.totalMemberships}</p>
                  <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full font-bold text-xs text-blue-100 shadow-inner">
                    {data.memberships.activeMemberships} currently active
                  </div>
                </div>

                <div className="bg-gradient-to-br from-emerald-800 to-teal-900 rounded-3xl p-6 border border-emerald-700 shadow-2xl relative overflow-hidden">
                  <p className="text-emerald-200 text-xs font-bold uppercase tracking-widest">Paid Users</p>
                  <p className="text-4xl font-black text-white mt-2">{data.memberships.userBreakdown.paidUsers}</p>
                  <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full font-bold text-xs text-emerald-100 shadow-inner">
                    {data.memberships.userBreakdown.paidPercentage}% conversion
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xl shadow-gray-200/50">
                  <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Unpaid Users</p>
                  <p className="text-4xl font-black text-gray-900 mt-2">{data.memberships.userBreakdown.unpaidUsers}</p>
                  <p className="text-gray-500 text-sm mt-4 font-semibold">{data.memberships.userBreakdown.totalUsers} gross pipeline</p>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xl shadow-gray-200/50">
                  <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Enterprise Orgs</p>
                  <p className="text-4xl font-black text-gray-900 mt-2">{data.memberships.corporateMemberships}</p>
                  <p className="text-blue-600 text-sm mt-4 font-semibold">{data.memberships.userMemberships} individual plans</p>
                </div>
              </div>

              {/* Memberships by Status and Type */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-gray-200/50 flex flex-col">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Status Composition</h3>
                  <div className="flex-1 min-h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={data.memberships.membershipsByStatus || []}
                          dataKey="count"
                          nameKey="_id"
                          cx="50%"
                          cy="50%"
                          innerRadius={90}
                          outerRadius={120}
                          paddingAngle={4}
                          label={({ name, value }) => `${name}: ${value}`}
                          stroke="none"
                        >
                          {data.memberships.membershipsByStatus?.map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-gray-200/50">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Pipeline by Type</h3>
                  <div className="space-y-4">
                    {data.memberships.membershipsByType?.map((type: any) => (
                      <div key={type._id} className="p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:border-blue-100 transition">
                        <div className="flex justify-between items-center mb-4">
                          <p className="font-bold text-lg text-gray-900 tracking-wide uppercase">{type._id}</p>
                          <span className="px-4 py-1.5 bg-gray-900 text-white rounded-full text-sm font-black shadow-sm">{type.count} Total</span>
                        </div>
                        <div className="flex gap-4 text-sm mt-4 border-t border-gray-200 pt-4">
                          <div className="flex-1">
                            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mb-1">Active</p>
                            <p className="font-black text-2xl text-emerald-600">{type.activeCount}</p>
                          </div>
                          <div className="flex-1">
                            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mb-1">Inactive</p>
                            <p className="font-black text-2xl text-gray-400">{type.count - type.activeCount}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Memberships by Plan */}
              <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Tier Breakdowns</h3>
                <div className="overflow-x-auto pb-4">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50/50">
                      <tr>
                        <th className="px-4 py-4 font-bold text-gray-500 uppercase tracking-wider">Plan Name</th>
                        <th className="px-4 py-4 text-center font-bold text-gray-500 uppercase tracking-wider">Total Bound</th>
                        <th className="px-4 py-4 text-center font-bold text-gray-500 uppercase tracking-wider">Active</th>
                        <th className="px-4 py-4 text-center font-bold text-gray-500 uppercase tracking-wider">Expired</th>
                        <th className="px-4 py-4 text-right font-bold text-gray-500 uppercase tracking-wider">Cancelled</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {data.memberships.membershipsByPlan?.map((plan: any, idx: number) => (
                        <tr key={idx} className="hover:bg-gray-50/50 transition">
                          <td className="px-4 py-4 text-gray-900 font-bold tracking-wide">{plan._id}</td>
                          <td className="px-4 py-4 text-center">
                            <span className="px-4 py-1.5 bg-blue-100 text-blue-800 rounded-full text-xs font-black">
                              {plan.totalCount}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-center">
                            <span className="px-4 py-1.5 bg-emerald-100 text-emerald-800 rounded-full text-xs font-black">
                              {plan.activeCount}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-center">
                            <span className="px-4 py-1.5 bg-amber-100 text-amber-800 rounded-full text-xs font-black">
                              {plan.expiredCount}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-right">
                            <span className="px-4 py-1.5 bg-red-100 text-red-800 rounded-full text-xs font-black">
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
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-indigo-900 to-blue-900 rounded-3xl p-8 border border-indigo-700 shadow-2xl relative overflow-hidden">
                  <p className="text-blue-200 text-sm font-bold uppercase tracking-widest">Total Corporate Accounts</p>
                  <p className="text-5xl font-black text-white mt-3">{data.corporates.totalCorporates}</p>
                </div>

                <div className="bg-gradient-to-br from-emerald-800 to-teal-900 rounded-3xl p-8 border border-emerald-700 shadow-2xl relative overflow-hidden">
                  <p className="text-emerald-200 text-sm font-bold uppercase tracking-widest">Verified Orgs</p>
                  <p className="text-5xl font-black text-white mt-3">{data.corporates.verifiedCorporates}</p>
                </div>

                <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-gray-200/50">
                  <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">Active State</p>
                  <p className="text-5xl font-black text-gray-900 mt-3">{data.corporates.activeCorporates}</p>
                </div>
              </div>

              {/* Corporate Tiers */}
              <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-gray-200/50">
                <h3 className="text-xl font-bold text-gray-900 mb-6 font-medium">B2B Volume Tiers</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {data.corporates.corporateTiers?.map((tier: any) => (
                    <div key={tier._id} className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200 shadow-sm relative hover:shadow-lg transition">
                      <p className="text-sm font-black text-indigo-700 mb-6 uppercase tracking-widest bg-indigo-100 px-3 py-1 inline-block rounded-full">{tier._id}</p>
                      <div className="space-y-4">
                        <div className="flex justify-between items-end">
                          <p className="text-xs text-gray-500 font-bold uppercase">Total Orgs</p>
                          <p className="text-3xl font-black text-gray-900">{tier.count}</p>
                        </div>
                        <div className="flex justify-between items-end">
                          <p className="text-xs text-gray-500 font-bold uppercase">Avg Staff Limit</p>
                          <p className="text-2xl font-bold text-blue-600">{tier.avgStaffCount}</p>
                        </div>
                        <div className="pt-4 border-t border-gray-200/60 mt-4">
                          <div className="flex justify-between mb-2">
                            <span className="text-xs font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded uppercase">{tier.paidCount} paid</span>
                            <span className="text-xs font-black bg-gray-200 text-gray-600 px-2 py-0.5 rounded uppercase">{tier.unpaidCount} free</span>
                          </div>
                          <p className="text-xs font-bold text-gray-500 text-right">{tier.paidPercentage}% conversion</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Corporates by Status & Industry */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-gray-200/50">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 font-medium">Pipeline by Status</h3>
                  <div className="space-y-4">
                    {data.corporates.corporatesByStatus?.map((status: any) => (
                      <div key={status._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <span className="font-bold text-gray-700 uppercase tracking-widest text-sm">{status._id}</span>
                        <span className="px-4 py-1.5 bg-gray-900 text-white rounded-full text-sm font-black shadow-sm">
                          {status.count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-gray-200/50">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 font-medium">B2B Verticals (Top 10)</h3>
                  <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {data.corporates.corporatesByIndustry?.map((industry: any) => (
                      <div key={industry._id} className="flex items-center justify-between p-4 bg-blue-50 rounded-2xl border border-blue-100/50 hover:border-blue-200 transition">
                        <span className="font-bold text-gray-900 tracking-wide">{industry._id}</span>
                        <span className="px-4 py-1.5 bg-blue-600 text-white rounded-full text-sm font-black shadow-sm">
                          {industry.count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Top Corporates Table */}
              <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Top Enterprise Cohorts (By Staff Limit)</h3>
                <div className="overflow-x-auto pb-4">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50/50">
                      <tr>
                        <th className="px-4 py-4 font-bold text-gray-500 uppercase tracking-wider">Company Name</th>
                        <th className="px-4 py-4 text-center font-bold text-gray-500 uppercase tracking-wider">Staff Limit</th>
                        <th className="px-4 py-4 text-center font-bold text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-4 py-4 text-center font-bold text-gray-500 uppercase tracking-wider">Plan State</th>
                        <th className="px-4 py-4 text-right font-bold text-gray-500 uppercase tracking-wider">Active Tier</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {data.corporates.corporatesWithStaffStats?.map((corp: any, idx: number) => (
                        <tr key={idx} className="border-b hover:bg-gray-50/50 transition">
                          <td className="px-4 py-4 text-gray-900 font-bold max-w-xs truncate tracking-wide">{corp.companyName}</td>
                          <td className="px-4 py-4 text-center">
                            <span className="px-4 py-1.5 bg-blue-100 text-blue-800 rounded-full text-xs font-black">
                              {corp.staffCount}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-center">
                            <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${
                              corp.status === 'active' ? 'bg-emerald-100 text-emerald-800' :
                              corp.status === 'verified' ? 'bg-blue-100 text-blue-800' :
                              'bg-amber-100 text-amber-800'
                            }`}>
                              {corp.status}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-center">
                            <span className={`px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase ${
                              corp.hasMembership ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-500'
                            }`}>
                              {corp.hasMembership ? 'Subscribed' : 'Orphaned'}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-right text-gray-500 font-bold uppercase tracking-widest text-xs">
                            {corp.membershipPlan || 'None'}
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
