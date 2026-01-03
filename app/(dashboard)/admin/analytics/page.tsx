export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Analytics & Reporting</h2>
        <p className="text-gray-600 mt-2">View platform metrics and generate detailed reports</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold mb-4">📊 Platform Metrics</h3>
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 rounded">
              <p className="text-sm text-gray-600">Daily Active Users</p>
              <p className="text-2xl font-bold text-blue-600">--</p>
            </div>
            <div className="p-3 bg-green-50 rounded">
              <p className="text-sm text-gray-600">Monthly Growth</p>
              <p className="text-2xl font-bold text-green-600">--</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold mb-4">📈 Engagement Analytics</h3>
          <p className="text-gray-600 text-sm mb-4">Course completion rates, session duration, and user activity</p>
          <button className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700">
            View Engagement
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold mb-4">📥 Export Reports</h3>
          <p className="text-gray-600 text-sm mb-4">Download data exports in CSV, PDF, and Excel formats</p>
          <button className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700">
            Generate Report
          </button>
        </div>
      </div>
    </div>
  );
}
