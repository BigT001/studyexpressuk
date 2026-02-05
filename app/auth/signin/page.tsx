'use client';

import { useState, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const message = searchParams?.get('message');
  // Default redirect based on user role (will be set after auth)
  const callbackUrl = searchParams?.get('callbackUrl') || null;

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (message) setError(''); // Clear success message when user starts typing
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (message) setError(''); // Clear success message when user starts typing
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      console.log('[SignIn] Starting signin with email:', email);
      
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      console.log('[SignIn] Result:', result);

      if (result?.error) {
        console.log('[SignIn] Auth error:', result.error);
        setError('Invalid email or password. Please try again.');
        setIsLoading(false);
      } else if (result?.ok) {
        console.log('[SignIn] Auth successful, redirecting based on role');
        // Wait briefly for session cookie to be set, then fetch user info
        setTimeout(async () => {
          try {
            const response = await fetch('/api/users/me');
            const data = await response.json();
            
            if (data.success && data.user) {
              const userRole = data.user.role;
              console.log('[SignIn] User role:', userRole);
              
              // Redirect based on user role
              let redirectPath = '/individual'; // default for INDIVIDUAL
              if (userRole === 'STAFF') {
                redirectPath = '/staff';
              } else if (userRole === 'CORPORATE') {
                redirectPath = '/corporate';
              } else if (userRole === 'ADMIN') {
                redirectPath = '/admin';
              } else if (userRole === 'SUB_ADMIN') {
                redirectPath = '/subadmin';
              }
              
              console.log('[SignIn] Redirecting to:', callbackUrl || redirectPath);
              window.location.href = callbackUrl || redirectPath;
            } else {
              // Fallback if user fetch fails
              window.location.href = callbackUrl || '/individual';
            }
          } catch (err) {
            console.error('[SignIn] Error fetching user:', err);
            // Fallback to individual if fetch fails
            window.location.href = callbackUrl || '/individual';
          }
        }, 500);
      } else {
        console.log('[SignIn] Unexpected response:', result);
        setError('Signin failed. Please try again.');
        setIsLoading(false);
      }
    } catch (err: unknown) {
      console.error('[SignIn] Caught error:', err);
      setError('An error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-gray-900 mb-2">Sign In</h1>
          <p className="text-gray-600">Access your account</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          {message && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-600 font-medium">{message}</p>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600 font-medium">Error</p>
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="you@example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008200] focus:border-transparent transition-all"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-900 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={handlePasswordChange}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008200] focus:border-transparent transition-all"
                required
              />
            </div>

            {/* Remember Me & Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
                <span className="text-gray-600">Remember me</span>
              </label>
              <Link href="/auth/forgot-password" className="text-[#008200] hover:text-[#006b00] font-semibold">
                Forgot password?
              </Link>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-3 bg-gradient-to-r from-[#008200] to-[#00B300] text-white font-bold rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Sign Up Link */}
          <p className="text-center text-gray-600 text-sm mt-6">
            Don't have an account?{' '}
            <Link href="/auth/signup" className="text-[#008200] hover:text-[#006b00] font-bold">
              Sign up here
            </Link>
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-600 text-xs mt-6">
          By signing in, you agree to our{' '}
          <Link href="/terms" className="text-[#008200] hover:underline">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="text-[#008200] hover:underline">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}
export default function SignIn() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-white via-white to-white" />}>
      <SignInForm />
    </Suspense>
  );
}