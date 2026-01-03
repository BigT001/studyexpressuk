'use client';

import { useState } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  type: 'individual' | 'corporate';
  status: 'active' | 'pending' | 'inactive';
  joinDate: string;
}

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      type: 'individual',
      status: 'active',
      joinDate: '2024-01-15',
    },
    {
      id: '2',
      name: 'Acme Corp',
      email: 'contact@acme.com',
      type: 'corporate',
      status: 'pending',
      joinDate: '2025-12-20',
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    return type === 'individual'
      ? 'bg-blue-100 text-blue-800'
      : 'bg-purple-100 text-purple-800';
  };

  const handleApprove = (id: string) => {
    setUsers(
      users.map((user) =>
        user.id === id ? { ...user, status: 'active' } : user
      )
    );
  };

  const handleReject = (id: string) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
          <button className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
            Add User
          </button>
        </div>
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Email
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Type
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Status
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Join Date
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {user.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(
                      user.type
                    )}`}
                  >
                    {user.type === 'individual' ? 'Individual' : 'Corporate'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      user.status
                    )}`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {new Date(user.joinDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm space-x-2">
                  {user.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleApprove(user.id)}
                        className="px-3 py-1 bg-green-100 text-green-800 rounded hover:bg-green-200 transition-colors"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(user.id)}
                        className="px-3 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200 transition-colors"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {user.status === 'active' && (
                    <>
                      <button className="px-3 py-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition-colors">
                        Edit
                      </button>
                      <button className="px-3 py-1 bg-gray-100 text-gray-800 rounded hover:bg-gray-200 transition-colors">
                        View
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
