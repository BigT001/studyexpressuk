import { getServerAuthSession } from '@/server/auth/session';
import { redirect } from 'next/navigation';
import {
  IndividualDashboardHeader,
  IndividualQuickStats,
  ProfileSection,
  MembershipSection,
  LearningSection,
  CommunicationSection,
  NotificationsSection,
} from '@/components/individual';
import { UserProfileCard } from '@/components/individual/UserProfileCard';
import { getUserProfile } from '@/server/users/getUserProfile';

export default async function IndividualDashboard() {
  const session = await getServerAuthSession();

  if (!session || !['INDIVIDUAL', 'STAFF'].includes(session.user?.role || '')) {
    redirect('/auth/signin');
  }

  const userName = session.user?.email?.split('@')[0] || 'Member';
  const profile = session.user?.email ? await getUserProfile(session.user.email) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
        <UserProfileCard
          profileImage={profile?.profileImage}
          firstName={profile?.firstName}
          lastName={profile?.lastName}
          bio={profile?.bio}
        />
        <IndividualQuickStats />
        
        {/* Top Communication Section - Full Width */}
        <CommunicationSection />
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-7 space-y-6 md:space-y-8">
            <ProfileSection />
            <MembershipSection />
            <LearningSection />
          </div>
          
          {/* Right Sidebar - Notifications (Wider) */}
          <div className="lg:col-span-5 space-y-6 md:space-y-8">
            <NotificationsSection profile={profile} userId={session.user?.id ?? ''} />
          </div>
        </div>
      </div>
    </div>
  );
}
