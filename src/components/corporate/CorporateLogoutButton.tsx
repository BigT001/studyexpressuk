'use client';

import { signOut } from 'next-auth/react';
import { useState } from 'react';

export default function CorporateLogoutButton({ collapsed = false }: { collapsed?: boolean }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    await signOut({ redirect: true, callbackUrl: '/auth/signin' });
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-gray-800 hover:text-red-600 hover:bg-red-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      title={collapsed ? 'Sign Out' : undefined}
    >
      <span className="text-lg flex-shrink-0">🚪</span>
      {!collapsed && <span className="font-medium">{isLoading ? 'Signing out...' : 'Sign Out'}</span>}
    </button>
  );
}
