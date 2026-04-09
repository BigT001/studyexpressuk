'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';

const NAV_ITEMS = [
  { label: 'Courses',    href: '/courses' },
  { label: 'Events',     href: '/events' },
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
              <Link
                href="/auth/signup"
                className="btn-primary"
                style={{ padding: '9px 20px', fontSize: '0.85rem', borderRadius: 8 }}
              >
                Get Started
              </Link>
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
        <div style={{
          position: 'fixed',
          inset: 0,
          top: 0,
          zIndex: 99,
          background: 'rgba(0,0,0,0.4)',
          backdropFilter: 'blur(4px)',
        }} onClick={() => setIsOpen(false)}>
          <div
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: 300,
              height: '100vh',
              background: 'white',
              padding: '80px 24px 32px',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              boxShadow: '-8px 0 40px rgba(0,0,0,0.15)',
            }}
            onClick={e => e.stopPropagation()}
          >
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                style={{
                  padding: '12px 16px',
                  borderRadius: 10,
                  fontSize: '1rem',
                  fontWeight: isActive(item.href) ? 700 : 500,
                  color: isActive(item.href) ? '#008200' : '#374151',
                  background: isActive(item.href) ? '#f0faf0' : 'transparent',
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                }}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}

            <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {!session ? (
                <>
                  <Link
                    href="/auth/signin"
                    className="btn-secondary"
                    style={{ justifyContent: 'center' }}
                    onClick={() => setIsOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="btn-primary"
                    style={{ justifyContent: 'center' }}
                    onClick={() => setIsOpen(false)}
                  >
                    Get Started
                  </Link>
                </>
              ) : (
                <Link
                  href={getDashboardHref(session?.user?.role as string)}
                  className="btn-primary"
                  style={{ justifyContent: 'center' }}
                  onClick={() => setIsOpen(false)}
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
