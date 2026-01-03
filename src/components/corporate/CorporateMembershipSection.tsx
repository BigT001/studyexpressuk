'use client';

import { CreditCard, TrendingUp, CalendarDays } from 'lucide-react';
import Link from 'next/link';

export function CorporateMembershipSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Status Card */}
      <Link
        href="/corporate/memberships"
        className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-700 text-sm font-medium">Current Status</p>
            <h3 className="text-2xl font-bold text-blue-900 mt-2">Enterprise</h3>
          </div>
          <CreditCard className="w-10 h-10 text-blue-600" />
        </div>
        <p className="text-blue-700 text-xs mt-4">Active • Renews in 30 days</p>
      </Link>

      {/* Upgrade Card */}
      <Link
        href="/corporate/memberships?action=upgrade"
        className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-700 text-sm font-medium">Plan Features</p>
            <h3 className="text-lg font-bold text-green-900 mt-2">Unlimited Access</h3>
          </div>
          <TrendingUp className="w-10 h-10 text-green-600" />
        </div>
        <p className="text-green-700 text-xs mt-4">All Enterprise features included</p>
      </Link>

      {/* Renewal Card */}
      <Link
        href="/corporate/memberships"
        className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-purple-700 text-sm font-medium">Renewal Date</p>
            <h3 className="text-lg font-bold text-purple-900 mt-2">Feb 14, 2025</h3>
          </div>
          <CalendarDays className="w-10 h-10 text-purple-600" />
        </div>
        <p className="text-purple-700 text-xs mt-4">$15,000 per year</p>
      </Link>
    </div>
  );
}
