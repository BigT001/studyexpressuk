import { redirect } from 'next/navigation';
import { getServerAuthSession } from '@/server/auth/session';
import { SidebarProvider } from '@/context/SidebarContext';
import CorporateDashboardLayoutClient from './layout-client';

export default async function CorporateDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session: any = await getServerAuthSession();

  // Verify user is authenticated and has CORPORATE role
  if (!session || session.user?.role !== 'CORPORATE') {
    console.log('[Corporate Layout] Auth failed - session:', session ? 'exists' : 'missing', 'role:', session?.user?.role);
    redirect('/auth/signin');
  }

  return (
    <SidebarProvider>
      <CorporateDashboardLayoutClient>{children}</CorporateDashboardLayoutClient>
    </SidebarProvider>
  );
}
