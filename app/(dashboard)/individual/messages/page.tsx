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
      <div className="h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
        <div className="text-center">
          <div className="text-6xl mb-4">💬</div>
          <p className="text-gray-500">Loading chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-200 flex items-center gap-3 sticky top-0 z-10 bg-white">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#008200] to-[#00B300] flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
          {adminUser.profileImage ? (
            <img src={adminUser.profileImage} alt={getFullName(adminUser)} className="w-full h-full rounded-full object-cover" />
          ) : (
            getInitials(adminUser)
          )}
        </div>
        <div className="flex-1">
          <h2 className="font-bold text-gray-900">{getFullName(adminUser)}</h2>
          <p className="text-xs text-gray-500">Admin • {adminUser.email}</p>
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
              Send a message to {getFullName(adminUser)} to get started
            </p>
          </div>
        ) : (
          messages.map(message => {
            const isOwn = message.senderId._id === userId;
            return (
              <div key={message._id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                  isOwn
                    ? 'bg-[#008200] text-white rounded-br-none'
                    : 'bg-gray-200 text-gray-900 rounded-bl-none'
                }`}>
                  <p className="break-words">{message.content}</p>
                  <p className={`text-xs mt-1 ${isOwn ? 'text-green-100' : 'text-gray-500'}`}>
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
            className="flex-1 px-4 py-2 bg-gray-100 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#008200] text-sm"
          />
          <button
            type="submit"
            disabled={!messageInput.trim()}
            className="px-4 py-2 bg-[#008200] text-white rounded-full hover:bg-[#006600] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
          >
            ➤
          </button>
        </form>
      </div>
    </div>
  );
}
