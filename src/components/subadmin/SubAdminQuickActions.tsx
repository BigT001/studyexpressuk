'use client'

import { UserCheck, MessageSquare, BarChart3, Bell } from 'lucide-react'

export function SubAdminQuickActions() {
  const actions = [
    {
      icon: UserCheck,
      label: 'Approve Staff',
      description: '23 pending approvals',
      color: 'from-purple-500 to-purple-600',
      href: '/subadmin/staff-registrations'
    },
    {
      icon: MessageSquare,
      label: 'Member Messages',
      description: '12 unread messages',
      color: 'from-blue-500 to-blue-600',
      href: '/subadmin/messages'
    },
    {
      icon: BarChart3,
      label: 'View Reports',
      description: 'Engagement & activity',
      color: 'from-green-500 to-green-600',
      href: '/subadmin/reports'
    },
    {
      icon: Bell,
      label: 'Notifications',
      description: '8 new alerts',
      color: 'from-amber-500 to-amber-600',
      href: '/subadmin/notifications'
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {actions.map((action, idx) => {
        const Icon = action.icon
        return (
          <a
            key={idx}
            href={action.href}
            className={`bg-gradient-to-br ${action.color} rounded-lg p-6 text-white hover:shadow-lg transition-shadow cursor-pointer`}
          >
            <Icon className="w-6 h-6 mb-3 text-white/80" />
            <p className="font-semibold text-sm">{action.label}</p>
            <p className="text-xs text-white/70 mt-1">{action.description}</p>
          </a>
        )
      })}
    </div>
  )
}
