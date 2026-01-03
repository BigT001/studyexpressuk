export default function CorporateManagementPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Corporate & Staff Oversight</h2>
        <p className="text-gray-600 mt-2">Manage corporate accounts and staff linkages</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-600">
          <h3 className="text-lg font-bold mb-4">Corporate Accounts</h3>
          <p className="text-gray-600">View and manage all corporate member accounts</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-600">
          <h3 className="text-lg font-bold mb-4">Staff Linkages</h3>
          <p className="text-gray-600">Approve and manage staff-corporate connections</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-600">
          <h3 className="text-lg font-bold mb-4">Corporate Structure</h3>
          <p className="text-gray-600">View hierarchical organization structures</p>
        </div>
      </div>
    </div>
  );
}
