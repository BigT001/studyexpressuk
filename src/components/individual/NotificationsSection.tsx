'use client';

import { Bell, UserPlus } from 'lucide-react';
import { useEffect, useState } from 'react';

export function NotificationsSection({ profile, userId }: { profile: any, userId: string }) {
  const [welcomeMessage, setWelcomeMessage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMessages() {
      try {
        const res = await fetch(`/api/messages?userId=${userId}&limit=10`);
        if (!res.ok) return;
        const data = await res.json();
        const welcome = data.messages?.find((msg: any) =>
          msg.content?.startsWith('Welcome to StudyExpress!')
        );
        if (welcome) setWelcomeMessage(welcome.content);
      } catch {}
    }
    fetchMessages();
  }, [userId]);

  const showProfileNotification = !profile?.profileImage || !profile?.bio;

  return (
    <section className="space-y-2">
      <div className="flex items-center gap-2 mb-1">
        <Bell className="w-4 h-4 text-gray-400" aria-hidden="true" />
        <h2 className="text-lg font-semibold text-gray-900">Your Notifications</h2>
      </div>
      <div className="space-y-2">
        {/* Welcome Notification (automated) */}
        {welcomeMessage && (
          <div className="flex items-start gap-3 border border-blue-100 rounded-lg bg-white p-3">
            <Bell className="w-4 h-4 text-blue-400 mt-1" aria-hidden="true" />
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-900 text-sm">Welcome to StudyExpress!</h3>
              <p className="text-xs text-gray-600 mt-1">{welcomeMessage.replace('Welcome to StudyExpress!', '').trim()}</p>
              <span className="inline-block mt-2 text-[10px] text-blue-500 bg-blue-50 px-2 py-0.5 rounded">Just now</span>
            </div>
          </div>
        )}
        {/* Profile Completion Notification (automated) */}
        {showProfileNotification && (
          <div className="flex items-start gap-3 border border-emerald-100 rounded-lg bg-white p-3">
            <UserPlus className="w-4 h-4 text-emerald-400 mt-1" aria-hidden="true" />
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-900 text-sm">Complete Your Profile</h3>
              <p className="text-xs text-gray-600 mt-1">Add a profile picture and bio to help us personalize your experience.</p>
              <span className="inline-block mt-2 text-[10px] text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded">Pending</span>
            </div>
          </div>
        )}
      </div>
      <div className="pt-2">
        <button className="w-full px-3 py-2 text-center text-xs font-medium text-blue-700 hover:bg-blue-50 rounded transition-colors">
          View all notifications &rarr;
        </button>
      </div>
    </section>
  );
}
