'use client';

import Link from 'next/link';

interface StatCard {
  title: string;
  value: string;
  icon: string;
  href: string;
  color: string;
}

export function DashboardOverview() {
  const stats: StatCard[] = [
    {
      title: 'Total Users',
      value: '1,234',
      icon: '👥',
      href: '/admin/users',
      color: 'bg-blue-50',
    },
    {
      title: 'Active Courses',
      value: '45',
      icon: '📚',
      href: '/admin/courses',
      color: 'bg-green-50',
    },
    {
      title: 'Upcoming Events',
      value: '12',
      icon: '📅',
      href: '/admin/events',
      color: 'bg-purple-50',
    },
    {
      title: 'Total Revenue',
      value: '$45,320',
      icon: '💰',
      href: '/admin/payments',
      color: 'bg-yellow-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <Link
          key={stat.title}
          href={stat.href}
          className={`${stat.color} p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer`}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
            </div>
            <span className="text-4xl">{stat.icon}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
