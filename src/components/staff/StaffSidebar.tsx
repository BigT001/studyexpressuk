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
    icon: '🏢',
    label: 'Dashboard',
    href: '/staff',
  },
  {
    icon: '👥',
    label: 'Team',
    href: '/staff/team',
  },
  {
    icon: '📊',
    label: 'Reports',
    href: '/staff/reports',
  },
  {
    icon: '💬',
    label: 'Messages',
    href: '/staff/messages',
  },
  {
    icon: '📢',
    label: 'Announcements',
    href: '/staff/announcements',
  },
  {
    icon: '⚙️',
    label: 'Settings',
    href: '/staff/settings',
  },
];

export function StaffSidebar() {
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
                    const isActive = item.href === '/staff' 
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
                  onClick={() => setShowLogoutModal(true)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-all font-medium"
                >
                  <span className="text-lg">🚪</span>
                  Sign Out
                </button>
              </div>

              {/* Logout Confirmation Modal */}
              {showLogoutModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg p-6 shadow-xl max-w-sm">
                    <h2 className="text-lg font-bold text-gray-900 mb-2">Sign out?</h2>
                    <p className="text-gray-600 mb-6">Are you sure you want to sign out of your account?</p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setShowLogoutModal(false)}
                        className="flex-1 px-4 py-2 bg-gray-100 text-gray-900 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleLogout}
                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </aside>
          </>
        )}

        {/* End Mobile */}
      </>
    );
  }

  // Desktop sidebar
  return (
    <>
      <aside className={`hidden lg:flex flex-col fixed left-0 top-0 h-screen bg-white text-gray-900 border-r border-gray-200 transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-64'
      } z-40`}>
        {/* Logo */}
        <div className={`flex items-center justify-between h-16 px-4 border-b border-gray-200 flex-shrink-0 ${isCollapsed && 'justify-center'}`}>
          {!isCollapsed && (
            <Link href="/" className="flex items-center gap-2">
              <span className="text-lg font-black leading-none bg-gradient-to-r from-[#008200] to-[#00B300] bg-clip-text text-transparent">
                studyexpress
              </span>
            </Link>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 hover:bg-gray-100 rounded transition-colors"
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
          <div className={`space-y-0.5 ${isCollapsed ? 'px-1' : 'px-2'}`}>
            {navItems.map((item) => {
              const isActive = item.href === '/staff' 
                ? pathname === item.href 
                : (pathname === item.href || pathname.startsWith(item.href + '/'));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group relative ${isCollapsed ? 'justify-center' : ''} ${
                    isActive
                      ? 'text-[#008200] bg-green-50 border-l-4 border-[#008200]'
                      : 'text-gray-800 hover:text-[#008200] hover:bg-gray-100'
                  }`}
                  title={isCollapsed ? item.label : ''}
                >
                  <span className="text-xl flex-shrink-0">{item.icon}</span>
                  {!isCollapsed && <span className="font-medium text-sm">{item.label}</span>}
                  {!isCollapsed && item.badge && (
                    <span className="ml-auto bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                  {isCollapsed && item.badge && (
                    <span className="absolute -right-1 -top-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className={`border-t border-gray-200 ${isCollapsed ? 'p-2' : 'p-3'}`}>
          <button
            onClick={() => setShowLogoutModal(true)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-all font-medium ${isCollapsed ? 'justify-center' : ''}`}
            title={isCollapsed ? 'Sign Out' : ''}
          >
            <span className="text-lg flex-shrink-0">🚪</span>
            {!isCollapsed && <span className="text-sm">Sign Out</span>}
          </button>
        </div>

        {/* Logout Confirmation Modal */}
        {showLogoutModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 shadow-xl max-w-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-2">Sign out?</h2>
              <p className="text-gray-600 mb-6">Are you sure you want to sign out of your account?</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-900 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
