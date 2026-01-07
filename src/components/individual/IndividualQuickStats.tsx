'use client';


import { Mail, BookOpen, BarChart2, UserCheck, Calendar } from 'lucide-react';

export function IndividualQuickStats() {
  return (
    <div className="grid md:grid-cols-4 gap-4">
      {/* Registered Events */}
      <div className="flex flex-col items-start border border-gray-200 rounded-lg bg-white p-4 min-h-[110px]">
        <div className="flex items-center gap-2 mb-2">
          <Calendar className="w-5 h-5 text-gray-400" aria-hidden="true" />
          <span className="text-xs text-gray-500 font-medium">Registered Events</span>
        </div>
        <span className="text-2xl font-bold text-gray-900 mb-1">0</span>
        <span className="text-xs text-gray-400">No events registered</span>
      </div>

      {/* Enrolled Courses */}
      <div className="flex flex-col items-start border border-gray-200 rounded-lg bg-white p-4 min-h-[110px]">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="w-5 h-5 text-gray-400" aria-hidden="true" />
          <span className="text-xs text-gray-500 font-medium">Enrolled Courses</span>
        </div>
        <span className="text-2xl font-bold text-gray-900 mb-1">0</span>
        <span className="text-xs text-gray-400">Courses in progress</span>
      </div>

      {/* Learning Progress */}
      <div className="flex flex-col items-start border border-gray-200 rounded-lg bg-white p-4 min-h-[110px]">
        <div className="flex items-center gap-2 mb-2">
          <BarChart2 className="w-5 h-5 text-gray-400" aria-hidden="true" />
          <span className="text-xs text-gray-500 font-medium">Learning Progress</span>
        </div>
        <span className="text-2xl font-bold text-gray-900 mb-1">0%</span>
        <span className="text-xs text-gray-400">Average completion</span>
      </div>

      {/* Messages */}
      <div className="flex flex-col items-start border border-gray-200 rounded-lg bg-white p-4 min-h-[110px]">
        <div className="flex items-center gap-2 mb-2">
          <Mail className="w-5 h-5 text-gray-400" aria-hidden="true" />
          <span className="text-xs text-gray-500 font-medium">New Messages</span>
        </div>
        <span className="text-2xl font-bold text-gray-900 mb-1">0</span>
        <span className="text-xs text-gray-400">Unread messages</span>
      </div>
    </div>
  );
}
