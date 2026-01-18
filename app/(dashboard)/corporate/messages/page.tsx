'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';

interface Staff {
  _id: string;
  userId: {
    _id: string;
    firstName?: string;
    lastName?: string;
    email: string;
    role: string;
    profileImage?: string;
  };
  role: string;
  department: string;
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

export default function CorporateMessagesPage() {
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [staffLoading, setStaffLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Get current user ID
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await fetch('/api/user/me');
        const data = await res.json();
        if (data.success && data.user?.id) {
          setUserId(data.user.id);
        }
      } catch (err) {
        console.error('Failed to get user info:', err);
      }
    };
    fetchUserInfo();
  }, []);

  // Mark ALL unread messages as read when page loads
  useEffect(() => {
    if (!userId) return;

    const markAllAsRead = async () => {
      try {
        await fetch('/api/corporate/messages/mark-all-read', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });
      } catch (err) {
        console.error('Failed to mark all messages as read:', err);
      }
    };

    markAllAsRead();
  }, [userId]);

  // Fetch staff members under this corporate
  useEffect(() => {
    if (!userId) return;

    const fetchStaff = async () => {
      try {
        setStaffLoading(true);
        const res = await fetch('/api/corporates/staff');
        const data = await res.json();
        
        if (data.success && data.staff) {
          // Fetch admin user
          const adminRes = await fetch('/api/admin/user');
          const adminData = adminRes.ok ? await adminRes.json() : null;
          
          let staffWithAdmin = data.staff;
          
          // Add admin at the top if available
          if (adminData?.user) {
            const adminStaffEntry: Staff = {
              _id: adminData.user._id,
              userId: {
                _id: adminData.user._id,
                firstName: adminData.user.firstName,
                lastName: adminData.user.lastName,
                email: adminData.user.email,
                role: 'ADMIN',
                profileImage: adminData.user.profileImage,
              },
              role: 'ADMIN',
              department: 'Administration',
            };
            staffWithAdmin = [adminStaffEntry, ...data.staff];
          }
          
          setStaffList(staffWithAdmin);
          // Auto-select first staff if available
          if (staffWithAdmin.length > 0 && !selectedStaff) {
            setSelectedStaff(staffWithAdmin[0]);
          }
        }
      } catch (err) {
        console.error('Failed to fetch staff:', err);
        setError('Failed to load staff members');
      } finally {
        setStaffLoading(false);
      }
    };

    fetchStaff();
  }, [userId]);

  // Fetch messages with selected staff
  useEffect(() => {
    if (!selectedStaff?.userId?._id || !userId) return;

    const fetchMessages = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/messages/thread/${selectedStaff.userId._id}`);
        const data = await res.json();
        
        if (data.success && data.messages) {
          setMessages(data.messages);
          
          // Mark all unread messages from this conversation as read
          const unreadMessages = data.messages.filter(
            (msg: Message) => !msg.readAt && msg.recipientId._id === userId
          );
          
          for (const msg of unreadMessages) {
            try {
              await fetch('/api/corporate/messages/mark-read', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messageId: msg._id }),
              });
            } catch (err) {
              console.error('Failed to mark message as read:', err);
            }
          }
        }
      } catch (err) {
        console.error('Failed to fetch messages:', err);
        setError('Failed to load messages');
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [selectedStaff, userId]);

  // Smart background polling - only update if new messages exist
  useEffect(() => {
    if (!selectedStaff?.userId?._id || !userId) return;

    const pollMessages = async () => {
      try {
        const messagesRes = await fetch(`/api/messages/thread/${selectedStaff.userId._id}`);
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
  }, [selectedStaff?.userId?._id, userId]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !selectedStaff) return;

    const content = messageInput.trim();
    setMessageInput('');

    try {
      const res = await fetch(`/api/messages/thread/${selectedStaff.userId._id}`, {
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

  const filteredStaff = staffList.filter(staff =>
    getFullName(staff.userId).toLowerCase().includes(searchQuery.toLowerCase()) ||
    staff.userId.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    staff.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-screen flex bg-white">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-80' : 'w-0'} bg-white border-r border-gray-200 flex flex-col transition-all duration-300 overflow-hidden`}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="font-bold text-gray-900">Staff Members</h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search staff..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent flex-1 outline-none text-sm"
            />
          </div>
        </div>

        {/* Staff List */}
        <div className="flex-1 overflow-y-auto">
          {staffLoading ? (
            <div className="p-4 text-center text-gray-500 text-sm">Loading staff...</div>
          ) : filteredStaff.length === 0 ? (
            <div className="p-4 text-center text-gray-500 text-sm">No staff members found</div>
          ) : (
            <div className="space-y-2 p-2">
              {filteredStaff.map((staff) => (
                <button
                  key={staff._id}
                  onClick={() => {
                    setSelectedStaff(staff);
                  }}
                  className={`w-full p-3 rounded-lg text-left transition-colors ${
                    selectedStaff?._id === staff._id
                      ? 'bg-blue-100 border-l-4 border-blue-600'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold flex-shrink-0 overflow-hidden">
                      {staff.userId.profileImage ? (
                        <img src={staff.userId.profileImage} alt={getFullName(staff.userId)} className="w-full h-full object-cover" />
                      ) : (
                        getInitials(staff.userId)
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{getFullName(staff.userId)}</p>
                      <p className="text-xs text-gray-500 truncate">{staff.department}</p>
                      <p className="text-xs text-gray-400 truncate">{staff.userId.email}</p>
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
        <div className="lg:hidden p-4 border-b border-gray-200 flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Search className="w-5 h-5 text-gray-600" />
          </button>
          {selectedStaff && <h3 className="font-semibold text-gray-900">{getFullName(selectedStaff.userId)}</h3>}
        </div>

        {selectedStaff ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 flex items-center gap-3 sticky top-0 z-10 bg-white hidden lg:flex">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0 overflow-hidden">
                {selectedStaff.userId.profileImage ? (
                  <img src={selectedStaff.userId.profileImage} alt={getFullName(selectedStaff.userId)} className="w-full h-full object-cover" />
                ) : (
                  getInitials(selectedStaff.userId)
                )}
              </div>
              <div className="flex-1">
                <h2 className="font-bold text-gray-900">{getFullName(selectedStaff.userId)}</h2>
                <p className="text-xs text-gray-500">{selectedStaff.department} • {selectedStaff.userId.email}</p>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-gray-50 to-white">
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
                    Send a message to {getFullName(selectedStaff.userId)} to get started
                  </p>
                </div>
              ) : (
                messages.map(message => {
                  const isOwn = message.senderId._id === userId;
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
            <div className="p-4 border-t border-gray-200 bg-white sticky bottom-0">
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
              <p className="text-gray-500">Select a staff member to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
