'use client';

import { usePathname } from 'next/navigation';
import { SessionProvider } from '@/components/SessionProvider';
import { Header } from '@/components/Header';

/* Routes where the public header is hidden (dashboard areas) */
const DASHBOARD_PREFIXES = ['/dashboard', '/admin', '/individual', '/corporate', '/subadmin'];

import { Toaster } from 'react-hot-toast';

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard = DASHBOARD_PREFIXES.some((prefix) => pathname?.startsWith(prefix));

  return (
    <SessionProvider>
      <Toaster position="top-center" reverseOrder={false} />
      {!isDashboard && <Header />}
      <main style={{ minHeight: '100vh' }}>{children}</main>
    </SessionProvider>
  );
}
