'use client';

import { signOut } from 'next-auth/react';
import { useState } from 'react';

export default function LogoutButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    await signOut({ redirect: true, callbackUrl: '/auth/signin' });
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className="px-6 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-semibold hover:shadow-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
    >
      🚪 {isLoading ? 'Signing out...' : 'Sign Out'}
    </button>
  );
}
