'use client';

import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';

export function DashboardNav() {
  const { data: session } = useSession();

  if (!session) return null;

  return (
    <nav className="border-b bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-blue-600">
          Study Express UK
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            {session.user?.email} ({session.user?.role})
          </span>
          <button
            onClick={() => signOut()}
            className="px-3 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700"
          >
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  );
}
