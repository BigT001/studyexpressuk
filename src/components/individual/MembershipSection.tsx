'use client';

import Link from 'next/link';

export function MembershipSection() {
  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center gap-4">
          <span className="text-5xl">💳</span>
          <div>
            <h2 className="text-2xl font-black">Membership Management</h2>
            <p className="text-blue-100 text-sm mt-1">Upgrade your experience</p>
          </div>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <Link
          href="/individual/memberships"
          className="bg-white border-2 border-blue-200 rounded-xl p-6 hover:shadow-lg hover:border-blue-400 transition-all duration-300 group"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-bold text-gray-900 group-hover:text-[#008200] transition-colors">View Membership Status</h3>
              <p className="text-sm text-gray-500 mt-1">Current plan & benefits</p>
            </div>
            <span className="text-3xl">👁️</span>
          </div>
          <p className="text-xs text-gray-600">→ View status</p>
        </Link>

        <Link
          href="/individual/memberships?action=upgrade"
          className="bg-white border-2 border-emerald-200 rounded-xl p-6 hover:shadow-lg hover:border-emerald-400 transition-all duration-300 group"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-bold text-gray-900 group-hover:text-[#008200] transition-colors">Upgrade to Premium</h3>
              <p className="text-sm text-gray-500 mt-1">Unlock exclusive features</p>
            </div>
            <span className="text-3xl">⭐</span>
          </div>
          <p className="text-xs text-gray-600">→ View plans</p>
        </Link>
      </div>
    </div>
  );
}
