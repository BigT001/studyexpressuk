'use client';

import React, { useEffect, useState } from 'react';
import { AlertCircle } from 'lucide-react';

interface Announcement {
  _id: string;
  title: string;
  content: string;
  type: 'info' | 'warning' | 'success' | 'urgent';
  targetAudience: string;
  createdBy: string;
  createdAt: string;
  readBy?: string[];
  isActive: boolean;
}

export default function CorporateAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'urgent'>('all');
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch('/api/announcements');
      const data = await res.json();
      if (data.success) {
        setAnnouncements(data.announcements || []);
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

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'urgent':
        return 'bg-red-100 text-red-900';
      case 'warning':
        return 'bg-orange-100 text-orange-900';
      case 'success':
        return 'bg-green-100 text-green-900';
      default:
        return 'bg-blue-100 text-blue-900';
    }
  };

  const getTypeDisplay = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  // Filter announcements based on active tab
  const filteredAnnouncements = activeTab === 'urgent' 
    ? announcements.filter((a) => a.type === 'urgent')
    : announcements;

  // Get unread count
  const getUnreadCount = () => {
    return announcements.filter((a) => !readIds.has(a._id)).length;
  };

  // Get unread urgent count
  const getUnreadUrgentCount = () => {
    return announcements.filter((a) => a.type === 'urgent' && !readIds.has(a._id)).length;
  };

  const unreadCount = getUnreadCount();
  const urgentCount = getUnreadUrgentCount();

  // Function to mark announcement as read
  const markAsRead = async (announcementId: string) => {
    try {
      // Add to local read set for immediate UI update
      setReadIds((prev) => new Set(prev).add(announcementId));

      // Call API to persist the read status
      const res = await fetch('/api/corporate/announcements/mark-read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ announcementId }),
      });

      if (!res.ok) {
        console.error('Failed to mark announcement as read');
        // Revert on error
        setReadIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(announcementId);
          return newSet;
        });
      }
    } catch (error) {
      console.error('Error marking announcement as read:', error);
    }
  };

  // Function to handle announcement selection and mark as read
  const handleSelectAnnouncement = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    // Mark as read when selected - this will trigger count to decrease
    if (!readIds.has(announcement._id)) {
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
                {filteredAnnouncements.map((announcement: Announcement) => (
                  <div
                    key={announcement._id}
                    onClick={() => handleSelectAnnouncement(announcement)}
                    className={`p-6 cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-700 ${
                      selectedAnnouncement?._id === announcement._id ? 'bg-blue-50 dark:bg-blue-900' : ''
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Type Indicator Dot */}
                      <div className="flex-shrink-0">
                        <div className={`w-6 h-6 rounded-full ${
                          announcement.type === 'urgent'
                            ? 'bg-red-500'
                            : announcement.type === 'warning'
                            ? 'bg-orange-500'
                            : announcement.type === 'success'
                            ? 'bg-green-500'
                            : 'bg-blue-500'
                        }`} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <h3 className={`font-bold text-lg ${
                            readIds.has(announcement._id)
                              ? 'text-gray-500 dark:text-gray-400'
                              : 'text-gray-900 dark:text-white font-bold'
                          }`}>
                            {announcement.title}
                          </h3>
                          <span className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${getTypeColor(announcement.type)}`}>
                            {getTypeDisplay(announcement.type)}
                          </span>
                        </div>

                        <p className={`mt-2 line-clamp-2 ${
                          readIds.has(announcement._id)
                            ? 'text-gray-600 dark:text-gray-500'
                            : 'text-gray-700 dark:text-gray-300'
                        }`}>
                          {announcement.content}
                        </p>

                        <div className="mt-3 flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 flex-wrap">
                          <div className="flex items-center gap-1">
                            <span>🕐</span>
                            {formatDate(announcement.createdAt)}
                          </div>
                          {!readIds.has(announcement._id) && (
                            <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                          )}
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
