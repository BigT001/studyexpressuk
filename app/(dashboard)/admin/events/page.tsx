export default function EventsManagementPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Events Management</h2>
          <p className="text-gray-600 mt-2">Create, publish, and manage platform events and webinars</p>
        </div>
        <button className="bg-[#008200] text-white px-6 py-2 rounded-lg font-bold hover:bg-[#006600]">
          + Create Event
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border-l-4 border-blue-600">
          <p className="text-sm text-gray-600">Total Events</p>
          <p className="text-3xl font-bold text-blue-600">--</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border-l-4 border-green-600">
          <p className="text-sm text-gray-600">Active Events</p>
          <p className="text-3xl font-bold text-green-600">--</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border-l-4 border-purple-600">
          <p className="text-sm text-gray-600">Total Registrations</p>
          <p className="text-3xl font-bold text-purple-600">--</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold mb-4">📅 Upcoming Events</h3>
          <p className="text-gray-600 text-sm mb-4">View and manage scheduled events</p>
          <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
            View Events
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold mb-4">🔐 Access Rules</h3>
          <p className="text-gray-600 text-sm mb-4">Configure who can access each event</p>
          <button className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700">
            Manage Access
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-bold mb-4">📋 Events List</h3>
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-4">Event Name</th>
              <th className="text-left py-2 px-4">Date</th>
              <th className="text-left py-2 px-4">Registrations</th>
              <th className="text-left py-2 px-4">Status</th>
              <th className="text-left py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b hover:bg-gray-50">
              <td colSpan={5} className="text-center py-8 text-gray-500">
                No events created yet
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
