'use client';

import Link from 'next/link';

const FOOTER_LINKS = {
  Platform: [
    { label: 'Courses',     href: '/courses' },
    { label: 'Events',      href: '/events' },
    { label: 'Memberships', href: '/membership' },
    { label: 'For Teams',   href: '/contact' },
  ],
  Company: [
    { label: 'About Us',   href: '/about' },
    { label: 'Blog',       href: '/blog' },
    { label: 'Contact',    href: '/contact' },
    { label: 'Study in UK', href: '/study-in-uk' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Use',   href: '#' },
    { label: 'Cookie Policy',  href: '#' },
    { label: 'Security',       href: '#' },
  ],
};

const SOCIALS = ['𝕏', 'in', 'f', '▶'];

export function HomeFooter() {
  return (
    <footer style={{ background: '#0d1117', color: '#9ca3af' }}>
      {/* Main grid */}
      <div
        className="section-container"
        style={{ padding: 'clamp(48px, 6vw, 72px) clamp(1rem, 4vw, 2rem)' }}
      >
        <div
          className="footer-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1.5fr 1fr 1fr 1fr',
            gap: 40,
          }}
        >
          {/* Brand */}
          <div>
            <div style={{ marginBottom: 16 }}>
              <span style={{ fontSize: '1.4rem', fontWeight: 900, letterSpacing: '-0.02em' }}>
                <span style={{ color: '#008200' }}>study</span>
                <span style={{ color: '#4d8eff' }}>express</span>
              </span>
              <span style={{
                fontSize: '0.55rem', fontWeight: 800, color: 'white',
                background: '#0E3386', padding: '2px 5px', borderRadius: 4,
                letterSpacing: '0.05em', marginLeft: 4, verticalAlign: 'middle',
              }}>UK</span>
            </div>
            <p style={{ fontSize: '0.875rem', lineHeight: 1.7, maxWidth: 260, color: '#6b7280' }}>
              Empowering professionals worldwide with UK-accredited education, industry
              events, and career-transforming certifications.
            </p>

            {/* Social icons */}
            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              {SOCIALS.map((icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label={`Social link ${i + 1}`}
                  style={{
                    width: 36, height: 36, borderRadius: 8,
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#9ca3af', fontWeight: 700, fontSize: '0.8rem',
                    textDecoration: 'none', transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(0,130,0,0.2)';
                    e.currentTarget.style.color = '#4ade80';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                    e.currentTarget.style.color = '#9ca3af';
                  }}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
            <div key={heading}>
              <h4 style={{
                color: 'white', fontWeight: 700, fontSize: '0.875rem',
                marginBottom: 18, marginTop: 0, letterSpacing: '0.02em',
              }}>
                {heading}
              </h4>
              <ul style={{
                listStyle: 'none', margin: 0, padding: 0,
                display: 'flex', flexDirection: 'column', gap: 11,
              }}>
                {links.map(link => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      style={{
                        color: '#6b7280', textDecoration: 'none',
                        fontSize: '0.875rem', transition: 'color 0.2s',
                        display: 'inline-block',
                      }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLAnchorElement).style.color = '#4ade80';
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLAnchorElement).style.color = '#6b7280';
                      }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '20px clamp(1rem, 4vw, 2rem)' }}>
        <div
          className="section-container"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: 12,
          }}
        >
          <p style={{ margin: 0, fontSize: '0.8rem', color: '#4b5563' }}>
            © {new Date().getFullYear()} Study Express UK. All rights reserved.
            Registered in England &amp; Wales.
          </p>
          <div style={{ display: 'flex', gap: 20 }}>
            {['Privacy', 'Terms', 'Cookies'].map(t => (
              <Link
                key={t}
                href="#"
                style={{ fontSize: '0.8rem', color: '#4b5563', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#4ade80'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#4b5563'; }}
              >
                {t}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) { .footer-grid { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 560px) { .footer-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </footer>
  );
}
