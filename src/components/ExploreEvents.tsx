'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useScrollReveal } from '@/hooks/useScrollReveal';

/* ── Helpers ─────────────────────────────────────────────────────────── */
function formatDate(date: string | Date | undefined) {
  if (!date) return 'TBA';
  return new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

const FORMAT_STYLE: Record<string, { bg: string; label: string; icon: string }> = {
  online:  { bg: '#0066CC', label: 'Online',  icon: '🌐' },
  offline: { bg: '#FF6B35', label: 'Offline', icon: '📍' },
  hybrid:  { bg: '#7C3AED', label: 'Hybrid',  icon: '🔄' },
};

const ACCESS_STYLE: Record<string, { bg: string; label: string; icon: string }> = {
  premium:   { bg: '#d97706', label: 'Premium',   icon: '💎' },
  corporate: { bg: '#0E3386', label: 'Corporate', icon: '🏢' },
  free:      { bg: '#059669', label: 'Free',       icon: '🆓' },
};

/* ── Skeleton ─────────────────────────────────────────────────── */
function EventSkeleton() {
  return (
    <div style={{
      background: 'white', borderRadius: 20, overflow: 'hidden',
      border: '1px solid #f3f4f6', boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
    }}>
      <div className="skeleton" style={{ height: 180 }} />
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div className="skeleton" style={{ height: 20, width: '60%' }} />
        <div className="skeleton" style={{ height: 14, width: '100%' }} />
        <div className="skeleton" style={{ height: 14, width: '75%' }} />
        <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
          <div className="skeleton" style={{ height: 36, flex: 1 }} />
          <div className="skeleton" style={{ height: 36, flex: 1 }} />
        </div>
      </div>
    </div>
  );
}

/* ── Event Card ───────────────────────────────────────────────── */
function EventCard({ item, index }: { item: any, index: number }) {
  const fmt    = FORMAT_STYLE[item.format] ?? null;
  const access = ACCESS_STYLE[item.access] ?? ACCESS_STYLE.free;

  return (
    <div className="card reveal reveal-scale" style={{ 
      display: 'flex', flexDirection: 'column', height: '100%',
      transitionDelay: `${index * 0.1}s`
    }}>
      {/* Image */}
      <div style={{ position: 'relative', height: 190, overflow: 'hidden', flexShrink: 0 }}>
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
            className="event-img"
          />
        ) : (
          <div style={{
            width: '100%', height: '100%',
            background: 'linear-gradient(135deg, #008200 0%, #0E3386 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontSize: '2.5rem' }}>🎯</span>
          </div>
        )}
        {/* Dark overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)',
          pointerEvents: 'none',
        }} />

        {/* Access badge */}
        <div style={{
          position: 'absolute', top: 12, left: 12,
          background: access.bg, color: 'white',
          padding: '4px 10px', borderRadius: 100,
          fontSize: '0.7rem', fontWeight: 700,
        }}>
          {access.icon} {access.label}
        </div>

        {/* Format badge */}
        {fmt && (
          <div style={{
            position: 'absolute', top: 12, right: 12,
            background: fmt.bg, color: 'white',
            padding: '4px 10px', borderRadius: 100,
            fontSize: '0.7rem', fontWeight: 700,
          }}>
            {fmt.icon} {fmt.label}
          </div>
        )}

        {/* Date on image */}
        {item.startDate && (
          <div style={{
            position: 'absolute', bottom: 12, left: 12,
            background: 'rgba(255,255,255,0.95)',
            borderRadius: 8, padding: '6px 10px',
            fontSize: '0.72rem', fontWeight: 700, color: '#111827',
            display: 'flex', alignItems: 'center', gap: 5,
          }}>
            <svg width="12" height="12" fill="none" stroke="#008200" strokeWidth="2" viewBox="0 0 24 24">
              <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
            </svg>
            {formatDate(item.startDate)}
          </div>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: '18px 20px 0', flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#0E3386', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          🎯 Event
        </span>

        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#111827', lineHeight: 1.35 }}
          className="line-clamp-2">
          {item.title}
        </h3>

        {item.description && (
          <p style={{ margin: 0, fontSize: '0.82rem', color: '#6b7280', lineHeight: 1.5 }}
            className="line-clamp-2">
            {item.description}
          </p>
        )}
      </div>

      {/* Actions */}
      <div style={{ padding: '16px 20px 20px', display: 'flex', gap: 10, marginTop: 'auto' }}>
        <button
          onClick={() => window.location.href = '/events'}
          className="btn-primary"
          style={{ flex: 1, justifyContent: 'center', padding: '10px 16px', fontSize: '0.82rem', borderRadius: 10 }}
        >
          Register Now
        </button>
        <button
          onClick={() => window.location.href = `/events/${item._id || item.id}`}
          style={{
            flex: 1, padding: '10px 16px', fontSize: '0.82rem', fontWeight: 600,
            border: '1.5px solid #e5e7eb', borderRadius: 10, background: 'transparent',
            color: '#374151', cursor: 'pointer', transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#0E3386'; e.currentTarget.style.color = '#0E3386'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.color = '#374151'; }}
        >
          View Details
        </button>
      </div>
    </div>
  );
}

/* ── Main section ─────────────────────────────────────────────── */
export function ExploreEvents() {
  const [events,  setEvents ] = useState<any[]>([]);
  useScrollReveal([events]);
  const [loading, setLoading] = useState(true);
  const [error,   setError  ] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res  = await fetch('/api/events');
        const data = await res.json();
        setEvents(data.events || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load events');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const displayed = events.slice(0, 3);

  return (
    <section style={{
      padding: 'clamp(60px, 8vw, 100px) 0',
      background: 'linear-gradient(180deg, #f0f5ff 0%, #ffffff 100%)',
      position: 'relative',
    }}>
      {/* Mesh gradient decoration */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, top: 0,
        backgroundImage: 'radial-gradient(at 0% 100%, rgba(14, 51, 134, 0.04) 0, transparent 50%), radial-gradient(at 100% 0%, rgba(0, 130, 0, 0.02) 0, transparent 40%)',
        pointerEvents: 'none',
      }} />

      <div className="section-container" style={{ position: 'relative' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 56 }} className="reveal reveal-up">
          <span className="section-label section-label-blue" style={{ marginBottom: 16, display: 'inline-flex' }}>
            🎯 Upcoming Events
          </span>
          <h2 style={{
            fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
            fontWeight: 900, letterSpacing: '-0.03em',
            color: '#111827', margin: '12px 0 16px',
          }}>
            Explore <span className="gradient-text-blue">Recent Events</span>
          </h2>
          <p style={{ fontSize: '1.05rem', color: '#6b7280', maxWidth: 520, margin: '0 auto', lineHeight: 1.6 }}>
            Discover professional development events, networking sessions, and UK study experiences.
          </p>
        </div>

        {/* Grid */}
        {loading && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
            {Array.from({ length: 3 }).map((_, i) => <EventSkeleton key={i} />)}
          </div>
        )}

        {error && (
          <div style={{
            textAlign: 'center', padding: '48px 24px',
            background: '#fef2f2', borderRadius: 16, border: '1px solid #fecaca',
          }}>
            <div style={{ fontSize: '2rem', marginBottom: 12 }}>⚠️</div>
            <p style={{ color: '#dc2626', fontWeight: 500 }}>{error}</p>
          </div>
        )}

        {!loading && !error && displayed.length === 0 && (
          <div style={{ textAlign: 'center', padding: '64px 24px', color: '#9ca3af' }}>
            <div style={{ fontSize: '3rem', marginBottom: 16 }}>📭</div>
            <p style={{ fontSize: '1rem' }}>No events at the moment. Check back soon!</p>
          </div>
        )}

        {!loading && !error && displayed.length > 0 && (
          <>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: 24,
            }}>
              {displayed.map((item, idx) => <EventCard key={item._id || item.id} item={item} index={idx} />)}
            </div>

            <div style={{ textAlign: 'center', marginTop: 48 }} className="reveal reveal-up">
                <Link href="/events" className="btn-primary" style={{ fontSize: '0.95rem', padding: '14px 32px' }}>
                  View More Events
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
          </>
        )}
      </div>

      <style>{`
        .event-img { transition: transform 0.5s ease; }
        .card:hover .event-img { transform: scale(1.06); }
      `}</style>
    </section>
  );
}
