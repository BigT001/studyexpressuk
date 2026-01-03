'use client';

import { Building2, Users, BookOpen, TrendingUp } from 'lucide-react';

export function CorporateDashboardHeader() {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg shadow-lg p-8 text-white">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-bold">Welcome Back!</h1>
          <p className="text-blue-100 mt-2">Tech Solutions Ltd • Enterprise Member</p>
        </div>
        <Building2 className="w-16 h-16 opacity-20" />
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white bg-opacity-10 rounded-lg p-4">
          <p className="text-blue-100 text-sm">Next Renewal</p>
          <p className="text-2xl font-bold mt-1">30 Days</p>
        </div>
        <div className="bg-white bg-opacity-10 rounded-lg p-4">
          <p className="text-blue-100 text-sm">Staff Training</p>
          <p className="text-2xl font-bold mt-1">12 Active</p>
        </div>
        <div className="bg-white bg-opacity-10 rounded-lg p-4">
          <p className="text-blue-100 text-sm">Support</p>
          <p className="text-2xl font-bold mt-1">24/7 Available</p>
        </div>
      </div>
    </div>
  );
}
