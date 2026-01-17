'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useDeleteAccount } from '@/hooks/useDeleteAccount';
import { DeleteAccountModal } from '@/components/DeleteAccountModal';

interface Device {
  id: string;
  name: string;
  icon: string;
  lastActive: string;
  ip: string;
  location: string;
  isCurrent: boolean;
}

export default function SettingsClient() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { deleteAccount, loading: deleteLoading, error: deleteError } = useDeleteAccount({
    userType: 'individual',
    onSuccess: () => {
      // Modal will be closed and user redirected
    },
  });

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const response = await fetch('/api/user/sessions');
        const data = await response.json();
        if (data.success && data.devices) {
          setDevices(data.devices);
        }
      } catch (error) {
        console.error('Error fetching devices:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDevices();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-black text-gray-900">Account & Security</h1>
        <p className="mt-2 text-gray-600 text-lg">
          Manage your account security, privacy, and preferences
        </p>
      </div>

      {/* Security Overview */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Account Status */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Account Status</h3>
              <p className="mt-1 text-sm text-gray-600">
                Your account is secure and active
              </p>
            </div>
            <div className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-bold text-green-800">
              ✓ Secure
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">Last verified: Today</p>
          </div>
        </div>

        {/* Security Score */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Security Score</h3>
              <p className="mt-1 text-sm text-gray-600">
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
                    className="stroke-gray-200"
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
                  <span className="text-sm font-bold text-gray-900">75%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Password & Authentication */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900">Password & Authentication</h2>

        <div className="mt-6 space-y-4">
          {/* Change Password */}
          <div className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-4 hover:bg-gray-100 transition-colors">
            <div>
              <h3 className="font-bold text-gray-900">Change Password</h3>
              <p className="mt-1 text-sm text-gray-600">
                Update your password regularly to keep your account secure
              </p>
            </div>
            <Link
              href="/individual/profile?section=password"
              className="inline-flex items-center rounded-lg bg-[#008200] px-4 py-2 text-sm font-bold text-white hover:bg-[#007000] transition-colors"
            >
              Update
            </Link>
          </div>
        </div>
      </div>

      {/* Device & Session Management */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900">Active Devices & Sessions</h2>
        <p className="text-sm text-gray-600 mt-1">Manage devices where you&apos;re signed in</p>

        {loading ? (
          <div className="mt-6 flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          </div>
        ) : devices.length === 0 ? (
          <div className="mt-6 text-center py-8">
            <p className="text-gray-600">No devices found</p>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {devices.map((device) => (
              <div
                key={device.id}
                className={`flex items-start justify-between rounded-lg border p-4 ${
                  device.isCurrent
                    ? 'border-green-100 bg-green-50'
                    : 'border-gray-100 bg-gray-50 hover:bg-gray-100 transition-colors'
                }`}
              >
                <div className="flex items-start space-x-4 flex-1">
                  <div className="text-2xl">{device.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">{device.name}</h3>
                    <p className="mt-1 text-sm text-gray-600">
                      Last active: {formatDate(device.lastActive)}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      IP: {device.ip} | Location: {device.location}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {device.isCurrent && (
                    <span className="inline-block rounded-full bg-green-200 px-3 py-1 text-xs font-bold text-green-800">
                      Current
                    </span>
                  )}
                  {!device.isCurrent && (
                    <button className="text-sm text-red-600 hover:text-red-700 font-bold hover:underline">
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {devices.length > 1 && (
          <button className="mt-6 text-sm text-red-600 hover:text-red-700 font-bold hover:underline">
            Sign out from all other devices
          </button>
        )}
      </div>

      {/* Danger Zone */}
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <h2 className="text-2xl font-bold text-red-900">Danger Zone</h2>

        <div className="mt-6 space-y-4">
          {/* Close Account */}
          <div className="flex items-center justify-between rounded-lg border border-red-100 bg-white p-4">
            <div>
              <h3 className="font-bold text-red-900">Close Account</h3>
              <p className="mt-1 text-sm text-red-700">
                Permanently delete your account and all associated data
              </p>
            </div>
            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="inline-flex items-center rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={deleteLoading}
            >
              Close Account
            </button>
          </div>
        </div>
      </div>

      {/* Help Section */}
      <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6">
        <div className="flex items-start space-x-4">
          <svg
            className="h-6 w-6 shrink-0 text-blue-600"
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
            <h3 className="text-base font-bold text-blue-900">
              Need Help with Security?
            </h3>
            <p className="mt-1 text-sm text-blue-800">
              If you have any security concerns or need assistance, please contact our support team at{' '}
              <span className="font-bold">support@studyexpressuk.com</span> or call us at{' '}
              <span className="font-bold">+44 (0) 123 456 7890</span>
            </p>
          </div>
        </div>
      </div>

      <DeleteAccountModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={deleteAccount}
        loading={deleteLoading}
        error={deleteError}
      />
    </div>
  );
}
