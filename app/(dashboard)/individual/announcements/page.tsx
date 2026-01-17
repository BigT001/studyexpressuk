'use client';

import React, { useEffect, useState } from 'react';

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'urgent'>('all');
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    fetchUserAndAnnouncements();
  }, []);

  const fetchUserAndAnnouncements = async () => {
    try {
      // First get the current user
      const userRes = await fetch('/api/auth/session');
      const userData = await userRes.json();
      if (userData.user?.id) {
        setUserId(userData.user.id);
      }

      // Then fetch announcements
      const res = await fetch('/api/announcements');
      const data = await res.json();
      if (data.success && Array.isArray(data.announcements)) {
        const sortedAnnouncements = data.announcements.sort((a: any, b: any) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setAnnouncements(sortedAnnouncements);
      }
    } catch (error) {
      console.error('Error fetching announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', { 
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const isUnread = (announcement: any) => {
    return !announcement.readBy?.includes(userId);
  };

  const getCategoryColor = (announcement: any) => {
    if (announcement.isUrgent) {
      return 'bg-red-100 text-red-900 dark:bg-red-900 dark:text-red-200';
    }
    return 'bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-200';
  };

  // Filter announcements based on active tab
  const filteredAnnouncements = activeTab === 'urgent' 
    ? announcements.filter((a: any) => a.type === 'urgent')
    : announcements;

  // Calculate unread counts
  const unreadCount = announcements.filter((a: any) => isUnread(a)).length;
  const unreadUrgentCount = announcements.filter((a: any) => a.type === 'urgent' && isUnread(a)).length;

  const markAsRead = async (announcementId: string) => {
    try {
      const res = await fetch('/api/announcements/mark-read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ announcementId }),
      });

      if (res.ok) {
        // Update local state
        setAnnouncements(announcements.map(a => 
          a._id === announcementId 
            ? { ...a, readBy: [...(a.readBy || []), userId] }
            : a
        ));
      }
    } catch (error) {
      console.error('Error marking announcement as read:', error);
    }
  };

  const handleSelectAnnouncement = (announcement: any) => {
    setSelectedAnnouncement(announcement);
    if (isUnread(announcement) && announcement._id) {
      markAsRead(announcement._id);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-200 border-t-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-4 md:p-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-black text-gray-900">Announcements</h1>
        <p className="text-gray-600 text-lg">Stay updated with important announcements from the platform</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-3">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-6 py-3 rounded-lg font-bold transition-all duration-300 flex items-center gap-2 ${
            activeTab === 'all'
              ? 'bg-green-600 text-white shadow-lg'
              : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300 hover:shadow-md'
          }`}
        >
          📢 All Announcements
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold rounded-full px-2.5 py-0.5 ml-1">
              {unreadCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('urgent')}
          className={`px-6 py-3 rounded-lg font-bold transition-all duration-300 flex items-center gap-2 ${
            activeTab === 'urgent'
              ? 'bg-red-600 text-white shadow-lg'
              : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300 hover:shadow-md'
          }`}
        >
          🚨 Urgent ({announcements.filter((a: any) => a.type === 'urgent').length})
          {unreadUrgentCount > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold rounded-full px-2.5 py-0.5 ml-1">
              {unreadUrgentCount}
            </span>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Announcements Feed */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-linear-to-r from-blue-50 to-blue-100 px-6 py-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <span className="text-3xl">📢</span>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">All Announcements</h2>
                  <p className="text-sm text-gray-600 mt-1">{filteredAnnouncements.length} announcement{filteredAnnouncements.length !== 1 ? 's' : ''}</p>
                </div>
              </div>
            </div>

            {announcements.length === 0 ? (
              <div className="p-12 text-center">
                <div className="text-6xl mb-4">📭</div>
                <p className="text-gray-600 text-lg font-medium">No announcements at this time</p>
                <p className="text-gray-500 mt-2">Check back later for updates</p>
              </div>
            ) : filteredAnnouncements.length === 0 ? (
              <div className="p-12 text-center">
                <div className="text-6xl mb-4">🔍</div>
                <p className="text-gray-600 text-lg font-medium">No {activeTab === 'urgent' ? 'urgent' : ''} announcements</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredAnnouncements.map((announcement: any) => {
                  const unread = isUnread(announcement);
                  return (
                    <div
                      key={announcement._id}
                      onClick={() => handleSelectAnnouncement(announcement)}
                      className={`p-6 cursor-pointer transition-all duration-200 hover:bg-gray-50 ${
                        unread ? 'bg-blue-50' : ''
                      } ${
                        selectedAnnouncement?._id === announcement._id ? 'bg-blue-100 border-l-4 border-blue-600' : ''
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        {/* Priority Indicator */}
                        <div className="flex-shrink-0 mt-1">
                          {unread ? (
                            <div className="w-4 h-4 rounded-full bg-green-500 ring-2 ring-green-200"></div>
                          ) : (
                            <div className="w-4 h-4 rounded-full bg-gray-300"></div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-3 mb-2">
                            <h3 className={`font-bold text-lg line-clamp-1 ${unread ? 'text-gray-900' : 'text-gray-700'}`}>
                              {announcement.title}
                            </h3>
                            {announcement.type === 'urgent' && (
                              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold whitespace-nowrap">
                                🚨 Urgent
                              </span>
                            )}
                          </div>

                          <p className="text-gray-600 line-clamp-2 text-sm mb-3">{announcement.content}</p>

                          <div className="flex items-center gap-4 text-xs text-gray-500 flex-wrap">
                            <div className="flex items-center gap-1">
                              <span>📅</span>
                              {formatDate(announcement.createdAt)}
                            </div>
                            <div className="flex items-center gap-1">
                              <span>👤</span>
                              {announcement.createdBy?.name || 'Admin'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Announcement Details Panel */}
        <div className="lg:col-span-1">
          {selectedAnnouncement ? (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden sticky top-6">
              <div className="bg-linear-to-r from-green-50 to-green-100 px-6 py-6 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">💌</span>
                  <h3 className="font-bold text-gray-900 text-lg">Full Message</h3>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <h4 className="font-bold text-lg text-gray-900 mb-2">{selectedAnnouncement.title}</h4>
                  {selectedAnnouncement.type === 'urgent' && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold">
                      🚨 Urgent
                    </span>
                  )}
                </div>

                <div>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{selectedAnnouncement.content}</p>
                </div>

                <div className="pt-4 border-t border-gray-200 space-y-3">
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Date</p>
                    <p className="text-sm text-gray-700">{formatDate(selectedAnnouncement.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold mb-1">From</p>
                    <p className="text-sm text-gray-700">{selectedAnnouncement.createdBy?.name || 'Admin Team'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Status</p>
                    <p className="text-sm">
                      {isUnread(selectedAnnouncement) ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-100 text-green-700 font-medium">
                          ✓ Unread
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 font-medium">
                          ✓ Read
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center sticky top-6">
              <span className="text-6xl block mb-4 text-gray-300">📢</span>
              <p className="text-gray-600 font-medium">Select an announcement to view full details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
