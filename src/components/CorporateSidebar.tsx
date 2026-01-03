'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useSidebar } from '@/context/SidebarContext';
import CorporateLogoutButton from '@/components/corporate/CorporateLogoutButton';

interface NavItem {
  icon: string;
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  {
    icon: '📊',
    label: 'Dashboard',
    href: '/corporate',
  },
  {
    icon: '🏢',
    label: 'Profile',
    href: '/corporate/profile',
  },
  {
    icon: '💳',
    label: 'Memberships',
    href: '/corporate/memberships',
  },
  {
    icon: '👥',
    label: 'Staff Management',
    href: '/corporate/staff',
  },
  {
    icon: '📚',
    label: 'Training & Courses',
    href: '/corporate/courses',
  },
  {
    icon: '💬',
    label: 'Messages',
    href: '/corporate/messages',
  },
  {
    icon: '📢',
    label: 'Announcements',
    href: '/corporate/announcements',
  },
  {
    icon: '🔔',
    label: 'Notifications',
    href: '/corporate/notifications',
  },
  {
    icon: '⚙️',
    label: 'Settings',
    href: '/corporate/settings',
  },
];

export function CorporateSidebar() {
  const pathname = usePathname();
  const { isCollapsed, setIsCollapsed } = useSidebar();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    window.location.href = '/api/auth/signout';
  };

  return (
    <aside
      className={`fixed left-0 top-0 h-screen ${
        isCollapsed ? 'w-20' : 'w-64'
      } bg-white text-gray-900 border-r border-gray-200 transition-all duration-300 flex flex-col z-40`}
    >
      {/* Sidebar Header with Logo */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        {!isCollapsed && (
          <Link href="/" className="flex items-center gap-2 flex-1">
            <span className="text-lg font-black leading-none bg-gradient-to-r from-[#008200] to-[#00B300] bg-clip-text text-transparent">
              studyexpress
            </span>
          </Link>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 hover:bg-gray-100 rounded transition-colors ml-auto"
          title={isCollapsed ? 'Expand' : 'Collapse'}
        >
          {isCollapsed ? '→' : '←'}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <style>{`
          nav::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        <div className="space-y-0.5 px-2">
          {navItems.map((item) => {
            // Make Dashboard exact match only, other items can have sub-paths
            const isActive = item.href === '/corporate' 
              ? pathname === item.href 
              : (pathname === item.href || pathname.startsWith(item.href + '/'));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all group relative ${
                  isActive
                    ? 'text-[#008200] bg-green-50 border-l-4 border-[#008200]'
                    : 'text-gray-800 hover:text-[#008200] hover:bg-gray-100'
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                <span className="text-lg flex-shrink-0">{item.icon}</span>
                {!isCollapsed && (
                  <span className="font-medium">{item.label}</span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Sidebar Footer */}
      <div className="border-t border-gray-200 p-3">
        <CorporateLogoutButton collapsed={isCollapsed} />
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full mx-4 overflow-hidden animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-8 text-white text-center">
              <div className="text-5xl mb-4">👋</div>
              <h2 className="text-2xl font-black">Ready to leave?</h2>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-6">
              <p className="text-gray-600 text-center mb-2">
                Are you sure you want to sign out?
              </p>
              <p className="text-gray-500 text-sm text-center">
                You'll need to log in again to access your corporate dashboard.
              </p>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-4 flex gap-3 border-t border-gray-200">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg font-semibold transition-colors duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
