'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';

interface User {
  _id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  role: string;
  profileImage?: string;
  department?: string;
  isAdmin?: boolean;
  isCorporateAdmin?: boolean;
}

interface Message {
  _id: string;
  senderId: { _id: string; firstName?: string; lastName?: string; email: string; profileImage?: string };
  recipientId: { _id: string; firstName?: string; lastName?: string; email: string; profileImage?: string };
  content: string;
  createdAt: string;
  readAt?: string;
}

function getFullName(user: any) {
  if (!user) return 'User';
  if (user.firstName && user.lastName) return `${user.firstName} ${user.lastName}`;
  if (user.firstName) return user.firstName;
  if (user.lastName) return user.lastName;
  if (user.name) return user.name;
  return user.email || 'User';
}

function getInitials(user: any) {
  const name = getFullName(user);
  return name
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function formatTime(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

function getRoleLabel(role: string, isAdmin?: boolean, isCorporateAdmin?: boolean) {
  if (isAdmin) return 'Admin';
  if (isCorporateAdmin) return 'Corporate Admin';
  if (role === 'STAFF') return 'Staff Member';
  return role;
}

export default function StaffMessagesPage() {
  const [contactableUsers, setContactableUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [usersLoading, setUsersLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [staffId, setStaffId] = useState<string>('');
  const [staffCorporateId, setStaffCorporateId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Get current staff info
  useEffect(() => {
    const fetchStaffInfo = async () => {
      try {
        const res = await fetch('/api/user/me');
        const data = await res.json();
        if (data.success && data.user?.id) {
          setStaffId(data.user.id);
          // Fetch staff record to get corporateId
          const staffRes = await fetch(`/api/staff/${data.user.id}`);
          const staffData = await staffRes.json();
          if (staffData.success && staffData.staff?.corporateId) {
            setStaffCorporateId(staffData.staff.corporateId);
          }
        }
      } catch (err) {
        console.error('Failed to get staff info:', err);
      }
    };
    fetchStaffInfo();
  }, []);

  // Mark ALL unread messages as read when page loads
  useEffect(() => {
    if (!staffId) return;

    const markAllAsRead = async () => {
      try {
        await fetch('/api/staff/messages/mark-all-read', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });
      } catch (err) {
        console.error('Failed to mark all messages as read:', err);
      }
    };

    markAllAsRead();
  }, [staffId]);

  // Fetch users that staff can contact
  useEffect(() => {
    if (!staffId) return;

    const fetchContactableUsers = async () => {
      try {
        setUsersLoading(true);
        // Fetch system admin and other staff + corporate admin
        const res = await fetch('/api/staff/contacts');
        const data = await res.json();
        
        if (data.success && data.users) {
          setContactableUsers(data.users);
          // Auto-select first user if available
          if (data.users.length > 0 && !selectedUser) {
            setSelectedUser(data.users[0]);
          }
        }
      } catch (err) {
        console.error('Failed to fetch contacts:', err);
        setError('Failed to load contacts');
      } finally {
        setUsersLoading(false);
      }
    };

    fetchContactableUsers();
  }, [staffId]);

  // Fetch messages with selected user
  useEffect(() => {
    if (!selectedUser?._id || !staffId) return;

    const fetchMessages = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/messages/thread/${selectedUser._id}`);
        const data = await res.json();
        
        if (data.success && data.messages) {
          setMessages(data.messages);
        }
      } catch (err) {
        console.error('Failed to fetch messages:', err);
        setError('Failed to load messages');
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [selectedUser, staffId]);

  // Smart background polling
  useEffect(() => {
    if (!selectedUser?._id || !staffId) return;

    const pollMessages = async () => {
      try {
        const messagesRes = await fetch(`/api/messages/thread/${selectedUser._id}`);
        const messagesData = await messagesRes.json();
        
        if (messagesData.success && messagesData.messages) {
          setMessages(prevMessages => {
            if (prevMessages.length !== messagesData.messages.length) {
              return messagesData.messages;
            }
            return prevMessages;
          });
        }
      } catch (err) {
        console.error('Background polling error:', err);
      }
    };

    const interval = setInterval(pollMessages, 3000);
    return () => clearInterval(interval);
  }, [selectedUser?._id, staffId]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !selectedUser) return;

    const content = messageInput.trim();
    setMessageInput('');

    try {
      const res = await fetch(`/api/messages/thread/${selectedUser._id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });

      const data = await res.json();
      if (data.success) {
        setMessages([...messages, data.message]);
      }
    } catch (err) {
      console.error('Failed to send message:', err);
      setError('Failed to send message');
    }
  };

  const filteredUsers = contactableUsers.filter(user =>
    getFullName(user).toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-screen flex bg-white">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-80' : 'w-0'} bg-white border-r border-gray-200 flex flex-col transition-all duration-300 overflow-hidden`}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
          <h2 className="font-bold text-gray-900">Contacts</h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent flex-1 outline-none text-sm"
            />
          </div>
        </div>

        {/* Users List */}
        <div className="flex-1 overflow-y-auto min-h-0">
          {usersLoading ? (
            <div className="p-4 text-center text-gray-500 text-sm">Loading contacts...</div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-4 text-center text-gray-500 text-sm">No contacts found</div>
          ) : (
            <div className="space-y-2 p-2">
              {filteredUsers.map((user) => (
                <button
                  key={user._id}
                  onClick={() => {
                    setSelectedUser(user);
                  }}
                  className={`w-full p-3 rounded-lg text-left transition-colors ${
                    selectedUser?._id === user._id
                      ? 'bg-blue-100 border-l-4 border-blue-600'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold flex-shrink-0 overflow-hidden">
                      {user.profileImage ? (
                        <img src={user.profileImage} alt={getFullName(user)} className="w-full h-full object-cover" />
                      ) : (
                        getInitials(user)
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{getFullName(user)}</p>
                      <p className="text-xs text-gray-500 truncate">{getRoleLabel(user.role, user.isAdmin, user.isCorporateAdmin)}</p>
                      <p className="text-xs text-gray-400 truncate">{user.email}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Sidebar Toggle */}
        <div className="lg:hidden p-4 border-b border-gray-200 flex items-center gap-3 flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Search className="w-5 h-5 text-gray-600" />
          </button>
          {selectedUser && <h3 className="font-semibold text-gray-900">{getFullName(selectedUser)}</h3>}
        </div>

        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 flex items-center gap-3 bg-white hidden lg:flex flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0 overflow-hidden">
                {selectedUser.profileImage ? (
                  <img src={selectedUser.profileImage} alt={getFullName(selectedUser)} className="w-full h-full object-cover" />
                ) : (
                  getInitials(selectedUser)
                )}
              </div>
              <div className="flex-1">
                <h2 className="font-bold text-gray-900">{getFullName(selectedUser)}</h2>
                <p className="text-xs text-gray-500">{getRoleLabel(selectedUser.role, selectedUser.isAdmin, selectedUser.isCorporateAdmin)} • {selectedUser.email}</p>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-gray-50 to-white min-h-0">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">Loading messages...</p>
                </div>
              ) : error ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-red-500">{error}</p>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="text-5xl mb-4">👋</div>
                  <h3 className="font-bold text-gray-900 mb-1">Start your conversation</h3>
                  <p className="text-gray-500 text-sm max-w-sm">
                    Send a message to {getFullName(selectedUser)} to get started
                  </p>
                </div>
              ) : (
                messages.map(message => {
                  const isOwn = message.senderId._id === staffId;
                  return (
                    <div key={message._id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                        isOwn
                          ? 'bg-blue-600 text-white rounded-br-none'
                          : 'bg-gray-200 text-gray-900 rounded-bl-none'
                      }`}>
                        <p className="break-words">{message.content}</p>
                        <p className={`text-xs mt-1 ${isOwn ? 'text-blue-100' : 'text-gray-500'}`}>
                          {formatTime(message.createdAt)}
                          {isOwn && message.readAt && ' ✓✓'}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 bg-white flex-shrink-0">
              <form onSubmit={handleSendMessage} className="flex gap-3">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 bg-gray-100 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <button
                  type="submit"
                  disabled={!messageInput.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
                >
                  ➤
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
            <div className="text-center">
              <div className="text-6xl mb-4">💬</div>
              <p className="text-gray-500">Select a contact to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
