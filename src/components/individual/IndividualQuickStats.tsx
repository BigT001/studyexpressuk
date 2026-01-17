'use client';

import { useState, useEffect } from 'react';
import { BookOpen, Calendar } from 'lucide-react';

export function IndividualQuickStats() {
  const [stats, setStats] = useState({
    enrolledCourses: 0,
    registeredEvents: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch enrolled courses
        const coursesRes = await fetch('/api/individual/enrollments/courses');
        const coursesData = await coursesRes.json();
        const courseCount = coursesData.enrollments ? coursesData.enrollments.length : 0;

        // Fetch registered events
        const eventsRes = await fetch('/api/individual/enrollments/events');
        const eventsData = await eventsRes.json();
        const eventCount = eventsData.enrollments ? eventsData.enrollments.length : 0;

        setStats({
          enrolledCourses: courseCount,
          registeredEvents: eventCount,
        });
      } catch (err) {
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {/* Registered Events */}
      <div className="flex flex-col items-start border border-gray-200 rounded-lg bg-white p-4 min-h-[110px]">
        <div className="flex items-center gap-2 mb-2">
          <Calendar className="w-5 h-5 text-gray-400" aria-hidden="true" />
          <span className="text-xs text-gray-500 font-medium">Registered Events</span>
        </div>
        <span className="text-2xl font-bold text-gray-900 mb-1">
          {loading ? '—' : stats.registeredEvents}
        </span>
        <span className="text-xs text-gray-400">
          {stats.registeredEvents === 0 ? 'No events registered' : `${stats.registeredEvents} event${stats.registeredEvents !== 1 ? 's' : ''}`}
        </span>
      </div>

      {/* Enrolled Courses */}
      <div className="flex flex-col items-start border border-gray-200 rounded-lg bg-white p-4 min-h-[110px]">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="w-5 h-5 text-gray-400" aria-hidden="true" />
          <span className="text-xs text-gray-500 font-medium">Enrolled Courses</span>
        </div>
        <span className="text-2xl font-bold text-gray-900 mb-1">
          {loading ? '—' : stats.enrolledCourses}
        </span>
        <span className="text-xs text-gray-400">
          {stats.enrolledCourses === 0 ? 'No courses enrolled' : `${stats.enrolledCourses} course${stats.enrolledCourses !== 1 ? 's' : ''}`}
        </span>
      </div>
    </div>
  );
}
