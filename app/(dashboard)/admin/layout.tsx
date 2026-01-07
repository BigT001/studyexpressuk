import { redirect } from 'next/navigation';
import { getServerAuthSession } from '@/server/auth/session';
import { AdminSidebar } from '@/components/AdminSidebar';
import { SidebarProvider } from '@/context/SidebarContext';
import AdminLayoutClient from './layout-client';

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const session: any = await getServerAuthSession();

  if (!session || session.user?.role !== 'ADMIN') {
    redirect('/auth/signin');
  }

  return (
    <SidebarProvider>
      <AdminLayoutClient>{children}</AdminLayoutClient>
    </SidebarProvider>
  );
}
