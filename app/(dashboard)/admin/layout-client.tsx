'use client';

import { AdminSidebar } from '@/components/AdminSidebar';
import { useSidebar } from '@/context/SidebarContext';

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Fixed Sidebar */}
      <AdminSidebar />

      {/* Main Content with responsive margin for sidebar */}
      <main className={`flex-1 min-h-screen overflow-y-auto transition-all duration-300 ${isCollapsed ? 'md:ml-20' : 'md:ml-64'}`}>
        <div className="p-4 md:p-8">
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-6 md:mb-8">Admin</h1>
          {children}
        </div>
      </main>
    </div>
  );
}
