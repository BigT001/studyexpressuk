'use client';

export function IndividualQuickStats() {
  return (
    <div className="grid md:grid-cols-4 gap-6">
      {/* Active Membership Card */}
      <div className="group relative overflow-hidden bg-white rounded-2xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-300">
        <div className="absolute top-0 right-0 w-20 h-20 bg-blue-100 rounded-full -mr-10 -mt-10 opacity-50 group-hover:opacity-100 transition-opacity"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-600 font-medium">Active Membership</p>
            <span className="text-3xl">💳</span>
          </div>
          <p className="text-4xl font-black text-gray-900 mb-2">0</p>
          <p className="text-sm text-gray-500">Status: Not Active</p>
        </div>
      </div>

      {/* Enrolled Courses Card */}
      <div className="group relative overflow-hidden bg-white rounded-2xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-300">
        <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-100 rounded-full -mr-10 -mt-10 opacity-50 group-hover:opacity-100 transition-opacity"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-600 font-medium">Enrolled Courses</p>
            <span className="text-3xl">📚</span>
          </div>
          <p className="text-4xl font-black text-gray-900 mb-2">0</p>
          <p className="text-sm text-gray-500">Courses in progress</p>
        </div>
      </div>

      {/* Learning Progress Card */}
      <div className="group relative overflow-hidden bg-white rounded-2xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-300">
        <div className="absolute top-0 right-0 w-20 h-20 bg-purple-100 rounded-full -mr-10 -mt-10 opacity-50 group-hover:opacity-100 transition-opacity"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-600 font-medium">Learning Progress</p>
            <span className="text-3xl">📈</span>
          </div>
          <p className="text-4xl font-black text-gray-900 mb-2">0%</p>
          <p className="text-sm text-gray-500">Average completion</p>
        </div>
      </div>

      {/* Messages Card */}
      <div className="group relative overflow-hidden bg-white rounded-2xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-300">
        <div className="absolute top-0 right-0 w-20 h-20 bg-amber-100 rounded-full -mr-10 -mt-10 opacity-50 group-hover:opacity-100 transition-opacity"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-600 font-medium">New Messages</p>
            <span className="text-3xl">💬</span>
          </div>
          <p className="text-4xl font-black text-gray-900 mb-2">0</p>
          <p className="text-sm text-gray-500">Unread messages</p>
        </div>
      </div>
    </div>
  );
}
