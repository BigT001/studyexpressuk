'use client';

import { useState, useEffect } from 'react';
import { Trash2, Edit3, Eye, EyeOff, Check, X, Loader, AlertCircle, CheckCircle } from 'lucide-react';

interface SubAdmin {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  permissionLevel: 'FULL_ADMIN' | 'CONTENT_ADMIN' | 'USER_ADMIN';
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

const permissionLevels = [
  {
    value: 'FULL_ADMIN',
    label: 'Full Admin',
    description: 'All permissions - events, courses, content, users, memberships, analytics, payments',
    color: 'bg-red-100 text-red-800',
  },
  {
    value: 'CONTENT_ADMIN',
    label: 'Content Admin',
    description: 'Manage events, courses, and content. View analytics.',
    color: 'bg-blue-100 text-blue-800',
  },
  {
    value: 'USER_ADMIN',
    label: 'User Admin',
    description: 'Manage user accounts, memberships, and view analytics.',
    color: 'bg-purple-100 text-purple-800',
  },
];

export default function SubAdminManagementPage() {
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [subAdmins, setSubAdmins] = useState<SubAdmin[]>([]);
  const [fetchingSubAdmins, setFetchingSubAdmins] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
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
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchSubAdmins();
  }, []);

  const fetchSubAdmins = async () => {
    try {
      setFetchingSubAdmins(true);
      const response = await fetch('/api/subadmins');
      if (response.ok) {
        const data = await response.json();
        setSubAdmins(data.subAdmins || []);
      }
    } catch (err) {
      console.error('Failed to fetch sub-admins:', err);
      setError('Failed to load sub-admins');
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

      setSuccess('✓ Sub-admin created successfully!');
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

  const handleDelete = async () => {
    if (!deleteTargetId) return;

    setDeleting(true);
    try {
      const response = await fetch(`/api/subadmins/${deleteTargetId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSuccess('Sub-admin removed successfully');
        fetchSubAdmins();
        setShowDeleteConfirm(false);
        setDeleteTargetId(null);
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('Failed to remove sub-admin');
      }
    } catch (err) {
      setError('Failed to remove sub-admin');
      console.error('Error deleting sub-admin:', err);
    } finally {
      setDeleting(false);
    }
  };

  const openDeleteConfirm = (id: string) => {
    setDeleteTargetId(id);
    setShowDeleteConfirm(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Sub-Admin Management</h1>
          <p className="text-gray-600 mt-2">Create, manage, and monitor sub-administrator accounts with granular permissions</p>
        </div>
        <button
          onClick={() => {
            setEditingId(null);
            setFormData({
              firstName: '',
              lastName: '',
              email: '',
              password: '',
              confirmPassword: '',
              permissionLevel: 'USER_ADMIN',
            });
            setShowModal(true);
          }}
          className="bg-gradient-to-r from-[#008200] to-[#006600] text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all whitespace-nowrap"
        >
          + Create Sub-Admin
        </button>
      </div>

      {/* Messages */}
      {success && (
        <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
          <CheckCircle className="w-5 h-5" />
          {success}
        </div>
      )}
      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Sub-Admin Accounts List */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6 border-l-4 border-red-600">
          <h2 className="text-xl font-bold mb-1">👥 Sub-Admin Accounts</h2>
          <p className="text-gray-600 text-sm mb-4">Manage and monitor all sub-administrator accounts ({subAdmins.length})</p>

          {fetchingSubAdmins ? (
            <div className="flex items-center justify-center h-64">
              <Loader className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : subAdmins.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 font-medium">No sub-admins created yet</p>
              <p className="text-gray-400 text-sm mt-1">Click "Create Sub-Admin" to add your first sub-administrator</p>
            </div>
          ) : (
            <div className="space-y-3">
              {subAdmins.map((subAdmin) => {
                const permLevel = permissionLevels.find(p => p.value === subAdmin.permissionLevel);
                return (
                  <div key={subAdmin.id} className="bg-gradient-to-r from-gray-50 to-white p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <p className="font-semibold text-gray-900 text-lg">
                            {subAdmin.firstName} {subAdmin.lastName}
                          </p>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${permLevel?.color || 'bg-gray-100 text-gray-800'}`}>
                            {permLevel?.label}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            subAdmin.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {subAdmin.isActive ? '🟢 Active' : '⚫ Inactive'}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm">{subAdmin.email}</p>
                        <div className="flex gap-4 mt-2 text-xs text-gray-500">
                          <span>Created: {new Date(subAdmin.createdAt).toLocaleDateString()}</span>
                          {subAdmin.lastLogin && <span>Last login: {new Date(subAdmin.lastLogin).toLocaleDateString()}</span>}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            /* Edit functionality would go here */
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openDeleteConfirm(subAdmin.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Permission Levels & Quick Info */}
        <div className="space-y-6">
          {/* Permission Levels */}
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-600">
            <h2 className="text-lg font-bold mb-4">🔐 Permission Levels</h2>
            <div className="space-y-3">
              {permissionLevels.map((level) => (
                <div key={level.value} className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-purple-300 transition">
                  <p className="font-semibold text-sm text-gray-900">{level.label}</p>
                  <p className="text-xs text-gray-600 mt-1">{level.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Statistics */}
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-600">
            <h2 className="text-lg font-bold mb-4">📊 Statistics</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total Sub-Admins</span>
                <span className="text-2xl font-bold text-blue-600">{subAdmins.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Active</span>
                <span className="text-2xl font-bold text-green-600">{subAdmins.filter(s => s.isActive).length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Full Admins</span>
                <span className="text-2xl font-bold text-red-600">{subAdmins.filter(s => s.permissionLevel === 'FULL_ADMIN').length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Sub-Admin Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#008200] to-[#006600] px-6 py-8 text-white">
              <h2 className="text-2xl font-bold">Create New Sub-Admin</h2>
              <p className="text-green-100 mt-2">Add a new sub-administrator with custom permissions</p>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-900 px-4 py-3 rounded flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008200] focus:border-transparent"
                    placeholder="John"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008200] focus:border-transparent"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008200] focus:border-transparent"
                  placeholder="john.doe@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Permission Level</label>
                <select
                  name="permissionLevel"
                  value={formData.permissionLevel}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008200] focus:border-transparent"
                >
                  {permissionLevels.map((level) => (
                    <option key={level.value} value={level.value}>
                      {level.label} - {level.description}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008200] focus:border-transparent pr-10"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">Minimum 8 characters - use letters, numbers, and symbols</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008200] focus:border-transparent"
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
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-[#008200] to-[#006600] hover:from-[#006600] hover:to-[#004d00] text-white rounded-lg font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      Create Sub-Admin
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && deleteTargetId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="bg-red-50 px-6 py-8 text-center">
              <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-red-900">Remove Sub-Admin?</h2>
              <p className="text-red-700 mt-2">This action cannot be undone. The sub-admin account will be permanently deleted.</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600">Sub-Admin ID:</p>
                <p className="font-mono text-sm text-gray-900 break-all">{deleteTargetId}</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={deleting}
                  className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg font-semibold transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {deleting ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Removing...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      Remove Sub-Admin
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
