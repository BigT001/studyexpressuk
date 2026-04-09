'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useScrollReveal } from '@/hooks/useScrollReveal';

/* ── Types ───────────────────────────────────────────────────────────── */
interface Course {
  _id: string;
  title: string;
  description?: string;
  category?: string;
  level?: 'beginner' | 'intermediate' | 'advanced';
  status: 'draft' | 'published' | 'active' | 'archived';
  duration?: number;
  price?: number;
  instructor?: string;
  imageUrl?: string;
}

/* ── Level badge colours ─────────────────────────────────────── */
const LEVEL_STYLES: Record<string, { bg: string; color: string }> = {
  beginner:     { bg: '#ecfdf5', color: '#059669' },
  intermediate: { bg: '#fffbeb', color: '#d97706' },
  advanced:     { bg: '#f5f3ff', color: '#7c3aed' },
};

/* ── Skeleton loading placeholder ───────────────────────────── */
function CourseSkeleton() {
  return (
    <div style={{
      background: 'white', borderRadius: 20, overflow: 'hidden',
      border: '1px solid #f3f4f6',
      boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
    }}>
      <div className="skeleton" style={{ height: 180 }} />
      <div style={{ padding: '20px 20px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div className="skeleton" style={{ height: 20, width: '70%' }} />
        <div className="skeleton" style={{ height: 14, width: '100%' }} />
        <div className="skeleton" style={{ height: 14, width: '80%' }} />
        <div className="skeleton" style={{ height: 40, marginTop: 8 }} />
      </div>
    </div>
  );
}

/* ── Course card ──────────────────────────────────────────────── */
function CourseCard({ course, index }: { course: Course, index: number }) {
  const level    = course.level ? LEVEL_STYLES[course.level] : null;
  const priceStr = course.price && course.price > 0 ? `£${course.price}` : 'Free';

  return (
    <div
      className="card reveal reveal-scale"
      style={{ 
        display: 'flex', flexDirection: 'column', height: '100%',
        transitionDelay: `${index * 0.1}s`
      }}
    >
      {/* Image */}
      <div style={{ position: 'relative', height: 180, overflow: 'hidden', flexShrink: 0 }}>
        {course.imageUrl ? (
          <img
            src={course.imageUrl}
            alt={course.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
            className="course-img"
            onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
          />
        ) : (
          <div style={{
            width: '100%', height: '100%',
            background: 'linear-gradient(135deg, #008200 0%, #0E3386 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontSize: '2.5rem' }}>📚</span>
          </div>
        )}
        {/* Gradient overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 60%)',
          pointerEvents: 'none',
        }} />

        {/* Price badge on image */}
        <div style={{
          position: 'absolute', top: 12, right: 12,
          background: priceStr === 'Free' ? '#008200' : '#0E3386',
          color: 'white',
          padding: '4px 10px',
          borderRadius: 100,
          fontSize: '0.72rem',
          fontWeight: 800,
        }}>
          {priceStr}
        </div>

        {/* Level badge */}
        {level && (
          <div style={{
            position: 'absolute', bottom: 12, left: 12,
            background: level.bg,
            color: level.color,
            padding: '3px 10px',
            borderRadius: 100,
            fontSize: '0.7rem',
            fontWeight: 700,
          }}>
            {course.level!.charAt(0).toUpperCase() + course.level!.slice(1)}
          </div>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: '20px 20px 0', display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
        {course.category && (
          <span style={{
            fontSize: '0.7rem', fontWeight: 700, color: '#008200',
            textTransform: 'uppercase', letterSpacing: '0.08em',
          }}>{course.category}</span>
        )}

        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#111827', lineHeight: 1.35 }}
          className="line-clamp-2">
          {course.title}
        </h3>

        {course.description && (
          <p style={{ margin: 0, fontSize: '0.82rem', color: '#6b7280', lineHeight: 1.5 }}
            className="line-clamp-2">
            {course.description}
          </p>
        )}

        {/* Metadata row */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 16, marginTop: 4,
          paddingTop: 12, borderTop: '1px solid #f3f4f6',
          fontSize: '0.78rem', color: '#9ca3af',
        }}>
          {course.duration && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10"/><path strokeLinecap="round" d="M12 6v6l4 2"/>
              </svg>
              {course.duration}h
            </span>
          )}
          {course.instructor && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, minWidth: 0 }}>
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{course.instructor}</span>
            </span>
          )}
        </div>
      </div>

      {/* Footer actions */}
      <div style={{ padding: '16px 20px 20px', display: 'flex', gap: 10, marginTop: 'auto' }}>
        <button
          onClick={() => window.location.href = '/courses'}
          className="btn-primary"
          style={{ flex: 1, justifyContent: 'center', padding: '10px 16px', fontSize: '0.82rem', borderRadius: 10 }}
        >
          Enrol Now
        </button>
        <button
          onClick={() => window.location.href = `/courses/${course._id}`}
          style={{
            flex: 1, padding: '10px 16px', fontSize: '0.82rem', fontWeight: 600,
            border: '1.5px solid #e5e7eb', borderRadius: 10, background: 'transparent',
            color: '#374151', cursor: 'pointer', transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#008200'; e.currentTarget.style.color = '#008200'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.color = '#374151'; }}
        >
          View Details
        </button>
      </div>
    </div>
  );
}

/* ── Main section ──────────────────────────────────────────────── */
export function ExploreCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  useScrollReveal([courses]);
  const [loading, setLoading] = useState(true);
  const [error,   setError  ] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res  = await fetch('/api/courses');
        const data = await res.json();
        if (data.success) {
          setCourses(
            (data.courses || []).filter((c: Course) => c.status === 'published' || c.status === 'active')
          );
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load courses');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const displayed = courses.slice(0, 3);

  return (
    <section style={{ 
      padding: 'clamp(60px, 8vw, 100px) 0', 
      background: 'linear-gradient(180deg, #ffffff 0%, #f2fcf5 100%)',
      position: 'relative'
    }}>
      {/* Decorative overlays */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        backgroundImage: 'radial-gradient(circle at 10% 20%, rgba(0, 130, 0, 0.04) 0%, transparent 40%), radial-gradient(circle at 90% 80%, rgba(14, 51, 134, 0.02) 0%, transparent 40%)',
        pointerEvents: 'none',
      }} />

      <div className="section-container" style={{ position: 'relative' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 56 }} className="reveal reveal-up">
          <span className="section-label section-label-green" style={{ marginBottom: 16, display: 'inline-flex' }}>
            📚 Popular Courses
          </span>
          <h2 style={{
            fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
            fontWeight: 900, letterSpacing: '-0.03em',
            color: '#111827', margin: '12px 0 16px',
          }}>
            Explore <span className="gradient-text-green">Top-Rated</span> Courses
          </h2>
          <p style={{ fontSize: '1.05rem', color: '#6b7280', maxWidth: 520, margin: '0 auto', lineHeight: 1.6 }}>
            Industry-designed programmes to accelerate your career with recognised UK qualifications.
          </p>
        </div>

        {/* Grid */}
        {loading && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
            {Array.from({ length: 3 }).map((_, i) => <CourseSkeleton key={i} />)}
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
            <p style={{ fontSize: '1rem' }}>No courses available yet. Check back soon!</p>
          </div>
        )}

        {!loading && !error && displayed.length > 0 && (
          <>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: 24,
            }}>
              {displayed.map((course, idx) => <CourseCard key={course._id} course={course} index={idx} />)}
            </div>

            <div style={{ textAlign: 'center', marginTop: 48 }} className="reveal reveal-up">
              <Link href="/courses" className="btn-primary" style={{ fontSize: '0.95rem', padding: '14px 32px' }}>
                View More Courses
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </>
        )}

      </div>

      {/* hover effect for course images */}
      <style>{`
        .course-img { transition: transform 0.5s ease; }
        .card:hover .course-img { transform: scale(1.06); }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>
    </section>
  );
}
