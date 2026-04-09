'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useScrollReveal } from '@/hooks/useScrollReveal';

/* ── Benefit card data ────────────────────────────────────────────── */
const BENEFITS = [
  {
    title: 'Personalised Solutions',
    description: 'Custom learning paths tailored to your career goals and skill level.',
    image: '/38080549_8602372.png',
    gradient: 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)',
    shadowColor: 'rgba(249,115,22,0.3)',
    imgObjectPosition: 'top center',
  },
  {
    title: 'Leading UK Institutions',
    description: 'Partner with top British universities and earn globally recognised qualifications.',
    image: '/blackgirl.png',
    gradient: 'linear-gradient(135deg, #eab308 0%, #facc15 100%)',
    shadowColor: 'rgba(234,179,8,0.3)',
    imgObjectPosition: 'top center',
  },
  {
    title: 'Global & Local',
    description: 'International reach with dedicated local support wherever you are.',
    image: '/38080885_8602716.png',
    gradient: 'linear-gradient(135deg, #008200 0%, #16a34a 100%)',
    shadowColor: 'rgba(0,130,0,0.3)',
    imgObjectPosition: 'top center',
  },
];

/* ── Why-us data ─────────────────────────────────────────────────── */
const WHY_ITEMS = [
  { icon: '🔐', label: 'Secure & Trusted Platform' },
  { icon: '📱', label: 'Learn on Any Device' },
  { icon: '🏅', label: 'Industry-Recognised Certs' },
  { icon: '🤝', label: 'Corporate Training Solutions' },
  { icon: '💬', label: '24/7 Learner Support' },
  { icon: '🚀', label: 'Career Placement Assistance' },
];

