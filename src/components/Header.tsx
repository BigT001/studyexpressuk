'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const menuItems = [
    { label: 'Courses', href: '/courses' },
    { label: 'Events', href: '/events' },
    { label: 'About', href: '/about' },
  ];

  const isActive = (href: string) => {
    return pathname === href;
  };

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${isScrolled
        ? 'bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm'
        : 'bg-transparent border-transparent'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex items-center justify-between transition-all duration-300 ${isScrolled ? 'h-16' : 'h-20'}`}>
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <div className="flex items-center gap-0.5">
              <span className="text-2xl font-black leading-none">
                <span style={{ color: '#008200' }}>study</span><span style={{ color: '#0E3386' }}>express</span>
              </span>
              <span className="text-xs font-bold text-gray-700">UK</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 flex-1 ml-12">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`text-sm font-medium transition-all relative group ${isActive(item.href)
                  ? 'text-blue-600 border-b-2 border-blue-600 pb-1'
                  : 'text-gray-700 hover:text-gray-900'
                  }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Search Bar */}
          <div className="hidden sm:flex flex-1 mx-8 max-w-md">
            <div className="w-full relative">
              <input
                type="text"
                placeholder="Search courses and events..."
                className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              <svg
                className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Right Section - Auth or Profile */}
          <div className="flex items-center gap-4">
            {!session ? (
              <>
                <Link
                  href="/auth/signin"
                  className="hidden sm:block text-sm font-bold text-gray-700 hover:text-gray-900 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="px-4 py-2 text-sm font-bold text-white rounded hover:opacity-90 transition-colors"
                  style={{ backgroundColor: '#008200' }}
                >
                  Get Started
                </Link>
              </>
            ) : (
              <Link
                href={
                  session?.user?.role === 'INDIVIDUAL'
                    ? '/individual'
                    : session?.user?.role === 'CORPORATE'
                      ? '/corporate'
                      : session?.user?.role === 'SUBADMIN'
                        ? '/subadmin'
                        : session?.user?.role === 'STAFF'
                          ? '/individual'
                          : '/admin'
                }
                className="px-4 py-2 text-sm font-bold text-white hover:opacity-90 rounded-lg transition-colors"
                style={{ backgroundColor: '#008200' }}
              >
                Dashboard
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg text-gray-800 hover:bg-gray-100"
              aria-label="Toggle menu"
            >
              <svg
                className={`w-6 h-6 transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-200 py-4">
          <div className="max-w-7xl mx-auto px-4 space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`block px-3 py-2 text-base font-medium rounded transition-colors ${isActive(item.href)
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-50'
                  }`}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-gray-200 flex gap-2">
              {!session ? (
                <>
                  <Link
                    href="/auth/signin"
                    className="flex-1 text-center px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-100 rounded transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="flex-1 text-center px-4 py-2 text-sm font-bold text-white rounded transition-colors"
                    style={{ backgroundColor: '#008200' }}
                    onClick={() => setIsOpen(false)}
                  >
                    Get Started
                  </Link>
                </>
              ) : (
                <Link
                  href={
                    session?.user?.role === 'INDIVIDUAL'
                      ? '/individual'
                      : session?.user?.role === 'CORPORATE'
                        ? '/corporate'
                        : session?.user?.role === 'SUBADMIN'
                          ? '/subadmin'
                          : session?.user?.role === 'STAFF'
                            ? '/individual'
                            : '/admin'
                  }
                  className="flex-1 text-center px-4 py-2 text-sm font-bold text-white rounded transition-colors"
                  style={{ backgroundColor: '#008200' }}
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
