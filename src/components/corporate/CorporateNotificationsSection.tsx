'use client';

import Link from 'next/link';
import { Bell, Clock, AlertCircle, CheckCircle, CreditCard } from 'lucide-react';

export function CorporateNotificationsSection() {
  const notifications = [
    {
      type: 'event',
      icon: Clock,
      title: 'Upcoming Webinar: Cloud Architecture',
      message: 'Your team has been enrolled in the webinar on Feb 15',
      time: 'Today',
      color: 'blue',
    },
    {
      type: 'staff',
      icon: CheckCircle,
      title: 'Course Completed',
      message: 'John Smith completed Advanced TypeScript with 92%',
      time: '2 hours ago',
      color: 'green',
    },
    {
      type: 'membership',
      icon: CreditCard,
      title: 'Renewal Reminder',
      message: 'Your Enterprise membership renews in 30 days',
      time: 'Yesterday',
      color: 'orange',
    },
    {
      type: 'alert',
      icon: AlertCircle,
      title: 'Staff Alert',
      message: '3 members failed the certification assessment',
      time: '2 days ago',
      color: 'red',
    },
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Recent Notifications</h2>
          <Link href="/corporate/notifications" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            View All
          </Link>
        </div>
      </div>

      <div className="divide-y divide-gray-200">
        {notifications.map((notification, idx) => {
          const Icon = notification.icon;
          const colorClasses = {
            blue: 'bg-blue-100 text-blue-600',
            green: 'bg-green-100 text-green-600',
            orange: 'bg-orange-100 text-orange-600',
            red: 'bg-red-100 text-red-600',
          };

          return (
            <div key={idx} className="p-4 hover:bg-gray-50 transition-colors cursor-pointer">
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-lg flex-shrink-0 ${colorClasses[notification.color as keyof typeof colorClasses]}`}>
                  <Icon className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 text-sm">{notification.title}</h3>
                  <p className="text-gray-600 text-xs mt-1">{notification.message}</p>
                  <p className="text-gray-500 text-xs mt-2">{notification.time}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
