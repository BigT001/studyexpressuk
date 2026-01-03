export default function CommunicationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Messaging & Communications</h2>
        <p className="text-gray-600 mt-2">Send announcements, messages, and manage notifications</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-amber-500">
          <h3 className="text-lg font-bold mb-4">📢 Announcements</h3>
          <p className="text-gray-600 text-sm mb-4">Post system-wide announcements and important updates</p>
          <button className="w-full bg-amber-500 text-white py-2 rounded hover:bg-amber-600">
            Create Announcement
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
          <h3 className="text-lg font-bold mb-4">💬 Group Messaging</h3>
          <p className="text-gray-600 text-sm mb-4">Send messages to user groups and cohorts</p>
          <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
            Send Message
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
          <h3 className="text-lg font-bold mb-4">📧 Email Notifications</h3>
          <p className="text-gray-600 text-sm mb-4">Configure and send bulk email notifications</p>
          <button className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600">
            Send Email
          </button>
        </div>
      </div>
    </div>
  );
}
