'use client';

import Link from 'next/link';
import { Mail, Megaphone } from 'lucide-react';
import { useState, useEffect } from 'react';

export function CommunicationSection() {
  const [messageCount, setMessageCount] = useState(0);
  const [announcementCount, setAnnouncementCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      // Fetch unread messages
      const messagesRes = await fetch('/api/individual/messages/unread');
      if (messagesRes.ok) {
        const messagesData = await messagesRes.json();
        const newCount = messagesData.count || 0;
        setMessageCount(newCount);
      }

      // Fetch unread announcements
      const announcementsRes = await fetch('/api/individual/announcements/unread');
      if (announcementsRes.ok) {
        const announcementsData = await announcementsRes.json();
        const newCount = announcementsData.count || 0;
        setAnnouncementCount(newCount);
      }
    } catch (err) {
      console.error('Error fetching communication data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, []);

  // Polling every 3 seconds to refresh counts
  useEffect(() => {
    const interval = setInterval(() => {
      fetchData();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="space-y-2">
      {/* Header */}
      <div className="flex items-center gap-2 mb-1">
        <Mail className="w-4 h-4 text-gray-400" aria-hidden="true" />
        <h2 className="text-lg font-semibold text-gray-900">Communication Center</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* My Inbox */}
        <Link
          href="/individual/messages"
          className={`flex flex-col border rounded-lg bg-white p-4 hover:border-blue-400 transition-all ${
            messageCount > 0
              ? 'border-blue-300 shadow-sm'
              : 'border-gray-200'
          }`}
        >
          <div className="flex items-center gap-2 mb-1">
            <Mail className="w-4 h-4 text-blue-400" aria-hidden="true" />
            <span className="text-sm font-medium text-gray-900">My Inbox</span>
            {messageCount > 0 && (
              <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-blue-100 text-xs font-bold text-blue-600 ml-auto">
                {messageCount}
              </span>
            )}
          </div>
          <span className="text-xs text-gray-500 mb-2">Direct messages from administrators</span>
          <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
            <span className="text-xs text-gray-400">Unread</span>
            <span className={`text-base font-bold ${loading ? 'text-gray-400' : messageCount > 0 ? 'text-blue-600' : 'text-gray-400'}`}>
              {loading ? '—' : messageCount}
            </span>
          </div>
        </Link>
        {/* Announcements */}
        <Link
          href="/individual/announcements"
          className={`flex flex-col border rounded-lg bg-white p-4 hover:border-orange-400 transition-all ${
            announcementCount > 0
              ? 'border-orange-300 shadow-sm'
              : 'border-gray-200'
          }`}
        >
          <div className="flex items-center gap-2 mb-1">
            <Megaphone className="w-4 h-4 text-orange-400" aria-hidden="true" />
            <span className="text-sm font-medium text-gray-900">Announcements</span>
            {announcementCount > 0 && (
              <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-orange-100 text-xs font-bold text-orange-600 ml-auto">
                {announcementCount}
              </span>
            )}
          </div>
          <span className="text-xs text-gray-500 mb-2">Platform updates & important broadcasts</span>
          <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
            <span className="text-xs text-gray-400">Unread</span>
            <span className={`text-base font-bold ${loading ? 'text-gray-400' : announcementCount > 0 ? 'text-orange-600' : 'text-gray-400'}`}>
              {loading ? '—' : announcementCount}
            </span>
          </div>
        </Link>
      </div>
    </section>
  );
}
