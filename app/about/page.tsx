import { Metadata } from 'next';
import AboutPageClient from './AboutPageClient';

export const metadata: Metadata = {
  title: 'About Us | Study Express UK',
  description: 'We are on a mission to make world-class education radically accessible — for individuals chasing ambition and organisations building their future.',
};

export const dynamic = 'force-dynamic';

export default function AboutPage() {
  return <AboutPageClient />;
}
