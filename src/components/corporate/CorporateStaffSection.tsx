'use client';

import { Users, UserPlus, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export function CorporateStaffSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Total Staff Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm font-medium">Total Staff</p>
            <h3 className="text-3xl font-bold text-gray-900 mt-2">45</h3>
          </div>
          <Users className="w-10 h-10 text-blue-600" />
        </div>
        <p className="text-gray-600 text-xs mt-4">+5 members this month</p>
      </div>

      {/* Add Staff Card */}
      <Link
        href="/corporate/staff"
        className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-700 text-sm font-medium">Manage Staff</p>
            <h3 className="text-lg font-bold text-blue-900 mt-2">Add Members</h3>
          </div>
          <UserPlus className="w-10 h-10 text-blue-600" />
        </div>
        <p className="text-blue-700 text-xs mt-4">Invite and manage your team</p>
      </Link>

      {/* Performance Card */}
      <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-700 text-sm font-medium">Avg. Performance</p>
            <h3 className="text-3xl font-bold text-green-900 mt-2">78%</h3>
          </div>
          <TrendingUp className="w-10 h-10 text-green-600" />
        </div>
        <p className="text-green-700 text-xs mt-4">Staff completion rate</p>
      </div>
    </div>
  );
}
