'use client'

import React, { useEffect, useState } from 'react'
import { Plus, Eye, Edit2, Trash2, AlertCircle } from 'lucide-react'


export default function AnnouncementsPage() {
  const [showModal, setShowModal] = useState(false)
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', content: '', category: 'General' })
  const [announcements, setAnnouncements] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'all' | 'urgent'>('all')

  useEffect(() => {
    fetchAnnouncements()
  }, [])

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch('/api/user/notifications')
      const data = await res.json()
      if (data.success) {
        // Filter for only announcements
        const announcementsList = data.notifications
          .filter((n: any) => n.type === 'announcement')
          .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        setAnnouncements(announcementsList)
      }
    } catch (error) {
      console.error('Error fetching announcements:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('en-US', { 
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }

  const getStatusColor = (status: string) => {
    if (status === 'unread') return 'bg-green-100 text-green-700'
    return 'bg-blue-100 text-blue-700'
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-700'
      case 'high':
        return 'bg-orange-100 text-orange-700'
      default:
        return 'bg-blue-100 text-blue-700'
    }
  }

  // Filter announcements based on active tab - check priority OR type field for backward compatibility
  const filteredAnnouncements = activeTab === 'urgent' 
    ? announcements.filter((a: any) => (a.priority === 'urgent' || a.type === 'urgent'))
    : announcements;

  const unreadCount = announcements.filter((a: any) => a.status === 'unread').length;
  const urgentCount = announcements.filter((a: any) => (a.priority === 'urgent' || a.type === 'urgent') && a.status === 'unread').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Announcements</h1>
          <p className="text-slate-600 mt-1">View announcements from the platform</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-2 bg-white rounded-lg shadow p-1">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded font-semibold transition-colors flex items-center gap-2 ${
            activeTab === 'all'
              ? 'bg-green-600 text-white'
              : 'text-gray-700 hover:bg-gray-100'
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
              : 'text-gray-700 hover:bg-gray-100'
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-transparent backdrop-blur-sm z-50 flex items-center justify-center p-4">
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
        {announcements.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
            <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No announcements</h3>
            <p className="text-slate-600">Check back soon for announcements from the admin.</p>
          </div>
        ) : filteredAnnouncements.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
            <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No {activeTab === 'urgent' ? 'urgent' : ''} announcements</h3>
            <p className="text-slate-600">Check back soon for announcements.</p>
          </div>
        ) : (
          filteredAnnouncements.map((announcement) => (
            <div key={announcement._id} className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-md transition-shadow dark:bg-gray-800 dark:border-gray-700">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="text-3xl">
                    {announcement.priority === 'urgent' ? '🔴' : announcement.priority === 'high' ? '🟠' : '🔵'}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start gap-2 flex-wrap">
                      <h3 className="font-semibold text-slate-900 dark:text-white text-lg">{announcement.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${getStatusColor(announcement.status)}`}>
                        {announcement.status === 'unread' ? 'New' : 'Read'}
                      </span>
                      {announcement.priority && (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${getPriorityColor(announcement.priority)}`}>
                          {announcement.priority.charAt(0).toUpperCase() + announcement.priority.slice(1)}
                        </span>
                      )}
                    </div>

                    <p className="text-slate-700 dark:text-gray-300 mt-2 line-clamp-2">{announcement.content}</p>

                    <div className="flex items-center gap-4 mt-4 text-sm text-slate-600 dark:text-gray-400 flex-wrap">
                      <span>{formatDate(announcement.createdAt)}</span>
                      <span className="flex items-center gap-1">
                        From {announcement.sender || 'Admin Team'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors" title="View">
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
