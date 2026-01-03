'use client';

import Link from 'next/link';

export function ProfileSection() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-4xl">👤</span>
        <h2 className="text-2xl font-black text-gray-900">Profile & Account</h2>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <Link
          href="/individual/profile"
          className="bg-white border-2 border-blue-200 rounded-xl p-6 hover:shadow-lg hover:border-blue-400 transition-all duration-300 group"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-bold text-gray-900 group-hover:text-[#008200] transition-colors">My Profile</h3>
              <p className="text-sm text-gray-500 mt-1">View and update personal details</p>
            </div>
            <span className="text-3xl">📋</span>
          </div>
          <p className="text-xs text-gray-600">→ Manage profile</p>
        </Link>

        <Link
          href="/individual/profile?section=security"
          className="bg-white border-2 border-red-200 rounded-xl p-6 hover:shadow-lg hover:border-red-400 transition-all duration-300 group"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-bold text-gray-900 group-hover:text-[#008200] transition-colors">Security Settings</h3>
              <p className="text-sm text-gray-500 mt-1">Change password & security options</p>
            </div>
            <span className="text-3xl">🔐</span>
          </div>
          <p className="text-xs text-gray-600">→ Manage security</p>
        </Link>
      </div>
    </div>
  );
}
