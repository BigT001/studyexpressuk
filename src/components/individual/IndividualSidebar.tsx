'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { signOut } from 'next-auth/react';
import { useSidebar } from '@/context/SidebarContext';

interface NavItem {
  icon: string;
  label: string;
  href: string;
  badge?: number;
}

const navItems: NavItem[] = [
  {
    icon: '🏠',
    label: 'Dashboard',
    href: '/individual',
  },
  {
    icon: '👤',
    label: 'Profile',
    href: '/individual/profile',
  },
  {
    icon: '💳',
    label: 'Memberships',
    href: '/individual/memberships',
  },
  {
    icon: '📚',
    label: 'Enrollments',
    href: '/individual/enrollments',
  },
  {
    icon: '🎫',
    label: 'Events',
    href: '/individual/events',
  },
  {
    icon: '💬',
    label: 'Messages',
    href: '/individual/messages',
  },
  {
    icon: '📢',
    label: 'Announcements',
    href: '/individual/announcements',
  },
  {
    icon: '🔔',
    label: 'Notifications',
    href: '/individual/notifications',
  },
  {
    icon: '⚙️',
    label: 'Settings',
    href: '/individual/settings',
  },
];

export function IndividualSidebar() {
  const pathname = usePathname();
  const { isCollapsed, setIsCollapsed } = useSidebar();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: '/auth/signin' });
  };

  // Mobile drawer overlay
  if (isMobile) {
    return (
      <>
        {/* Mobile Header with Hamburger */}
        <div className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-50 lg:hidden">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-lg font-black leading-none bg-gradient-to-r from-[#008200] to-[#00B300] bg-clip-text text-transparent">
              studyexpress
            </span>
          </Link>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 hover:bg-gray-100 rounded transition-colors"
            title="Menu"
          >
            {isMobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile Sidebar Drawer */}
        {isMobileMenuOpen && (
          <>
            {/* Overlay */}
            <div 
              className="fixed inset-0 bg-transparent backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            {/* Drawer */}
            <aside className="fixed left-0 top-16 bottom-0 w-72 bg-white text-gray-900 border-r border-gray-200 flex flex-col z-40 lg:hidden overflow-y-auto">
              {/* Navigation */}
              <nav className="flex-1 overflow-y-auto py-4 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                <style>{`
                  nav::-webkit-scrollbar {
                    display: none;
                  }
                `}</style>
                <div className="space-y-0.5 px-2">
                  {navItems.map((item) => {
                    const isActive = item.href === '/individual' 
                      ? pathname === item.href 
                      : (pathname === item.href || pathname.startsWith(item.href + '/'));
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all group relative ${
                          isActive
                            ? 'text-[#008200] bg-green-50 border-l-4 border-[#008200]'
                            : 'text-gray-800 hover:text-[#008200] hover:bg-gray-100'
                        }`}
                      >
                        <span className="text-xl flex-shrink-0">{item.icon}</span>
                        <span className="font-medium">{item.label}</span>
                        {item.badge && (
                          <span className="ml-auto bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </nav>

              {/* Sidebar Footer */}
              <div className="border-t border-gray-200 p-3">
                <button
                  onClick={() => {
                    setShowLogoutModal(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-800 hover:text-red-600 hover:bg-red-50 transition-all w-full"
                >
                  <span className="text-xl flex-shrink-0">🚪</span>
                  <span className="font-medium">Sign Out</span>
                </button>
              </div>
            </aside>
          </>
        )}

        {/* Logout Confirmation Modal */}
        {showLogoutModal && (
          <div className="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full mx-4 overflow-hidden animate-in fade-in zoom-in-95">
              <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-8 text-white text-center">
                <div className="text-5xl mb-4">👋</div>
                <h2 className="text-2xl font-black">Ready to leave?</h2>
              </div>
              <div className="px-6 py-6">
                <p className="text-gray-600 text-center mb-2">
                  Are you sure you want to sign out?
                </p>
                <p className="text-gray-500 text-sm text-center">
                  You'll need to log in again to access your account.
                </p>
              </div>
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
      </>
    );
  }

  // Desktop Sidebar (unchanged, works on tablets too)
  return (
    <aside
      className={`hidden lg:flex fixed left-0 top-0 h-screen ${
        isCollapsed ? 'w-20' : 'w-64'
      } bg-white text-gray-900 border-r border-gray-200 transition-all duration-300 flex-col z-40`}
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
            const isActive = item.href === '/individual' 
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
                  <>
                    <span className="font-medium">{item.label}</span>
                    {item.badge && (
                      <span className="ml-auto bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Sidebar Footer */}
      <div className="border-t border-gray-200 p-3">
        <button
          onClick={() => setShowLogoutModal(true)}
          className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-800 hover:text-red-600 hover:bg-red-50 transition-all w-full"
          title={isCollapsed ? 'Sign Out' : undefined}
        >
          <span className="text-lg flex-shrink-0">🚪</span>
          {!isCollapsed && <span className="font-medium">Sign Out</span>}
        </button>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center z-50">
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
                You'll need to log in again to access your account.
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
