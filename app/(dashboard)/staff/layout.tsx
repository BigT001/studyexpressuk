import { redirect } from 'next/navigation';
import { getServerAuthSession } from '@/server/auth/session';
import { SidebarProvider } from '@/context/SidebarContext';
import StaffLayoutClient from './layout-client';

export default async function StaffLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerAuthSession();

  // Only allow STAFF role - not INDIVIDUAL
  if (!session || session.user?.role !== 'STAFF') {
    redirect('/auth/signin');
  }

  return (
    <SidebarProvider>
      <StaffLayoutClient>{children}</StaffLayoutClient>
    </SidebarProvider>
  );
}
