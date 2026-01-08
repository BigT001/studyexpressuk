"use client";
import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';

// Type for messages in thread
type Message = {
  _id: string;
  senderName: string;
  body: string;
  createdAt: string;
  senderId?: { role?: string; name?: string };
};

export default function MessageThreadPage({ params }: { params: { id: string } }) {
  const id = params.id;
  const [thread, setThread] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchThread() {
      try {
        setLoading(true);
        const res = await fetch(`/api/messages/thread/${id}`);
        const data = await res.json();
        if (data.success) {
          setThread(data.thread);
        } else {
          setError(data.error || 'Failed to fetch thread');
        }
      } catch {
        setError('Network error');
      } finally {
        setLoading(false);
      }
    }
    fetchThread();
  }, [id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [thread]);

  async function handleSendReply(e: React.FormEvent) {
    e.preventDefault();
    if (!reply.trim()) return;
    setSending(true);
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ threadId: id, content: reply }),
      });
      const data = await res.json();
      if (data.success) {
        setThread([...thread, data.message]);
        setReply('');
      } else {
        setError(data.error || 'Failed to send reply');
      }
    } catch {
      setError('Network error');
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <Link href="/individual/messages" className="text-blue-600 hover:underline mb-4 block">← Back to Messages</Link>
      <h1 className="text-2xl font-bold mb-4">Message Thread</h1>
      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading thread...</div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">{error}</div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-6">
          {thread.length > 0 ? (
            <div className="space-y-4">
              {thread.map((msg, idx) => (
                <div key={msg._id || idx} className={`flex flex-col ${msg.senderId?.role === 'ADMIN' ? 'items-start' : 'items-end'}`}>
                  <div className={`inline-block px-4 py-2 rounded-lg ${msg.senderId?.role === 'ADMIN' ? 'bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100' : 'bg-green-100 text-green-900 dark:bg-green-900 dark:text-green-100'}`}>
                    <div className="text-xs font-semibold mb-1">{msg.senderName || (msg.senderId?.role === 'ADMIN' ? 'Admin' : 'You')}</div>
                    <div>{msg.body}</div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{new Date(msg.createdAt).toLocaleString()}</div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">No messages in this thread yet.</div>
          )}
        </div>
      )}
      <form onSubmit={handleSendReply} className="flex gap-2">
        <input
          type="text"
          className="flex-1 rounded-lg border border-gray-300 dark:border-gray-700 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white"
          placeholder="Type your reply..."
          value={reply}
          onChange={e => setReply(e.target.value)}
          disabled={sending}
        />
        <button
          type="submit"
          className="rounded-lg bg-[#008200] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#007000] focus:outline-none focus:ring-4 focus:ring-green-300 dark:focus:ring-green-800"
          disabled={sending}
        >
          {sending ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  );
}
