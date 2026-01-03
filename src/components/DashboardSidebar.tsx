'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarLink {
  href: string;
  label: string;
}

export function DashboardSidebar({ links }: { links: SidebarLink[] }) {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-gray-50 border-r min-h-screen p-4">
      <nav className="space-y-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`block px-4 py-2 rounded text-sm ${
              pathname === link.href
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-200'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
