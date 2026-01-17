'use client';

import { useSidebar } from '@/context/SidebarContext';
import { CorporateSidebar } from '@/components/CorporateSidebar';
import { usePathname } from 'next/navigation';

export default function CorporateDashboardLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isCollapsed } = useSidebar();
  const pathname = usePathname();
  
  // Remove padding for messages page (full screen chat)
  const isMessagesPage = pathname?.includes('/corporate/messages');

  return (
    <div className="flex h-screen bg-gray-50">
      <CorporateSidebar />

      {/* Main Content */}
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${
        isCollapsed ? 'ml-20' : 'ml-64'
      }`}>
        {/* Content */}
        <div className={isMessagesPage ? 'flex-1 overflow-hidden' : 'flex-1 overflow-y-auto'}>
          {children}
        </div>
      </div>
    </div>
  );
}
