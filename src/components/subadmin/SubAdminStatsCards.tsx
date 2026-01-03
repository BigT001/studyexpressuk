'use client'

import { Card } from '@/components/ui'

interface Stat {
  label: string
  value: string
  change: string
  color: string
  icon: any
}

export function SubAdminStatsCards({ stats }: { stats: Stat[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, idx) => {
        const Icon = stat.icon
        return (
          <div key={idx} className={`bg-gradient-to-br ${stat.color} rounded-lg p-6 text-white`}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-white/80 text-sm mb-2">{stat.label}</p>
                <p className="text-3xl font-bold">{stat.value}</p>
                <p className="text-sm text-white/70 mt-2">{stat.change}</p>
              </div>
              <Icon className="w-8 h-8 text-white/20" />
            </div>
          </div>
        )
      })}
    </div>
  )
}
