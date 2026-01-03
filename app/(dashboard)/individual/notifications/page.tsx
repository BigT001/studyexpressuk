import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Notifications | Individual Dashboard',
  description: 'Event reminders, messages, and membership alerts',
};

export default function NotificationsPage() {
  // Sample notifications data
  const notifications = [
    {
      id: 1,
      type: 'event',
      title: 'Upcoming Event Reminder',
      description: 'UK Study Abroad Information Session starting in 2 hours',
      timestamp: '2 hours ago',
      icon: '📅',
      isRead: false,
      actionUrl: '/events/uk-study-abroad',
    },
    {
      id: 2,
      type: 'course',
      title: 'Course Update',
      description: 'New assignment posted in "English Language Mastery" course',
      timestamp: '5 hours ago',
      icon: '📝',
      isRead: false,
      actionUrl: '/individual/enrollments',
    },
    {
      id: 3,
      type: 'message',
      title: 'New Message',
      description: 'You have a message from Course Instructor regarding your submission',
      timestamp: '1 day ago',
      icon: '💬',
      isRead: true,
      actionUrl: '/individual/messages',
    },
    {
      id: 4,
      type: 'membership',
      title: 'Membership Expiring Soon',
      description: 'Your Premium membership will expire in 30 days. Consider renewing for uninterrupted access.',
      timestamp: '2 days ago',
      icon: '🎟️',
      isRead: true,
      actionUrl: '/individual/memberships',
    },
    {
      id: 5,
      type: 'course',
      title: 'Certificate Ready',
      description: 'Congratulations! Your certificate for "Professional Communication" is ready to download.',
      timestamp: '3 days ago',
      icon: '🏆',
      isRead: true,
      actionUrl: '/individual/enrollments?view=certificates',
    },
    {
      id: 6,
      type: 'system',
      title: 'Account Activity',
      description: 'You logged in from a new device: Windows (Chrome). If this was not you, please secure your account.',
      timestamp: '1 week ago',
      icon: '🔐',
      isRead: true,
      actionUrl: '/individual/profile?section=security',
    },
    {
      id: 7,
      type: 'event',
      title: 'Event Cancelled',
      description: 'The "Introduction to UK Education System" event scheduled for next week has been rescheduled.',
      timestamp: '1 week ago',
      icon: '⚠️',
      isRead: true,
      actionUrl: '/events',
    },
    {
      id: 8,
      type: 'promotion',
      title: 'Special Offer',
      description: 'Limited time: Get 50% off on all premium courses this month only!',
      timestamp: '2 weeks ago',
      icon: '🎉',
      isRead: true,
      actionUrl: '/courses',
    },
  ];

  const getTypeStyles = (type: string) => {
    const styles: Record<string, { bg: string; text: string; icon: string }> = {
      event: { bg: 'bg-purple-50 dark:bg-purple-900/20', text: 'text-purple-700 dark:text-purple-200', icon: '📅' },
      course: { bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-700 dark:text-blue-200', icon: '📚' },
      message: { bg: 'bg-green-50 dark:bg-green-900/20', text: 'text-green-700 dark:text-green-200', icon: '💬' },
      membership: { bg: 'bg-orange-50 dark:bg-orange-900/20', text: 'text-orange-700 dark:text-orange-200', icon: '🎟️' },
      system: { bg: 'bg-red-50 dark:bg-red-900/20', text: 'text-red-700 dark:text-red-200', icon: '🔐' },
      promotion: { bg: 'bg-yellow-50 dark:bg-yellow-900/20', text: 'text-yellow-700 dark:text-yellow-200', icon: '🎉' },
    };
    return styles[type] || styles.system;
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Notifications</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Stay informed with event reminders, messages, and membership alerts
          </p>
        </div>
        {unreadCount > 0 && (
          <div className="rounded-lg bg-red-50 px-4 py-2 dark:bg-red-900/20">
            <p className="text-sm font-medium text-red-700 dark:text-red-200">
              {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
            </p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
          <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
          Mark All as Read
        </button>
        <Link
          href="/individual/profile?section=notifications"
          className="inline-flex items-center rounded-lg border border-[#008200] bg-white px-4 py-2 text-sm font-medium text-[#008200] hover:bg-green-50 dark:border-[#00B300] dark:bg-gray-800 dark:text-[#00B300] dark:hover:bg-gray-700"
        >
          <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Preferences
        </Link>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.map((notification) => {
          const styles = getTypeStyles(notification.type);
          return (
            <Link
              key={notification.id}
              href={notification.actionUrl}
              className={`block rounded-lg border p-4 transition-all hover:shadow-md ${
                notification.isRead
                  ? 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800'
                  : `border-l-4 border-l-[#008200] ${styles.bg}`
              }`}
            >
              <div className="flex items-start space-x-4">
                {/* Icon */}
                <div className="flex-shrink-0 text-2xl">{notification.icon}</div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3
                        className={`text-base font-semibold ${
                          notification.isRead
                            ? 'text-gray-900 dark:text-white'
                            : 'text-gray-900 dark:text-white'
                        }`}
                      >
                        {notification.title}
                        {!notification.isRead && (
                          <span className="ml-2 inline-block h-2 w-2 rounded-full bg-[#008200]"></span>
                        )}
                      </h3>
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        {notification.description}
                      </p>
                      <p className="mt-2 text-xs text-gray-500 dark:text-gray-500">
                        {notification.timestamp}
                      </p>
                    </div>

                    {/* Action Icon */}
                    <svg
                      className="ml-4 h-5 w-5 flex-shrink-0 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Settings Reminder */}
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
        <div className="flex items-start space-x-3">
          <svg
            className="h-5 w-5 flex-shrink-0 text-gray-400 dark:text-gray-500 mt-0.5"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zm-11-1a1 1 0 11-2 0 1 1 0 012 0zm3 1a1 1 0 100-2 1 1 0 000 2zm3 0a1 1 0 100-2 1 1 0 000 2z"
              clipRule="evenodd"
            />
          </svg>
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
              Customize Your Notifications
            </h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Visit your notification preferences to control which alerts you receive and how you want to receive them.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
