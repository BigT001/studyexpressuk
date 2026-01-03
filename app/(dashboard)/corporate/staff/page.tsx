'use client';

import { useState } from 'react';

export default function CorporateStaffPage() {
  const [staff, setStaff] = useState([
    {
      id: 1,
      name: 'John Smith',
      email: 'john@techsolutions.com',
      department: 'Engineering',
      role: 'Manager',
      status: 'Active',
      joinDate: 'Jan 15, 2024',
      coursesEnrolled: 5,
      coursesCompleted: 2,
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah@techsolutions.com',
      department: 'Marketing',
      role: 'Coordinator',
      status: 'Active',
      joinDate: 'Feb 1, 2024',
      coursesEnrolled: 3,
      coursesCompleted: 1,
    },
    {
      id: 3,
      name: 'Michael Chen',
      email: 'michael@techsolutions.com',
      department: 'Engineering',
      role: 'Developer',
      status: 'Active',
      joinDate: 'Feb 10, 2024',
      coursesEnrolled: 4,
      coursesCompleted: 3,
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newStaff, setNewStaff] = useState({
    name: '',
    email: '',
    department: '',
    role: '',
  });

  const handleAddStaff = () => {
    if (newStaff.name && newStaff.email) {
      setStaff([
        ...staff,
        {
          id: Math.max(...staff.map(s => s.id)) + 1,
          name: newStaff.name,
          email: newStaff.email,
          department: newStaff.department,
          role: newStaff.role,
          status: 'Active',
          joinDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
          coursesEnrolled: 0,
          coursesCompleted: 0,
        },
      ]);
      setNewStaff({ name: '', email: '', department: '', role: '' });
      setShowAddModal(false);
    }
  };

  const handleRemoveStaff = (id: number) => {
    setStaff(staff.filter(s => s.id !== id));
  };

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Staff Management</h1>
          <p className="text-gray-600 mt-1">Manage your organization's staff members and monitor their progress</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
        >
          <span>➕</span>
          Add Staff Member
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-gray-600 text-sm font-medium">Total Staff</div>
          <div className="text-3xl font-bold text-gray-900 mt-2">{staff.length}</div>
          <div className="text-green-600 text-sm mt-2">All active</div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-gray-600 text-sm font-medium">In Training</div>
          <div className="text-3xl font-bold text-gray-900 mt-2">
            {staff.filter(s => s.coursesEnrolled > 0).length}
          </div>
          <div className="text-blue-600 text-sm mt-2">Currently enrolled</div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-gray-600 text-sm font-medium">Completions</div>
          <div className="text-3xl font-bold text-gray-900 mt-2">
            {staff.reduce((sum, s) => sum + s.coursesCompleted, 0)}
          </div>
          <div className="text-purple-600 text-sm mt-2">Total courses completed</div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-gray-600 text-sm font-medium">Avg. Progress</div>
          <div className="text-3xl font-bold text-gray-900 mt-2">
            {Math.round(
              (staff.reduce((sum, s) => sum + s.coursesCompleted, 0) /
                (staff.reduce((sum, s) => sum + s.coursesEnrolled, 0) || 1)) *
                100
            )}%
          </div>
          <div className="text-orange-600 text-sm mt-2">Completion rate</div>
        </div>
      </div>

      {/* Staff List */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Staff Members</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Department</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Role</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Courses</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {staff.map((member, idx) => (
                <tr key={member.id} className={`border-b border-gray-100 ${idx % 2 ? 'bg-white' : 'bg-gray-50'}`}>
                  <td className="px-6 py-4">
                    <span className="font-medium text-gray-900">{member.name}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{member.email}</td>
                  <td className="px-6 py-4 text-gray-700">{member.department}</td>
                  <td className="px-6 py-4 text-gray-700">{member.role}</td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-2 text-green-700">
                      <span className="text-green-700">✓</span>
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <p className="font-medium text-gray-900">{member.coursesCompleted}/{member.coursesEnrolled}</p>
                      <p className="text-gray-600">completed</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <span className="text-blue-600">✍️</span>
                      </button>
                      <button
                        onClick={() => handleRemoveStaff(member.id)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <span className="text-red-600">🗑️</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Staff Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Add Staff Member</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={newStaff.name}
                  onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter staff name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={newStaff.email}
                  onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter email address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <input
                  type="text"
                  value={newStaff.department}
                  onChange={(e) => setNewStaff({ ...newStaff, department: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. Engineering, HR, Marketing"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role/Title</label>
                <input
                  type="text"
                  value={newStaff.role}
                  onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. Manager, Developer, Analyst"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddStaff}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Staff
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
