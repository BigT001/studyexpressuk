'use client';

import Link from 'next/link';
import { Users, UserPlus, TrendingUp } from 'lucide-react';

export function CorporateStaffSection() {
  return (
    <section className="space-y-2">
      <div className="flex items-center gap-2 mb-1">
        <Users className="w-4 h-4 text-gray-400" aria-hidden="true" />
        <h2 className="text-lg font-semibold text-gray-900">Staff Management</h2>
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        <Link
          href="/corporate/staff"
          className="flex flex-col border border-blue-100 rounded-lg bg-white p-4 hover:border-blue-400 transition-colors"
        >
          <div className="flex items-center gap-2 mb-1">
            <UserPlus className="w-4 h-4 text-blue-400" aria-hidden="true" />
            <span className="text-sm font-medium text-gray-900">Add Staff Member</span>
          </div>
          <span className="text-xs text-gray-500 mb-2">Invite team members to training</span>
          <span className="text-xs text-blue-500 mt-auto">→ Manage staff</span>
        </Link>
        <Link
          href="/corporate/staff"
          className="flex flex-col border border-purple-100 rounded-lg bg-white p-4 hover:border-purple-400 transition-colors"
        >
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-purple-400" aria-hidden="true" />
            <span className="text-sm font-medium text-gray-900">Staff Performance</span>
          </div>
          <span className="text-xs text-gray-500 mb-2">Track team progress and achievements</span>
          <span className="text-xs text-purple-500 mt-auto">→ View analytics</span>
        </Link>
      </div>
    </section>
  );
}
