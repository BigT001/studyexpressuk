import type { Metadata } from 'next';
import { HeroSection }    from '@/components/HeroSection';
import { ExploreEvents }  from '@/components/ExploreEvents';
import { ExploreCourses } from '@/components/ExploreCourses';
import { ExploreAll }     from '@/components/ExploreAll';
import { HomeCTA }        from '@/components/HomeCTA';
import { HomeFooter }     from '@/components/HomeFooter';

/* ── SEO ─────────────────────────────────────────────────────────────── */
export const metadata: Metadata = {
  title: 'Study Express UK — Learn, Connect & Transform Your Career',
  description:
    'UK-accredited courses, professional development events, and corporate training. Join 50,000+ learners advancing their careers with Study Express UK.',
};

/* ── Page (server component) ─────────────────────────────────────────── */
export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <ExploreEvents />
      <ExploreCourses />
      <ExploreAll />
      <HomeCTA />
      <HomeFooter />
    </div>
  );
}
