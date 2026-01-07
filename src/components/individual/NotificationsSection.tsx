'use client';

import { Bell, UserPlus } from 'lucide-react';

export function NotificationsSection() {
  return (
    <section className="space-y-2">
      <div className="flex items-center gap-2 mb-1">
        <Bell className="w-4 h-4 text-gray-400" aria-hidden="true" />
        <h2 className="text-lg font-semibold text-gray-900">Your Notifications</h2>
      </div>
      <div className="space-y-2">
        {/* Welcome Notification */}
        <div className="flex items-start gap-3 border border-blue-100 rounded-lg bg-white p-3">
          <Bell className="w-4 h-4 text-blue-400 mt-1" aria-hidden="true" />
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-900 text-sm">Welcome to StudyExpress!</h3>
            <p className="text-xs text-gray-600 mt-1">Your account has been created successfully. Explore our courses and get started on your learning journey.</p>
            <span className="inline-block mt-2 text-[10px] text-blue-500 bg-blue-50 px-2 py-0.5 rounded">Just now</span>
          </div>
        </div>
        {/* Profile Completion Notification */}
        <div className="flex items-start gap-3 border border-emerald-100 rounded-lg bg-white p-3">
          <UserPlus className="w-4 h-4 text-emerald-400 mt-1" aria-hidden="true" />
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-900 text-sm">Complete Your Profile</h3>
            <p className="text-xs text-gray-600 mt-1">Add a profile picture and bio to help us personalize your experience.</p>
            <span className="inline-block mt-2 text-[10px] text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded">Pending</span>
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
