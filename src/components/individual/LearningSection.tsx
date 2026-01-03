'use client';

import Link from 'next/link';

export function LearningSection() {
  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center gap-4">
          <span className="text-5xl">📚</span>
          <div>
            <h2 className="text-2xl font-black">Learning Hub</h2>
            <p className="text-emerald-100 text-sm mt-1">Explore courses, events & training</p>
          </div>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <Link
          href="/individual/enrollments"
          className="bg-white border-2 border-emerald-200 rounded-xl p-6 hover:shadow-lg hover:border-emerald-400 transition-all duration-300 group"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-bold text-gray-900 group-hover:text-[#008200] transition-colors">My Enrollments</h3>
              <p className="text-sm text-gray-500 mt-1">Courses you're learning</p>
            </div>
            <span className="text-3xl">🎓</span>
          </div>
          <p className="text-xs text-gray-600">→ View enrollments</p>
        </Link>

        <Link
          href="/courses"
          className="bg-white border-2 border-cyan-200 rounded-xl p-6 hover:shadow-lg hover:border-cyan-400 transition-all duration-300 group"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-bold text-gray-900 group-hover:text-[#008200] transition-colors">Browse Courses</h3>
              <p className="text-sm text-gray-500 mt-1">Explore all available courses</p>
            </div>
            <span className="text-3xl">🔍</span>
          </div>
          <p className="text-xs text-gray-600">→ Browse</p>
        </Link>

        <Link
          href="/events"
          className="bg-white border-2 border-purple-200 rounded-xl p-6 hover:shadow-lg hover:border-purple-400 transition-all duration-300 group"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-bold text-gray-900 group-hover:text-[#008200] transition-colors">Browse Events</h3>
              <p className="text-sm text-gray-500 mt-1">Upcoming events & trainings</p>
            </div>
            <span className="text-3xl">📅</span>
          </div>
          <p className="text-xs text-gray-600">→ Browse</p>
        </Link>

        <Link
          href="/individual/enrollments?view=certificates"
          className="bg-white border-2 border-amber-200 rounded-xl p-6 hover:shadow-lg hover:border-amber-400 transition-all duration-300 group"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-bold text-gray-900 group-hover:text-[#008200] transition-colors">My Certificates</h3>
              <p className="text-sm text-gray-500 mt-1">Completed & earned certificates</p>
            </div>
            <span className="text-3xl">🏆</span>
          </div>
          <p className="text-xs text-gray-600">→ View certificates</p>
        </Link>
      </div>
    </div>
  );
}
