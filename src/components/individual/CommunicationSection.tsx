'use client';

import Link from 'next/link';

export function CommunicationSection() {
  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center gap-4">
          <span className="text-5xl">💬</span>
          <div>
            <h2 className="text-2xl font-black">Communication Center</h2>
            <p className="text-purple-100 text-sm mt-1">Messages & announcements</p>
          </div>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <Link
          href="/individual/messages"
          className="bg-white border-2 border-purple-200 rounded-xl p-6 hover:shadow-lg hover:border-purple-400 transition-all duration-300 group"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-bold text-gray-900 group-hover:text-[#008200] transition-colors">My Inbox</h3>
              <p className="text-sm text-gray-500 mt-1">Messages from administrators</p>
            </div>
            <span className="text-3xl">📧</span>
          </div>
          <p className="text-xs text-gray-600">→ Open inbox</p>
        </Link>

        <Link
          href="/individual/announcements"
          className="bg-white border-2 border-pink-200 rounded-xl p-6 hover:shadow-lg hover:border-pink-400 transition-all duration-300 group"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-bold text-gray-900 group-hover:text-[#008200] transition-colors">Announcements</h3>
              <p className="text-sm text-gray-500 mt-1">Platform updates & broadcasts</p>
            </div>
            <span className="text-3xl">📢</span>
          </div>
          <p className="text-xs text-gray-600">→ View announcements</p>
        </Link>
      </div>
    </div>
  );
}
