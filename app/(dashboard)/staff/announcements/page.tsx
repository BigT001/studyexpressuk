'use client';

export default function AnnouncementsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Announcements</h1>
          <p className="text-gray-600 mt-2">Important updates and notices for your team</p>
        </div>

        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <div className="flex gap-4">
              <div className="text-2xl">📢</div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900">Welcome to Staff Dashboard</h3>
                <p className="text-sm text-gray-600 mt-1">This is your dedicated staff member dashboard. You now have a completely separate experience from student users.</p>
                <p className="text-xs text-gray-500 mt-2">Posted on Jan 15, 2026</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="text-center py-8">
              <p className="text-gray-600">No additional announcements at this time.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
