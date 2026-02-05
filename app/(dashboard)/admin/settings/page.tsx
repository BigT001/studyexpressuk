'use client';

import React, { useEffect, useState } from 'react';
import { Save, RotateCcw, AlertCircle, CheckCircle, Loader } from 'lucide-react';

interface SystemSettings {
  // Registration
  allowIndividualRegistration: boolean;
  allowCorporateRegistration: boolean;
  requireEmailVerification: boolean;
  
  // Security
  enforce2FAForAdmins: boolean;
  passwordExpiryDays: number;
  sessionTimeoutMinutes: number;
  maxLoginAttempts: number;
  
  // Email Configuration
  smtpHost: string;
  smtpPort: number;
  smtpUsername: string;
  emailFromName: string;
  emailFromAddress: string;
  
  // Payment & Billing
  stripeEnabled: boolean;
  taxRate: number;
  
  // System
  maintenanceMode: boolean;
  maintenanceMessage: string;
  
  // Features
  enableMessaging: boolean;
  enableAnalytics: boolean;
  enableCertificates: boolean;
  enableEventNotifications: boolean;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SystemSettings>({
    allowIndividualRegistration: true,
    allowCorporateRegistration: true,
    requireEmailVerification: true,
    enforce2FAForAdmins: true,
    passwordExpiryDays: 90,
    sessionTimeoutMinutes: 60,
    maxLoginAttempts: 5,
    smtpHost: 'smtp.gmail.com',
    smtpPort: 587,
    smtpUsername: 'noreply@studyexpressuk.com',
    emailFromName: 'Study Express UK',
    emailFromAddress: 'noreply@studyexpressuk.com',
    stripeEnabled: true,
    taxRate: 0,
    maintenanceMode: false,
    maintenanceMessage: '',
    enableMessaging: true,
    enableAnalytics: true,
    enableCertificates: true,
    enableEventNotifications: true,
  });

