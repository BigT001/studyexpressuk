"use client";
import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';

// Type for messages from API (based on IGroupMessage)

type Message = {
  _id: string;
  senderId?: string;
  recipientId?: string;
  content?: string;
  subject?: string;
  body?: string;
  senderName?: string;
  recipientGroups?: string[];
  status?: 'draft' | 'scheduled' | 'sent' | 'failed';
  sentAt?: string;
  recipientCount?: number;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
  readAt?: string;
};



export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [announcements, setAnnouncements] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeSection, setActiveSection] = useState<'messages' | 'announcements'>('messages');
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'chat'>('all');
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeTab !== 'chat') {
      setLoading(true);
      setError('');
      Promise.all([
        fetch('/api/messages').then(res => res.ok ? res.json() : { messages: [] }),
        fetch('/api/announcements').then(res => res.ok ? res.json() : { announcements: [] })
      ])
        .then(([msgData, annData]) => {
          setMessages(msgData.messages || []);
          setAnnouncements(annData.announcements || []);
        })
        .catch(() => setError('Failed to load messages or announcements'))
        .finally(() => setLoading(false));
    }
  }, [activeTab]);

  const fetchChatMessages = async () => {
    setChatLoading(true);
    setChatError('');
    try {
      const res = await fetch('/api/messages');
      if (!res.ok) throw new Error('Failed to fetch chat messages');
      const data = await res.json();
      const filtered = (data.messages || []).filter((msg: Message) => msg.content);
      setChatMessages(filtered);
    } catch (err) {
      setChatError('Could not load chat messages');
    } finally {
      setChatLoading(false);
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  };

  const sendChatMessage = async () => {
    if (!chatInput.trim()) return;
    setChatLoading(true);
    setChatError('');
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receiverId: null, content: chatInput }),
      });
      if (!res.ok) throw new Error('Failed to send message');
      setChatInput('');
      await fetchChatMessages();
    } catch (err) {
      setChatError('Could not send message');
    } finally {
      setChatLoading(false);
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  };

  useEffect(() => {
    if (activeTab === 'chat') fetchChatMessages();
  }, [activeTab]);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-56 border-r bg-gray-50 py-8 px-4 flex flex-col gap-4">
        <button
          className={`w-full text-left px-4 py-2 rounded-lg font-semibold transition-colors ${activeSection === 'messages' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100 text-gray-700'}`}
          onClick={() => setActiveSection('messages')}
        >
          Inbox
        </button>
        <button
          className={`w-full text-left px-4 py-2 rounded-lg font-semibold transition-colors ${activeSection === 'announcements' ? 'bg-emerald-100 text-emerald-700' : 'hover:bg-gray-100 text-gray-700'}`}
          onClick={() => setActiveSection('announcements')}
        >
          Announcements
        </button>
      </div>
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-8 pt-8 px-8">
          <button className={`border-b-2 px-6 py-2 text-base font-semibold rounded-t transition-all duration-150 ${activeTab === 'all' ? 'border-blue-600 text-blue-700 bg-blue-50' : 'border-transparent text-gray-600 bg-white hover:bg-gray-50'}`} onClick={() => setActiveTab('all')}>All</button>
          <button className={`border-b-2 px-6 py-2 text-base font-semibold rounded-t transition-all duration-150 ${activeTab === 'unread' ? 'border-blue-600 text-blue-700 bg-blue-50' : 'border-transparent text-gray-600 bg-white hover:bg-gray-50'}`} onClick={() => setActiveTab('unread')}>Unread</button>
          <div className="flex-1"></div>
          <button className={`ml-auto border-b-2 px-6 py-2 text-base font-semibold rounded-t transition-all duration-150 ${activeTab === 'chat' ? 'border-blue-600 text-blue-700 bg-blue-50' : 'border-transparent text-gray-600 bg-white hover:bg-gray-50'}`} onClick={() => setActiveTab('chat')}>Chat</button>
        </div>
        {/* Main message/announcement/chat content */}
        <div className="p-8 min-h-[300px] flex-1">
          {activeTab === 'chat' ? (
            <div className="flex flex-col h-[400px] max-h-[60vh] w-full max-w-2xl mx-auto border border-gray-200 rounded-xl bg-white shadow-sm overflow-hidden">
              <div className="flex-shrink-0 px-4 py-3 border-b border-gray-100 bg-blue-50">
                <h3 className="text-lg font-bold text-blue-700">Chat with Admin</h3>
              </div>
              <div className="flex-1 overflow-y-auto px-4 py-2 space-y-3 bg-gray-50" style={{ minHeight: 0 }}>
                {chatLoading ? (
                  <div className="text-gray-400 text-center py-8">Loading...</div>
                ) : chatError ? (
                  <div className="text-red-400 text-center py-8">{chatError}</div>
                ) : chatMessages.length === 0 ? (
                  <div className="text-gray-400 text-center py-8">No messages yet. Say hello!</div>
                ) : (
                  chatMessages.map((msg, idx) => (
                    <div key={msg._id || idx} className={`flex ${msg.senderName === 'StudyExpress' ? 'justify-start' : 'justify-end'}`} >
                      <div className={`rounded-lg px-4 py-2 max-w-xs md:max-w-md text-sm ${msg.senderName === 'StudyExpress' ? 'bg-blue-100 text-blue-900' : 'bg-blue-600 text-white'}`}>
                        {msg.content}
                        <div className="text-[10px] text-gray-400 mt-1 text-right">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                      </div>
                    </div>
                  ))
                )}
                <div ref={chatEndRef}></div>
              </div>
              <form className="flex items-center gap-2 px-4 py-3 border-t border-gray-100 bg-white" onSubmit={e => { e.preventDefault(); sendChatMessage(); }}>
                <input
                  type="text"
                  className="flex-1 rounded-full border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                  placeholder="Type your message..."
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  disabled={chatLoading}
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-full transition-all duration-150 disabled:opacity-50"
                  disabled={chatLoading || !chatInput.trim()}
                >Send</button>
              </form>
            </div>
          ) : (
            <>
              <h3 className="text-lg font-bold text-gray-900 mb-4">{activeSection === 'messages' ? 'Inbox' : 'Announcements'}</h3>
              {loading ? (
                <div className="text-gray-400 text-center py-16">Loading...</div>
              ) : error ? (
                <div className="text-red-400 text-center py-16">{error}</div>
              ) : activeSection === 'messages' ? (
                messages.length > 0 ? (
                  messages
                    .filter(msg => activeTab === 'all' || !msg.readAt)
                    .map(msg => (
                      <div key={msg._id} className="mb-6">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-blue-700">{msg.senderName || 'StudyExpress'}</span>
                          {msg.status && (
                            <span className="inline-block rounded-full bg-gray-200 px-2.5 py-0.5 text-xs font-medium text-gray-700">{msg.status}</span>
                          )}
                        </div>
                        {msg.content ? (
                          <div className="text-gray-700 mb-2">{msg.content}</div>
                        ) : (
                          <>
                            <div className="font-bold text-gray-900 mb-1">{msg.subject}</div>
                            <div className="text-gray-700 mb-2">{msg.body}</div>
                          </>
                        )}
                        <div className="text-xs text-gray-400">{new Date(msg.createdAt).toLocaleString()}</div>
                      </div>
                    ))
                ) : (
                  <div className="text-gray-400 text-center py-16">No messages to display.</div>
                )
              ) : (
                announcements.length > 0 ? (
                  announcements
                    .filter(a => activeTab === 'all' || !a.readAt)
                    .map(a => (
                      <div key={a._id} className="mb-6">
                        <div className="font-semibold text-emerald-700 mb-1">{a.subject}</div>
                        <div className="text-gray-700 mb-2">{a.body}</div>
                        <div className="text-xs text-gray-400">{new Date(a.createdAt).toLocaleString()}</div>
                      </div>
                    ))
                ) : (
                  <div className="text-gray-400 text-center py-16">No announcements to display.</div>
                )
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
