'use client';

import { IndividualSidebar } from '@/components/individual/IndividualSidebar';
import { useSidebar } from '@/context/SidebarContext';
import { usePathname } from 'next/navigation';

export default function IndividualLayoutClient({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar();
  const pathname = usePathname();
  const isDashboardHome = pathname === '/individual';

  return (
    <div className="min-h-screen bg-gray-50">
      <IndividualSidebar />
      
      {/* Main Content Area */}
      <main className={`min-h-screen transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-64'}`}>
        <div className="p-8">
          {isDashboardHome && (
            <div className="mb-4">
              <h1 className="text-4xl font-black text-gray-900">My Dashboard</h1>
              <p className="text-gray-600 mt-1">Track your progress and manage your learning.</p>
            </div>
          )}
          {children}
        </div>
      </main>
    </div>
  );
}
