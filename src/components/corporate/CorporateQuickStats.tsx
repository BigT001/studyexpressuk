'use client';

import { Users, BookOpen, BarChart3, TrendingUp } from 'lucide-react';

export function CorporateQuickStats() {
  return (
    <div className="grid md:grid-cols-4 gap-4">
      {/* Total Staff */}
      <div className="flex flex-col items-start border border-gray-200 rounded-lg bg-white p-4 min-h-[110px]">
        <div className="flex items-center gap-2 mb-2">
          <Users className="w-5 h-5 text-blue-400" aria-hidden="true" />
          <span className="text-xs text-gray-500 font-medium">Total Staff</span>
        </div>
        <span className="text-2xl font-bold text-gray-900 mb-1">0</span>
        <span className="text-xs text-gray-400">Team members</span>
      </div>

      {/* Active Courses */}
      <div className="flex flex-col items-start border border-gray-200 rounded-lg bg-white p-4 min-h-[110px]">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="w-5 h-5 text-green-400" aria-hidden="true" />
          <span className="text-xs text-gray-500 font-medium">Active Courses</span>
        </div>
        <span className="text-2xl font-bold text-gray-900 mb-1">0</span>
        <span className="text-xs text-gray-400">In training</span>
      </div>

      {/* Completion Rate */}
      <div className="flex flex-col items-start border border-gray-200 rounded-lg bg-white p-4 min-h-[110px]">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="w-5 h-5 text-purple-400" aria-hidden="true" />
          <span className="text-xs text-gray-500 font-medium">Completion Rate</span>
        </div>
        <span className="text-2xl font-bold text-gray-900 mb-1">0%</span>
        <span className="text-xs text-gray-400">Average progress</span>
      </div>

      {/* Overall Progress */}
      <div className="flex flex-col items-start border border-gray-200 rounded-lg bg-white p-4 min-h-[110px]">
        <div className="flex items-center gap-2 mb-2">
          <BarChart3 className="w-5 h-5 text-orange-400" aria-hidden="true" />
          <span className="text-xs text-gray-500 font-medium">Overall Progress</span>
        </div>
        <span className="text-2xl font-bold text-gray-900 mb-1">0%</span>
        <span className="text-xs text-gray-400">Team learning progress</span>
      </div>
    </div>
  );
}
