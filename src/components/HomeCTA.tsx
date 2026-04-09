'use client';

import { useScrollReveal } from '@/hooks/useScrollReveal';
import Link from 'next/link';

const STATS = [
  { num: '200+', label: 'Courses Available' },
  { num: '5K+',  label: 'Active Learners' },
  { num: '4.9★', label: 'Average Rating' },
];

export function HomeCTA() {
  useScrollReveal();

  return (
    <section style={{
      padding: 'clamp(60px, 8vw, 100px) 0',
      background: 'linear-gradient(135deg, #f0faf0 0%, #eef2fb 100%)',
      borderTop: '1px solid #e5e7eb',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Decorative blobs */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        backgroundImage: 'radial-gradient(circle at 10% 20%, rgba(0, 130, 0, 0.05) 0%, transparent 40%), radial-gradient(circle at 90% 80%, rgba(14, 51, 134, 0.05) 0%, transparent 40%)',
        pointerEvents: 'none',
      }} />

      <div
        className="section-container reveal reveal-up"
        style={{ textAlign: 'center', maxWidth: 680, position: 'relative' }}
      >
        <span
          className="section-label section-label-green"
          style={{ marginBottom: 20, display: 'inline-flex' }}
        >
          🚀 Get Started Today
        </span>

        <h2 style={{
          fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)',
          fontWeight: 900, letterSpacing: '-0.03em',
          color: '#111827', margin: '12px 0 16px', lineHeight: 1.1,
        }}>
          Ready to Transform
          <br />
          <span className="gradient-text-green">Your Learning Journey?</span>
        </h2>

        <p style={{
          fontSize: '1.05rem', color: '#6b7280', lineHeight: 1.7,
          margin: '0 auto 36px',
        }}>
          Join thousands of professionals advancing their careers with
          Study Express UK&apos;s expert-led courses and industry events.
        </p>

        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            href="/auth/signup"
            className="btn-primary"
            style={{ fontSize: '1rem', padding: '15px 32px' }}
          >
            Sign Up Free
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
          <Link
            href="/auth/signin"
            className="btn-secondary"
            style={{ fontSize: '1rem', padding: '14px 32px' }}
          >
            Sign In
          </Link>
        </div>

        {/* Social proof row */}
        <div style={{
          marginTop: 40, paddingTop: 32,
          borderTop: '1px solid #e5e7eb',
          display: 'flex', gap: 32, justifyContent: 'center', flexWrap: 'wrap',
        }}>
          {STATS.map((item, idx) => (
            <div key={item.label} style={{ textAlign: 'center', transitionDelay: `${0.1 * idx}s` }} className="reveal reveal-up">
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#008200' }}>{item.num}</div>
              <div style={{ fontSize: '0.78rem', color: '#9ca3af', marginTop: 2, fontWeight: 500 }}>
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
