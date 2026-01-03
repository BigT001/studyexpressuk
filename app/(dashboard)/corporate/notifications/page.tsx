'use client';

import { useState } from 'react';

export default function CorporateNotificationsPage() {
  const [notifications] = useState([
    {
      id: 1,
      type: 'event',
      title: 'Upcoming Webinar: Cloud Architecture Trends',
      message: 'Your team has been enrolled in the upcoming webinar on cloud architecture trends happening on February 15.',
      date: 'Today',
      time: '10:30 AM',
      emoji: '🕐',
      color: 'blue',
    },
    {
      id: 2,
      type: 'staff',
      title: 'John Smith Completed Advanced TypeScript Course',
      message: 'Staff member John Smith has successfully completed the Advanced TypeScript Mastery course with a score of 92%.',
      date: 'Today',
      time: '9:15 AM',
      emoji: '✓',
      color: 'green',
    },
    {
      id: 3,
      type: 'membership',
      title: 'Enterprise Membership Renewal in 30 Days',
      message: 'Your Enterprise membership plan will renew in 30 days. Review your plan details and make any changes before renewal.',
      date: 'Yesterday',
      time: '2:45 PM',
      emoji: '💳',
      color: 'orange',
    },
    {
      id: 4,
      type: 'staff',
      title: '3 Staff Members Failed Course Assessment',
      message: 'Sarah Johnson, Michael Chen, and Robert Wilson did not pass the Professional Certification assessment. Remedial training recommended.',
      date: 'Jan 28',
      time: '8:00 AM',
      emoji: '⚠️',
      color: 'red',
    },
    {
      id: 5,
      type: 'event',
      title: 'New Course Available: Data Analytics Fundamentals',
      message: 'A new course in Data Analytics Fundamentals is now available for your organization. Enroll your staff to start learning.',
      date: 'Jan 27',
      time: '4:30 PM',
      emoji: '🕐',
      color: 'purple',
    },
    {
      id: 6,
      type: 'membership',
      title: 'Mid-Year Membership Review',
      message: 'It is time for your mid-year membership review. We recommend upgrading to Enterprise plan to unlock additional features.',
      date: 'Jan 26',
      time: '11:00 AM',
      emoji: '👥',
      color: 'indigo',
    },
  ]);

  const [selectedNotification, setSelectedNotification] = useState<typeof notifications[0] | null>(null);

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'event':
        return 'Event Update';
      case 'staff':
        return 'Staff Alert';
      case 'membership':
        return 'Membership Renewal';
      default:
        return 'Notification';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'event':
        return 'bg-blue-100 text-blue-900';
      case 'staff':
        return 'bg-green-100 text-green-900';
      case 'membership':
        return 'bg-orange-100 text-orange-900';
      default:
        return 'bg-gray-100 text-gray-900';
    }
  };

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
        <p className="text-gray-600 mt-1">Stay informed about events, staff progress, and membership updates</p>
      </div>

      {/* Notification Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <span className="text-4xl mb-3 block">🕐</span>
          <p className="text-gray-600 text-sm font-medium">Event Updates</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {notifications.filter(n => n.type === 'event').length}
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <span className="text-4xl mb-3 block">👥</span>
          <p className="text-gray-600 text-sm font-medium">Staff Alerts</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {notifications.filter(n => n.type === 'staff').length}
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <span className="text-4xl mb-3 block">💳</span>
          <p className="text-gray-600 text-sm font-medium">Membership Alerts</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {notifications.filter(n => n.type === 'membership').length}
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <span className="text-4xl mb-3 block">🔔</span>
          <p className="text-gray-600 text-sm font-medium">Total</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{notifications.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Notifications List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🔔</span>
                <h2 className="text-2xl font-bold text-gray-900">All Notifications</h2>
              </div>
            </div>

            <div className="divide-y divide-gray-200">
              {notifications.map((notification) => {
                return (
                  <div
                    key={notification.id}
                    onClick={() => setSelectedNotification(notification)}
                    className={`p-6 cursor-pointer transition-colors hover:bg-gray-50 ${
                      selectedNotification?.id === notification.id ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg flex-shrink-0 bg-${notification.color}-100`}>
                        <span className="text-2xl">{notification.emoji}</span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-gray-900">{notification.title}</h3>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(notification.type)}`}>
                            {getTypeLabel(notification.type)}
                          </span>
                        </div>

                        <p className="text-gray-700 mt-2 line-clamp-2">{notification.message}</p>

                        <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
                          <span>{notification.date}</span>
                          <span>•</span>
                          <span>{notification.time}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Notification Details */}
        <div className="lg:col-span-1">
          {selectedNotification ? (
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 border-b border-gray-200">
                <h3 className="font-bold text-gray-900">Notification Details</h3>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Type</p>
                  <div className="mt-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(selectedNotification.type)}`}>
                      {getTypeLabel(selectedNotification.type)}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Notification</p>
                  <h4 className="font-bold text-gray-900 mt-2">{selectedNotification.title}</h4>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Date & Time</p>
                  <p className="font-bold text-gray-900 mt-1">{selectedNotification.date} at {selectedNotification.time}</p>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-3">Full Message</p>
                  <p className="text-gray-700 leading-relaxed">{selectedNotification.message}</p>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Mark as Read
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 text-center">
              <span className="text-5xl block mb-3 text-gray-400">🔔</span>
              <p className="text-gray-600">Select a notification to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
