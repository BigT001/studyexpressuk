'use client';

import { Users, BookOpen, TrendingUp, Award } from 'lucide-react';

export function CorporateQuickStats() {
  const stats = [
    {
      icon: Users,
      label: 'Total Staff',
      value: '45',
      change: '+5 this month',
      color: 'blue',
    },
    {
      icon: BookOpen,
      label: 'Active Courses',
      value: '12',
      change: '3 in progress',
      color: 'green',
    },
    {
      icon: TrendingUp,
      label: 'Completion Rate',
      value: '78%',
      change: '+12% from last month',
      color: 'purple',
    },
    {
      icon: Award,
      label: 'Avg. Progress',
      value: '65%',
      change: 'Staff learning progress',
      color: 'orange',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        const colorClasses = {
          blue: 'bg-blue-50 border-blue-200 text-blue-600',
          green: 'bg-green-50 border-green-200 text-green-600',
          purple: 'bg-purple-50 border-purple-200 text-purple-600',
          orange: 'bg-orange-50 border-orange-200 text-orange-600',
        };

        return (
          <div key={idx} className={`${colorClasses[stat.color as keyof typeof colorClasses]} rounded-lg border p-6`}>
            <Icon className="w-8 h-8 mb-3" />
            <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
            <p className="text-xs text-gray-600 mt-2">{stat.change}</p>
          </div>
        );
      })}
    </div>
  );
}
