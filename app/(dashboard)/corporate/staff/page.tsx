'use client';

import { useState, useEffect } from 'react';
import { Users, UserPlus, Trash2, Eye, Award, BookOpen, TrendingUp } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface StaffMember {
  _id: string;
  userId: { email: string; firstName?: string; lastName?: string };
  role: string;
  department: string;
  status: string;
  joinDate: string;
}

export default function CorporateStaffPage() {
  const router = useRouter();
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [showAddModal, setShowAddModal] = useState(false);

  const [newStaff, setNewStaff] = useState({
    email: '',
    firstName: '',
    lastName: '',
    role: '',
    department: '',
    password: '',
  });
  const [showCredentials, setShowCredentials] = useState(false);
  const [createdCredentials, setCreatedCredentials] = useState<{ email: string; password: string; message: string } | null>(null);

  // Fetch staff on mount
  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/corporates/staff');
      const data = await response.json();
      console.log('[STAFF-PAGE] API response:', data);
      if (data.success) {
        console.log('[STAFF-PAGE] Setting staff with IDs:', data.staff.map((s: any) => s._id));
        setStaff(data.staff);
        setError('');
      } else {
        setError(data.error || 'Failed to load staff');
      }
    } catch (err) {
      setError('Error loading staff members');
      console.error('[STAFF-PAGE] Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStaff = async () => {
    if (!newStaff.email || !newStaff.firstName || !newStaff.lastName || !newStaff.role || !newStaff.password) {
      setError('Email, first name, last name, role, and password are required');
      return;
    }

    if (newStaff.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/corporates/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStaff),
      });

      const data = await response.json();

      if (data.success) {
        setStaff([...staff, data.staff]);
        setCreatedCredentials(data.credentials);
        setShowCredentials(true);
        setNewStaff({
          email: '',
          firstName: '',
          lastName: '',
          role: '',
          department: '',
          password: '',
        });
        setError('');
      } else {
        setError(data.error || 'Failed to add staff member');
      }
    } catch (err) {
      setError('Error adding staff member');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveStaff = async (id: string) => {
    if (!confirm('Are you sure you want to remove this staff member?')) return;

    try {
      const response = await fetch(`/api/corporates/staff?id=${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        setStaff(staff.filter(s => s._id !== id));
        setSuccessMessage('Staff member removed successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setError(data.error || 'Failed to remove staff member');
      }
    } catch (err) {
      setError('Error removing staff member');
      console.error(err);
    }
  };

  const openDetailModal = async (staffMember: StaffMember) => {
    router.push(`/corporate/staff/${staffMember._id}`);
  };

  return (
    <div className="space-y-8 p-6">
      {/* Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex justify-between items-center">
          <span>{error}</span>
          <button onClick={() => setError('')}>×</button>
        </div>
      )}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex justify-between items-center">
          <span>{successMessage}</span>
          <button onClick={() => setSuccessMessage('')}>×</button>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Staff Management</h1>
          <p className="text-gray-600 mt-1">Manage your organization&apos;s staff members and track their progress</p>
        </div>
        <button
          onClick={() => {
            setNewStaff({
              email: '',
              firstName: '',
              lastName: '',
              role: '',
              department: '',
              password: '',
            });
            setShowAddModal(true);
          }}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          Add Staff Member
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-gray-600 text-sm font-medium">Total Staff</div>
              <div className="text-3xl font-bold text-gray-900 mt-2">{staff.length}</div>
            </div>
            <Users className="w-8 h-8 text-green-200" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-gray-600 text-sm font-medium">In Training</div>
              <div className="text-3xl font-bold text-gray-900 mt-2">
                {staff.length > 0 ? Math.floor(staff.length * 0.7) : 0}
              </div>
            </div>
            <BookOpen className="w-8 h-8 text-blue-200" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-gray-600 text-sm font-medium">Completed</div>
              <div className="text-3xl font-bold text-gray-900 mt-2">
                {staff.length > 0 ? Math.floor(staff.length * 0.3) : 0}
              </div>
            </div>
            <Award className="w-8 h-8 text-purple-200" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-gray-600 text-sm font-medium">Avg. Progress</div>
              <div className="text-3xl font-bold text-gray-900 mt-2">65%</div>
            </div>
            <TrendingUp className="w-8 h-8 text-orange-200" />
          </div>
        </div>
      </div>

      {/* Staff List */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-gray-50 p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Staff Members</h2>
        </div>

        {loading && !staff.length ? (
          <div className="p-8 text-center text-gray-500">Loading staff members...</div>
        ) : staff.length === 0 ? (
          <div className="p-8 text-center">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No staff members added yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Department</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Role</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Join Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {staff.map((member, idx) => (
                  <tr
                    key={member._id}
                    className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                      idx % 2 ? 'bg-white' : 'bg-gray-50'
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div>
                        <span className="font-medium text-gray-900">
                          {member.userId.firstName && member.userId.lastName 
                            ? `${member.userId.firstName} ${member.userId.lastName}`
                            : member.userId.email}
                        </span>
                        {member.userId.firstName && member.userId.lastName && (
                          <p className="text-xs text-gray-500">{member.userId.email}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{member.department || '—'}</td>
                    <td className="px-6 py-4 text-gray-700">{member.role}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                        {member.status === 'active' ? 'Active' : member.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-700 text-sm">
                      {new Date(member.joinDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openDetailModal(member)}
                          className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                          title="View details"
                        >
                          <Eye className="w-4 h-4 text-blue-600" />
                        </button>
                        <button
                          onClick={() => handleRemoveStaff(member._id)}
                          className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                          title="Remove staff"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Staff Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Add Staff Member</h2>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                  <input
                    type="text"
                    value={newStaff.firstName}
                    onChange={(e) => setNewStaff({ ...newStaff, firstName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="e.g. John"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                  <input
                    type="text"
                    value={newStaff.lastName}
                    onChange={(e) => setNewStaff({ ...newStaff, lastName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="e.g. Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                <input
                  type="email"
                  value={newStaff.email}
                  onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="staff@example.com"
                />
                <p className="text-xs text-gray-500 mt-1">Staff will use this to log in</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role/Title *</label>
                  <input
                    type="text"
                    value={newStaff.role}
                    onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="e.g. Manager, Developer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                  <input
                    type="text"
                    value={newStaff.department}
                    onChange={(e) => setNewStaff({ ...newStaff, department: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="e.g. Engineering, HR, Marketing"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
                <input
                  type="password"
                  value={newStaff.password}
                  onChange={(e) => setNewStaff({ ...newStaff, password: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Minimum 6 characters"
                />
                <p className="text-xs text-gray-500 mt-1">You will share this with staff</p>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleAddStaff}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50"
              >
                {loading ? 'Adding...' : 'Add Staff Member'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Staff Detail Modal - REMOVED: Now using dedicated detail page at /corporate/staff/[id] */}

      {/* Assign Course Modal - REMOVED: Now handled on the detail page */}

      {/* Credentials Modal */}
      {showCredentials && createdCredentials && (
        <div className="fixed inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-2xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Staff Account Created Successfully</h2>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-700 mb-4">{createdCredentials.message}</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address:</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value={createdCredentials.email}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    />
                    <button
                      onClick={() => navigator.clipboard.writeText(createdCredentials.email)}
                      className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Copy
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Temporary Password:</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value={createdCredentials.password}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    />
                    <button
                      onClick={() => navigator.clipboard.writeText(createdCredentials.password)}
                      className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Copy
                    </button>
                  </div>
                </div>

                <div>
                  <button
                    onClick={() => {
                      const text = `Email: ${createdCredentials.email}\nPassword: ${createdCredentials.password}`;
                      navigator.clipboard.writeText(text);
                    }}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    Copy Both
                  </button>
                </div>
              </div>

              <p className="text-xs text-gray-600 mt-4">
                ⚠️ Save these credentials. The staff member can change their password after first login.
              </p>
            </div>

            <button
              onClick={() => {
                setShowCredentials(false);
                setShowAddModal(false);
                setSuccessMessage('Staff member added successfully!');
                setTimeout(() => setSuccessMessage(''), 3000);
              }}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
