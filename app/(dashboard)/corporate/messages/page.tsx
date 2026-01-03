'use client';

import { useState } from 'react';

export default function CorporateMessagesPage() {
  const [messages] = useState([
    {
      id: 1,
      sender: 'Platform Admin',
      subject: 'Your Enterprise Plan Upgrade is Ready',
      preview: 'We are excited to inform you that your Enterprise plan upgrade has been processed successfully...',
      date: 'Today',
      time: '10:30 AM',
      read: false,
      priority: 'high',
    },
    {
      id: 2,
      sender: 'Support Team',
      subject: 'Response: Staff Training Program Question',
      preview: 'Thank you for your inquiry regarding the staff training program. We have successfully set up...',
      date: 'Yesterday',
      time: '2:15 PM',
      read: true,
      priority: 'normal',
    },
    {
      id: 3,
      sender: 'Finance Department',
      subject: 'Invoice #INV-2024-001 Ready for Download',
      preview: 'Your invoice for the Professional membership plan (Q1 2024) is now ready for download...',
      date: 'Jan 28',
      time: '9:45 AM',
      read: true,
      priority: 'normal',
    },
    {
      id: 4,
      sender: 'Platform Admin',
      subject: 'New Features Available for Enterprise Users',
      preview: 'We are pleased to announce several new features that are now available exclusively to...',
      date: 'Jan 27',
      time: '3:20 PM',
      read: true,
      priority: 'normal',
    },
  ]);

  const [selectedMessage, setSelectedMessage] = useState<typeof messages[0] | null>(null);
  const [replyText, setReplyText] = useState('');

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
        <p className="text-gray-600 mt-1">Communicate with platform administrators and support team</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Inbox</h2>
                <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm font-medium">
                  {messages.filter(m => !m.read).length} New
                </span>
              </div>
            </div>

            <div className="divide-y divide-gray-200">
              {messages.map((message) => (
                <div
                  key={message.id}
                  onClick={() => setSelectedMessage(message)}
                  className={`p-4 cursor-pointer transition-colors hover:bg-gray-50 ${
                    selectedMessage?.id === message.id ? 'bg-blue-50' : ''
                  } ${!message.read ? 'bg-blue-50' : ''}`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.priority === 'high'
                        ? 'bg-red-100 text-red-600'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      <span className="text-xl">📧</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className={`font-${!message.read ? 'bold' : 'medium'} text-gray-900`}>
                          {message.sender}
                        </h3>
                        <span className="text-sm text-gray-600">{message.date}</span>
                      </div>

                      <p className={`text-${!message.read ? 'gray-900 font-medium' : 'gray-700'} mt-1`}>
                        {message.subject}
                      </p>

                      <p className="text-gray-600 text-sm mt-2 truncate">{message.preview}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-1">
          {selectedMessage ? (
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 border-b border-gray-200">
                <h3 className="font-bold text-gray-900">Message Details</h3>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <p className="text-sm text-gray-600">From</p>
                  <p className="font-bold text-gray-900 mt-1">{selectedMessage.sender}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Subject</p>
                  <p className="font-bold text-gray-900 mt-1">{selectedMessage.subject}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Date & Time</p>
                  <p className="font-bold text-gray-900 mt-1">{selectedMessage.date} at {selectedMessage.time}</p>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600">Message</p>
                  <p className="text-gray-700 mt-3 leading-relaxed">{selectedMessage.preview}</p>
                </div>

                <div className="pt-4 border-t border-gray-200 flex gap-2">
                  <button className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2 transition-colors">
                    <span>📦</span>
                    Archive
                  </button>
                  <button className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2 transition-colors">
                    <span>🗑️</span>
                    Delete
                  </button>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Reply</label>
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Type your reply here..."
                  />
                  <button className="mt-3 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 transition-colors">
                    <span>↩️</span>
                    Send Reply
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 text-center">
              <span className="text-5xl block mb-3 text-gray-400">💬</span>
              <p className="text-gray-600">Select a message to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
