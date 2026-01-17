'use client';

import { useState, useEffect } from 'react';

interface Announcement {
  _id: string;
  title: string;
  content: string;
  type: 'info' | 'warning' | 'success' | 'urgent';
  targetAudience: 'all' | 'students' | 'corporate' | 'subadmin';
  createdBy: string;
  createdAt: string;
  isActive: boolean;
}

interface GroupMessage {
  _id: string;
  subject: string;
  body: string;
  senderName: string;
  recipientGroups: string[];
  status: 'draft' | 'scheduled' | 'sent' | 'failed';
  sentAt: string;
}

interface EmailNotification {
  _id: string;
  subject: string;
  htmlContent: string;
  recipients: string[];
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed';
  successCount?: number;
  failedCount?: number;
  sentAt: string;
}

export default function CommunicationsPage() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [messages, setMessages] = useState<GroupMessage[]>([]);
  const [emails, setEmails] = useState<EmailNotification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Announcement form state
  const [announcementForm, setAnnouncementForm] = useState({
    title: '',
    content: '',
    type: 'info' as const,
    targetAudience: 'all' as const,
  });

  // Email form state
  const [emailForm, setEmailForm] = useState({
    subject: '',
    htmlContent: '',
    recipients: ['all'],
  });

  // Message form state
  const [messageForm, setMessageForm] = useState({
    subject: '',
    body: '',
    senderName: '',
    recipientGroups: ['all'],
  });

  // Fetch all data on mount
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [announcementsRes, emailsRes] = await Promise.all([
        fetch('/api/announcements'),
        fetch('/api/emails'),
      ]);

      if (announcementsRes.ok) {
        const data = await announcementsRes.json();
        setAnnouncements(data.announcements || []);
      }
      if (emailsRes.ok) {
        const data = await emailsRes.json();
        setEmails(data.emails || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/announcements', {
        method: 'POST',
        body: JSON.stringify(announcementForm),
      });
      if (res.ok) {
        const data = await res.json();
        setAnnouncements([data.announcement, ...announcements]);
        setAnnouncementForm({
          title: '',
          content: '',
          type: 'info',
          targetAudience: 'all',
        });
      }
    } catch (err) {
      setError('Failed to create announcement');
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        body: JSON.stringify(messageForm),
      });
      if (res.ok) {
        const data = await res.json();
        setMessages([data.message, ...messages]);
        setMessageForm({
          subject: '',
          body: '',
          senderName: '',
          recipientGroups: ['all'],
        });
      }
    } catch (err) {
      setError('Failed to send message');
    }
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/emails', {
        method: 'POST',
        body: JSON.stringify(emailForm),
      });
      if (res.ok) {
        const data = await res.json();
        setEmails([data.email, ...emails]);
        setEmailForm({
          subject: '',
          htmlContent: '',
          recipients: ['all'],
        });
      }
    } catch (err) {
      setError('Failed to send email');
    }
  };

  const handleDeleteAnnouncement = async (id: string) => {
    if (!confirm('Delete this announcement?')) return;
    try {
      const res = await fetch(`/api/announcements/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setAnnouncements(announcements.filter(a => a._id !== id));
      }
    } catch (err) {
      setError('Failed to delete announcement');
    }
  };

  const handleDeleteMessage = async (id: string) => {
    if (!confirm('Delete this message?')) return;
    try {
      const res = await fetch(`/api/messages/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMessages(messages.filter(m => m._id !== id));
      }
    } catch (err) {
      setError('Failed to delete message');
    }
  };

  const handleDeleteEmail = async (id: string) => {
    if (!confirm('Delete this email?')) return;
    try {
      const res = await fetch(`/api/emails/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setEmails(emails.filter(e => e._id !== id));
      }
    } catch (err) {
      setError('Failed to delete email');
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'urgent':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'success':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
        return 'bg-green-100 text-green-800';
      case 'sending':
        return 'bg-blue-100 text-blue-800';
      case 'scheduled':
        return 'bg-purple-100 text-purple-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Messaging & Communications</h2>
        <p className="text-gray-600 mt-2">Send announcements, messages, and manage notifications</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-white rounded-lg shadow p-1">
        <button
          onClick={() => setSelectedTab(0)}
          className={`px-6 py-3 font-bold rounded transition-colors ${
            selectedTab === 0
              ? 'bg-green-600 text-white'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          📢 Announcements
        </button>
        <button
          onClick={() => setSelectedTab(1)}
          className={`px-6 py-3 font-bold rounded transition-colors ${
            selectedTab === 1
              ? 'bg-green-600 text-white'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
           Emails
        </button>
      </div>

      {/* Tab Content */}
      {/* Announcements Tab */}
      {selectedTab === 0 && (
        <div className="space-y-6 mt-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold mb-6">Create New Announcement</h3>
            <form onSubmit={handleCreateAnnouncement} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={announcementForm.title}
                    onChange={(e) =>
                      setAnnouncementForm({ ...announcementForm, title: e.target.value })
                    }
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                    style={{ borderColor: '#008200' }}
                    placeholder="Announcement title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Type
                  </label>
                  <select
                      value={announcementForm.type}
                      onChange={(e) =>
                        setAnnouncementForm({
                          ...announcementForm,
                          type: e.target.value as any,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                      style={{ borderColor: '#008200' }}
                    >
                      <option value="info">ℹ️ Info</option>
                      <option value="urgent">🚨 Urgent</option>
                    </select>
                  </div>
                </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Target Audience
                </label>
                <select
                  value={announcementForm.targetAudience}
                  onChange={(e) =>
                    setAnnouncementForm({
                      ...announcementForm,
                      targetAudience: e.target.value as any,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{ borderColor: '#008200' }}
                >
                  <option value="all">👥 Everyone</option>
                  <option value="students">🎓 Students</option>
                  <option value="corporate">🏢 Corporate</option>
                  <option value="subadmin">👤 Sub Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Content
                </label>
                <textarea
                  value={announcementForm.content}
                  onChange={(e) =>
                    setAnnouncementForm({
                      ...announcementForm,
                      content: e.target.value,
                    })
                  }
                  required
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{ borderColor: '#008200' }}
                  placeholder="Announcement content"
                />
              </div>

              <button
                type="submit"
                className="w-full px-6 py-3 text-white rounded-lg hover:opacity-90 transition-opacity font-bold"
                style={{ backgroundColor: '#008200' }}
              >
                📢 Post Announcement
              </button>
            </form>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold mb-4">Recent Announcements</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {announcements.length === 0 ? (
                <p className="text-gray-600">No announcements yet</p>
              ) : (
                announcements.map((ann) => (
                  <div key={ann._id} className={`p-4 rounded-lg border-l-4 ${getTypeColor(ann.type)}`}>
                    <div className="flex justify-between items-start">
                      <div className="flex-grow">
                        <h4 className="font-bold">{ann.title}</h4>
                        <p className="text-sm mt-1">{ann.content.substring(0, 100)}...</p>
                        <div className="flex gap-2 mt-2 text-xs">
                          <span className="px-2 py-1 bg-white rounded">
                            {ann.targetAudience}
                          </span>
                          <span className="px-2 py-1 bg-white rounded">
                            {new Date(ann.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteAnnouncement(ann._id)}
                        className="text-red-600 hover:text-red-800 font-bold"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Emails Tab */}
      {selectedTab === 1 && (
        <div className="space-y-6 mt-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold mb-6">Send Email Notification</h3>
            <form onSubmit={handleSendEmail} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Email Subject
                </label>
                <input
                  type="text"
                  value={emailForm.subject}
                  onChange={(e) =>
                    setEmailForm({ ...emailForm, subject: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{ borderColor: '#008200' }}
                  placeholder="Email subject"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Recipient Group
                </label>
                <select
                  value={emailForm.recipients[0] || 'all'}
                  onChange={(e) =>
                    setEmailForm({
                      ...emailForm,
                      recipients: [e.target.value],
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{ borderColor: '#008200' }}
                >
                  <option value="all">👥 Everyone</option>
                  <option value="students">🎓 Students</option>
                  <option value="corporate">🏢 Corporate</option>
                  <option value="subadmin">👤 Sub Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Email Content (HTML)
                </label>
                <textarea
                  value={emailForm.htmlContent}
                  onChange={(e) =>
                    setEmailForm({ ...emailForm, htmlContent: e.target.value })
                  }
                  required
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent font-mono text-sm"
                  style={{ borderColor: '#008200' }}
                  placeholder="<h1>Title</h1><p>Your email content here...</p>"
                />
              </div>

              <button
                type="submit"
                className="w-full px-6 py-3 text-white rounded-lg hover:opacity-90 transition-opacity font-bold"
                style={{ backgroundColor: '#008200' }}
              >
                📧 Send Email
              </button>
            </form>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold mb-4">Email History</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {emails.length === 0 ? (
                <p className="text-gray-600">No emails sent</p>
              ) : (
                emails.map((email) => (
                  <div key={email._id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div className="flex-grow">
                        <h4 className="font-bold">{email.subject}</h4>
                        <div className="flex gap-2 mt-2">
                          <span className={`text-xs px-2 py-1 rounded ${getStatusColor(email.status)}`}>
                            {email.status}
                          </span>
                          {email.status === 'sent' && (
                            <>
                              <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded">
                                ✓ {email.successCount || 0} sent
                              </span>
                              {email.failedCount ? (
                                <span className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded">
                                  ✕ {email.failedCount} failed
                                </span>
                              ) : null}
                            </>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteEmail(email._id)}
                        className="text-red-600 hover:text-red-800 font-bold"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