  const [originalSettings, setOriginalSettings] = useState<SystemSettings>(settings);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  useEffect(() => {
    setHasChanges(JSON.stringify(settings) !== JSON.stringify(originalSettings));
  }, [settings, originalSettings]);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(data.settings || settings);
        setOriginalSettings(data.settings || settings);
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage({ type: 'success', text: 'Settings saved successfully!' });
        setOriginalSettings(settings);
        setTimeout(() => setMessage(null), 5000);
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to save settings' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save settings' });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setSettings(originalSettings);
    setMessage(null);
  };

  const handleChange = (key: keyof SystemSettings, value: any) => {
    setSettings({ ...settings, [key]: value });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900">System Configuration</h1>
        <p className="text-gray-600 mt-2">Manage platform settings, security rules, and system preferences</p>
      </div>

      {/* Messages */}
      {message && (
        <div className={`flex items-center gap-3 p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200'
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Settings Sections */}
      <div className="space-y-6">
        {/* Registration Settings */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-600">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">📝 Registration Settings</h2>
          <div className="space-y-4">
            <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition">
              <input
                type="checkbox"
                checked={settings.allowIndividualRegistration}
                onChange={(e) => handleChange('allowIndividualRegistration', e.target.checked)}
                className="w-5 h-5 text-blue-600 rounded"
              />
              <div>
                <p className="font-semibold text-gray-900">Allow Individual Registration</p>
                <p className="text-sm text-gray-600">Permit individual users to sign up</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition">
              <input
                type="checkbox"
                checked={settings.allowCorporateRegistration}
                onChange={(e) => handleChange('allowCorporateRegistration', e.target.checked)}
                className="w-5 h-5 text-blue-600 rounded"
              />
              <div>
                <p className="font-semibold text-gray-900">Allow Corporate Registration</p>
                <p className="text-sm text-gray-600">Permit corporate organizations to register</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition">
              <input
                type="checkbox"
                checked={settings.requireEmailVerification}
                onChange={(e) => handleChange('requireEmailVerification', e.target.checked)}
                className="w-5 h-5 text-blue-600 rounded"
              />
              <div>
                <p className="font-semibold text-gray-900">Require Email Verification</p>
                <p className="text-sm text-gray-600">Users must verify email before access</p>
              </div>
            </label>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-600">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">🔒 Security Rules</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition">
              <input
                type="checkbox"
                checked={settings.enforce2FAForAdmins}
                onChange={(e) => handleChange('enforce2FAForAdmins', e.target.checked)}
                className="w-5 h-5 text-red-600 rounded"
              />
              <div>
                <p className="font-semibold text-gray-900">Enforce 2FA for Admins</p>
                <p className="text-sm text-gray-600">Require two-factor authentication</p>
              </div>
            </label>

            <div className="p-4 bg-gray-50 rounded-lg">
              <label className="block">
                <p className="font-semibold text-gray-900 mb-2">Password Expiry (Days)</p>
                <input
                  type="number"
                  min="0"
                  max="365"
                  value={settings.passwordExpiryDays}
                  onChange={(e) => handleChange('passwordExpiryDays', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                />
                <p className="text-xs text-gray-600 mt-1">Set to 0 to disable expiry</p>
              </label>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <label className="block">
                <p className="font-semibold text-gray-900 mb-2">Session Timeout (Minutes)</p>
                <input
                  type="number"
                  min="5"
                  max="1440"
                  value={settings.sessionTimeoutMinutes}
                  onChange={(e) => handleChange('sessionTimeoutMinutes', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                />
                <p className="text-xs text-gray-600 mt-1">Auto-logout duration</p>
              </label>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <label className="block">
                <p className="font-semibold text-gray-900 mb-2">Max Login Attempts</p>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={settings.maxLoginAttempts}
                  onChange={(e) => handleChange('maxLoginAttempts', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                />
                <p className="text-xs text-gray-600 mt-1">Failed attempts before lockout</p>
              </label>
            </div>
          </div>
        </div>

        {/* Email Configuration */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-600">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">📧 Email Configuration</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <label className="block">
                <p className="font-semibold text-gray-900 mb-2">SMTP Host</p>
                <input
                  type="text"
                  value={settings.smtpHost}
                  onChange={(e) => handleChange('smtpHost', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </label>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <label className="block">
                <p className="font-semibold text-gray-900 mb-2">SMTP Port</p>
                <input
                  type="number"
                  value={settings.smtpPort}
                  onChange={(e) => handleChange('smtpPort', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </label>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <label className="block">
                <p className="font-semibold text-gray-900 mb-2">SMTP Username</p>
                <input
                  type="text"
                  value={settings.smtpUsername}
                  onChange={(e) => handleChange('smtpUsername', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </label>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <label className="block">
                <p className="font-semibold text-gray-900 mb-2">From Name</p>
                <input
                  type="text"
                  value={settings.emailFromName}
                  onChange={(e) => handleChange('emailFromName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </label>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg md:col-span-2">
              <label className="block">
                <p className="font-semibold text-gray-900 mb-2">From Email Address</p>
                <input
                  type="email"
                  value={settings.emailFromAddress}
                  onChange={(e) => handleChange('emailFromAddress', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Payment & Billing */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-600">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">💳 Payment & Billing</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition">
              <input
                type="checkbox"
                checked={settings.stripeEnabled}
                onChange={(e) => handleChange('stripeEnabled', e.target.checked)}
                className="w-5 h-5 text-green-600 rounded"
              />
              <div>
                <p className="font-semibold text-gray-900">Enable Stripe Payments</p>
                <p className="text-sm text-gray-600">Accept online payments</p>
              </div>
            </label>

            <div className="p-4 bg-gray-50 rounded-lg">
              <label className="block">
                <p className="font-semibold text-gray-900 mb-2">Tax Rate (%)</p>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={settings.taxRate}
                  onChange={(e) => handleChange('taxRate', parseFloat(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </label>
            </div>
          </div>
        </div>

        {/* System Maintenance */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-amber-600">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">⚙️ System Maintenance</h2>
          <div className="space-y-4">
            <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition">
              <input
                type="checkbox"
                checked={settings.maintenanceMode}
                onChange={(e) => handleChange('maintenanceMode', e.target.checked)}
                className="w-5 h-5 text-amber-600 rounded"
              />
              <div>
                <p className="font-semibold text-gray-900">Maintenance Mode</p>
                <p className="text-sm text-gray-600">Disable platform for all non-admin users</p>
              </div>
            </label>

            {settings.maintenanceMode && (
              <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                <label className="block">
                  <p className="font-semibold text-gray-900 mb-2">Maintenance Message</p>
                  <textarea
                    value={settings.maintenanceMessage}
                    onChange={(e) => handleChange('maintenanceMessage', e.target.value)}
                    placeholder="We're performing scheduled maintenance..."
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                  />
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-indigo-600">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">⚡ Feature Toggles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition">
              <input
                type="checkbox"
                checked={settings.enableMessaging}
                onChange={(e) => handleChange('enableMessaging', e.target.checked)}
                className="w-5 h-5 text-indigo-600 rounded"
              />
              <div>
                <p className="font-semibold text-gray-900">Messaging Module</p>
                <p className="text-sm text-gray-600">User-to-user messaging</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition">
              <input
                type="checkbox"
                checked={settings.enableAnalytics}
                onChange={(e) => handleChange('enableAnalytics', e.target.checked)}
                className="w-5 h-5 text-indigo-600 rounded"
              />
              <div>
                <p className="font-semibold text-gray-900">Analytics Dashboard</p>
                <p className="text-sm text-gray-600">Business intelligence & insights</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition">
              <input
                type="checkbox"
                checked={settings.enableCertificates}
                onChange={(e) => handleChange('enableCertificates', e.target.checked)}
                className="w-5 h-5 text-indigo-600 rounded"
              />
              <div>
                <p className="font-semibold text-gray-900">Course Certificates</p>
                <p className="text-sm text-gray-600">Generate completion certificates</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition">
              <input
                type="checkbox"
                checked={settings.enableEventNotifications}
                onChange={(e) => handleChange('enableEventNotifications', e.target.checked)}
                className="w-5 h-5 text-indigo-600 rounded"
              />
              <div>
                <p className="font-semibold text-gray-900">Event Notifications</p>
                <p className="text-sm text-gray-600">Send event reminders & updates</p>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 sticky bottom-0 bg-white p-4 rounded-lg shadow border-t">
        <button
          onClick={handleSave}
          disabled={!hasChanges || saving}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-semibold transition ${
            hasChanges && !saving
              ? 'bg-[#008200] text-white hover:bg-[#006600]'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          {saving ? <Loader className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          {saving ? 'Saving...' : 'Save Settings'}
        </button>

        <button
          onClick={handleReset}
          disabled={!hasChanges}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-semibold transition ${
            hasChanges
              ? 'bg-gray-200 text-gray-900 hover:bg-gray-300'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          <RotateCcw className="w-5 h-5" />
          Reset Changes
        </button>
      </div>
    </div>
  );
}
