'use client';

import { AdminSidebar } from '@/components/AdminSidebar';
import { useSidebar } from '@/context/SidebarContext';

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Sidebar */}
      <AdminSidebar />

      {/* Main Content with responsive margin for sidebar */}
      <main className={`min-h-screen overflow-y-auto transition-all duration-300 md:${isCollapsed ? 'ml-20' : 'ml-64'} pt-16 md:pt-0`}>
        <div className="p-4 md:p-8">
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-6 md:mb-8">Admin</h1>
          {children}
        </div>
      </main>
    </div>
  );
}
