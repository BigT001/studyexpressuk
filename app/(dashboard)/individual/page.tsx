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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
        <IndividualQuickStats />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          <div className="lg:col-span-2 space-y-6 md:space-y-8">
            <ProfileSection />
            <MembershipSection />
            <LearningSection />
          </div>
          
          <div className="space-y-6 md:space-y-8">
            <CommunicationSection />
            <NotificationsSection />
            <QuickActionsSection />
          </div>
        </div>
      </div>
    </div>
  );
        <CommunicationSection />
        <NotificationsSection />
        <QuickActionsSection />
          </div>
        </div>
      </div>
    </div>
  );
}
