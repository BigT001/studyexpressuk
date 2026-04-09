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
    <div className="space-y-8 p-4 lg:p-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-[#008200] rounded-3xl p-10 text-white shadow-2xl relative overflow-hidden">
         <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay"></div>
         <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-4xl font-black tracking-tight text-white mb-2">Account & Security</h1>
              <p className="text-gray-300 text-lg font-medium max-w-xl">
                Manage your credentials, secure your identity, and control active endpoint sessions.
              </p>
            </div>
            <div className="hidden md:flex w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl items-center justify-center border border-white/20 shadow-inner">
               <span className="text-4xl shadow-sm">🛡️</span>
            </div>
         </div>
      </div>

      {/* Security Overview */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Account Status */}
        <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 text-green-700 rounded-xl flex items-center justify-center text-2xl font-black shadow-inner border border-green-200">
                 ✓
              </div>
              <div>
                <h3 className="text-xl font-black text-gray-900">Account Status</h3>
                <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mt-1">
                  System Validation
                </p>
              </div>
            </div>
            <div className="inline-flex items-center rounded-full bg-emerald-50 border border-emerald-200 px-4 py-1.5 text-sm font-black text-emerald-700 uppercase tracking-wide">
              Secure Channel
            </div>
          </div>
          <div className="pt-6 border-t border-gray-100">
            <p className="text-sm font-bold text-gray-400">🛡️ Perimeter scan completed: <span className="text-gray-800">Today</span></p>
          </div>
        </div>

        {/* Security Score */}
        <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center justify-between h-full">
            <div className="h-full flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-black text-gray-900">Integrity Score</h3>
                <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mt-1">
                  Overall Protection
                </p>
              </div>
              <p className="text-sm font-medium text-gray-500 mt-4 leading-relaxed max-w-[200px]">
                 Consider enabling 2FA or updating passwords to achieve maximum grade.
              </p>
            </div>
            <div className="flex items-center">
              <div className="relative h-28 w-28 drop-shadow-md">
                <svg className="h-28 w-28 transform -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15.915" fill="none" className="stroke-gray-100" strokeWidth="4"></circle>
                  <circle
                    cx="18" cy="18" r="15.915" fill="none"
                    className="stroke-[#008200]" strokeWidth="4" strokeDasharray="75 100" strokeLinecap="round"
                  ></circle>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-black text-gray-900">75<span className="text-lg">%</span></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Password & Authentication */}
      <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-xl shadow-gray-200/50">
        <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-100">
           <div className="text-2xl p-3 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">🔑</div>
           <h2 className="text-2xl font-bold text-gray-900">Authentication</h2>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between rounded-2xl border border-gray-100 bg-gray-50/50 p-6 hover:bg-white hover:shadow-lg transition-all duration-300 gap-4">
            <div>
              <h3 className="font-bold text-gray-900 text-lg">Change Password</h3>
              <p className="mt-1 text-sm font-medium text-gray-500">
                Update your active passphrase to invalidate old sessions immediately.
              </p>
            </div>
            <Link
              href="/individual/profile?section=password"
              className="inline-flex items-center justify-center rounded-xl bg-gray-900 px-6 py-3 font-bold text-white hover:bg-[#008200] hover:shadow-lg transition-all duration-300"
            >
              Update Key
            </Link>
          </div>
        </div>
      </div>

      {/* Device & Session Management */}
      <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-xl shadow-gray-200/50">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
           <div className="flex items-center gap-3">
              <div className="text-2xl p-3 bg-purple-50 text-purple-600 rounded-xl border border-purple-100">💻</div>
              <div>
                 <h2 className="text-2xl font-bold text-gray-900">Active Access Nodes</h2>
                 <p className="text-sm font-bold tracking-widest uppercase text-gray-500 mt-1">Endpoints Authorized</p>
              </div>
           </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-purple-600"></div>
          </div>
        ) : devices.length === 0 ? (
          <div className="text-center py-12 rounded-2xl bg-gray-50 border border-gray-100">
            <p className="text-gray-500 font-bold">No active sessions mapped.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {devices.map((device) => (
              <div
                key={device.id}
                className={`flex flex-col md:flex-row md:items-center justify-between rounded-2xl border p-6 transition-all duration-300 ${
                  device.isCurrent
                    ? 'border-emerald-200 bg-gradient-to-r from-emerald-50/50 to-white shadow-sm ring-1 ring-emerald-100/50'
                    : 'border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-md'
                }`}
              >
                <div className="flex items-start md:items-center space-x-6 flex-1 mb-4 md:mb-0">
                  <div className="text-4xl bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center">{device.icon}</div>
                  <div className="flex-1">
                    <h3 className={`font-black text-lg ${device.isCurrent ? 'text-emerald-900' : 'text-gray-900'}`}>{device.name}</h3>
                    <div className="flex flex-col gap-1 mt-2">
                       <p className="text-sm font-bold text-gray-500">
                         <span className="opacity-70">⏱ Last ping:</span> {formatDate(device.lastActive)}
                       </p>
                       <p className="text-sm font-bold text-gray-500">
                         <span className="opacity-70">📍 IP / Trace:</span> {device.ip} <span className="opacity-40 px-1">•</span> <span className="text-gray-700">{device.location}</span>
                       </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {device.isCurrent ? (
                    <span className="inline-flex items-center border border-emerald-300 rounded-lg bg-emerald-100 px-4 py-2 text-sm font-black text-emerald-800 uppercase tracking-wider">
                      Current Node
                    </span>
                  ) : (
                    <button className="text-sm font-bold text-red-600 hover:text-white px-5 py-2.5 rounded-xl border border-red-200 hover:bg-red-600 transition-colors duration-300">
                      Revoke
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {devices.length > 1 && (
          <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
             <button className="text-sm bg-red-50 text-red-700 px-6 py-3 rounded-xl border border-red-200 hover:bg-red-600 hover:text-white hover:shadow-lg font-black tracking-wide uppercase transition-all duration-300">
               Terminate All Foreign Nodes
             </button>
          </div>
        )}
      </div>

      {/* Danger Zone */}
      <div className="rounded-3xl border border-red-200 bg-gradient-to-br from-red-50 to-white p-8 shadow-xl shadow-red-900/5 relative overflow-hidden group">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-red-100 relative z-10">
           <div className="text-2xl p-3 bg-red-100 text-red-600 rounded-xl border border-red-200">⚠️</div>
           <h2 className="text-2xl font-black text-red-900">Danger Zone</h2>
        </div>

        <div className="relative z-10 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between rounded-2xl border border-red-200 bg-white p-6 shadow-sm">
            <div>
              <h3 className="font-black text-red-900 text-lg">Self-Destruct Sequence</h3>
              <p className="mt-1 text-sm font-bold text-red-700/80 max-w-lg">
                Permanently purge your account, data, credentials, and records from our architecture. This action is lethal and irreversible.
              </p>
            </div>
            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="mt-4 sm:mt-0 inline-flex items-center justify-center rounded-xl bg-red-600 px-8 py-4 text-sm font-black uppercase tracking-widest text-white hover:bg-red-700 shadow-lg shadow-red-600/30 hover:shadow-red-600/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={deleteLoading}
            >
              Purge Identity
            </button>
          </div>
        </div>
      </div>

      {/* Help Section */}
      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 flex items-start space-x-6">
          <div className="text-3xl p-4 bg-white rounded-2xl shadow-sm border border-slate-200 shrink-0">🤝</div>
          <div className="pt-2">
            <h3 className="text-lg font-black text-slate-900 tracking-tight">
              Require manual intervention?
            </h3>
            <p className="mt-2 text-base font-medium text-slate-600 leading-relaxed max-w-2xl">
              If an unauthorized device accesses your account, or you suspect a breach, immediately disable external nodes and contact cybersecurity operations at{' '}
              <a href="mailto:support@studyexpressuk.com" className="font-bold text-blue-600 hover:underline mx-1">support@studyexpressuk.com</a>
              or transmit to <span className="font-bold text-slate-800">0800 123 4567</span>.
            </p>
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
