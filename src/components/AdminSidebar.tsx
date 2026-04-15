import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useSidebar } from '@/context/SidebarContext';
import { motion, AnimatePresence } from 'framer-motion';

interface NavItem {
  icon: string;
  label: string;
  href: string;
  badge?: number;
}

const navItems: NavItem[] = [
  { icon: '📊', label: 'Dashboard', href: '/admin' },
  { icon: '👥', label: 'Users', href: '/admin/users' },
  { icon: '📅', label: 'Events', href: '/admin/events' },
  { icon: '📚', label: 'Courses', href: '/admin/courses' },
  { icon: '💳', label: 'Memberships', href: '/admin/memberships' },
  { icon: '📢', label: 'Announcements', href: '/admin/communications' },
  { icon: '💬', label: 'Messages', href: '/admin/messages' },
  { icon: '💰', label: 'Payments', href: '/admin/payments' },
  { icon: '📊', label: 'Analytics', href: '/admin/analytics' },
  { icon: '⚙️', label: 'Settings', href: '/admin/settings' },
  { icon: '🌍', label: 'GRIP Edits', href: '/admin/grip-content' },
  { icon: '🔑', label: 'Sub-Admins', href: '/admin/subadmins' },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { isCollapsed, setIsCollapsed } = useSidebar();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile on mount and window resize
  useEffect(() => {
    const checkIsMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) setShowMobileMenu(false);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Body lock for mobile menu
  useEffect(() => {
    if (showMobileMenu) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [showMobileMenu]);

  const handleLogout = () => {
    window.location.href = '/api/auth/signout';
  };

  const handleNavClick = () => {
    if (isMobile) {
      setShowMobileMenu(false);
    }
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex fixed left-0 top-0 h-screen ${isCollapsed ? 'w-20' : 'w-64'
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
              const isActive = item.href === '/admin'
                ? pathname === item.href
                : (pathname === item.href || pathname.startsWith(item.href + '/'));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all group relative ${isActive
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
      </aside>

      {/* Mobile Header (Dashboard) */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-40">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-base font-black bg-gradient-to-r from-[#008200] to-[#00B300] bg-clip-text text-transparent">
            studyexpress
          </span>
        </Link>
        <button
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          className="p-2.5 hover:bg-gray-50 rounded-xl border border-gray-100 transition-all active:scale-90"
          title="Menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showMobileMenu ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>

      {/* Mobile Menu Content */}
      <AnimatePresence>
        {showMobileMenu && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-[45]"
              onClick={() => setShowMobileMenu(false)}
            />
            {/* Mobile Menu Panel */}
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-[80%] max-w-sm bg-white border-r border-gray-200 flex flex-col z-50 shadow-2xl overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                 <span className="text-xl font-black bg-gradient-to-r from-[#008200] to-[#00B300] bg-clip-text text-transparent">
                   studyexpress
                 </span>
                 <button 
                   onClick={() => setShowMobileMenu(false)}
                   className="p-2 bg-gray-200/50 rounded-full text-gray-600"
                 >
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                   </svg>
                 </button>
              </div>

              {/* Navigation */}
              <nav className="flex-1 py-6 px-4">
                <div className="space-y-1">
                  {navItems.map((item) => {
                    const isActive = item.href === '/admin'
                      ? pathname === item.href
                      : (pathname === item.href || pathname.startsWith(item.href + '/'));
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={handleNavClick}
                        className={`flex items-center gap-4 px-4 py-4 rounded-xl font-bold transition-all ${isActive
                          ? 'text-[#008200] bg-green-50 border-l-4 border-[#008200] shadow-sm'
                          : 'text-gray-700 hover:text-[#008200] hover:bg-gray-50'
                          }`}
                      >
                        <span className="text-xl flex-shrink-0">{item.icon}</span>
                        <span className="text-lg">{item.label}</span>
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

              {/* Mobile Menu Footer */}
              <div className="border-t border-gray-100 p-6 bg-gray-50/30">
                <button
                  onClick={() => {
                    setShowLogoutModal(true);
                    setShowMobileMenu(false);
                  }}
                  className="flex items-center gap-4 px-4 py-4 rounded-xl text-gray-800 font-bold hover:text-red-600 hover:bg-red-50 transition-all w-full border border-gray-200"
                >
                  <span className="text-xl flex-shrink-0">🚪</span>
                  <span className="text-lg">Sign Out</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[32px] shadow-2xl max-w-sm w-full overflow-hidden"
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-br from-red-500 to-red-600 px-6 py-10 text-white text-center">
                <div className="text-6xl mb-4">👋</div>
                <h2 className="text-3xl font-black tracking-tight">Ready to leave?</h2>
              </div>

              {/* Modal Body */}
              <div className="px-8 py-8">
                <p className="text-gray-600 text-center text-lg font-medium leading-relaxed mb-1">
                  Are you sure you want to sign out?
                </p>
                <p className="text-gray-400 text-sm text-center">
                  You'll need to log in again to access the admin dashboard.
                </p>
              </div>

              {/* Modal Footer */}
              <div className="px-8 pb-8 flex gap-3">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 px-4 py-4 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-2xl font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 px-4 py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-bold transition-all shadow-lg shadow-red-200"
                >
                  Sign Out
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
