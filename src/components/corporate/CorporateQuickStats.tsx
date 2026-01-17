'use client';

import { Users, BookOpen, Calendar } from 'lucide-react';
import { useState, useEffect } from 'react';

interface StatsData {
  totalStaff: number;
  activeCourses: number;
  totalEvents: number;
}

export function CorporateQuickStats() {
  const [stats, setStats] = useState<StatsData>({
    totalStaff: 0,
    activeCourses: 0,
    totalEvents: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/corporate/stats');
        if (response.ok) {
          const data = await response.json();
          setStats({
            totalStaff: data.totalStaff || 0,
            activeCourses: data.activeCourses || 0,
            totalEvents: data.totalEvents || 0,
          });
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="grid md:grid-cols-3 gap-4">
      {/* Total Staff */}
      <div className="flex flex-col items-start border border-gray-200 rounded-lg bg-white p-4 min-h-27.5">
        <div className="flex items-center gap-2 mb-2">
          <Users className="w-5 h-5 text-blue-400" aria-hidden="true" />
          <span className="text-xs text-gray-500 font-medium">Total Staff</span>
        </div>
        <span className="text-2xl font-bold text-gray-900 mb-1">
          {loading ? '-' : stats.totalStaff}
        </span>
        <span className="text-xs text-gray-400">Team members</span>
      </div>

      {/* Active Courses */}
      <div className="flex flex-col items-start border border-gray-200 rounded-lg bg-white p-4 min-h-27.5">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="w-5 h-5 text-green-400" aria-hidden="true" />
          <span className="text-xs text-gray-500 font-medium">Active Courses</span>
        </div>
        <span className="text-2xl font-bold text-gray-900 mb-1">
          {loading ? '-' : stats.activeCourses}
        </span>
        <span className="text-xs text-gray-400">In training</span>
      </div>

      {/* Total Events */}
      <div className="flex flex-col items-start border border-gray-200 rounded-lg bg-white p-4 min-h-27.5">
        <div className="flex items-center gap-2 mb-2">
          <Calendar className="w-5 h-5 text-orange-400" aria-hidden="true" />
          <span className="text-xs text-gray-500 font-medium">Total Events</span>
        </div>
        <span className="text-2xl font-bold text-gray-900 mb-1">
          {loading ? '-' : stats.totalEvents}
        </span>
        <span className="text-xs text-gray-400">Scheduled events</span>
      </div>
    </div>
  );
}
