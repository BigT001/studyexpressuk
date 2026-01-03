'use client'

import { AlertTriangle, Clock, CheckCircle } from 'lucide-react'

export function SubAdminAlerts() {
  const alerts = [
    {
      id: 1,
      type: 'critical',
      title: 'Portal Login Issues',
      message: 'Tech Industries staff unable to log in (23 users affected)',
      timestamp: '2 hours ago',
      icon: AlertTriangle
    },
    {
      id: 2,
      type: 'warning',
      title: 'Pending Approvals',
      message: '23 staff registrations awaiting review',
      timestamp: '4 hours ago',
      icon: Clock
    },
    {
      id: 3,
      type: 'success',
      title: 'System Healthy',
      message: 'All platform services operating normally',
      timestamp: '10 minutes ago',
      icon: CheckCircle
    },
  ]

  return (
    <div className="bg-white rounded-lg border border-slate-200">
      <div className="p-6 border-b border-slate-200">
        <h3 className="font-semibold text-slate-900">Alerts</h3>
      </div>

      <div className="divide-y divide-slate-200">
        {alerts.map((alert) => {
          const Icon = alert.icon
          const bgColor = alert.type === 'critical' ? 'bg-red-100' :
                         alert.type === 'warning' ? 'bg-amber-100' :
                         'bg-green-100'
          const textColor = alert.type === 'critical' ? 'text-red-600' :
                           alert.type === 'warning' ? 'text-amber-600' :
                           'text-green-600'

          return (
            <div key={alert.id} className="p-4 hover:bg-slate-50 transition-colors">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg flex-shrink-0 ${bgColor}`}>
                  <Icon className={`w-5 h-5 ${textColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900">{alert.title}</p>
                  <p className="text-xs text-slate-600 mt-1">{alert.message}</p>
                  <p className="text-xs text-slate-400 mt-2">{alert.timestamp}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