/* ── Component ────────────────────────────────────────────────────── */
export function ExploreAll() {
  useScrollReveal();

  return (
    <>
      {/* ━━━━━━━━━━━━━━━━ BENEFITS — image-above-card ━━━━━━━━━━━━━━━ */}
      <section style={{
        background: '#ffffff',
        padding: 'clamp(50px, 7vw, 90px) 0',
        borderTop: '1px solid #f3f4f6',
        position: 'relative',
      }}>
        {/* Subtle decorative blob */}
        <div style={{
          position: 'absolute', top: '10%', left: '-5%',
          width: 400, height: 400,
          background: 'radial-gradient(circle, rgba(14,51,134,0.03) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div className="section-container" style={{ position: 'relative' }}>

          {/* Section header */}
          <div style={{ textAlign: 'center', marginBottom: 48 }} className="reveal reveal-up">
            <span className="section-label section-label-green" style={{ marginBottom: 16, display: 'inline-flex' }}>
              ⭐ Why Choose Us
            </span>
            <h2 style={{
              fontSize: 'clamp(1.6rem, 3.2vw, 2.4rem)',
              fontWeight: 900,
              letterSpacing: '-0.03em',
              color: '#111827',
              margin: '8px 0 12px',
              lineHeight: 1.1,
            }}>
              Benefits of<br />
              <span className="gradient-text-green">Studying with Us</span>
            </h2>
            <p style={{
              fontSize: '1rem',
              color: '#6b7280',
              maxWidth: 480,
              margin: '0 auto',
              lineHeight: 1.6,
            }}>
              Upskill, explore, and connect. We guide you toward success.
            </p>
          </div>

          {/* Cards — image overflowing above top border */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 24,
            paddingTop: 40,
          }}
            className="benefits-grid"
          >
            {BENEFITS.map((b, idx) => (
              <div
                key={idx}
                style={{
                  position: 'relative',
                  paddingTop: 45,
                  transitionDelay: `${idx * 0.1}s`
                }}
                className="reveal reveal-scale"
              >
                {/* ── Overflowing character image ──────────────────── */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 20,
                  width: 110,
                  height: 140,
                  zIndex: 2,
                  borderRadius: 14,
                  overflow: 'hidden',
                  background: 'white',
                  boxShadow: `0 8px 24px ${b.shadowColor}`,
                  border: '3px solid white',
                }}>
                  <Image
                    src={b.image}
                    alt={b.title}
                    fill
                    style={{
                      objectFit: 'cover',
                      objectPosition: b.imgObjectPosition,
                    }}
                    priority={idx === 0}
                  />
                </div>

                {/* ── Coloured card ─────────────────────────────────── */}
                <div
                  style={{
                    background: b.gradient,
                    borderRadius: 20,
                    padding: '24px 20px',
                    height: 100,
                    display: 'flex',
                    alignItems: 'center',
                    boxShadow: `0 6px 20px ${b.shadowColor}, inset 0 1px 0 rgba(255,255,255,0.25)`,
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    cursor: 'default',
                    overflow: 'visible',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = `0 12px 32px ${b.shadowColor}, inset 0 1px 0 rgba(255,255,255,0.3)`;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = `0 6px 20px ${b.shadowColor}, inset 0 1px 0 rgba(255,255,255,0.25)`;
                  }}
                >
                  <div style={{
                    marginLeft: 115,
                    flex: 1,
                    minWidth: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                  }}>
                    <h3 style={{
                      color: 'white',
                      fontWeight: 800,
                      fontSize: '0.92rem',
                      margin: '0 0 4px',
                      lineHeight: 1.2,
                    }}>
                      {b.title}
                    </h3>
                    <p style={{
                      color: 'rgba(255,255,255,0.95)',
                      fontSize: '0.75rem',
                      margin: 0,
                      lineHeight: 1.4,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}>
                      {b.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA paragraph + button */}
          <div style={{ textAlign: 'center', marginTop: 40, maxWidth: 640, margin: '40px auto 0' }} className="reveal reveal-up">
            <p style={{
              fontSize: '0.9rem',
              color: '#6b7280',
              lineHeight: 1.6,
              marginBottom: 24,
            }}>
              We are committed to delivering excellence in executive education and professional
              development. Whether you&apos;re advancing your career, leading a team, or transforming
              your organisation — our tailored solutions empower you to achieve your goals.
            </p>
            <Link href="/courses" className="btn-primary" style={{ fontSize: '0.9rem', padding: '12px 28px' }}>
              Explore
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━ WHY-CHOOSE-US — PRO REDESIGN ━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section style={{
        padding: 'clamp(60px, 8vw, 100px) 0',
        background: '#ffffff',
        position: 'relative',
        overflow: 'hidden',
        borderTop: '1px solid #f3f4f6',
      }}>
        {/* Subtle radial glows for depth */}
        <div style={{
          position: 'absolute', top: '-10%', right: '-5%',
          width: '50%', height: '70%',
          background: 'radial-gradient(circle, rgba(14,51,134,0.04) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '-10%', left: '-5%',
          width: '40%', height: '60%',
          background: 'radial-gradient(circle, rgba(0,130,0,0.03) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(rgba(0,0,0,0.02) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          pointerEvents: 'none',
        }} />

        <div className="section-container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="why-grid" style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 1fr',
            gap: 'clamp(32px, 6vw, 64px)',
            alignItems: 'center',
          }}>
            {/* Left copy */}
            <div className="reveal reveal-left">
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'rgba(14,51,134,0.05)', padding: '6px 14px', borderRadius: 100, border: '1px solid rgba(14,51,134,0.1)', marginBottom: 20 }}>
                <span style={{ fontSize: '1rem' }}>✨</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0E3386', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  Our Commitment to Excellence
                </span>
              </div>
              
              <h2 style={{
                fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)',
                fontWeight: 900,
                letterSpacing: '-0.04em',
                color: '#111827',
                margin: '0 0 16px',
                lineHeight: 1.05,
              }}>
                Redefining the<br />
                <span className="gradient-text-green">Learning Experience</span>
              </h2>
              
              <p style={{
                color: '#4b5563',
                lineHeight: 1.7,
                fontSize: '1rem',
                marginBottom: 32,
                maxWidth: 500,
              }}>
                We bridge the gap between ambition and achievement through UK-accredited 
                programmes, industry-leading mentors, and a platform built for the future.
              </p>
              
              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                <Link href="/auth/signup" className="btn-primary" style={{
                  padding: '12px 28px', fontSize: '0.9rem',
                }}>
                  Get Started Free
                </Link>
                <Link href="/courses" className="btn-secondary" style={{ padding: '11px 28px', fontSize: '0.9rem' }}>
                  Explore Programs
                </Link>
              </div>

              {/* Quick Trust row */}
              <div style={{ marginTop: 40, display: 'flex', gap: 24, alignItems: 'center' }}>
                <div>
                   <div style={{ color: '#111827', fontWeight: 800, fontSize: '1.1rem' }}>100%</div>
                   <div style={{ color: '#6b7280', fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: 700 }}>Online</div>
                </div>
                <div style={{ width: 1, height: 24, background: '#e5e7eb' }} />
                <div>
                   <div style={{ color: '#111827', fontWeight: 800, fontSize: '1.1rem' }}>UK</div>
                   <div style={{ color: '#6b7280', fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: 700 }}>Accredited</div>
                </div>
                <div style={{ width: 1, height: 24, background: '#e5e7eb' }} />
                <div>
                   <div style={{ color: '#111827', fontWeight: 800, fontSize: '1.1rem' }}>24/7</div>
                   <div style={{ color: '#6b7280', fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: 700 }}>Support</div>
                </div>
              </div>
            </div>

            {/* Right feature tiles */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: 12,
              background: '#f9fafb',
              padding: 20,
              borderRadius: 24,
              border: '1px solid #e5e7eb',
            }}>
              {WHY_ITEMS.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'white',
                    border: '1px solid #f3f4f6',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                    borderRadius: 16,
                    padding: '20px 16px',
                    transition: 'all 0.3s ease',
                    cursor: 'default',
                    transitionDelay: `${idx * 0.05}s`
                  }}
                  className="reveal reveal-scale"
                  onMouseEnter={e => {
                    e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.borderColor = '#e5e7eb';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = '#f3f4f6';
                  }}
                >
                  <div style={{ 
                    width: 38, height: 38, 
                    background: '#f0fdf4', 
                    borderRadius: 10, 
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.25rem', marginBottom: 12,
                  }}>
                    {item.icon}
                  </div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#111827', lineHeight: 1.3 }}>
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <style>{`
          @media (max-width: 900px) {
            .why-grid { grid-template-columns: 1fr !important; }
            .benefits-grid { grid-template-columns: 1fr 1fr !important; }
          }
          @media (max-width: 640px) {
            .benefits-grid { grid-template-columns: 1fr !important; }
            .why-grid > div:last-child { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </section>
    </>
  );
}
