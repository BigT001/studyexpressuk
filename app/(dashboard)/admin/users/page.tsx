'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface User {
  _id: string;
  email: string;
  phone?: string;
  role: 'INDIVIDUAL' | 'CORPORATE' | 'SUB_ADMIN' | 'ADMIN';
  status: 'subscribed' | 'not-subscribed';
  createdAt: string;
  firstName?: string;
  lastName?: string;
}

export default function UsersManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState('');

  const stats = {
    total: users.length,
    subscribed: users.filter(u => u.status === 'subscribed').length,
    notSubscribed: users.filter(u => u.status === 'not-subscribed').length,
    individual: users.filter(u => u.role === 'INDIVIDUAL').length,
    corporate: users.filter(u => u.role === 'CORPORATE').length,
    subAdmin: users.filter(u => u.role === 'SUB_ADMIN').length,
    admin: users.filter(u => u.role === 'ADMIN').length,
  };

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/users?limit=1000');
        if (!response.ok) throw new Error('Failed to fetch users');
        const data = await response.json();
        setUsers(data.users || []);
        setError('');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load users');
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filter users based on search and filters
  useEffect(() => {
    let filtered = users;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(u =>
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Role filter
    if (filterRole !== 'all') {
      filtered = filtered.filter(u => u.role === filterRole);
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(u => u.status === filterStatus);
    }

    setFilteredUsers(filtered);
  }, [users, searchTerm, filterRole, filterStatus]);

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      INDIVIDUAL: 'bg-blue-100 text-blue-800',
      CORPORATE: 'bg-purple-100 text-purple-800',
      ADMIN: 'bg-red-100 text-red-800',
      SUB_ADMIN: 'bg-orange-100 text-orange-800',
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      subscribed: 'bg-green-100 text-green-800',
      'not-subscribed': 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      subscribed: 'Subscribed',
      'not-subscribed': 'Not Subscribed',
    };
    return labels[status] || status;
  };

  const handleStatusChange = async (userId: string, newStatus: string) => {
    try {
      setActionLoading(true);
      setActionError('');
      
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error('Failed to update user status');
      
      // Update local state
      const newStatusTyped = newStatus as 'subscribed' | 'not-subscribed';
      setUsers(users.map(u => u._id === userId ? { ...u, status: newStatusTyped } : u));
      setSelectedUser(prev => prev?._id === userId ? { ...prev, status: newStatusTyped } : prev);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to update user');
    } finally {
      setActionLoading(false);
    }
  };

  const handleResetPassword = async (userId: string) => {
    try {
      setActionLoading(true);
      setActionError('');
      
      const response = await fetch(`/api/users/${userId}/reset-password`, {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Failed to send password reset');
      
      setActionError('');
      alert('Password reset email sent to user');
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to reset password');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-600 mt-2 text-sm md:text-base">Manage individual and corporate member accounts</p>
          </div>
          <input
            type="search"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64"
          />
        </div>

        {/* Stats Cards - All in one row, responsive */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 sm:p-4 md:p-6 border-l-4 border-blue-600">
            <p className="text-xs sm:text-xs md:text-sm text-gray-600 font-medium truncate">Total Members</p>
            <p className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-600 mt-1 sm:mt-2">{stats.total}</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3 sm:p-4 md:p-6 border-l-4 border-green-600">
            <p className="text-xs sm:text-xs md:text-sm text-gray-600 font-medium truncate">Subscribed</p>
            <p className="text-xl sm:text-2xl md:text-3xl font-bold text-green-600 mt-1 sm:mt-2">{stats.subscribed}</p>
          </div>
          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-3 sm:p-4 md:p-6 border-l-4 border-red-600">
            <p className="text-xs sm:text-xs md:text-sm text-gray-600 font-medium truncate">Not Subscribed</p>
            <p className="text-xl sm:text-2xl md:text-3xl font-bold text-red-600 mt-1 sm:mt-2">{stats.notSubscribed}</p>
          </div>
          <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-lg p-3 sm:p-4 md:p-6 border-l-4 border-cyan-600">
            <p className="text-xs sm:text-xs md:text-sm text-gray-600 font-medium truncate">Individuals</p>
            <p className="text-xl sm:text-2xl md:text-3xl font-bold text-cyan-600 mt-1 sm:mt-2">{stats.individual}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-3 sm:p-4 md:p-6 border-l-4 border-purple-600">
            <p className="text-xs sm:text-xs md:text-sm text-gray-600 font-medium truncate">Corporate</p>
            <p className="text-xl sm:text-2xl md:text-3xl font-bold text-purple-600 mt-1 sm:mt-2">{stats.corporate}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 md:p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">Filter by Role</label>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="all">All Roles</option>
                <option value="INDIVIDUAL">Individual</option>
                <option value="CORPORATE">Corporate</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="all">All Status</option>
                <option value="subscribed">Subscribed</option>
                <option value="not-subscribed">Not Subscribed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            {error ? (
              <div className="p-6 text-center text-red-600">
                <p className="font-medium">Error loading users</p>
                <p className="text-sm">{error}</p>
              </div>
            ) : loading ? (
              <div className="p-6 text-center text-gray-500">
                <p>Loading users...</p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <p>No users found</p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-3 px-4 text-xs md:text-sm font-semibold text-gray-700">Email</th>
                    <th className="text-left py-3 px-4 text-xs md:text-sm font-semibold text-gray-700">Name</th>
                    <th className="text-left py-3 px-4 text-xs md:text-sm font-semibold text-gray-700">Role</th>
                    <th className="text-left py-3 px-4 text-xs md:text-sm font-semibold text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 text-xs md:text-sm font-semibold text-gray-700">Joined</th>
                    <th className="text-left py-3 px-4 text-xs md:text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4 text-xs md:text-sm text-gray-900">{user.email}</td>
                      <td className="py-3 px-4 text-xs md:text-sm text-gray-600">
                        {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : '-'}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getRoleColor(user.role)}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getStatusColor(user.status)}`}>
                          {getStatusLabel(user.status)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-xs md:text-sm text-gray-600">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <button 
                          onClick={() => setSelectedUser(user)}
                          className="text-blue-600 hover:text-blue-800 text-xs md:text-sm font-medium">
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination info */}
          {!loading && !error && (
            <div className="bg-gray-50 border-t border-gray-200 px-4 py-3 flex justify-between items-center text-xs md:text-sm text-gray-600">
              <span>Showing {filteredUsers.length} of {users.length} users</span>
              <span>Page 1</span>
            </div>
          )}
        </div>

        {/* User Details Modal */}
        {selectedUser && (
          <div 
            className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedUser(null)}>
            <div 
              className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}>
              {/* Modal Header */}
              <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex justify-between items-center">
                <h2 className="text-xl md:text-2xl font-bold text-white">User Details</h2>
                <button 
                  onClick={() => setSelectedUser(null)}
                  className="text-white hover:text-gray-200 text-2xl leading-none">
                  ×
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-6">
                {actionError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800 text-sm">
                    {actionError}
                  </div>
                )}

                {/* User Basic Info */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-600 font-medium uppercase">Email</p>
                      <p className="text-sm md:text-base text-gray-900 mt-1">{selectedUser.email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-medium uppercase">Phone</p>
                      <p className="text-sm md:text-base text-gray-900 mt-1">{selectedUser.phone || '-'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-medium uppercase">Full Name</p>
                      <p className="text-sm md:text-base text-gray-900 mt-1">
                        {selectedUser.firstName && selectedUser.lastName 
                          ? `${selectedUser.firstName} ${selectedUser.lastName}` 
                          : '-'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-medium uppercase">Joined</p>
                      <p className="text-sm md:text-base text-gray-900 mt-1">
                        {new Date(selectedUser.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* User Role & Status */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Account Status</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-600 font-medium uppercase">Role</p>
                      <div className="mt-2">
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(selectedUser.role)}`}>
                          {selectedUser.role}
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-medium uppercase">Current Status</p>
                      <div className="mt-2">
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedUser.status)}`}>
                          {getStatusLabel(selectedUser.status)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Admin Actions */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Admin Actions</h3>
                  
                  {/* Status Change */}
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600 font-medium">Change Subscription Status</p>
                    <div className="flex flex-col sm:flex-row gap-2">
                      {['subscribed', 'not-subscribed'].map((status) => (
                        <button
                          key={status}
                          onClick={() => handleStatusChange(selectedUser._id, status)}
                          disabled={actionLoading || selectedUser.status === status}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            selectedUser.status === status
                              ? 'bg-gray-200 text-gray-600 cursor-not-allowed'
                              : status === 'subscribed'
                              ? 'bg-green-600 text-white hover:bg-green-700'
                              : 'bg-red-600 text-white hover:bg-red-700'
                          }`}>
                          {actionLoading ? 'Processing...' : `Set ${getStatusLabel(status)}`}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Reset Password */}
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600 font-medium">Password Management</p>
                    <button
                      onClick={() => handleResetPassword(selectedUser._id)}
                      disabled={actionLoading}
                      className="w-full px-4 py-2 rounded-lg text-sm font-medium bg-orange-600 text-white hover:bg-orange-700 transition-all disabled:opacity-50">
                      {actionLoading ? 'Processing...' : 'Send Password Reset Email'}
                    </button>
                  </div>

                  {/* User ID */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs text-gray-600 font-medium uppercase">User ID</p>
                    <p className="text-sm text-gray-900 mt-1 font-mono break-all">{selectedUser._id}</p>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
                <button
                  onClick={() => setSelectedUser(null)}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-all">
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
