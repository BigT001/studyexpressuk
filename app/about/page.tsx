
import { connectToDatabase } from '@/server/db/mongoose';
import { SiteContent } from '@/server/db/models/siteContent.model';
import { Metadata } from 'next';
import * as LucideIcons from 'lucide-react';
import { Target, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us | Study Express UK',
  description: 'Empowering your journey through education and innovation.',
};

import { unstable_noStore as noStore } from 'next/cache';

async function getAboutContent() {
  noStore();
  try {
    await connectToDatabase();
    const content = (await SiteContent.findOne({ key: 'about-us' }).lean()) as any;
    console.log('[AboutPage] Fetched content:', content ? 'Success' : 'Not Found', content?.title);
    return content;
  } catch (error) {
    console.error('[AboutPage] Error fetching content:', error);
    return null;
  }
}

import { AboutHero } from '@/components/about/AboutHero';
import { AboutIntro } from '@/components/about/AboutIntro';
import { AboutMission } from '@/components/about/AboutMission';
import { AboutFeatures } from '@/components/about/AboutFeatures';
import { AboutStats } from '@/components/about/AboutStats';
import { AboutCTA } from '@/components/about/AboutCTA';

export default async function AboutPage() {
  const data = await getAboutContent() as any;

  // Hero Data
  const title = data?.title || 'About Study Express UK';
  const tagline = data?.tagline || 'Our Journey';
  const imageUrl = data?.imageUrl || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=2000';
  const heroDescription = data?.heroDescription || 'Bridging the gap between ambition and achievement through world-class education and innovation.';

  // Intro Data
  const introTitle = data?.introTitle || 'Study Express UK';
  const introduction = data?.introduction || 'Empowering learners worldwide with quality education and professional development opportunities.';

  // Mission Data
  const missionTitle = data?.missionTitle || 'Our Mission';
  const missionContent = data?.missionContent || 'To bridge the gap between ambition and achievement by providing accessible, high-quality courses and events that foster growth, connection, and success.';
  const missionImageUrl = data?.missionImageUrl || data?.imageUrl || 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=1000';

  // Features Data
  const featuresTitle = data?.featuresTitle || 'What We Offer';
  const featuresTagline = data?.featuresTagline || 'Crafting excellence in every step';
  const features = data?.features?.length > 0 ? data.features : [
    { icon: 'BookOpen', title: 'Expert-Led Courses', description: 'Learn from industry professionals with real-world experience.', badge: 'Premium Quality' },
    { icon: 'Calendar', title: 'Engaging Events', description: 'Connect with peers through immersive conferences.', badge: 'Immersive Experience' },
    { icon: 'Users', title: 'Global Community', description: 'Join a diverse network of learners worldwide.', badge: 'Global Reach' }
  ];

  // Stats Data
  const stats = data?.stats?.length > 0 ? data.stats : [
    { value: '10k+', label: 'Learners', color: 'text-green-600' },
    { value: '500+', label: 'Courses', color: 'text-blue-600' },
    { value: '50+', label: 'Partners', color: 'text-orange-500' }
  ];

  // CTA Data
  const ctaTitle = data?.ctaTitle || 'Study Express UK is your partner in lifelong learning.';
  const ctaDescription = data?.ctaDescription || "Whether you're looking to advance your career, learn a new skill, or connect with like-minded individuals, we are here for you.";
  const ctaButtonText = data?.ctaButtonText || 'Get Started Now';

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-red-500 text-white p-2 text-center font-bold z-[100] relative">DEBUG: NEW ABOUT PAGE LOADED</div>

      <AboutHero title={title} tagline={tagline} imageUrl={imageUrl} heroDescription={heroDescription} />

      <AboutStats stats={stats} />

      <AboutIntro title={introTitle} introduction={introduction} />

      <AboutMission
        missionTitle={missionTitle}
        missionContent={missionContent}
        missionImageUrl={missionImageUrl}
      />

      <AboutFeatures features={features} featuresTitle={featuresTitle} featuresTagline={featuresTagline} />

      <AboutCTA
        ctaTitle={ctaTitle}
        ctaDescription={ctaDescription}
        ctaButtonText={ctaButtonText}
      />

      <footer className="bg-white border-t border-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">
            &copy; {new Date().getFullYear()} Study Express UK. Global Education Excellence.
          </p>
        </div>
      </footer>
    </div>
  );
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;
