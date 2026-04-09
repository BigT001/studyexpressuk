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
      <div className="flex flex-col items-center justify-center min-h-[80vh] m-4 lg:m-8 bg-gray-50 rounded-3xl border border-gray-100 shadow-sm animate-in fade-in duration-700">
        <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mb-6"></div>
        <p className="text-gray-500 font-bold tracking-wide uppercase">Syncing Announcements...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-4 lg:p-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#008200] to-teal-700 rounded-3xl p-10 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay"></div>
        <div className="relative z-10">
          <h1 className="text-4xl font-black tracking-tight mb-2">Announcements</h1>
          <p className="text-green-100 text-lg font-medium opacity-90 max-w-xl">
            Stay updated with real-time broadcasts, platform upgrades, and urgent notices from the administration.
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-3">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-8 py-4 rounded-2xl font-black transition-all duration-300 flex items-center gap-3 ${
            activeTab === 'all'
              ? 'bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-xl shadow-gray-900/20 translate-y-0'
              : 'bg-white text-gray-500 border border-gray-100 shadow-sm hover:border-gray-200 hover:shadow-md hover:text-gray-700'
          }`}
        >
          <span className="text-xl">📢</span> Global Feed
          {unreadCount > 0 && (
            <span className={`text-xs font-black rounded-full px-3 py-1 ${activeTab === 'all' ? 'bg-red-500 text-white' : 'bg-red-100 text-red-600'}`}>
              {unreadCount} New
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('urgent')}
          className={`px-8 py-4 rounded-2xl font-black transition-all duration-300 flex items-center gap-3 ${
            activeTab === 'urgent'
              ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-xl shadow-red-900/20'
              : 'bg-white text-gray-500 border border-gray-100 shadow-sm hover:border-red-200 hover:shadow-md hover:text-red-600'
          }`}
        >
          <span className="text-xl">🚨</span> Critical Action
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Announcements Feed */}
        <div className="lg:col-span-7 xl:col-span-8">
          <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden flex flex-col min-h-[600px]">
            <div className="bg-gray-50/80 px-8 py-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                {activeTab === 'urgent' ? 'Critical Notices' : 'Inbox Stream'}
              </h2>
              <span className="text-sm font-bold text-gray-500 bg-white px-4 py-1.5 rounded-full border border-gray-100 shadow-sm">
                {filteredAnnouncements.length} Records
              </span>
            </div>

            {announcements.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-center opacity-70">
                <div className="text-7xl mb-6 grayscale mix-blend-luminosity">📭</div>
                <p className="text-gray-900 text-2xl font-black mb-2">Inbox Empty</p>
                <p className="text-gray-500 font-medium max-w-sm">No administrative broadcasts have been published recently.</p>
              </div>
            ) : filteredAnnouncements.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-center opacity-70">
                <div className="text-7xl mb-6 grayscale mix-blend-luminosity">🔍</div>
                <p className="text-gray-900 text-2xl font-black mb-2">Filter Returned Empty</p>
                <p className="text-gray-500 font-medium">No {activeTab} notifications match your view.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 overflow-y-auto">
                {filteredAnnouncements.map((announcement: any) => {
                  const unread = isUnread(announcement);
                  const isSelected = selectedAnnouncement?._id === announcement._id;
                  
                  return (
                    <div
                      key={announcement._id}
                      onClick={() => handleSelectAnnouncement(announcement)}
                      className={`p-6 cursor-pointer transition-all duration-300 group relative ${
                        unread ? 'bg-emerald-50/30' : 'bg-white'
                      } ${isSelected ? 'bg-gray-50 ring-1 ring-inset ring-gray-200' : 'hover:bg-gray-50/50'}`}
                    >
                      {/* Active Border */}
                      {isSelected && (
                         <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#008200] rounded-r-md"></div>
                      )}
                      
                      <div className="flex gap-5 pl-2">
                        {/* Status Dot */}
                        <div className="flex-shrink-0 mt-1.5">
                          {unread ? (
                            <div className="w-4 h-4 rounded-full bg-emerald-500 shadow-md shadow-emerald-500/30 border-2 border-white ring-2 ring-emerald-100 relative">
                               <div className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-20"></div>
                            </div>
                          ) : (
                            <div className="w-4 h-4 rounded-full bg-gray-200 border-2 border-white"></div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <h3 className={`font-black text-lg leading-tight transition-colors ${unread ? 'text-gray-900' : 'text-gray-600'} group-hover:text-[#008200]`}>
                              {announcement.title}
                            </h3>
                            {announcement.type === 'urgent' && (
                              <span className="shrink-0 inline-flex items-center px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs font-black uppercase tracking-widest border border-red-100">
                                Urgent
                              </span>
                            )}
                          </div>

                          <p className="text-gray-500 line-clamp-2 text-sm leading-relaxed mb-4 font-medium pr-8">{announcement.content}</p>

                          <div className="flex items-center gap-6 text-xs font-bold text-gray-400 select-none">
                            <div className="flex items-center gap-1.5">
                              <span className="text-gray-300">📅</span>
                              {formatDate(announcement.createdAt)}
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-gray-300">👤</span>
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
        <div className="lg:col-span-5 xl:col-span-4">
          {selectedAnnouncement ? (
            <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden sticky top-6 animate-in slide-in-from-right-8 duration-500 flex flex-col max-h-[85vh]">
              {/* Cover Header */}
              <div className={`px-8 py-8 ${selectedAnnouncement.type === 'urgent' ? 'bg-gradient-to-br from-red-500 to-rose-700' : 'bg-gradient-to-br from-emerald-500 to-teal-700'} text-white relative`}>
                 <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay"></div>
                 <div className="relative z-10">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center text-2xl mb-4 border border-white/20 shadow-inner">
                       {selectedAnnouncement.type === 'urgent' ? '🚨' : '💌'}
                    </div>
                    {selectedAnnouncement.type === 'urgent' && (
                      <span className="inline-flex mb-3 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-black uppercase tracking-widest border border-white/30 backdrop-blur-sm shadow-sm">
                        Critical Operations
                      </span>
                    )}
                    <h3 className="font-black text-2xl leading-tight text-white mb-2">{selectedAnnouncement.title}</h3>
                 </div>
              </div>

              {/* Notice Body */}
              <div className="p-8 overflow-y-auto flex-1 bg-white">
                <div className="prose prose-emerald max-w-none text-gray-700 leading-loose prose-p:font-medium">
                   <p className="whitespace-pre-wrap">{selectedAnnouncement.content}</p>
                </div>
              </div>

              {/* Notice Metadata */}
              <div className="p-6 bg-gray-50 border-t border-gray-100 grid grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                    <p className="text-xs text-gray-400 uppercase font-black tracking-widest mb-1.5 flex items-center gap-1.5">
                       <span>🕒</span> Timestamp
                    </p>
                    <p className="text-sm font-bold text-gray-800">{formatDate(selectedAnnouncement.createdAt)}</p>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                    <p className="text-xs text-gray-400 uppercase font-black tracking-widest mb-1.5 flex items-center gap-1.5">
                       <span>🛡️</span> Authority
                    </p>
                    <p className="text-sm font-bold text-gray-800">{selectedAnnouncement.createdBy?.name || 'Systems Admin'}</p>
                  </div>
              </div>
            </div>
          ) : (
            <div className="bg-white/50 backdrop-blur-sm rounded-3xl border-2 border-dashed border-gray-200 p-12 text-center sticky top-6 h-[400px] flex flex-col items-center justify-center">
              <span className="text-7xl block mb-6 grayscale opacity-20 transform -rotate-12">📢</span>
              <p className="text-gray-900 text-xl font-black mb-2">No Item Selected</p>
              <p className="text-gray-500 font-medium max-w-xs">Click on any announcement from the left feed to preview the full secure broadcast here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
