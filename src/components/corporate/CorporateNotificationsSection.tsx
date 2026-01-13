'use client';

import { Bell, Clock } from 'lucide-react';

interface CorporateNotificationsSectionProps {
  userId: string;
}

export function CorporateNotificationsSection({ userId }: CorporateNotificationsSectionProps) {
  return (
    <section className="space-y-2">
      <div className="flex items-center gap-2 mb-1">
        <Bell className="w-4 h-4 text-gray-400" aria-hidden="true" />
        <h2 className="text-lg font-semibold text-gray-900">Your Notifications</h2>
      </div>
      <div className="space-y-2">
        {/* Membership Renewal Notification */}
        <div className="flex items-start gap-3 border border-orange-100 rounded-lg bg-white p-3">
          <Clock className="w-4 h-4 text-orange-400 mt-1" aria-hidden="true" />
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-900 text-sm">Membership Renewal</h3>
            <p className="text-xs text-gray-600 mt-1">Your Enterprise plan renews in 30 days</p>
            <span className="inline-block mt-2 text-[10px] text-orange-500 bg-orange-50 px-2 py-0.5 rounded">Upcoming</span>
          </div>
        </div>

        {/* Welcome Notification */}
        <div className="flex items-start gap-3 border border-blue-100 rounded-lg bg-white p-3">
          <Bell className="w-4 h-4 text-blue-400 mt-1" aria-hidden="true" />
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-900 text-sm">Welcome to StudyExpress!</h3>
            <p className="text-xs text-gray-600 mt-1">Your corporate training hub is ready. Start by adding staff members.</p>
            <span className="inline-block mt-2 text-[10px] text-blue-500 bg-blue-50 px-2 py-0.5 rounded">New</span>
          </div>
        </div>
      </div>
      <div className="pt-2">
        <button className="w-full px-3 py-2 text-center text-xs font-medium text-blue-700 hover:bg-blue-50 rounded transition-colors">
          View all notifications &rarr;
        </button>
      </div>
    </section>
  );
}
