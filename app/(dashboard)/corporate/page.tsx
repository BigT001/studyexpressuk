import { getServerAuthSession } from '@/server/auth/session';
import { redirect } from 'next/navigation';
import { connectToDatabase } from '@/server/db/mongoose';
import CorporateProfileModel from '@/server/db/models/corporate.model';
import {
  CorporateQuickStats,
  CorporateCommunicationSection,
} from '@/components/corporate';
import { CorporateProfileCard } from '@/components/corporate/CorporateProfileCard';
import { CorporateNotificationsSection } from '@/components/corporate/CorporateNotificationsSection';
import { CorporateCoursesSection } from '@/components/corporate/CorporateCoursesSection';
import { CorporateStaffSection } from '@/components/corporate/CorporateStaffSection';

export default async function CorporateDashboard() {
  try {
    const session = await getServerAuthSession();

    if (!session || session.user?.role !== 'CORPORATE') {
      redirect('/auth/signin');
    }

    let companyName = session.user?.email?.split('@')[0] || 'Company';
    let logo = '';
    let bio = 'Welcome to your corporate dashboard. Manage your team, courses, and communications all in one place.';

    // Fetch the corporate profile to get company name and logo
    try {
      await connectToDatabase();
      const profile = await CorporateProfileModel.findOne({ ownerId: session.user.id }).lean();
      if (profile) {
        companyName = profile.companyName || companyName;
        logo = profile.logo || '';
        bio = (profile as any).bio || bio;
      }
    } catch (error) {
      console.error('Failed to fetch corporate profile:', error);
      // Continue with defaults if fetch fails
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
          <CorporateProfileCard
            companyName={companyName}
            email={session.user?.email || ''}
            bio={bio}
            logo={logo}
          />
          <CorporateQuickStats />
          
          {/* Top Communication Section - Full Width */}
          <CorporateCommunicationSection />
          
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-7 space-y-6 md:space-y-8">
              <CorporateStaffSection />
              <CorporateCoursesSection />
            </div>
            
            {/* Right Sidebar - Notifications (Wider) */}
            <div className="lg:col-span-5 space-y-6 md:space-y-8">
              <CorporateNotificationsSection userId={session.user?.id ?? ''} />
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Corporate Dashboard Error:', error);
    throw error;
  }
}
