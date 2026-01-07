'use client';

import Link from 'next/link';
import { BookOpen, Search, Calendar, Award } from 'lucide-react';

export function LearningSection() {
  return (
    <section className="space-y-2">
      <div className="flex items-center gap-2 mb-1">
        <BookOpen className="w-4 h-4 text-emerald-400" aria-hidden="true" />
        <h2 className="text-lg font-semibold text-gray-900">Learning Hub</h2>
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        <Link
          href="/individual/enrollments"
          className="flex flex-col border border-emerald-100 rounded-lg bg-white p-4 hover:border-emerald-400 transition-colors"
        >
          <div className="flex items-center gap-2 mb-1">
            <BookOpen className="w-4 h-4 text-emerald-400" aria-hidden="true" />
            <span className="text-sm font-medium text-gray-900">My Enrollments</span>
          </div>
          <span className="text-xs text-gray-500 mb-2">Courses you&apos;re learning</span>
          <span className="text-xs text-emerald-500 mt-auto">→ View enrollments</span>
        </Link>
        <Link
          href="/courses"
          className="flex flex-col border border-cyan-100 rounded-lg bg-white p-4 hover:border-cyan-400 transition-colors"
        >
          <div className="flex items-center gap-2 mb-1">
            <Search className="w-4 h-4 text-cyan-400" aria-hidden="true" />
            <span className="text-sm font-medium text-gray-900">Browse Courses</span>
          </div>
          <span className="text-xs text-gray-500 mb-2">Explore all available courses</span>
          <span className="text-xs text-cyan-500 mt-auto">→ Browse</span>
        </Link>
        <Link
          href="/events"
          className="flex flex-col border border-purple-100 rounded-lg bg-white p-4 hover:border-purple-400 transition-colors"
        >
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="w-4 h-4 text-purple-400" aria-hidden="true" />
            <span className="text-sm font-medium text-gray-900">Browse Events</span>
          </div>
          <span className="text-xs text-gray-500 mb-2">Upcoming events & trainings</span>
          <span className="text-xs text-purple-500 mt-auto">→ Browse</span>
        </Link>
        <Link
          href="/individual/enrollments?view=certificates"
          className="flex flex-col border border-amber-100 rounded-lg bg-white p-4 hover:border-amber-400 transition-colors"
        >
          <div className="flex items-center gap-2 mb-1">
            <Award className="w-4 h-4 text-amber-400" aria-hidden="true" />
            <span className="text-sm font-medium text-gray-900">My Certificates</span>
          </div>
          <span className="text-xs text-gray-500 mb-2">Completed & earned certificates</span>
          <span className="text-xs text-amber-500 mt-auto">→ View certificates</span>
        </Link>
      </div>
    </section>
  );
}
