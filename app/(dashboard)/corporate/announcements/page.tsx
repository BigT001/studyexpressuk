'use client';

import React, { useEffect, useState } from 'react';
import { AlertCircle, MessageSquare, Info } from 'lucide-react';

export default function CorporateAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'urgent'>('all');

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch('/api/user/notifications');
      const data = await res.json();
      if (data.success) {
        // Filter for only announcements
        const announcementsList = data.notifications
          .filter((n: any) => n.type === 'announcement')
          .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setAnnouncements(announcementsList);
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

  const getCategoryColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-900';
      case 'high':
        return 'bg-orange-100 text-orange-900';
      default:
        return 'bg-blue-100 text-blue-900';
    }
  };

  const getPriorityDisplay = (announcement: any) => {
    const priority = announcement.priority || (announcement.type === 'urgent' ? 'urgent' : announcement.type === 'warning' ? 'high' : 'normal');
    return priority === 'urgent' ? 'Urgent' : priority === 'high' ? 'High' : 'Normal';
  };

  // Filter announcements based on active tab - check priority OR type field for backward compatibility
  const filteredAnnouncements = activeTab === 'urgent' 
    ? announcements.filter((a: any) => (a.priority === 'urgent' || a.type === 'urgent'))
    : announcements;

  // Function to calculate unread announcements count
  const getUnreadCount = () => {
    return announcements.filter((a: any) => a.status === 'unread').length;
  };

  // Function to calculate unread urgent announcements count
  const getUnreadUrgentCount = () => {
    return announcements.filter((a: any) => (a.priority === 'urgent' || a.type === 'urgent') && a.status === 'unread').length;
  };

  const unreadCount = getUnreadCount();
  const urgentCount = getUnreadUrgentCount();

  // Function to mark announcement as read when opened/clicked
  const markAsRead = async (announcementId: string) => {
    try {
      // Optimistically update local state immediately for instant UI feedback
      const updatedAnnouncements = announcements.map((a: any) =>
        a._id === announcementId ? { ...a, status: 'read' } : a
      );
      setAnnouncements(updatedAnnouncements);

      // Send API request to persist the change
      await fetch('/api/user/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'read', notificationId: announcementId }),
      });
    } catch (error) {
      console.error('Error marking announcement as read:', error);
      // Revert on error
      setAnnouncements(announcements);
    }
  };

  // Function to handle announcement selection and mark as read
  const handleSelectAnnouncement = (announcement: any) => {
    setSelectedAnnouncement(announcement);
    // Mark as read when selected - this will trigger count to decrease
    if (announcement.status === 'unread') {
      markAsRead(announcement._id);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Corporate Announcements</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Stay updated with important announcements from the platform</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-2 bg-white dark:bg-gray-800 rounded-lg shadow p-1">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded font-semibold transition-colors flex items-center gap-2 ${
            activeTab === 'all'
              ? 'bg-green-600 text-white'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          📢 All Announcements
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5">
              {unreadCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('urgent')}
          className={`px-4 py-2 rounded font-semibold transition-colors flex items-center gap-2 ${
            activeTab === 'urgent'
              ? 'bg-red-600 text-white'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          🚨 Urgent
          {urgentCount > 0 && (
            <span className="bg-white text-red-600 text-xs font-bold rounded-full px-2 py-0.5">
              {urgentCount}
            </span>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Announcements Feed */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📢</span>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">All Announcements</h2>
              </div>
            </div>

            {announcements.length === 0 ? (
              <div className="p-8 text-center">
                <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">No announcements at this time</p>
              </div>
            ) : filteredAnnouncements.length === 0 ? (
              <div className="p-8 text-center">
                <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">No {activeTab === 'urgent' ? 'urgent' : ''} announcements</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredAnnouncements.map((announcement: any) => (
                  <div
                    key={announcement._id}
                    onClick={() => handleSelectAnnouncement(announcement)}
                    className={`p-6 cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-700 ${
                      selectedAnnouncement?._id === announcement._id ? 'bg-blue-50 dark:bg-blue-900' : ''
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Priority Indicator */}
                      <div className="flex-shrink-0">
                        <div className={`w-6 h-6 rounded-full ${
                          (announcement.priority === 'urgent' || announcement.type === 'urgent')
                            ? 'bg-red-500'
                            : (announcement.priority === 'high' || announcement.type === 'warning')
                            ? 'bg-orange-500'
                            : 'bg-blue-500'
                        }`} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <h3 className="font-bold text-gray-900 dark:text-white text-lg">{announcement.title}</h3>
                          <span className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${getCategoryColor(announcement.priority || (announcement.type === 'urgent' ? 'urgent' : announcement.type === 'warning' ? 'high' : 'normal'))}`}>
                            {getPriorityDisplay(announcement)}
                          </span>
                        </div>

                        <p className="text-gray-700 dark:text-gray-300 mt-2 line-clamp-2">{announcement.content}</p>

                        <div className="mt-3 flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 flex-wrap">
                          <div className="flex items-center gap-1">
                            <span>🕐</span>
                            {formatDate(announcement.createdAt)}
                          </div>
                          <div className="flex items-center gap-1">
                            <span>📧</span>
                            From {announcement.sender || 'Admin Team'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Announcement Details */}
        <div className="lg:col-span-1">
          {selectedAnnouncement ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="font-bold text-gray-900 dark:text-white">Message</h3>
              </div>

              <div className="p-6">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{selectedAnnouncement.content}</p>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-8 text-center">
              <span className="text-5xl block mb-3 text-gray-400">📢</span>
              <p className="text-gray-600 dark:text-gray-400">Select an announcement to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
