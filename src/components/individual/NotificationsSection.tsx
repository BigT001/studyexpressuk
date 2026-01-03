'use client';

export function NotificationsSection() {
  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-8">
      <h2 className="text-2xl font-black text-gray-900 mb-6">Your Notifications</h2>
      <div className="space-y-4">
        <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
          <span className="text-2xl">🔔</span>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900">Welcome to StudyExpress!</h3>
            <p className="text-sm text-gray-600 mt-1">Your account has been created successfully. Explore our courses and get started on your learning journey.</p>
            <p className="text-xs text-gray-500 mt-2">Just now</p>
          </div>
        </div>

        <div className="flex items-start gap-4 p-4 bg-emerald-50 rounded-lg border-l-4 border-emerald-400">
          <span className="text-2xl">🎯</span>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900">Complete Your Profile</h3>
            <p className="text-sm text-gray-600 mt-1">Add a profile picture and bio to help us personalize your experience.</p>
            <p className="text-xs text-gray-500 mt-2">Pending</p>
          </div>
        </div>
      </div>
    </div>
  );
}
