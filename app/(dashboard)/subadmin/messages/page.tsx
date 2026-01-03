'use client'

import { useState } from 'react'
import { Search, MoreVertical, Paperclip, Send, MessageSquare } from 'lucide-react'


export default function MessagesPage() {
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [replyText, setReplyText] = useState('')

  const messages = [
    {
      id: 1,
      sender: 'Sarah Johnson',
      senderType: 'Member',
      email: 'sarah.johnson@email.com',
      subject: 'Question about course enrollment',
      preview: 'Hi, I wanted to ask about the project management course...',
      timestamp: '2 hours ago',
      unread: true,
      avatar: 'SJ',
      fullMessage: 'Hi, I wanted to ask about the project management course. Is it possible to start mid-session? I saw you have an ongoing cohort and would like to join.'
    },
    {
      id: 2,
      sender: 'Tech Industries Ltd',
      senderType: 'Corporate',
      email: 'hr@techindustries.com',
      subject: 'Staff enrollment requests',
      preview: 'We have 5 new team members who need to be enrolled...',
      timestamp: '4 hours ago',
      unread: true,
      avatar: 'TI',
      fullMessage: 'We have 5 new team members who need to be enrolled in the Excel training course. Please let me know the process and timeline.'
    },
    {
      id: 3,
      sender: 'James Wilson',
      senderType: 'Member',
      email: 'james.wilson@email.com',
      subject: 'Technical issue with portal',
      preview: 'I cannot access my course materials from the portal...',
      timestamp: '6 hours ago',
      unread: false,
      avatar: 'JW',
      fullMessage: 'I cannot access my course materials from the portal. Every time I try to open a lesson, I get an error message.'
    },
    {
      id: 4,
      sender: 'Emma Davis',
      senderType: 'Member',
      email: 'emma.davis@email.com',
      subject: 'Certificate request',
      preview: 'Could you please send me my completion certificate...',
      timestamp: '1 day ago',
      unread: false,
      avatar: 'ED',
      fullMessage: 'Could you please send me my completion certificate for the communication skills course? I completed it last week.'
    },
  ]

  const filteredMessages = messages.filter(msg => 
    msg.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
    msg.subject.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const selected = selectedMessage ? messages.find(m => m.id === selectedMessage) : null

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Member Messages</h1>
          <p className="text-slate-600 mt-1">Respond to member inquiries and requests</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages List */}
        <div className="lg:col-span-1 bg-white rounded-lg border border-slate-200">
          <div className="p-4 border-b border-slate-200">
            <div className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent flex-1 outline-none text-sm"
              />
            </div>
          </div>

          <div className="divide-y divide-slate-200 max-h-[600px] overflow-y-auto">
            {filteredMessages.map((msg) => (
              <button
                key={msg.id}
                onClick={() => setSelectedMessage(msg.id)}
                className={`w-full p-4 text-left hover:bg-slate-50 transition-colors border-l-2 ${
                  selectedMessage === msg.id ? 'bg-blue-50 border-l-blue-600' : 'border-l-transparent'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0 ${
                    msg.senderType === 'Corporate' 
                      ? 'bg-purple-500' 
                      : 'bg-blue-500'
                  }`}>
                    {msg.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-sm font-medium ${msg.unread ? 'text-slate-900 font-semibold' : 'text-slate-900'}`}>
                        {msg.sender}
                      </p>
                      {msg.unread && <div className="w-2 h-2 bg-blue-600 rounded-full" />}
                    </div>
                    <p className="text-xs text-slate-600 mt-1 truncate">{msg.subject}</p>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{msg.preview}</p>
                    <p className="text-xs text-slate-400 mt-2">{msg.timestamp}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-2">
          {selected ? (
            <div className="bg-white rounded-lg border border-slate-200 flex flex-col h-[600px]">
              {/* Header */}
              <div className="p-4 border-b border-slate-200 flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-white font-semibold ${
                    selected.senderType === 'Corporate' 
                      ? 'bg-purple-500' 
                      : 'bg-blue-500'
                  }`}>
                    {selected.avatar}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{selected.sender}</h3>
                    <p className="text-xs text-slate-600">{selected.email}</p>
                    <p className="text-xs text-slate-500 mt-1">{selected.timestamp}</p>
                  </div>
                </div>
                <button className="text-slate-400 hover:text-slate-600">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>

              {/* Subject and Message */}
              <div className="flex-1 overflow-y-auto p-4">
                <p className="font-semibold text-slate-900 mb-4">{selected.subject}</p>
                <p className="text-slate-700 leading-relaxed">{selected.fullMessage}</p>
              </div>

              {/* Reply Box */}
              <div className="p-4 border-t border-slate-200">
                <div className="flex items-center gap-2 mb-3">
                  <input
                    type="text"
                    placeholder="Type your response..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none"
                  />
                  <button className="text-slate-400 hover:text-slate-600">
                    <Paperclip className="w-4 h-4" />
                  </button>
                  <button className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Send className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-slate-500">Your response will be marked and logged</p>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-slate-200 h-[600px] flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600">Select a message to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
