'use client';

import { useState, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function AdminSignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const callbackUrl = searchParams?.get('callbackUrl') || '/admin';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Create a timeout promise
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Signin timeout')), 15000) // 15 second timeout
      );

      const signInPromise = signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      const result = await Promise.race([signInPromise, timeoutPromise]);

      if ((result as any)?.error) {
        setError('Invalid email or password. Please try again.');
        setIsLoading(false);
      } else if ((result as any)?.ok) {
        console.log('[AdminSignIn] Auth successful, redirecting to:', callbackUrl);
        // Use setTimeout to ensure state updates are processed
        setTimeout(() => router.push(callbackUrl), 100);
      } else {
        setError('Signin failed. Please try again.');
        setIsLoading(false);
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'An error occurred';
      if (errorMsg.includes('timeout')) {
        setError('Request timed out. Please check your connection and try again.');
      } else {
        setError('An error occurred. Please try again.');
      }
      console.error('Signin error:', err);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-white mb-2">Admin Sign In</h1>
          <p className="text-gray-300">Administrator Access</p>
        </div>

        {/* Card */}
        <div className="bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
              <p className="text-sm text-red-200">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-white mb-2">
                Admin Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008200] focus:border-transparent transition-all placeholder-gray-400"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-white mb-2">
                Admin Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008200] focus:border-transparent transition-all placeholder-gray-400"
                required
              />
            </div>

            {/* Remember Me */}
            <label className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4 rounded border-slate-600 bg-slate-700" />
              <span className="text-sm text-gray-300">Remember me</span>
            </label>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-3 bg-gradient-to-r from-[#008200] to-[#00B300] text-white font-bold rounded-lg hover:shadow-lg hover:shadow-[#008200]/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : 'Access Admin Portal'}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-700"></div>
            <span className="text-xs text-gray-400">ADMIN ONLY</span>
            <div className="flex-1 h-px bg-slate-700"></div>
          </div>

          {/* User Login Link */}
          <p className="text-center text-gray-400 text-sm">
            Not an admin?{' '}
            <Link href="/auth/signin" className="text-[#008200] hover:text-[#00B300] font-bold">
              Go to user login
            </Link>
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-xs mt-6">
          This portal is restricted to authorized administrators only.
          <br />
          Unauthorized access attempts may be logged.
        </p>
      </div>
    </div>
  );
}
export default function AdminSignIn() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />}>
      <AdminSignInForm />
    </Suspense>
  );
}