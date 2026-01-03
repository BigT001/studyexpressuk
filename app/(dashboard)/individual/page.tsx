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
  QuickActionsSection,
} from '@/components/individual';

export default async function IndividualDashboard() {
  const session = await getServerAuthSession();

  if (!session || session.user?.role !== 'INDIVIDUAL') {
    redirect('/auth/signin');
  }

  const userName = session.user?.email?.split('@')[0] || 'Member';

  return (
    <div className="p-8 space-y-8">
      <IndividualQuickStats />
      
      <div className="space-y-8">
        <ProfileSection />
        <MembershipSection />
        <LearningSection />
        <CommunicationSection />
        <NotificationsSection />
        <QuickActionsSection />
      </div>
    </div>
  );
}
