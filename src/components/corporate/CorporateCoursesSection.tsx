'use client';

import { BookOpen, Play, Award } from 'lucide-react';
import Link from 'next/link';

export function CorporateCoursesSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Browse Courses Card */}
      <Link
        href="/corporate/courses"
        className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-700 text-sm font-medium">Available Courses</p>
            <h3 className="text-lg font-bold text-blue-900 mt-2">Browse Library</h3>
          </div>
          <BookOpen className="w-10 h-10 text-blue-600" />
        </div>
        <p className="text-blue-700 text-xs mt-4">Explore and assign courses to staff</p>
      </Link>

      {/* Assign Courses Card */}
      <Link
        href="/corporate/courses"
        className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-700 text-sm font-medium">Active Courses</p>
            <h3 className="text-2xl font-bold text-green-900 mt-2">12</h3>
          </div>
          <Play className="w-10 h-10 text-green-600" />
        </div>
        <p className="text-green-700 text-xs mt-4">Courses your team is taking</p>
      </Link>

      {/* Completions Card */}
      <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-purple-700 text-sm font-medium">Completions</p>
            <h3 className="text-2xl font-bold text-purple-900 mt-2">23</h3>
          </div>
          <Award className="w-10 h-10 text-purple-600" />
        </div>
        <p className="text-purple-700 text-xs mt-4">Courses completed by staff</p>
      </div>
    </div>
  );
}
