'use client'

import { Clock, CheckCircle } from 'lucide-react'

export function SubAdminStaffStats() {
  const stats = [
    { label: 'Pending', value: '23', icon: Clock, color: 'amber' },
    { label: 'Approved', value: '156', icon: CheckCircle, color: 'green' },
  ]

  return (
    <div className="grid grid-cols-2 gap-4">
      {stats.map((stat, idx) => {
        const Icon = stat.icon
        return (
          <div key={idx} className="bg-white rounded-lg border border-slate-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-600">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
              </div>
              <Icon className={`w-8 h-8 text-${stat.color}-600`} />
            </div>
          </div>
        )
      })}
    </div>
  )
}
