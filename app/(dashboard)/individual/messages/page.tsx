'use client';

import { useState, useEffect, useRef } from 'react';

interface User {
  _id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  role: string;
  profileImage?: string;
}

interface Message {
  _id: string;
  senderId: { _id: string; firstName?: string; lastName?: string; email: string; profileImage?: string };
  recipientId: { _id: string; firstName?: string; lastName?: string; email: string; profileImage?: string };
  content: string;
  createdAt: string;
  readAt?: string;
}

function getFullName(user: User | null | undefined): string {
  if (!user) return 'Admin';
  if (user.role === 'ADMIN') return 'Admin';
  if (user.firstName && user.lastName) return `${user.firstName} ${user.lastName}`;
  if (user.firstName) return user.firstName;
  if (user.lastName) return user.lastName;
  return 'Admin';
}

function getInitials(user: User | null | undefined): string {
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

export default function IndividualMessagesPage() {
  const [adminUser, setAdminUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
        await fetch('/api/individual/messages/mark-all-read', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });
      } catch (err) {
        console.error('Failed to mark all messages as read:', err);
      }
    };

    markAllAsRead();
  }, [userId]);

  // Fetch admin info and messages - only once on mount
  useEffect(() => {
    if (!userId) return;
    
    const initializeChat = async () => {
      try {
        setLoading(true);
        // Fetch admin user info (assuming there's one admin)
        const usersRes = await fetch('/api/messages/users?role=ADMIN');
        const usersData = await usersRes.json();
        
        if (usersData.success && usersData.users?.length > 0) {
          const admin = usersData.users[0];
          setAdminUser(admin);

          // Fetch messages with admin
          const messagesRes = await fetch(`/api/messages/thread/${admin._id}`);
          const messagesData = await messagesRes.json();
          if (messagesData.success) {
            setMessages(messagesData.messages);
          }
        }
      } catch (err) {
        console.error('Failed to fetch messages:', err);
        setError('Failed to load messages');
      } finally {
        setLoading(false);
      }
    };

    initializeChat();
  }, [userId]);

  // Smart background polling - only update if new messages exist
  useEffect(() => {
    if (!adminUser?._id || !userId) return;

    const pollMessages = async () => {
      try {
        // Quietly fetch messages in the background without showing loading state
        const messagesRes = await fetch(`/api/messages/thread/${adminUser._id}`);
        const messagesData = await messagesRes.json();
        
        if (messagesData.success && messagesData.messages) {
          // Only update if message count changed (new messages arrived)
          setMessages(prevMessages => {
            if (prevMessages.length !== messagesData.messages.length) {
              console.log('New messages received:', messagesData.messages);
              console.log('Current user ID:', userId);
              return messagesData.messages;
            }
            return prevMessages;
          });
        }
      } catch (err) {
        // Silently fail in background polling
        console.error('Background polling error:', err);
      }
    };

    // Poll every 3 seconds, but only update on actual message changes
    const interval = setInterval(pollMessages, 3000);
    return () => clearInterval(interval);
  }, [adminUser?._id, userId]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Mark unread received messages as read
  useEffect(() => {
    if (!messages.length || !userId) return;

    const markUnreadAsRead = async () => {
      for (const message of messages) {
        // Only mark messages that were received (not sent) and not yet read
        if (message.senderId._id !== userId && !message.readAt) {
          try {
            await fetch('/api/individual/messages/mark-read', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ messageId: message._id }),
            });
          } catch (err) {
            console.error('Failed to mark message as read:', err);
          }
        }
      }
    };

    markUnreadAsRead();
  }, [messages, userId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !adminUser) return;

    const content = messageInput.trim();
    setMessageInput('');

    try {
      const res = await fetch(`/api/messages/thread/${adminUser._id}`, {
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

  if (!adminUser) {
    return (
      <div className="h-full min-h-[80vh] flex flex-col items-center justify-center bg-gray-50 rounded-3xl border border-gray-100 shadow-sm m-4 lg:m-8 animate-in fade-in duration-700">
        <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mb-6"></div>
        <p className="text-gray-500 font-bold tracking-wide uppercase">Connecting to Secure Channel...</p>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-6rem)] max-h-screen flex flex-col bg-gray-50/50 p-4 lg:p-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Container Wrapper */}
      <div className="flex-1 flex flex-col bg-white rounded-3xl shadow-xl shadow-gray-200/60 border border-gray-100 overflow-hidden relative">
        {/* Chat Header */}
        <div className="px-6 py-5 border-b border-gray-100 bg-white flex items-center gap-4 sticky top-0 z-10 shadow-sm">
          <div className="relative">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#008200] to-teal-600 flex items-center justify-center text-white font-black text-xl flex-shrink-0 shadow-lg shadow-green-900/20">
              {adminUser.profileImage ? (
                <img src={adminUser.profileImage} alt={getFullName(adminUser)} className="w-full h-full rounded-full object-cover" />
              ) : (
                getInitials(adminUser)
              )}
            </div>
            {/* Online indicator */}
            <div className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
          </div>
          <div className="flex-1">
            <h2 className="font-black text-gray-900 text-lg tracking-tight">{getFullName(adminUser)}</h2>
            <p className="text-sm font-semibold text-emerald-600 uppercase tracking-widest mt-0.5">Support Team Active</p>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-gray-50/50 to-white relative custom-scrollbar">
          {loading ? (
            <div className="flex items-center justify-center h-full">
               <div className="w-8 h-8 border-4 border-gray-200 border-t-emerald-600 rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-3">
              <span className="text-4xl">⚠️</span>
              <p className="text-red-600 font-bold bg-red-50 px-4 py-2 rounded-lg">{error}</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="text-6xl mb-6 opacity-80 mix-blend-luminosity grayscale">👋</div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">Start your conversation</h3>
              <p className="text-gray-500 text-base font-medium max-w-sm">
                Our support team is online and ready to assist you. Send a message to begin!
              </p>
            </div>
          ) : (
            messages.map((message, idx) => {
              const isOwn = message.senderId._id === userId;
              const isLast = idx === messages.length - 1;
              return (
                <div key={message._id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                  <div className={`group flex flex-col ${isOwn ? 'items-end' : 'items-start'} max-w-[85%] lg:max-w-[70%]`}>
                    <div className={`px-6 py-4 rounded-3xl shadow-sm text-base ${
                      isOwn
                        ? 'bg-gradient-to-br from-[#008200] to-emerald-700 text-white rounded-br-md shadow-emerald-900/20 border border-emerald-600'
                        : 'bg-white text-gray-800 rounded-bl-md shadow-gray-200/50 border border-gray-100'
                    }`}>
                      <p className="break-words leading-relaxed">{message.content}</p>
                    </div>
                    
                    <div className={`flex items-center gap-1.5 mt-2 text-xs font-bold px-2 ${isOwn ? 'text-gray-400' : 'text-gray-400'}`}>
                      <span>{formatTime(message.createdAt)}</span>
                      {isOwn && (
                        <span className={`transition-colors duration-300 ${message.readAt ? 'text-blue-500' : 'text-gray-300'}`}>
                          {message.readAt ? '✓✓ Read' : '✓ Sent'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} className="h-1" />
        </div>

        {/* Message Input Container */}
        <div className="p-4 border-t border-gray-100 bg-white mb-2 mx-4 rounded-2xl shadow-lg -translate-y-2 sticky bottom-4 z-20">
          <form onSubmit={handleSendMessage} className="flex gap-3 items-center">
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Write your message here..."
              className="flex-1 px-6 py-4 bg-gray-50/80 rounded-xl border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#008200] focus:border-transparent text-base transition-all duration-300 placeholder:text-gray-400 font-medium"
            />
            <button
              type="submit"
              disabled={!messageInput.trim()}
              className="p-4 px-8 bg-gradient-to-r from-[#008200] to-emerald-600 text-white rounded-xl hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:shadow-none transition-all duration-300 font-bold flex items-center justify-center gap-2 group"
            >
              <span className="hidden sm:inline">Send</span>
              <span className="text-xl group-hover:translate-x-1 transition-transform">➤</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
