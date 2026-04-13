'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { X } from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Courses',    href: '/courses' },
  { label: 'Events',     href: '/events' },
  { label: 'GRIP Programme', href: '/grip-programme' },
  { label: 'About',      href: '/about' },
];

function getDashboardHref(role?: string) {
  switch (role) {
    case 'INDIVIDUAL': return '/individual';
    case 'CORPORATE':  return '/corporate';
    case 'SUBADMIN':   return '/subadmin';
    case 'STAFF':      return '/individual';
    default:           return '/admin';
  }
}

export function Header() {
  const [isOpen,     setIsOpen    ] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobile,   setIsMobile  ] = useState(false);
  const { data: session }           = useSession();
  const pathname                    = usePathname();

  /* ── scroll listener ─────────────────────────────────────────────── */
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ── responsive breakpoint tracker ──────────────────────────────── */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  /* ── lock body scroll when mobile menu is open ───────────────────── */
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const isActive = (href: string) => pathname === href;

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
        background: isScrolled
          ? 'rgba(255,255,255,0.97)'
          : 'transparent',
        backdropFilter: isScrolled ? 'blur(16px)' : 'none',
        borderBottom: isScrolled ? '1px solid #e5e7eb' : '1px solid transparent',
        boxShadow: isScrolled ? '0 2px 20px rgba(0,0,0,0.06)' : 'none',
      }}
    >
      <div
        className="section-container"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: isScrolled ? 64 : 76, transition: 'height 0.3s ease' }}
      >
        {/* ── Logo ────────────────────────────────────────────────── */}
        <Link href="/" style={{ textDecoration: 'none', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ fontSize: '1.5rem', fontWeight: 900, lineHeight: 1, letterSpacing: '-0.02em' }}>
              <span style={{ color: '#008200' }}>study</span>
              <span style={{ color: '#0E3386' }}>express</span>
            </span>
            <span style={{
              fontSize: '0.6rem',
              fontWeight: 800,
              color: 'white',
              background: '#0E3386',
              padding: '2px 6px',
              borderRadius: 4,
              letterSpacing: '0.05em',
              lineHeight: 1,
            }}>UK</span>
          </div>
        </Link>

        {/* ── Desktop Navigation (hidden on mobile) ───────────────────── */}
        {!isMobile && <nav style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              style={{
                padding: '8px 16px',
                borderRadius: 8,
                fontSize: '0.875rem',
                fontWeight: isActive(item.href) ? 700 : 500,
                color: isActive(item.href) ? '#008200' : '#374151',
                background: isActive(item.href) ? '#f0faf0' : 'transparent',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => { if (!isActive(item.href)) (e.currentTarget as HTMLAnchorElement).style.color = '#008200'; }}
              onMouseLeave={e => { if (!isActive(item.href)) (e.currentTarget as HTMLAnchorElement).style.color = '#374151'; }}
            >
              {item.label}
            </Link>
          ))}
        </nav>}

        {/* ── Auth Buttons ────────────────────────────────────────── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {!session ? (
            <>
              {!isMobile && (
                <Link
                  href="/auth/signin"
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: '#374151',
                    textDecoration: 'none',
                    padding: '8px 16px',
                    transition: 'color 0.2s',
                  }}
                >
                  Sign In
                </Link>
              )}
              {!isMobile && (
                <Link
                  href="/auth/signup"
                  className="btn-primary"
                  style={{ padding: '9px 20px', fontSize: '0.85rem', borderRadius: 8 }}
                >
                  Get Started
                </Link>
              )}
            </>
          ) : (
            <Link
              href={getDashboardHref(session?.user?.role as string)}
              className="btn-primary"
              style={{ padding: '9px 20px', fontSize: '0.85rem', borderRadius: 8 }}
            >
              Dashboard →
            </Link>
          )}

          {/* Mobile hamburger – only rendered on mobile */}
          {isMobile && (
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
              style={{
                padding: 8,
                borderRadius: 8,
                background: 'transparent',
                border: '1.5px solid #e5e7eb',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#374151',
                transition: 'all 0.2s',
              }}
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                {isOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* ── Mobile Drawer ──────────────────────────────────────────── */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[110] bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="absolute top-0 right-0 w-[85%] max-w-sm h-full bg-white shadow-2xl flex flex-col p-6 animate-in slide-in-from-right duration-300"
            onClick={e => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-100">
               <div className="flex items-center gap-2">
                 <span className="text-xl font-black tracking-tighter">
                   <span className="text-[#008200]">study</span>
                   <span className="text-[#0E3386]">express</span>
                 </span>
               </div>
               <button 
                 onClick={() => setIsOpen(false)}
                 className="p-2 bg-gray-50 rounded-full text-gray-400 hover:text-gray-900 transition-colors"
               >
                 <X size={20} />
               </button>
            </div>

            {/* Links */}
            <nav className="flex flex-col gap-2 mb-8">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`px-4 py-3 rounded-xl text-lg font-bold transition-all ${
                    isActive(item.href) 
                    ? 'bg-[#008200]/5 text-[#008200] border-l-4 border-[#008200]' 
                    : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Auth Buttons */}
            <div className="mt-auto space-y-3 pt-6 border-t border-gray-100">
              {!session ? (
                <>
                  <Link
                    href="/auth/signin"
                    onClick={() => setIsOpen(false)}
                    className="w-full h-14 flex items-center justify-center rounded-xl border-2 border-gray-100 text-gray-700 font-bold hover:bg-gray-50 transition-all"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/signup"
                    onClick={() => setIsOpen(false)}
                    className="w-full h-14 flex items-center justify-center rounded-xl bg-[#008200] text-white font-bold hover:bg-[#006600] transition-all"
                  >
                    Get Started
                  </Link>
                </>
              ) : (
                <Link
                  href={getDashboardHref(session?.user?.role as string)}
                  onClick={() => setIsOpen(false)}
                  className="w-full h-14 flex items-center justify-center rounded-xl bg-[#0E3386] text-white font-bold hover:opacity-90 transition-all"
                >
                  Dashboard →
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
      {/* no CSS hack needed — visibility driven by isMobile state */}
    </header>
  );
}
