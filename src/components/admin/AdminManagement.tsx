'use client';

import { useState } from 'react';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'sub-admin';
  permissions: string[];
  status: 'active' | 'inactive';
}

export function AdminManagement() {
  const [admins, setAdmins] = useState<AdminUser[]>([
    {
      id: '1',
      name: 'Admin User',
      email: 'admin@studyexpress.com',
      role: 'admin',
      permissions: [
        'user_management',
        'content_management',
        'payments',
        'analytics',
      ],
      status: 'active',
    },
    {
      id: '2',
      name: 'John Manager',
      email: 'john@studyexpress.com',
      role: 'sub-admin',
      permissions: ['user_support', 'message_management'],
      status: 'active',
    },
  ]);

  const allPermissions = [
    'user_management',
    'content_management',
    'payments',
    'analytics',
    'user_support',
    'message_management',
    'settings',
    'reports',
  ];

  const getPermissionLabel = (permission: string) => {
    const labels: { [key: string]: string } = {
      user_management: 'User Management',
      content_management: 'Content Management',
      payments: 'Payment Management',
      analytics: 'Analytics',
      user_support: 'User Support',
      message_management: 'Message Management',
      settings: 'Site Settings',
      reports: 'Report Generation',
    };
    return labels[permission] || permission;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Admin Management</h2>
          <button className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
            Add Admin
          </button>
        </div>
      </div>

      <div className="divide-y divide-gray-200">
        {admins.map((admin) => (
          <div key={admin.id} className="p-6 hover:bg-gray-50 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {admin.name}
                </h3>
                <p className="text-sm text-gray-600 mt-1">{admin.email}</p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    admin.role === 'admin'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-orange-100 text-orange-800'
                  }`}
                >
                  {admin.role === 'admin' ? 'Full Admin' : 'Sub-Admin'}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    admin.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {admin.status}
                </span>
              </div>
            </div>

            {/* Permissions */}
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Permissions:
              </p>
              <div className="flex flex-wrap gap-2">
                {admin.permissions.map((permission) => (
                  <span
                    key={permission}
                    className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-xs font-medium"
                  >
                    {getPermissionLabel(permission)}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium">
                Edit
              </button>
              <button className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
                Deactivate
              </button>
              <button className="px-4 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium">
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Permission Reference */}
      <div className="p-6 bg-gray-50 border-t border-gray-200">
        <h4 className="font-semibold text-gray-900 mb-4">Available Permissions:</h4>
        <div className="grid grid-cols-2 gap-4">
          {allPermissions.map((permission) => (
            <div key={permission} className="flex items-center gap-2">
              <span className="w-2 h-2 bg-teal-600 rounded-full"></span>
              <span className="text-sm text-gray-700">
                {getPermissionLabel(permission)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
