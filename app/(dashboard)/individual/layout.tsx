import { redirect } from 'next/navigation';
import { getServerAuthSession } from '@/server/auth/session';
import { IndividualSidebar } from '@/components/individual/IndividualSidebar';
import { SidebarProvider } from '@/context/SidebarContext';
import IndividualLayoutClient from './layout-client';

export default async function IndividualLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerAuthSession();

  if (!session || !['INDIVIDUAL', 'STAFF'].includes(session.user?.role || '')) {
    redirect('/auth/signin');
  }

  return (
    <SidebarProvider>
      <IndividualLayoutClient>{children}</IndividualLayoutClient>
    </SidebarProvider>
  );
}
