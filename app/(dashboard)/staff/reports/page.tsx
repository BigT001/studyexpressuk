'use client';

export default function ReportsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600 mt-2">View and analyze team performance</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
          <div className="text-5xl mb-4">📊</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Reports Coming Soon</h2>
          <p className="text-gray-600">This feature is being developed. You'll be able to view detailed reports and analytics here.</p>
        </div>
      </div>
    </div>
  );
}
