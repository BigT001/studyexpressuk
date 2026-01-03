import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Messages | Individual Dashboard',
  description: 'Your inbox and messages with administrators',
};

export default function MessagesPage() {
  // Sample messages data
  const messages = [
    {
      id: 1,
      from: 'Admin Support',
      subject: 'Welcome to StudyExpressUK!',
      message: 'Thank you for registering. We are excited to have you on board.',
      date: 'January 1, 2026',
      isRead: false,
      category: 'system',
    },
    {
      id: 2,
      from: 'Course Instructor',
      subject: 'Your assignment has been reviewed',
      message: 'Great work on your last assignment! Please see the detailed feedback in the course portal.',
      date: 'December 30, 2025',
      isRead: true,
      category: 'course',
    },
    {
      id: 3,
      from: 'Membership Team',
      subject: 'Upgrade Your Membership',
      message: 'Unlock premium features with our Premium membership plan. Limited time offer!',
      date: 'December 28, 2025',
      isRead: true,
      category: 'membership',
    },
    {
      id: 4,
      from: 'Event Management',
      subject: 'Event Reminder: UK Study Abroad',
      message: 'Reminder: UK Study Abroad event is tomorrow at 3:00 PM. See you there!',
      date: 'December 25, 2025',
      isRead: true,
      category: 'event',
    },
  ];

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Messages</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            View and manage your messages from administrators, instructors, and the platform
          </p>
        </div>
        <Link
          href="/individual/messages?compose=true"
          className="inline-flex items-center rounded-lg bg-[#008200] px-6 py-2.5 text-center text-sm font-medium text-white hover:bg-[#007000] focus:outline-none focus:ring-4 focus:ring-green-300 dark:focus:ring-green-800"
        >
          <svg
            className="mr-2 h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          New Message
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-4 border-b border-gray-200 dark:border-gray-700">
        <button className="border-b-2 border-[#008200] px-4 py-2 text-sm font-medium text-[#008200] dark:text-[#00B300]">
          All
        </button>
        <button className="border-b-2 border-transparent px-4 py-2 text-sm font-medium text-gray-600 hover:border-gray-300 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300">
          Unread
        </button>
        <button className="border-b-2 border-transparent px-4 py-2 text-sm font-medium text-gray-600 hover:border-gray-300 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300">
          System
        </button>
        <button className="border-b-2 border-transparent px-4 py-2 text-sm font-medium text-gray-600 hover:border-gray-300 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300">
          Course
        </button>
      </div>

      {/* Messages List */}
      <div className="space-y-3">
        {messages.map((msg) => (
          <Link
            key={msg.id}
            href={`/individual/messages/${msg.id}`}
            className={`block rounded-lg border p-4 transition-all hover:shadow-md ${
              msg.isRead
                ? 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800'
                : 'border-[#00B300] bg-green-50 dark:border-[#00B300] dark:bg-green-900/20'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h3 className={`text-base font-semibold ${msg.isRead ? 'text-gray-900 dark:text-white' : 'text-[#008200] dark:text-[#00B300]'}`}>
                    {msg.from}
                  </h3>
                  {!msg.isRead && (
                    <span className="inline-flex h-2 w-2 rounded-full bg-[#008200]"></span>
                  )}
                  <span className="inline-block rounded-full bg-gray-200 px-2.5 py-0.5 text-xs font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                    {msg.category}
                  </span>
                </div>
                <p className="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                  {msg.subject}
                </p>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                  {msg.message}
                </p>
              </div>
              <div className="ml-4 flex-shrink-0 text-right">
                <p className="text-xs text-gray-500 dark:text-gray-400">{msg.date}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Empty State */}
      {messages.length === 0 && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 px-6 py-12 text-center dark:border-gray-700 dark:bg-gray-800">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
            No messages yet
          </h3>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Your messages and communications from administrators will appear here.
          </p>
        </div>
      )}

      {/* Help Section */}
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-900/20">
        <div className="flex">
          <svg
            className="h-5 w-5 text-blue-600 dark:text-blue-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zm-11-1a1 1 0 11-2 0 1 1 0 012 0zm3 1a1 1 0 100-2 1 1 0 000 2zm3 0a1 1 0 100-2 1 1 0 000 2z"
              clipRule="evenodd"
            />
          </svg>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
              Need help?
            </h3>
            <p className="mt-1 text-sm text-blue-700 dark:text-blue-300">
              Contact our support team directly through the help center or reach out to{' '}
              <span className="font-semibold">support@studyexpressuk.com</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
