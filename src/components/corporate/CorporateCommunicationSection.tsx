'use client';

import Link from 'next/link';
import { Mail, Megaphone } from 'lucide-react';
import { useState, useEffect } from 'react';

export function CorporateCommunicationSection() {
  const [messageCount, setMessageCount] = useState(0);
  const [announcementCount, setAnnouncementCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        setError(null);
        const [messagesRes, announcementsRes] = await Promise.all([
          fetch('/api/corporate/messages/count'),
          fetch('/api/corporate/announcements/count'),
        ]);

        if (messagesRes.ok) {
          const data = await messagesRes.json();
          setMessageCount(data.count || 0);
        } else {
          console.error('Failed to fetch message count:', messagesRes.status);
          setMessageCount(0);
        }

        if (announcementsRes.ok) {
          const data = await announcementsRes.json();
          setAnnouncementCount(data.count || 0);
        } else {
          console.error('Failed to fetch announcement count:', announcementsRes.status);
          setAnnouncementCount(0);
        }
      } catch (err) {
        console.error('Error fetching counts:', err);
        setError('Failed to load communication data');
        setMessageCount(0);
        setAnnouncementCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
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
          href="/corporate/messages"
          className="flex flex-col border border-gray-200 rounded-lg bg-white p-4 hover:border-blue-400 transition-colors"
        >
          <div className="flex items-center gap-2 mb-1">
            <Mail className="w-4 h-4 text-blue-400" aria-hidden="true" />
            <span className="text-sm font-medium text-gray-900">My Inbox</span>
          </div>
          <span className="text-xs text-gray-500 mb-2">Direct messages from administrators</span>
          <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
            <span className="text-xs text-gray-400">Messages</span>
            <span className="text-base font-bold text-blue-600">{loading ? '...' : messageCount}</span>
          </div>
        </Link>
        {/* Announcements */}
        <Link
          href="/corporate/announcements"
          className="flex flex-col border border-gray-200 rounded-lg bg-white p-4 hover:border-orange-400 transition-colors"
        >
          <div className="flex items-center gap-2 mb-1">
            <Megaphone className="w-4 h-4 text-orange-400" aria-hidden="true" />
            <span className="text-sm font-medium text-gray-900">Announcements</span>
          </div>
          <span className="text-xs text-gray-500 mb-2">Platform updates & important broadcasts</span>
          <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
            <span className="text-xs text-gray-400">Active</span>
            <span className="text-base font-bold text-orange-600">{loading ? '...' : announcementCount}</span>
          </div>
        </Link>
      </div>
    </section>
  );
}
