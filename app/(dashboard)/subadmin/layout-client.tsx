'use client';

import { SubAdminSidebar } from '@/components/SubAdminSidebar';
import { useSidebar } from '@/context/SidebarContext';
import { usePathname } from 'next/navigation';

export default function SubAdminLayoutClient({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar();
  const pathname = usePathname();

  // Remove padding for messages page (full screen chat)
  const isMessagesPage = pathname?.includes('/subadmin/messages');

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Fixed Sidebar */}
      <SubAdminSidebar />

      {/* Main Content with responsive margin for sidebar */}
      <main className={`flex-1 min-h-screen overflow-y-auto transition-all duration-300 pt-16 md:pt-0 ${isCollapsed ? 'md:ml-20' : 'md:ml-64'}`}>
        <div className={isMessagesPage ? '' : 'p-4 md:p-8'}>
          {children}
        </div>
      </main>
    </div>
  );
}
