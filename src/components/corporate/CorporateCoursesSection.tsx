'use client';

import Link from 'next/link';
import { BookOpen, Play, Award } from 'lucide-react';

export function CorporateCoursesSection() {
  return (
    <section className="space-y-2">
      <div className="flex items-center gap-2 mb-1">
        <BookOpen className="w-4 h-4 text-gray-400" aria-hidden="true" />
        <h2 className="text-lg font-semibold text-gray-900">Training Hub</h2>
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        <Link
          href="/corporate/courses"
          className="flex flex-col border border-green-100 rounded-lg bg-white p-4 hover:border-green-400 transition-colors"
        >
          <div className="flex items-center gap-2 mb-1">
            <BookOpen className="w-4 h-4 text-green-400" aria-hidden="true" />
            <span className="text-sm font-medium text-gray-900">Manage Courses</span>
          </div>
          <span className="text-xs text-gray-500 mb-2">Browse, register and assign courses</span>
          <span className="text-xs text-green-500 mt-auto">→ Go to courses</span>
        </Link>
        <Link
          href="/corporate/courses"
          className="flex flex-col border border-pink-100 rounded-lg bg-white p-4 hover:border-pink-400 transition-colors"
        >
          <div className="flex items-center gap-2 mb-1">
            <Award className="w-4 h-4 text-pink-400" aria-hidden="true" />
            <span className="text-sm font-medium text-gray-900">Completions</span>
          </div>
          <span className="text-xs text-gray-500 mb-2">Courses completed by your staff</span>
          <span className="text-xs text-pink-500 mt-auto">→ View certificates</span>
        </Link>
      </div>
    </section>
  );
}
