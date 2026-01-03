'use client';

import { MessageSquare, Mail, Send } from 'lucide-react';
import Link from 'next/link';

export function CorporateCommunicationSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Inbox Card */}
      <Link
        href="/corporate/messages"
        className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-700 text-sm font-medium">My Inbox</p>
            <h3 className="text-lg font-bold text-blue-900 mt-2">3 New Messages</h3>
          </div>
          <Mail className="w-10 h-10 text-blue-600" />
        </div>
        <p className="text-blue-700 text-xs mt-4">Communication from administrators</p>
      </Link>

      {/* Announcements Card */}
      <Link
        href="/corporate/announcements"
        className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-700 text-sm font-medium">Announcements</p>
            <h3 className="text-lg font-bold text-green-900 mt-2">Latest Updates</h3>
          </div>
          <MessageSquare className="w-10 h-10 text-green-600" />
        </div>
        <p className="text-green-700 text-xs mt-4">Platform news and broadcasts</p>
      </Link>

      {/* Send Message Card */}
      <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-purple-700 text-sm font-medium">Get Support</p>
            <h3 className="text-lg font-bold text-purple-900 mt-2">Contact Us</h3>
          </div>
          <Send className="w-10 h-10 text-purple-600" />
        </div>
        <p className="text-purple-700 text-xs mt-4">24/7 support available</p>
      </div>
    </div>
  );
}
