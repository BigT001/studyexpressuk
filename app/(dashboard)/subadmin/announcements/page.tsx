'use client'

import { useState } from 'react'
import { Plus, Eye, Edit2, Trash2 } from 'lucide-react'


export default function AnnouncementsPage() {
  const [showModal, setShowModal] = useState(false)
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', content: '', category: 'General' })

  const announcements = [
    {
      id: 1,
      title: 'New Course: Digital Marketing Mastery',
      content: 'We\'re excited to announce a new comprehensive course on digital marketing strategies. Available for enrollment starting next week.',
      category: 'Courses',
      date: '2024-12-28',
      status: 'Published',
      views: 234,
      avatar: '📚'
    },
    {
      id: 2,
      title: 'System Maintenance Scheduled',
      content: 'Please note that our learning platform will undergo maintenance on January 5, 2025, from 2:00 PM to 5:00 PM GMT. Services will be temporarily unavailable.',
      category: 'System',
      date: '2024-12-27',
      status: 'Published',
      views: 156,
      avatar: '⚙️'
    },
    {
      id: 3,
      title: 'January Events Schedule Released',
      content: 'Check out our packed January schedule with leadership workshops, professional development conferences, and specialized training sessions.',
      category: 'Events',
      date: '2024-12-26',
      status: 'Published',
      views: 412,
      avatar: '📅'
    },
    {
      id: 4,
      title: 'Certificate Program Recognition',
      content: 'Our Professional Development Certificate Program has been recognized by major industry bodies. Enroll now to gain a credential valued by top employers.',
      category: 'Achievement',
      date: '2024-12-25',
      status: 'Scheduled',
      views: 0,
      avatar: '🏆'
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Announcements</h1>
          <p className="text-slate-600 mt-1">Send announcements to all members via the platform</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Announcement
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white">
              <h2 className="text-xl font-bold text-slate-900">Create Announcement</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">Title</label>
                <input
                  type="text"
                  placeholder="Enter announcement title..."
                  value={newAnnouncement.title}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">Category</label>
                <select
                  value={newAnnouncement.category}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, category: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none"
                >
                  <option>General</option>
                  <option>Courses</option>
                  <option>Events</option>
                  <option>System</option>
                  <option>Achievement</option>
                  <option>Urgent</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">Message</label>
                <textarea
                  placeholder="Enter announcement content..."
                  value={newAnnouncement.content}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                  rows={6}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none"
                />
              </div>

              <div className="flex items-center gap-4 pt-4 border-t border-slate-200">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-slate-200 text-slate-900 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowModal(false)
                    setNewAnnouncement({ title: '', content: '', category: 'General' })
                  }}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Publish
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Announcements List */}
      <div className="space-y-4">
        {announcements.map((announcement) => (
          <div key={announcement.id} className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4 flex-1">
                <div className="text-3xl">{announcement.avatar}</div>
                <div className="flex-1">
                  <div className="flex items-start gap-2">
                    <h3 className="font-semibold text-slate-900 text-lg">{announcement.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                      announcement.status === 'Published'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {announcement.status}
                    </span>
                  </div>

                  <p className="text-slate-700 mt-2 line-clamp-2">{announcement.content}</p>

                  <div className="flex items-center gap-4 mt-4 text-sm text-slate-600">
                    <span className="inline-flex px-2 py-1 bg-slate-100 rounded text-xs">{announcement.category}</span>
                    <span>{announcement.date}</span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {announcement.views} views
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button className="p-2 text-slate-400 hover:text-red-600 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
