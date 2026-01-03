export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">System Configuration</h2>
        <p className="text-gray-600 mt-2">Configure platform settings and system preferences</p>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-600">
          <h3 className="text-lg font-bold mb-4">📝 Registration Settings</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <span>Allow Individual Registration</span>
              <input type="checkbox" defaultChecked className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <span>Allow Corporate Registration</span>
              <input type="checkbox" defaultChecked className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <span>Require Email Verification</span>
              <input type="checkbox" defaultChecked className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-600">
          <h3 className="text-lg font-bold mb-4">🔒 Security Rules</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <span>Enforce 2FA for Admins</span>
              <input type="checkbox" defaultChecked className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <span>Password Expiry (Days)</span>
              <input type="number" defaultValue="90" className="w-20 px-2 py-1 border rounded" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-600">
          <h3 className="text-lg font-bold mb-4">⚡ Feature Toggles</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <span>Enable Messaging Module</span>
              <input type="checkbox" defaultChecked className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <span>Enable Analytics Dashboard</span>
              <input type="checkbox" defaultChecked className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <span>Enable Course Certifications</span>
              <input type="checkbox" defaultChecked className="w-5 h-5" />
            </div>
          </div>
        </div>

        <button className="w-full bg-[#008200] text-white py-3 rounded-lg font-bold hover:bg-[#006600]">
          Save Settings
        </button>
      </div>
    </div>
  );
}
