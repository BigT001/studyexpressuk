'use client';

import { IndividualSidebar } from '@/components/individual/IndividualSidebar';
import { useSidebar } from '@/context/SidebarContext';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function IndividualLayoutClient({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar();
  const pathname = usePathname();
  const isDashboardHome = pathname === '/individual';
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <IndividualSidebar />
      
      {/* Main Content Area */}
      <main className={`min-h-screen transition-all duration-300 ${
        isMobile 
          ? 'pt-16' // Mobile: space for top header
          : isCollapsed ? 'ml-20' : 'ml-64' // Desktop: space for sidebar
      }`}>
        <div className="p-4 md:p-6 lg:p-8">
          {/* Removed My Dashboard header and description */}
          {children}
        </div>
      </main>
    </div>
  );
}
