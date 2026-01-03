'use client';

import { useState, useEffect } from 'react';

interface SubAdmin {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  permissionLevel: 'FULL_ADMIN' | 'CONTENT_ADMIN' | 'USER_ADMIN';
  isActive: boolean;
  createdAt: string;
}

const permissionLevels = [
  {
    value: 'FULL_ADMIN',
    label: 'Full Admin',
    description: 'All permissions',
  },
  {
    value: 'CONTENT_ADMIN',
    label: 'Content Admin',
    description: 'Manage events, courses, and content',
  },
  {
    value: 'USER_ADMIN',
    label: 'User Admin',
    description: 'Manage user accounts and memberships',
  },
];

export default function SubAdminManagementPage() {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [subAdmins, setSubAdmins] = useState<SubAdmin[]>([]);
  const [fetchingSubAdmins, setFetchingSubAdmins] = useState(true);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    permissionLevel: 'USER_ADMIN',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchSubAdmins();
  }, []);

  const fetchSubAdmins = async () => {
    try {
      setFetchingSubAdmins(true);
      const response = await fetch('/api/subadmins');
      if (response.ok) {
        const data = await response.json();
        setSubAdmins(data.subAdmins);
      }
    } catch (err) {
      console.error('Failed to fetch sub-admins:', err);
    } finally {
      setFetchingSubAdmins(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const validateForm = () => {
    if (!formData.firstName.trim()) {
      setError('First name is required');
      return false;
    }
    if (!formData.lastName.trim()) {
      setError('Last name is required');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!formData.password) {
      setError('Password is required');
      return false;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/subadmins', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          permissionLevel: formData.permissionLevel,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to create sub-admin');
        return;
      }

      setSuccess('Sub-admin created successfully!');
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        permissionLevel: 'USER_ADMIN',
      });
      setShowModal(false);
      fetchSubAdmins();

      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to create sub-admin. Please try again.');
      console.error('Error creating sub-admin:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Sub-Admin Management</h2>
          <p className="text-gray-600 mt-2">Create and manage sub-administrator accounts with custom permissions</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-[#008200] text-white px-6 py-2 rounded-lg font-bold hover:bg-[#006600] transition-colors"
        >
          + Create Sub-Admin
        </button>
      </div>

      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-900 px-4 py-3 rounded-lg">
          {success}
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Sub-Admin Accounts */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-600">
          <h3 className="text-lg font-bold mb-4">👥 Sub-Admin Accounts</h3>
          <p className="text-gray-600 text-sm mb-4">View, edit, and manage all sub-administrator accounts</p>

          {fetchingSubAdmins ? (
            <p className="text-sm text-gray-500">Loading...</p>
          ) : subAdmins.length === 0 ? (
            <p className="text-sm text-gray-500">No sub-admins created yet</p>
          ) : (
            <div className="space-y-3">
              {subAdmins.map((subAdmin) => {
                const permLevel = permissionLevels.find(p => p.value === subAdmin.permissionLevel);
                return (
                  <div key={subAdmin.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {subAdmin.firstName} {subAdmin.lastName}
                        </p>
                        <p className="text-sm text-gray-600">{subAdmin.email}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          <span className="inline-block bg-blue-100 text-blue-900 px-2 py-0.5 rounded">
                            {permLevel?.label}
                          </span>
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button className="text-blue-600 hover:text-blue-900 text-sm font-medium">Edit</button>
                        <button className="text-red-600 hover:text-red-900 text-sm font-medium">Remove</button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Permission Levels Info */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-600">
          <h3 className="text-lg font-bold mb-4">🔑 Permission Levels</h3>
          <div className="space-y-3">
            {permissionLevels.map((level) => (
              <div key={level.value} className="p-3 bg-gray-50 rounded border border-gray-200 hover:border-purple-300 transition-colors">
                <p className="font-semibold text-sm text-gray-900">{level.label}</p>
                <p className="text-xs text-gray-600">{level.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Create Sub-Admin Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#008200] to-[#006600] px-6 py-8 text-white">
              <h2 className="text-2xl font-bold">Create New Sub-Admin</h2>
              <p className="text-green-100 mt-2">Add a new sub-administrator to your platform</p>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-900 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008200]"
                    placeholder="Enter first name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008200]"
                    placeholder="Enter last name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008200]"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Permission Level</label>
                <select
                  name="permissionLevel"
                  value={formData.permissionLevel}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008200]"
                >
                  {permissionLevels.map((level) => (
                    <option key={level.value} value={level.value}>
                      {level.label} - {level.description}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008200]"
                  placeholder="••••••••"
                />
                <p className="text-xs text-gray-500 mt-1">Minimum 8 characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008200]"
                  placeholder="••••••••"
                />
              </div>

              {/* Modal Footer */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  disabled={loading}
                  className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg font-semibold transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-[#008200] to-[#006600] hover:from-[#006600] hover:to-[#004d00] text-white rounded-lg font-semibold transition-all disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Create Sub-Admin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
