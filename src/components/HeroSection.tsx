'use client';

import { useScrollReveal } from '@/hooks/useScrollReveal';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef } from 'react';

/* ── Animated counter hook ───────────────────────────────────────────── */
function AnimatedStat({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const duration = 1800;
        const start = performance.now();
        const step = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = eased * value;
          el.textContent = (value % 1 === 0 ? Math.round(current) : current.toFixed(1)) + suffix;
          if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }
    }, { threshold: 0.5 });

    observer.observe(el);
    return () => observer.disconnect();
  }, [value, suffix]);

  return (
    <div style={{ textAlign: 'center' }}>
      <span
        ref={ref}
        style={{
          display: 'block',
          fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
          fontWeight: 900,
          color: '#008200',
          lineHeight: 1,
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        0{suffix}
      </span>
      <span style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: 500, marginTop: 4, display: 'block' }}>
        {label}
      </span>
    </div>
  );
}

/* ── Feature card (floating) ─────────────────────────────────────────── */
function FloatCard({ icon, title, desc, delay = 0 }: { icon: string; title: string; desc: string; delay?: number }) {
  return (
    <div
      style={{
        background: 'white',
        borderRadius: 16,
        padding: '18px 20px',
        boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
        border: '1px solid #f3f4f6',
        animation: `float 4s ease-in-out ${delay}s infinite`,
        minWidth: 200,
        maxWidth: 230,
      }}
    >
      <div style={{ fontSize: '1.5rem', marginBottom: 8 }}>{icon}</div>
      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#111827', marginBottom: 4 }}>{title}</div>
      <div style={{ fontSize: '0.78rem', color: '#6b7280', lineHeight: 1.4 }}>{desc}</div>
    </div>
  );
}

