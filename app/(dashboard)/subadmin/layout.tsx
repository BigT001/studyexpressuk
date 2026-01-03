'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SidebarProvider } from '@/context/SidebarContext';
import SubAdminDashboardLayoutClient from './layout-client';

export default function SubAdminLayout({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/session');
        const session = await response.json();
        
        if (!session || session.user?.role !== 'SUB_ADMIN') {
          router.push('/auth/signin');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        router.push('/auth/signin');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#008200] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <SubAdminDashboardLayoutClient>{children}</SubAdminDashboardLayoutClient>
    </SidebarProvider>
  );
}
