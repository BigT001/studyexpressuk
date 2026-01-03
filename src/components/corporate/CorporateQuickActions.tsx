'use client';

import Link from 'next/link';
import { Users, BookOpen, MessageSquare, Bell, ArrowRight } from 'lucide-react';

export function CorporateQuickActions() {
  const actions = [
    {
      icon: Users,
      label: 'Add Staff Member',
      href: '/corporate/staff',
      color: 'blue',
    },
    {
      icon: BookOpen,
      label: 'Browse Courses',
      href: '/corporate/courses',
      color: 'green',
    },
    {
      icon: MessageSquare,
      label: 'View Messages',
      href: '/corporate/messages',
      color: 'purple',
    },
    {
      icon: Bell,
      label: 'Notifications',
      href: '/corporate/notifications',
      color: 'orange',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {actions.map((action, idx) => {
        const Icon = action.icon;
        const colorClasses = {
          blue: 'bg-blue-600 hover:bg-blue-700',
          green: 'bg-green-600 hover:bg-green-700',
          purple: 'bg-purple-600 hover:bg-purple-700',
          orange: 'bg-orange-600 hover:bg-orange-700',
        };

        return (
          <Link
            key={idx}
            href={action.href}
            className={`${colorClasses[action.color as keyof typeof colorClasses]} text-white rounded-lg p-6 flex items-center justify-between transition-colors group`}
          >
            <div className="flex items-center gap-3">
              <Icon className="w-6 h-6" />
              <span className="font-medium">{action.label}</span>
            </div>
            <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        );
      })}
    </div>
  );
}
