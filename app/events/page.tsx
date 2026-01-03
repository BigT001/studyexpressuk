export default function EventsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center space-y-6 mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            Upcoming <span className="text-teal-600">Events</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join our community at exclusive webinars, workshops, and networking events.
          </p>
        </div>

        {/* Events List */}
        <div className="space-y-6">
          {[1, 2, 3, 4].map((event) => (
            <div key={event} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
              <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-bold">
                      Coming Soon
                    </div>
                    <span className="text-sm text-gray-500">📅 Jan {15 + event}, 2026</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Event Title {event}</h3>
                  <p className="text-gray-600 mb-4">
                    Join us for an exciting event where industry leaders share insights and best practices. Network with professionals and expand your knowledge.
                  </p>
                  <div className="flex gap-4">
                    <span className="text-sm text-gray-500">🕐 2:00 PM - 3:30 PM</span>
                    <span className="text-sm text-gray-500">📍 Online</span>
                  </div>
                </div>
                <button className="px-6 py-3 bg-teal-600 text-white rounded hover:bg-teal-700 transition-colors font-bold whitespace-nowrap">
                  Register Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
