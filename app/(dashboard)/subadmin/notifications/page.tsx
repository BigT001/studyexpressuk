'use client'

import { useState } from 'react'
import { AlertCircle, Bell, CheckCircle, Trash2 } from 'lucide-react'


export default function NotificationsPage() {
  const [filterType, setFilterType] = useState('all')
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'registration',
      title: 'New Staff Registration',
      message: 'Michael Chen from Tech Industries has registered as a staff member',
      timestamp: '2 hours ago',
      read: false,
      category: 'Staff'
    },
    {
      id: 2,
      type: 'message',
      title: 'New Member Message',
      message: 'Sarah Johnson sent you a message about course enrollment',
      timestamp: '4 hours ago',
      read: false,
      category: 'Messages'
    },
    {
      id: 3,
      type: 'event',
      title: 'Event Registration Threshold',
      message: 'Digital Marketing Masterclass has reached 60% capacity (89/150)',
      timestamp: '1 day ago',
      read: true,
      category: 'Events'
    },
    {
      id: 4,
      type: 'registration',
      title: 'Staff Approval Reminder',
      message: 'You have 23 pending staff registration approvals',
      timestamp: '2 days ago',
      read: true,
      category: 'Staff'
    },
    {
      id: 5,
      type: 'message',
      title: 'Urgent Support Request',
      message: 'James Wilson reported a technical issue with the learning portal',
      timestamp: '3 days ago',
      read: true,
      category: 'Messages'
    },
  ])

  const stats = [
    { label: 'Unread', value: notifications.filter(n => !n.read).length, type: 'all' },
    { label: 'Registrations', value: notifications.filter(n => n.category === 'Staff').length, type: 'staff' },
    { label: 'Messages', value: notifications.filter(n => n.category === 'Messages').length, type: 'messages' },
    { label: 'Events', value: notifications.filter(n => n.category === 'Events').length, type: 'events' },
  ]

  const filteredNotifications = filterType === 'all'
    ? notifications
    : notifications.filter(n => {
      if (filterType === 'staff') return n.category === 'Staff'
      if (filterType === 'messages') return n.category === 'Messages'
      if (filterType === 'events') return n.category === 'Events'
      return true
    })

  const handleMarkAsRead = (id: number) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const handleDelete = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id))
  }

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Notifications</h1>
          <p className="text-slate-600 mt-1">Manage registration and message alerts</p>
        </div>
        {notifications.some(n => !n.read) && (
          <button
            onClick={handleMarkAllAsRead}
            className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <button
            key={idx}
            onClick={() => setFilterType(stat.type)}
            className={`p-4 rounded-lg border-2 text-left transition-all ${
              filterType === stat.type
                ? 'border-blue-600 bg-blue-50'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <p className="text-sm text-slate-600">{stat.label}</p>
            <p className="text-2xl font-bold text-slate-900 mt-2">{stat.value}</p>
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-lg border border-slate-200 p-8 text-center">
            <Bell className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-600">No notifications in this category</p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`border-l-4 rounded-lg p-4 flex items-start justify-between gap-4 transition-all ${
                notification.read
                  ? 'border-l-slate-200 bg-white'
                  : 'border-l-blue-600 bg-blue-50'
              }`}
            >
              <div className="flex items-start gap-4 flex-1">
                <div className={`p-2 rounded-lg flex-shrink-0 ${
                  notification.category === 'Staff'
                    ? 'bg-purple-100'
                    : notification.category === 'Messages'
                    ? 'bg-blue-100'
                    : 'bg-green-100'
                }`}>
                  {notification.category === 'Staff' && <AlertCircle className="w-5 h-5 text-purple-600" />}
                  {notification.category === 'Messages' && <Bell className="w-5 h-5 text-blue-600" />}
                  {notification.category === 'Events' && <CheckCircle className="w-5 h-5 text-green-600" />}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className={`font-medium ${notification.read ? 'text-slate-700' : 'text-slate-900 font-semibold'}`}>
                      {notification.title}
                    </h3>
                    {!notification.read && (
                      <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                    )}
                  </div>
                  <p className="text-sm text-slate-600 mt-1">{notification.message}</p>
                  <p className="text-xs text-slate-500 mt-2">{notification.timestamp}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {!notification.read && (
                  <button
                    onClick={() => handleMarkAsRead(notification.id)}
                    className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                    title="Mark as read"
                  >
                    <CheckCircle className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => handleDelete(notification.id)}
                  className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
