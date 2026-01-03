export default function UsersManagementPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">User Management</h2>
          <p className="text-gray-600 mt-2">Manage individual and corporate member accounts</p>
        </div>
        <input
          type="search"
          placeholder="Search users..."
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008200]"
        />
      </div>

      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border-l-4 border-blue-600">
          <p className="text-sm text-gray-600">Total Members</p>
          <p className="text-3xl font-bold text-blue-600">--</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border-l-4 border-green-600">
          <p className="text-sm text-gray-600">Active Users</p>
          <p className="text-3xl font-bold text-green-600">--</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border-l-4 border-yellow-600">
          <p className="text-sm text-gray-600">Pending Approval</p>
          <p className="text-3xl font-bold text-yellow-600">--</p>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border-l-4 border-red-600">
          <p className="text-sm text-gray-600">Deactivated</p>
          <p className="text-3xl font-bold text-red-600">--</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold mb-4">👤 Individual Members</h3>
          <p className="text-gray-600 text-sm mb-4">View and manage individual user accounts</p>
          <div className="space-y-2">
            <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
              View All Individuals
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold mb-4">🏢 Corporate Members</h3>
          <p className="text-gray-600 text-sm mb-4">View and manage corporate account memberships</p>
          <div className="space-y-2">
            <button className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700">
              View All Corporates
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold mb-4">✅ Approve Registrations</h3>
          <p className="text-gray-600 text-sm mb-4">Review and approve pending registration requests</p>
          <div className="space-y-2">
            <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
              View Pending Approvals
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold mb-4">🔧 Manage Accounts</h3>
          <p className="text-gray-600 text-sm mb-4">Edit user details, reset passwords, deactivate accounts</p>
          <div className="space-y-2">
            <button className="w-full bg-orange-600 text-white py-2 rounded hover:bg-orange-700">
              Manage User Accounts
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-bold mb-4">📋 Recent Activity</h3>
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-4">User</th>
              <th className="text-left py-2 px-4">Type</th>
              <th className="text-left py-2 px-4">Status</th>
              <th className="text-left py-2 px-4">Last Login</th>
              <th className="text-left py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b hover:bg-gray-50">
              <td colSpan={5} className="text-center py-8 text-gray-500">
                No users to display
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
