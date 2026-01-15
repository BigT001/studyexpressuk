'use client';

import { useEffect, useState } from 'react';
import { Bell, Mail, MessageSquare, Trash2, Check, CheckCheck, AlertCircle, Info } from 'lucide-react';

interface Notification {
  _id: string;
  type: 'announcement' | 'message' | 'email';
  title: string;
  content: string;
  sender?: string;
  priority: 'normal' | 'urgent';
  status: 'read' | 'unread';
  createdAt: string;
}

export default function CorporateCommunicationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'announcement' | 'message'>('all');
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/user/notifications');
      const data = await res.json();
      if (data.success) {
        setNotifications(data.notifications || []);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/user/notifications/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ action: 'read' }),
      });
      if (res.ok) {
        setNotifications((prev) =>
          prev.map((n) => (n._id === id ? { ...n, status: 'read' } : n))
        );
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const markAllAsRead = async () => {
    setActionLoading(true);
    try {
      const res = await fetch('/api/user/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'read-all' }),
      });
      if (res.ok) {
        setNotifications((prev) =>
          prev.map((n) => ({ ...n, status: 'read' }))
        );
      }
    } catch (error) {
      console.error('Error marking all as read:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const deleteNotification = async (id: string) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/user/notifications/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setNotifications((prev) => prev.filter((n) => n._id !== id));
        setSelectedNotification(null);
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const getFilteredNotifications = () => {
    let filtered = notifications;
    if (filter === 'unread') {
      filtered = filtered.filter((n) => n.status === 'unread');
    } else if (filter === 'announcement') {
      filtered = filtered.filter((n) => n.type === 'announcement');
    } else if (filter === 'message') {
      filtered = filtered.filter((n) => n.type === 'message');
    }
    return filtered;
  };

  const filteredNotifications = getFilteredNotifications();
  const unreadCount = notifications.filter((n) => n.status === 'unread').length;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'announcement':
        return <AlertCircle className="w-4 h-4" />;
      case 'message':
        return <MessageSquare className="w-4 h-4" />;
      case 'email':
        return <Mail className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    return priority === 'urgent' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800';
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'announcement':
        return 'bg-purple-100 text-purple-800';
      case 'message':
        return 'bg-green-100 text-green-800';
      case 'email':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
      if (diffHours === 0) {
        const diffMinutes = Math.ceil(diffTime / (1000 * 60));
        return `${diffMinutes}m ago`;
      }
      return `${diffHours}h ago`;
    }
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Bell className="w-8 h-8 text-green-600" />
              Updates & Communications
            </h1>
            <p className="text-gray-600 mt-2">
              Important announcements and messages from StudyExpress
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              disabled={actionLoading}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2 transition"
            >
              <CheckCheck className="w-4 h-4" />
              Mark All as Read
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="text-sm text-gray-600">Total Messages</div>
            <div className="text-2xl font-bold text-gray-900 mt-1">{notifications.length}</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="text-sm text-gray-600">Unread</div>
            <div className="text-2xl font-bold text-red-600 mt-1">{unreadCount}</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="text-sm text-gray-600">Announcements</div>
            <div className="text-2xl font-bold text-purple-600 mt-1">
              {notifications.filter((n) => n.type === 'announcement').length}
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="text-sm text-gray-600">Messages</div>
            <div className="text-2xl font-bold text-green-600 mt-1">
              {notifications.filter((n) => n.type === 'message').length}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Filters */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 sticky top-4">
            <h3 className="font-semibold text-gray-900 mb-4">Filters</h3>
            <div className="space-y-2">
              {[
                { value: 'all', label: 'All Messages', icon: Bell },
                { value: 'unread', label: 'Unread', icon: AlertCircle },
                { value: 'announcement', label: 'Announcements', icon: Info },
                { value: 'message', label: 'Messages', icon: MessageSquare },
              ].map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.value}
                    onClick={() => setFilter(option.value as any)}
                    className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg text-left transition ${
                      filter === option.value
                        ? 'bg-green-100 text-green-700 font-semibold'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {filteredNotifications.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-12 text-center">
              <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No messages</h3>
              <p className="text-gray-600">
                {filter === 'unread'
                  ? 'You have read all your messages.'
                  : filter === 'announcement'
                    ? 'No announcements available.'
                    : filter === 'message'
                      ? 'No messages available.'
                      : 'No notifications yet.'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification._id}
                  onClick={() => setSelectedNotification(notification)}
                  className={`bg-white rounded-lg border shadow-sm p-4 cursor-pointer transition hover:shadow-md ${
                    notification.status === 'unread'
                      ? 'border-green-300 bg-green-50'
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1 text-green-600">
                      {getTypeIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 break-words">
                            {notification.title}
                          </h4>
                          <p className="text-sm text-gray-600 line-clamp-1 mt-1">
                            {notification.content}
                          </p>
                          <div className="flex items-center gap-2 mt-2 flex-wrap">
                            <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor(notification.type)}`}>
                              {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
                            </span>
                            {notification.priority === 'urgent' && (
                              <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(notification.priority)}`}>
                                Urgent
                              </span>
                            )}
                            <span className="text-xs text-gray-500">
                              {formatDate(notification.createdAt)}
                            </span>
                          </div>
                        </div>
                        {notification.status === 'unread' && (
                          <div className="flex-shrink-0 w-2 h-2 bg-green-600 rounded-full mt-2"></div>
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

      {/* Detail Modal */}
      {selectedNotification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                <div className="text-green-600 mt-1">{getTypeIcon(selectedNotification.type)}</div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedNotification.title}
                  </h2>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getTypeColor(selectedNotification.type)}`}>
                      {selectedNotification.type.charAt(0).toUpperCase() + selectedNotification.type.slice(1)}
                    </span>
                    {selectedNotification.priority === 'urgent' && (
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${getPriorityColor(selectedNotification.priority)}`}>
                        Urgent
                      </span>
                    )}
                    <span className="text-sm text-gray-500">
                      {formatDate(selectedNotification.createdAt)}
                    </span>
                  </div>
                  {selectedNotification.sender && (
                    <p className="text-sm text-gray-600 mt-2">
                      From: <span className="font-semibold">{selectedNotification.sender}</span>
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={() => setSelectedNotification(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
              >
                ×
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">
                {selectedNotification.content}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-200 p-6 flex items-center justify-between bg-gray-50">
              <div className="text-sm text-gray-600">
                {selectedNotification.status === 'unread' ? (
                  <span className="flex items-center gap-1 text-orange-600">
                    <AlertCircle className="w-4 h-4" />
                    Unread
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-green-600">
                    <Check className="w-4 h-4" />
                    Read
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                {selectedNotification.status === 'unread' && (
                  <button
                    onClick={() => {
                      markAsRead(selectedNotification._id);
                      setSelectedNotification(null);
                    }}
                    disabled={actionLoading}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2 transition"
                  >
                    <Check className="w-4 h-4" />
                    Mark as Read
                  </button>
                )}
                <button
                  onClick={() => {
                    deleteNotification(selectedNotification._id);
                  }}
                  disabled={actionLoading}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2 transition"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
                <button
                  onClick={() => setSelectedNotification(null)}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
