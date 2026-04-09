'use client';

import { useState, useEffect } from 'react';

export default function CorporateSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [accessControl, setAccessControl] = useState({
    viewFinancials: true,
    managePeople: true,
    approveEnrollment: true,
    viewReports: true,
    editCourses: false,
    accessAnalytics: true,
    managePayments: true,
    viewAuditLogs: false,
  });

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [activeDevices, setActiveDevices] = useState<any[]>([]);
  const [updatingPassword, setUpdatingPassword] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [settingsRes, sessionsRes] = await Promise.all([
        fetch('/api/corporate/settings'),
        fetch('/api/user/sessions')
      ]);

      if (settingsRes.ok) {
        const settingsData = await settingsRes.json();
        if (settingsData.success) {
          setAccessControl(settingsData.accessControl);
          setTwoFactorEnabled(settingsData.twoFactorEnabled);
        }
      }

      if (sessionsRes.ok) {
        const sessionsData = await sessionsRes.json();
        if (sessionsData.success) {
          setActiveDevices(sessionsData.devices || []);
        }
      }
    } catch (err) {
      console.error('Failed to load initial data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChangeForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const submitPasswordChange = async () => {
    setError('');
    setMessage('');

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (passwordForm.newPassword.length < 8) {
      setError('New password must be at least 8 characters long');
      return;
    }

    setUpdatingPassword(true);
    try {
      const res = await fetch('/api/users/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(passwordForm),
      });

      const data = await res.json();
      if (data.success) {
        setMessage('Password updated successfully!');
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      } else {
        setError(data.error || 'Failed to update password');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setUpdatingPassword(false);
    }
  };

  const updateSettings = async (updates: any) => {
    try {
      const res = await fetch('/api/corporate/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error('Failed to update settings');
    } catch (err) {
      console.error('Error updating settings:', err);
      // Revert if needed in an advanced implementation
    }
  };

  const handleAccessControlChange = (key: keyof typeof accessControl) => {
    const newValue = !accessControl[key];
    setAccessControl(prev => ({ ...prev, [key]: newValue }));
    updateSettings({ accessControl: { ...accessControl, [key]: newValue } });
  };

  const toggleTwoFactor = () => {
    const newValue = !twoFactorEnabled;
    setTwoFactorEnabled(newValue);
    updateSettings({ twoFactorEnabled: newValue });
    setMessage(newValue ? 'Two-Factor Authentication enabled' : 'Two-Factor Authentication disabled');
    setTimeout(() => setMessage(''), 3000);
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading settings...</div>;
  }

  return (
    <div className="space-y-8 p-6">
      {/* Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex justify-between items-center">
          <span>{error}</span>
          <button onClick={() => setError('')}>&times;</button>
        </div>
      )}
      {message && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex justify-between items-center">
          <span>{message}</span>
          <button onClick={() => setMessage('')}>&times;</button>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage account security and access control</p>
      </div>

      {/* Change Password Section */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔑</span>
            <h2 className="text-2xl font-bold text-gray-900">Change Password</h2>
          </div>
          <p className="text-gray-600 mt-1">Update your account password regularly for security</p>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
            <div className="relative">
              <input
                type={showPasswords.current ? 'text' : 'password'}
                name="currentPassword"
                value={passwordForm.currentPassword}
                onChange={handlePasswordChangeForm}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 pr-10"
                placeholder="Enter your current password"
              />
              <button
                onClick={() => togglePasswordVisibility('current')}
                className="absolute right-3 top-2.5 text-gray-600 hover:text-gray-900"
              >
                {showPasswords.current ? '🚫' : '👁️'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
              <div className="relative">
                <input
                  type={showPasswords.new ? 'text' : 'password'}
                  name="newPassword"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChangeForm}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 pr-10"
                  placeholder="Enter new password"
                />
                <button
                  onClick={() => togglePasswordVisibility('new')}
                  className="absolute right-3 top-2.5 text-gray-600 hover:text-gray-900"
                >
                  {showPasswords.new ? '🚫' : '👁️'}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
              <div className="relative">
                <input
                  type={showPasswords.confirm ? 'text' : 'password'}
                  name="confirmPassword"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChangeForm}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 pr-10"
                  placeholder="Confirm new password"
                />
                <button
                  onClick={() => togglePasswordVisibility('confirm')}
                  className="absolute right-3 top-2.5 text-gray-600 hover:text-gray-900"
                >
                  {showPasswords.confirm ? '🚫' : '👁️'}
                </button>
              </div>
            </div>
          </div>

          <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
            <p className="font-medium mb-2">Password Requirements:</p>
            <ul className="space-y-1">
              <li>• At least 8 characters long</li>
              <li>• Contains uppercase and lowercase letters</li>
              <li>• Contains at least one number</li>
              <li>• Contains at least one special character (!@#$%^&*)</li>
            </ul>
          </div>

          <button 
            onClick={submitPasswordChange}
            disabled={updatingPassword || !passwordForm.currentPassword || !passwordForm.newPassword}
            className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50"
          >
            {updatingPassword ? 'Updating...' : 'Update Password'}
          </button>
        </div>
      </div>

      {/* Two-Factor Authentication */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-red-50 to-red-100 p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🛡️</span>
            <h2 className="text-2xl font-bold text-gray-900">Two-Factor Authentication</h2>
          </div>
          <p className="text-gray-600 mt-1">Add an extra layer of security to your account</p>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Enable 2FA</p>
              <p className="text-sm text-gray-600 mt-1">Require authentication code in addition to password</p>
            </div>
            <button
              onClick={toggleTwoFactor}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                twoFactorEnabled ? 'bg-red-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  twoFactorEnabled ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {twoFactorEnabled && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg overflow-hidden transition-all duration-300">
              <p className="text-sm text-red-900 mb-3">
                <strong>Setup Instructions:</strong> Two-Factor Authentication is currently enabled on your account. Keep your authenticator application configured.
              </p>
              <button onClick={toggleTwoFactor} className="mt-2 px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                Disable 2FA
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Access Control */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔒</span>
            <h2 className="text-2xl font-bold text-gray-900">Access Control</h2>
          </div>
          <p className="text-gray-600 mt-1">Manage permissions for your corporate account</p>
        </div>

        <div className="p-6 space-y-3">
          {Object.entries(accessControl).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div>
                <p className="font-medium text-gray-900 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {key === 'viewFinancials' && 'Access financial reports and billing information'}
                  {key === 'managePeople' && 'Add, edit, or remove staff members'}
                  {key === 'approveEnrollment' && 'Approve or reject staff course enrollments'}
                  {key === 'viewReports' && 'View advanced analytics and performance reports'}
                  {key === 'editCourses' && 'Create and edit custom courses for your organization'}
                  {key === 'accessAnalytics' && 'Access detailed learning analytics and insights'}
                  {key === 'managePayments' && 'Manage billing and payment information'}
                  {key === 'viewAuditLogs' && 'View activity logs and audit trails'}
                </p>
              </div>
              <button
                onClick={() => handleAccessControlChange(key as keyof typeof accessControl)}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                  value ? 'bg-green-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                    value ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Active Devices */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Active Sessions</h2>
          <p className="text-gray-600 mt-1">Manage devices and sessions accessing your account</p>
        </div>

        <div className="divide-y divide-gray-200">
          {activeDevices.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No active sessions mapped.</div>
          ) : activeDevices.map((device) => (
            <div key={device.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{device.icon}</span>
                    <h3 className="font-bold text-gray-900">{device.name}</h3>
                    {device.isCurrent && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-900 rounded-full text-xs font-medium">
                        Current Session
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm mt-1">{device.location} • {device.ip}</p>
                  <p className="text-gray-600 text-xs mt-1">Last active: {new Date(device.lastActive).toLocaleString()}</p>
                </div>

                {!device.isCurrent && (
                  <button className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                    Sign Out
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-orange-50 border-t border-orange-200 p-4">
          <div className="flex items-start gap-3">
            <span className="text-xl">⚠️</span>
            <p className="text-sm text-orange-900">
              If you see any unfamiliar devices, sign them out immediately and change your password.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
