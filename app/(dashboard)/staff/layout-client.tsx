'use client';

import { usePathname } from 'next/navigation';
import { StaffSidebar } from '@/components/staff/StaffSidebar';

export default function StaffLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isMessagesPage = pathname?.includes('/staff/messages');

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <StaffSidebar />
      
      {/* Main Content */}
      <div className={`flex-1 flex flex-col overflow-hidden lg:ml-64 transition-all duration-300`}>
        {/* Mobile header spacing */}
        <div className="h-16 lg:hidden flex-shrink-0" />
        
        {/* Content area */}
        <div className={`flex-1 overflow-auto ${isMessagesPage ? 'overflow-hidden' : 'overflow-y-auto'}`}>
          {children}
        </div>
      </div>
    </div>
  );
}