/* ── Main component ────────────────────────────────────────────────── */
export function HeroSection() {
  useScrollReveal();

  return (
    <section
      style={{
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #f2fcf5 0%, #ffffff 40%, #f0f5ff 100%)',
      }}
      className="bg-mesh-green"
    >
      {/* ── Background blobs ──────────────────────────────────────── */}
      <div style={{
        position: 'absolute', top: '-10%', right: '-5%',
        width: 800, height: 800,
        background: 'radial-gradient(circle, rgba(0,130,0,0.06) 0%, transparent 70%)',
        borderRadius: '50%',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-10%', left: '-5%',
        width: 700, height: 700,
        background: 'radial-gradient(circle, rgba(14,51,134,0.05) 0%, transparent 70%)',
        borderRadius: '50%',
        pointerEvents: 'none',
      }} />

      {/* ── Decorative grid dots ──────────────────────────────────── */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'radial-gradient(circle, rgba(0,130,0,0.04) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        pointerEvents: 'none',
      }} />

      {/* ── Content ───────────────────────────────────────────────── */}
      <div className="section-container" style={{ position: 'relative', zIndex: 10, paddingTop: 100, paddingBottom: 60 }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 'clamp(40px, 6vw, 80px)',
          alignItems: 'center',
        }}
          className="hero-grid"
        >
          {/* ── Left: Copy ─────────────────────────────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }} className="reveal reveal-left">
            {/* Label */}
            <div>
              <span className="section-label section-label-green">
                <span>🇬🇧</span> UK&apos;s Premier Learning Platform
              </span>
            </div>

            {/* Headline */}
            <h1 style={{
              fontSize: 'clamp(2.4rem, 5vw, 4.2rem)',
              fontWeight: 900,
              lineHeight: 1.05,
              letterSpacing: '-0.04em',
              color: '#111827',
              margin: 0,
            }}>
              Learn, Connect,{' '}
              <br />
              and{' '}
              <span className="gradient-text-green">Transform</span>
              <br />
              Your Career
            </h1>

            {/* Sub-copy */}
            <p style={{
              fontSize: 'clamp(1rem, 1.5vw, 1.15rem)',
              color: '#4b5563',
              lineHeight: 1.7,
              margin: 0,
              maxWidth: 520,
            }}>
              Expert-led training, UK-accredited certifications, and exclusive
              industry events — all in one platform built for ambitious professionals.
            </p>

            {/* CTA buttons */}
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <Link href="/courses" className="btn-primary" style={{ fontSize: '1rem', padding: '16px 32px' }}>
                Start Learning Today
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link href="/events" className="btn-secondary" style={{ fontSize: '1rem', padding: '15px 32px' }}>
                Browse Events
              </Link>
            </div>

            {/* Trust badges */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', opacity: 0.8 }}>
              {['✓ No credit card required', '✓ Join 5k+ learners', '✓ UK accredited'].map(t => (
                <span key={t} style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: 600 }}>{t}</span>
              ))}
            </div>

            {/* Stats row */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 1,
              background: '#e5e7eb',
              borderRadius: 20,
              overflow: 'hidden',
              marginTop: 10,
              boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
            }}>
              {[
                { value: 200,  suffix: '+',  label: 'Expert Courses' },
                { value: 5,    suffix: 'K+', label: 'Global Learners' },
                { value: 4.9,  suffix: '★',  label: 'Student Rating' },
              ].map((stat) => (
                <div key={stat.label} style={{ background: 'white', padding: '24px 16px', textAlign: 'center' }}>
                  <AnimatedStat value={stat.value} suffix={stat.suffix} label={stat.label} />
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: Visual ──────────────────────────────────────── */}
          <div
            className="hero-visual reveal reveal-right"
            style={{
              position: 'relative',
              height: 580,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Central image */}
            <div style={{
              position: 'relative',
              width: 360,
              height: 480,
              borderRadius: 32,
              overflow: 'hidden',
              boxShadow: '0 40px 100px rgba(0,0,0,0.2)',
              border: '4px solid white',
            }}>
              <Image
                src="/blackgirl2.png"
                alt="Student learning with Study Express UK"
                fill
                style={{ objectFit: 'cover', objectPosition: 'top center' }}
                priority
              />
              {/* Green overlay bar at bottom */}
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                background: 'linear-gradient(to top, rgba(0,130,0,0.9), transparent)',
                padding: '32px 24px 24px',
              }}>
                <div style={{ color: 'white', fontWeight: 800, fontSize: '1rem' }}>UK Certified Learning</div>
                <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.8rem', marginTop: 4 }}>Accredited by leading UK institutions</div>
              </div>
            </div>

            {/* Floating card — top left */}
            <div style={{ position: 'absolute', top: 30, left: -20, zIndex: 11 }}>
              <FloatCard icon="🎓" title="Executive Programs" desc="Expert-led training &amp; immersive experiences" delay={0} />
            </div>

            {/* Floating card — bottom right */}
            <div style={{ position: 'absolute', bottom: 40, right: -20, zIndex: 11 }}>
              <FloatCard icon="📚" title="UK Certifications" desc="Accredited qualifications, flexible learning" delay={1.5} />
            </div>

            {/* Floating badge — top right */}
            <div style={{
              position: 'absolute', top: 20, right: 0,
              background: '#0E3386',
              color: 'white',
              borderRadius: 20,
              padding: '12px 20px',
              fontSize: '0.82rem',
              fontWeight: 800,
              boxShadow: '0 10px 30px rgba(14,51,134,0.4)',
              animation: 'float 3.5s ease-in-out 0.8s infinite',
              zIndex: 12,
            }}>
              🎫 UK Events Support
            </div>

            {/* Active learners pill */}
            <div style={{
              position: 'absolute', bottom: 120, left: -40,
              background: 'white',
              borderRadius: 100,
              padding: '10px 20px',
              fontSize: '0.85rem',
              fontWeight: 700,
              color: '#111827',
              boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              animation: 'float 4.5s ease-in-out 1s infinite',
              zIndex: 12,
            }}>
              <span style={{
                width: 10, height: 10, background: '#22c55e', borderRadius: '50%',
                display: 'inline-block',
                animation: 'pulse-glow 2s ease-in-out infinite',
                boxShadow: '0 0 0 0 rgba(34,197,94,0.4)',
              }} />
              <span>Mentors are online</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Scroll indicator ─────────────────────────────────────── */}
      <div style={{
        position: 'absolute',
        bottom: 32,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
        animation: 'float 2s ease-in-out infinite',
        opacity: 0.6,
      }}>
        <span style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.15em', color: '#6b7280', textTransform: 'uppercase' }}>Discover</span>
        <svg width="22" height="22" fill="none" stroke="#6b7280" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* ── Responsive styles ─────────────────────────────────────── */}
      <style>{`
        @media (max-width: 900px) {
          .hero-grid { grid-template-columns: 1fr !important; text-align: center; }
          .hero-grid > div { align-items: center; }
          .hero-visual { height: 400px !important; margin-top: 40px; }
          .hero-visual > div:first-child { width: 280px !important; height: 380px !important; }
        }
        @media (max-width: 640px) {
          .hero-visual { display: none !important; }
        }
      `}</style>
    </section>
  );
}
