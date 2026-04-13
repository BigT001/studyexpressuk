import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useSidebar } from '@/context/SidebarContext';
import CorporateLogoutButton from '@/components/corporate/CorporateLogoutButton';
import { motion, AnimatePresence } from 'framer-motion';

interface NavItem {
  icon: string;
  label: string;
  href: string;
  badge?: 'messages' | 'announcements';
}

const navItems: NavItem[] = [
  { icon: '📊', label: 'Dashboard', href: '/corporate' },
  { icon: '🏢', label: 'Profile', href: '/corporate/profile' },
  { icon: '💳', label: 'Memberships', href: '/corporate/memberships' },
  { icon: '👥', label: 'Staff Management', href: '/corporate/staff' },
  { icon: '📚', label: 'Training & Courses', href: '/corporate/courses' },
  { icon: '📅', label: 'Events', href: '/corporate/events' },
  { icon: '💬', label: 'Messages', href: '/corporate/messages', badge: 'messages' },
  { icon: '📢', label: 'Announcements', href: '/corporate/announcements', badge: 'announcements' },
  { icon: '⚙️', label: 'Settings', href: '/corporate/settings' },
];

export function CorporateSidebar() {
  const pathname = usePathname();
  const { isCollapsed, setIsCollapsed } = useSidebar();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [messageBadge, setMessageBadge] = useState(0);
  const [announcementBadge, setAnnouncementBadge] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

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

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const [messagesRes, announcementsRes] = await Promise.all([
          fetch('/api/corporate/messages/count'),
          fetch('/api/corporate/announcements/count'),
        ]);

        if (messagesRes.ok) {
          const data = await messagesRes.json();
          setMessageBadge(data.count || 0);
        }
        if (announcementsRes.ok) {
          const data = await announcementsRes.json();
          setAnnouncementBadge(data.count || 0);
        }
      } catch (error) {
        console.error('Error fetching badge counts:', error);
      }
    };

    fetchBadges();
    const interval = setInterval(fetchBadges, 5000);
    return () => clearInterval(interval);
  }, []);

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

        <nav className="flex-1 overflow-y-auto py-4 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <style>{`
            nav::-webkit-scrollbar { display: none; }
          `}</style>
          <div className="space-y-0.5 px-2">
            {navItems.map((item) => {
              const isActive = item.href === '/corporate'
                ? pathname === item.href
                : (pathname === item.href || pathname.startsWith(item.href + '/'));

              let badgeCount = 0;
              if (item.badge === 'messages') badgeCount = messageBadge;
              else if (item.badge === 'announcements') badgeCount = announcementBadge;

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
                      <span className="font-medium flex-1">{item.label}</span>
                      {badgeCount > 0 && (
                        <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 rounded-full ml-auto">
                          {badgeCount > 99 ? '99+' : badgeCount}
                        </span>
                      )}
                    </>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="border-t border-gray-200 p-3">
          <CorporateLogoutButton collapsed={isCollapsed} />
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
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-[45]"
              onClick={() => setShowMobileMenu(false)}
            />
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

              <nav className="flex-1 py-6 px-4">
                <div className="space-y-1">
                  {navItems.map((item) => {
                    const isActive = item.href === '/corporate'
                      ? pathname === item.href
                      : (pathname === item.href || pathname.startsWith(item.href + '/'));

                    let badgeCount = 0;
                    if (item.badge === 'messages') badgeCount = messageBadge;
                    else if (item.badge === 'announcements') badgeCount = announcementBadge;

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
                        {badgeCount > 0 && (
                          <span className="ml-auto inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 rounded-full">
                            {badgeCount > 99 ? '99+' : badgeCount}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </nav>

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

      <AnimatePresence>
        {showLogoutModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[32px] shadow-2xl max-w-sm w-full overflow-hidden"
            >
              <div className="bg-gradient-to-br from-red-500 to-red-600 px-6 py-10 text-white text-center">
                <div className="text-6xl mb-4">👋</div>
                <h2 className="text-3xl font-black tracking-tight">Ready to leave?</h2>
              </div>
              <div className="px-8 py-8">
                <p className="text-gray-600 text-center text-lg font-medium leading-relaxed mb-1">
                  Are you sure you want to sign out?
                </p>
                <p className="text-gray-400 text-sm text-center">
                  You'll need to log in again to access your corporate dashboard.
                </p>
              </div>
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
