'use client';

interface IndividualDashboardHeaderProps {
  userName: string;
}

export function IndividualDashboardHeader({ userName }: IndividualDashboardHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-[#008200] to-[#00B300] rounded-2xl p-8 text-white shadow-lg">
      <h1 className="text-4xl font-black mb-2">Welcome back, {userName}! 👋</h1>
      <p className="text-green-100 text-lg">Your personal learning hub awaits. Explore, learn, and grow with us.</p>
    </div>
  );
}
