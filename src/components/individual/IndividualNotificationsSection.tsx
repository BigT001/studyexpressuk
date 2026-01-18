'use client';

import { Bell } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Announcement {
  _id: string;
  title: string;
  content: string;
  type: 'info' | 'warning' | 'success' | 'urgent';
  createdAt: string;
}

export function IndividualNotificationsSection() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch('/api/announcements');
      const data = await res.json();
      if (data.success && data.announcements) {
        // Get the 3 most recent announcements
        const recent = data.announcements
          .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 3);
        setAnnouncements(recent);
      }
    } catch (error) {
      console.error('Error fetching announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'urgent':
        return 'border-red-100 bg-red-50 text-red-700';
      case 'warning':
        return 'border-orange-100 bg-orange-50 text-orange-700';
      case 'success':
        return 'border-green-100 bg-green-50 text-green-700';
      default:
        return 'border-blue-100 bg-blue-50 text-blue-700';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'urgent':
        return '🔴';
      case 'warning':
        return '🟠';
      case 'success':
        return '🟢';
      default:
        return '🔵';
    }
  };

  return (
    <section className="space-y-2">
      <div className="flex items-center gap-2 mb-1">
        <Bell className="w-4 h-4 text-gray-400" aria-hidden="true" />
        <h2 className="text-lg font-semibold text-gray-900">Your Announcements</h2>
      </div>
      
      {loading ? (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
        </div>
      ) : announcements.length === 0 ? (
        <div className="flex items-center justify-center border border-gray-200 rounded-lg bg-white p-4 text-center">
          <p className="text-sm text-gray-600">No recent announcements</p>
        </div>
      ) : (
        <div className="space-y-2">
          {announcements.map((announcement) => (
            <div key={announcement._id} className={`flex items-start gap-3 border rounded-lg p-3 ${getTypeColor(announcement.type)}`}>
              <span className="text-lg flex-shrink-0">{getTypeIcon(announcement.type)}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm line-clamp-1">{announcement.title}</h3>
                <p className="text-xs opacity-80 mt-1 line-clamp-2">{announcement.content}</p>
                <span className="inline-block mt-2 text-[10px] opacity-70">{formatDate(announcement.createdAt)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="pt-2">
        <Link href="/individual/announcements" className="w-full block px-3 py-2 text-center text-xs font-medium text-blue-700 hover:bg-blue-50 rounded transition-colors">
          View all announcements &rarr;
        </Link>
      </div>
    </section>
  );
}
