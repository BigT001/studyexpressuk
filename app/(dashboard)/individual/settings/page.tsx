import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Account & Security Settings | Individual Dashboard',
  description: 'Manage your account security and privacy settings',
};

export default function SettingsPage() {
  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Account & Security</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Manage your account security, privacy, and preferences
        </p>
      </div>

      {/* Security Overview */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Account Status */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Account Status</h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Your account is secure and active
              </p>
            </div>
            <div className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
              ✓ Secure
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400">Last verified: January 2, 2026</p>
          </div>
        </div>

        {/* Security Score */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Security Score</h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Improve your account protection
              </p>
            </div>
            <div className="flex items-center">
              <div className="relative h-12 w-12">
                <svg className="h-12 w-12 transform -rotate-90" viewBox="0 0 36 36">
                  <circle
                    cx="18"
                    cy="18"
                    r="15.915"
                    fill="none"
                    className="stroke-gray-200 dark:stroke-gray-700"
                    strokeWidth="3"
                  ></circle>
                  <circle
                    cx="18"
                    cy="18"
                    r="15.915"
                    fill="none"
                    className="stroke-green-500"
                    strokeWidth="3"
                    strokeDasharray="75 100"
                  ></circle>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold text-gray-900 dark:text-white">75%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Password & Authentication */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Password & Authentication</h2>

        <div className="mt-6 space-y-4">
          {/* Change Password */}
          <div className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-700">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">Change Password</h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Update your password regularly to keep your account secure
              </p>
            </div>
            <Link
              href="/individual/profile?section=password"
              className="inline-flex items-center rounded-lg bg-[#008200] px-4 py-2 text-sm font-medium text-white hover:bg-[#007000] dark:hover:bg-[#006600] transition-colors"
            >
              Update
            </Link>
          </div>

          {/* Two-Factor Authentication */}
          <div className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-700">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">
                Two-Factor Authentication (2FA)
              </h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Protect your account with an extra layer of security
              </p>
            </div>
            <button className="inline-flex items-center rounded-lg border border-[#008200] bg-white px-4 py-2 text-sm font-medium text-[#008200] hover:bg-green-50 dark:border-[#00B300] dark:bg-gray-800 dark:text-[#00B300] dark:hover:bg-gray-700 transition-colors">
              Enable
            </button>
          </div>

          {/* Login Alerts */}
          <div className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-700">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">Login Alerts</h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Get notified when your account is accessed from a new device
              </p>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input type="checkbox" value="" className="peer sr-only" defaultChecked />
              <div className="peer h-6 w-11 rounded-full bg-gray-300 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-[#008200] peer-checked:after:translate-x-full dark:peer-checked:bg-[#00B300]"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Device & Session Management */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Devices & Sessions</h2>

        <div className="mt-6 space-y-4">
          {/* Current Device */}
          <div className="flex items-start justify-between rounded-lg border border-green-100 bg-green-50 p-4 dark:border-green-900 dark:bg-green-900/20">
            <div className="flex items-start space-x-4">
              <div className="text-2xl">💻</div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Windows (Chrome)</h3>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  Last active: Just now
                </p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                  IP: 192.168.1.100 | Location: London, UK
                </p>
              </div>
            </div>
            <span className="inline-block rounded-full bg-green-200 px-3 py-1 text-xs font-medium text-green-800 dark:bg-green-800 dark:text-green-200">
              Current
            </span>
          </div>

          {/* Other Device */}
          <div className="flex items-start justify-between rounded-lg border border-gray-100 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-700">
            <div className="flex items-start space-x-4">
              <div className="text-2xl">📱</div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">iPhone (Safari)</h3>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  Last active: 3 days ago
                </p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                  IP: 192.168.1.50 | Location: London, UK
                </p>
              </div>
            </div>
            <button className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium">
              Remove
            </button>
          </div>
        </div>

        <button className="mt-4 text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium">
          Sign out from all other devices
        </button>
      </div>

      {/* Privacy & Data */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Privacy & Data</h2>

        <div className="mt-6 space-y-4">
          {/* Notification Preferences */}
          <Link href="/individual/profile?section=notifications" className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-4 hover:border-[#00B300] dark:border-gray-700 dark:bg-gray-700 dark:hover:border-[#00B300] transition-colors">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">Notification Preferences</h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Control which notifications you receive
              </p>
            </div>
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>

          {/* Privacy Settings */}
          <Link href="/individual/profile?section=privacy" className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-4 hover:border-[#00B300] dark:border-gray-700 dark:bg-gray-700 dark:hover:border-[#00B300] transition-colors">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">Privacy Settings</h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Manage your privacy and data sharing preferences
              </p>
            </div>
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>

          {/* Data Download */}
          <button className="flex w-full items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-4 hover:border-[#00B300] dark:border-gray-700 dark:bg-gray-700 dark:hover:border-[#00B300] transition-colors text-left">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">Download Your Data</h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Export your personal data in a portable format
              </p>
            </div>
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-900/20">
        <h2 className="text-xl font-bold text-red-900 dark:text-red-200">Danger Zone</h2>

        <div className="mt-6 space-y-4">
          {/* Close Account */}
          <div className="flex items-center justify-between rounded-lg border border-red-100 bg-white p-4 dark:border-red-800 dark:bg-gray-800">
            <div>
              <h3 className="font-medium text-red-900 dark:text-red-200">Close Account</h3>
              <p className="mt-1 text-sm text-red-700 dark:text-red-300">
                Permanently delete your account and all associated data
              </p>
            </div>
            <button className="inline-flex items-center rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 dark:hover:bg-red-800 transition-colors">
              Close Account
            </button>
          </div>
        </div>
      </div>

      {/* Help Section */}
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-6 dark:border-blue-900 dark:bg-blue-900/20">
        <div className="flex items-start space-x-4">
          <svg
            className="h-6 w-6 flex-shrink-0 text-blue-600 dark:text-blue-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zm-11-1a1 1 0 11-2 0 1 1 0 012 0zm3 1a1 1 0 100-2 1 1 0 000 2zm3 0a1 1 0 100-2 1 1 0 000 2z"
              clipRule="evenodd"
            />
          </svg>
          <div>
            <h3 className="text-base font-semibold text-blue-900 dark:text-blue-200">
              Need Help with Security?
            </h3>
            <p className="mt-1 text-sm text-blue-800 dark:text-blue-300">
              If you have any security concerns or need assistance, please contact our support team at{' '}
              <span className="font-semibold">support@studyexpressuk.com</span> or call us at{' '}
              <span className="font-semibold">+44 (0) 123 456 7890</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
