'use client';

import { useState } from 'react';

export default function CorporateAnnouncementsPage() {
  const [announcements] = useState([
    {
      id: 1,
      title: 'New Staff Training Program Launched',
      content: 'We are excited to announce the launch of our new comprehensive staff training program. This program includes courses on leadership, technical skills, and professional development. All staff members are encouraged to enroll.',
      date: 'Today',
      time: '10:30 AM',
      category: 'Update',
      priority: 'high',
      views: 234,
      pinned: true,
    },
    {
      id: 2,
      title: 'February Webinar Series Starts Next Week',
      content: 'Join us for our February webinar series featuring industry experts discussing the latest trends in digital transformation, cloud computing, and data analytics. Register now to secure your spot.',
      date: 'Yesterday',
      time: '2:15 PM',
      category: 'Event',
      priority: 'normal',
      views: 156,
      pinned: false,
    },
    {
      id: 3,
      title: 'System Maintenance Scheduled for This Weekend',
      content: 'Please note that our platform will be undergoing scheduled maintenance this weekend from Saturday 2:00 PM to Sunday 6:00 AM GMT. During this time, the platform will be unavailable. We apologize for any inconvenience.',
      date: 'Jan 28',
      time: '9:45 AM',
      category: 'Maintenance',
      priority: 'normal',
      views: 342,
      pinned: false,
    },
    {
      id: 4,
      title: 'Enterprise Plan Benefits Now Expanded',
      content: 'We have expanded the benefits of our Enterprise plan to include unlimited course access, advanced analytics, API integrations, and dedicated account manager support. Existing Enterprise customers will automatically receive these benefits.',
      date: 'Jan 27',
      time: '3:20 PM',
      category: 'Update',
      priority: 'normal',
      views: 421,
      pinned: false,
    },
  ]);

  const [selectedAnnouncement, setSelectedAnnouncement] = useState<typeof announcements[0] | null>(null);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Update':
        return 'bg-blue-100 text-blue-900';
      case 'Event':
        return 'bg-green-100 text-green-900';
      case 'Maintenance':
        return 'bg-orange-100 text-orange-900';
      default:
        return 'bg-gray-100 text-gray-900';
    }
  };

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Announcements</h1>
        <p className="text-gray-600 mt-1">Stay updated with important announcements and broadcasts from the platform</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Announcements Feed */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📢</span>
                <h2 className="text-2xl font-bold text-gray-900">All Announcements</h2>
              </div>
            </div>

            <div className="divide-y divide-gray-200">
              {announcements.map((announcement) => (
                <div
                  key={announcement.id}
                  onClick={() => setSelectedAnnouncement(announcement)}
                  className={`p-6 cursor-pointer transition-colors hover:bg-gray-50 ${
                    selectedAnnouncement?.id === announcement.id ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Pin/Indicator */}
                    <div className="flex-shrink-0">
                      {announcement.pinned ? (
                        <span className="text-xl">📌</span>
                      ) : (
                        <div className={`w-6 h-6 rounded-full ${
                          announcement.priority === 'high'
                            ? 'bg-red-500'
                            : 'bg-blue-500'
                        }`} />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-gray-900 text-lg">{announcement.title}</h3>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(announcement.category)}`}>
                          {announcement.category}
                        </span>
                      </div>

                      <p className="text-gray-700 mt-2 line-clamp-2">{announcement.content}</p>

                      <div className="mt-3 flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <span>🕐</span>
                          {announcement.date} at {announcement.time}
                        </div>
                        <div className="flex items-center gap-1">
                          <span>👁️</span>
                          {announcement.views} views
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Announcement Details */}
        <div className="lg:col-span-1">
          {selectedAnnouncement ? (
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              <div className={`bg-gradient-to-r from-green-50 to-green-100 p-6 border-b border-gray-200`}>
                <h3 className="font-bold text-gray-900">Announcement Details</h3>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Category</p>
                  <div className="mt-1">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(selectedAnnouncement.category)}`}>
                      {selectedAnnouncement.category}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Published</p>
                  <p className="font-bold text-gray-900 mt-1">{selectedAnnouncement.date} at {selectedAnnouncement.time}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Views</p>
                  <p className="font-bold text-gray-900 mt-1">{selectedAnnouncement.views}</p>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-3">Status</p>
                  <div className="flex items-center gap-2">
                    {selectedAnnouncement.pinned && (
                      <span className="inline-block px-3 py-1 bg-red-100 text-red-900 rounded-full text-xs font-medium">
                        Pinned
                      </span>
                    )}
                    <span className="inline-block px-3 py-1 bg-green-100 text-green-900 rounded-full text-xs font-medium">
                      Published
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-3">Full Content</p>
                  <p className="text-gray-700 leading-relaxed">{selectedAnnouncement.content}</p>
                </div>

                <div className="pt-4 border-t border-gray-200 flex gap-2">
                  <button className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2 transition-colors">
                    <span>📦</span>
                    Archive
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 text-center">
              <span className="text-5xl block mb-3 text-gray-400">📢</span>
              <p className="text-gray-600">Select an announcement to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
