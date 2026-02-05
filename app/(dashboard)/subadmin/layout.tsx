import { redirect } from 'next/navigation';
import { getServerAuthSession } from '@/server/auth/session';
import { SidebarProvider } from '@/context/SidebarContext';
import SubAdminDashboardLayoutClient from './layout-client';

export default async function SubAdminLayout({ children }: { children: React.ReactNode }) {
  const session: any = await getServerAuthSession();

  // Verify user is authenticated and has SUB_ADMIN role
  if (!session || session.user?.role !== 'SUB_ADMIN') {
    console.log('[SubAdmin Layout] Auth failed - session:', session ? 'exists' : 'missing', 'role:', session?.user?.role);
    redirect('/auth/signin');
  }

  return (
    <SidebarProvider>
      <SubAdminDashboardLayoutClient>{children}</SubAdminDashboardLayoutClient>
    </SidebarProvider>
  );
}
