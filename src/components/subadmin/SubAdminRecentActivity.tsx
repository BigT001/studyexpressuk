'use client'

import { Activity, Users, Calendar, TrendingUp } from 'lucide-react'

export function SubAdminRecentActivity() {
  const activities = [
    {
      id: 1,
      type: 'staff_approved',
      user: 'Sophie Martin',
      action: 'Staff registration approved',
      company: 'Tech Industries Ltd',
      timestamp: '2 hours ago',
      icon: Users
    },
    {
      id: 2,
      type: 'member_joined',
      user: 'David Chen',
      action: 'Joined as Individual Member',
      detail: 'Enrolled in 2 courses',
      timestamp: '4 hours ago',
      icon: Users
    },
    {
      id: 3,
      type: 'event_registered',
      user: 'Tech Industries Ltd',
      action: 'Staff registered for event',
      detail: 'Leadership Workshop - 5 registrations',
      timestamp: '6 hours ago',
      icon: Calendar
    },
    {
      id: 4,
      type: 'milestone',
      user: 'Platform',
      action: 'Reached 2,450 total members',
      detail: 'Milestone achievement',
      timestamp: '1 day ago',
      icon: TrendingUp
    },
  ]

  return (
    <div className="bg-white rounded-lg border border-slate-200">
      <div className="p-6 border-b border-slate-200">
        <h3 className="font-semibold text-slate-900 flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-600" />
          Recent Activity
        </h3>
      </div>

      <div className="divide-y divide-slate-200">
        {activities.map((activity) => {
          const Icon = activity.icon
          return (
            <div key={activity.id} className="p-4 hover:bg-slate-50 transition-colors">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                  <Icon className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900">{activity.action}</p>
                  <p className="text-sm text-slate-600 mt-1">{activity.user}</p>
                  {'detail' in activity && (
                    <p className="text-xs text-slate-500 mt-1">{activity.detail}</p>
                  )}
                  <p className="text-xs text-slate-400 mt-2">{activity.timestamp}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
