'use client'

import { useState } from 'react'
import { Download, Filter } from 'lucide-react'


export default function ReportsPage() {
  const [reportType, setReportType] = useState('engagement')
  const [dateRange, setDateRange] = useState('month')

  const engagementData = [
    { period: 'Week 1', members: 890, courses: 34, events: 12, completion: 68 },
    { period: 'Week 2', members: 920, courses: 38, events: 15, completion: 72 },
    { period: 'Week 3', members: 945, courses: 42, events: 18, completion: 75 },
    { period: 'Week 4', members: 985, courses: 47, events: 21, completion: 78 },
  ]

  const activityData = [
    { label: 'Course Enrollments', value: 245, percentage: 35, color: 'bg-blue-600' },
    { label: 'Event Registrations', value: 189, percentage: 27, color: 'bg-green-600' },
    { label: 'Completed Courses', value: 156, percentage: 22, color: 'bg-purple-600' },
    { label: 'Certifications Earned', value: 98, percentage: 14, color: 'bg-amber-600' },
  ]

  const memberGrowth = [
    { month: 'Jan', individuals: 450, corporate: 85, total: 535 },
    { month: 'Feb', individuals: 580, corporate: 120, total: 700 },
    { month: 'Mar', individuals: 750, corporate: 165, total: 915 },
    { month: 'Apr', individuals: 920, corporate: 215, total: 1135 },
    { month: 'May', individuals: 1100, corporate: 285, total: 1385 },
    { month: 'Jun', individuals: 1280, corporate: 385, total: 1665 },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Reports & Analytics</h1>
          <p className="text-slate-600 mt-1">View engagement summaries and activity reports</p>
        </div>
        <button className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors">
          <Download className="w-4 h-4" />
          Export Report
        </button>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 flex items-center gap-4">
        <select
          value={reportType}
          onChange={(e) => setReportType(e.target.value)}
          className="text-sm border border-slate-200 rounded-lg px-3 py-2 outline-none"
        >
          <option value="engagement">Engagement Report</option>
          <option value="activity">Activity Report</option>
          <option value="growth">Member Growth</option>
        </select>

        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="text-sm border border-slate-200 rounded-lg px-3 py-2 outline-none"
        >
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="quarter">This Quarter</option>
          <option value="year">This Year</option>
        </select>

        <button className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors">
          <Filter className="w-4 h-4" />
          <span className="text-sm">Filters</span>
        </button>
      </div>

      {reportType === 'engagement' && (
        <div className="space-y-6">
          {/* Engagement Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {engagementData[engagementData.length - 1] && (
              <>
                <div className="bg-white rounded-lg border border-slate-200 p-4">
                  <p className="text-sm text-slate-600">Active Members</p>
                  <p className="text-3xl font-bold text-slate-900 mt-2">{engagementData[engagementData.length - 1].members}</p>
                  <p className="text-xs text-green-600 mt-2">+40 this week</p>
                </div>
                <div className="bg-white rounded-lg border border-slate-200 p-4">
                  <p className="text-sm text-slate-600">Course Enrollments</p>
                  <p className="text-3xl font-bold text-slate-900 mt-2">{engagementData[engagementData.length - 1].courses}</p>
                  <p className="text-xs text-green-600 mt-2">+5 this week</p>
                </div>
                <div className="bg-white rounded-lg border border-slate-200 p-4">
                  <p className="text-sm text-slate-600">Event Registrations</p>
                  <p className="text-3xl font-bold text-slate-900 mt-2">{engagementData[engagementData.length - 1].events}</p>
                  <p className="text-xs text-green-600 mt-2">+3 this week</p>
                </div>
                <div className="bg-white rounded-lg border border-slate-200 p-4">
                  <p className="text-sm text-slate-600">Avg. Completion Rate</p>
                  <p className="text-3xl font-bold text-slate-900 mt-2">{engagementData[engagementData.length - 1].completion}%</p>
                  <p className="text-xs text-green-600 mt-2">+10% this month</p>
                </div>
              </>
            )}
          </div>

          {/* Engagement Trend Chart */}
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Engagement Trend (4 Weeks)</h3>
            <div className="space-y-4">
              {engagementData.map((week, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-900">{week.period}</span>
                    <span className="text-sm text-slate-600">{week.completion}% completion</span>
                  </div>
                  <div className="w-full h-8 bg-slate-100 rounded-lg overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all"
                      style={{ width: `${week.completion}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {reportType === 'activity' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Activity Breakdown</h3>
            <div className="space-y-4">
              {activityData.map((activity, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-900">{activity.label}</span>
                    <span className="text-sm font-semibold text-slate-900">{activity.value}</span>
                  </div>
                  <div className="w-full h-6 bg-slate-100 rounded-lg overflow-hidden">
                    <div
                      className={`h-full ${activity.color} transition-all`}
                      style={{ width: `${activity.percentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-600 mt-1">{activity.percentage}% of total activity</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg border border-slate-200 p-4">
              <p className="text-sm text-slate-600">Total Activities</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">{activityData.reduce((sum, a) => sum + a.value, 0)}</p>
            </div>
            <div className="bg-white rounded-lg border border-slate-200 p-4">
              <p className="text-sm text-slate-600">Avg per Member</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">3.2</p>
            </div>
            <div className="bg-white rounded-lg border border-slate-200 p-4">
              <p className="text-sm text-slate-600">Growth Rate</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">+12%</p>
            </div>
          </div>
        </div>
      )}

      {reportType === 'growth' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Member Growth (6 Months)</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">Month</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">Individual</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">Corporate</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">Total</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">Growth</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {memberGrowth.map((month, idx) => {
                    const prevMonth = idx > 0 ? memberGrowth[idx - 1] : null
                    const growth = prevMonth ? ((month.total - prevMonth.total) / prevMonth.total * 100).toFixed(1) : 0
                    return (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="py-3 px-4 text-sm font-medium text-slate-900">{month.month}</td>
                        <td className="py-3 px-4 text-sm text-slate-600">{month.individuals}</td>
                        <td className="py-3 px-4 text-sm text-slate-600">{month.corporate}</td>
                        <td className="py-3 px-4 text-sm font-semibold text-slate-900">{month.total}</td>
                        <td className="py-3 px-4 text-sm text-green-600 font-medium">+{growth}%</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg border border-slate-200 p-4">
              <p className="text-sm text-slate-600">Total Members</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">1,665</p>
              <p className="text-xs text-green-600 mt-2">+19% growth this period</p>
            </div>
            <div className="bg-white rounded-lg border border-slate-200 p-4">
              <p className="text-sm text-slate-600">Individual Members</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">1,280</p>
              <p className="text-xs text-green-600 mt-2">77% of total</p>
            </div>
            <div className="bg-white rounded-lg border border-slate-200 p-4">
              <p className="text-sm text-slate-600">Corporate Members</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">385</p>
              <p className="text-xs text-green-600 mt-2">23% of total</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
