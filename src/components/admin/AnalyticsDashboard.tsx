'use client';

interface AnalyticsMetric {
  label: string;
  value: string | number;
  change: number;
  icon: string;
}

export function AnalyticsDashboard() {
  const metrics: AnalyticsMetric[] = [
    {
      label: 'Active Users',
      value: '1,234',
      change: 12.5,
      icon: '👥',
    },
    {
      label: 'Event Registrations',
      value: '456',
      change: 8.2,
      icon: '📅',
    },
    {
      label: 'Course Enrollments',
      value: '789',
      change: 15.3,
      icon: '📚',
    },
    {
      label: 'Premium Members',
      value: '345',
      change: 5.7,
      icon: '👑',
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Analytics & Insights</h2>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => (
          <div key={metric.label} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">{metric.label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {metric.value}
                </p>
                <p
                  className={`text-sm font-medium mt-2 ${
                    metric.change > 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {metric.change > 0 ? '+' : ''}{metric.change}% from last month
                </p>
              </div>
              <span className="text-4xl">{metric.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Chart Placeholder */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          User Activity Trend
        </h3>
        <div className="h-64 bg-gradient-to-b from-teal-50 to-blue-50 rounded-lg flex items-center justify-center text-gray-500">
          <p>Chart visualization would go here</p>
        </div>
      </div>

      {/* Top Performing Content */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Top Performing Content
        </h3>
        <div className="space-y-4">
          {[
            { title: 'Advanced Leadership Program', enrollments: 234 },
            { title: 'UK Business Culture Training', enrollments: 189 },
            { title: 'Digital Transformation Course', enrollments: 156 },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <span className="font-medium text-gray-900">{item.title}</span>
              <span className="text-sm text-gray-600">{item.enrollments} enrollments</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
