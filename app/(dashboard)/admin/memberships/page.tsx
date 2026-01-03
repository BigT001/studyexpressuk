export default function MembershipsManagementPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Membership Management</h2>
          <p className="text-gray-600 mt-2">Manage subscription plans, renewals, and member benefits</p>
        </div>
        <button className="bg-[#008200] text-white px-6 py-2 rounded-lg font-bold hover:bg-[#006600]">
          + Create Plan
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border-l-4 border-green-600">
          <p className="text-sm text-gray-600">Active Memberships</p>
          <p className="text-3xl font-bold text-green-600">--</p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border-l-4 border-blue-600">
          <p className="text-sm text-gray-600">Monthly Revenue</p>
          <p className="text-3xl font-bold text-blue-600">£--</p>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border-l-4 border-orange-600">
          <p className="text-sm text-gray-600">Renewals Due</p>
          <p className="text-3xl font-bold text-orange-600">--</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6 border-t-4 border-blue-600">
          <h3 className="text-lg font-bold mb-4">💳 Membership Plans</h3>
          <p className="text-gray-600 text-sm mb-4">Create and manage subscription tiers</p>
          <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
            Manage Plans
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-t-4 border-green-600">
          <h3 className="text-lg font-bold mb-4">📊 Active Subscriptions</h3>
          <p className="text-gray-600 text-sm mb-4">View and manage active memberships</p>
          <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
            View Subscriptions
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-t-4 border-purple-600">
          <h3 className="text-lg font-bold mb-4">🔄 Renewals & Upgrades</h3>
          <p className="text-gray-600 text-sm mb-4">Manage membership renewals and upgrades</p>
          <button className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700">
            View Renewals
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-bold mb-4">📋 Membership Plans</h3>
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-4">Plan Name</th>
              <th className="text-left py-2 px-4">Price</th>
              <th className="text-left py-2 px-4">Subscribers</th>
              <th className="text-left py-2 px-4">Status</th>
              <th className="text-left py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b hover:bg-gray-50">
              <td colSpan={5} className="text-center py-8 text-gray-500">
                No membership plans created yet
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
