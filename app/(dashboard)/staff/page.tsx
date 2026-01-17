'use client';

import { useState, useEffect } from 'react';

interface StaffProfile {
  _id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: string;
  department?: string;
}

export default function StaffDashboard() {
  const [profile, setProfile] = useState<StaffProfile | null>(null);
  const [stats, setStats] = useState({
    tasksAssigned: 8,
    tasksCompleted: 5,
    teamMembers: 12,
    reportsPending: 2,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStaffData();
  }, []);

  const fetchStaffData = async () => {
    try {
      setLoading(true);
      
      // Fetch user profile
      const profileRes = await fetch('/api/users/me');
      const profileData = await profileRes.json();
      if (profileData.success) {
        setProfile(profileData.user);
      }

      setError('');
    } catch (err) {
      setError('Failed to load staff dashboard');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Staff Dashboard Header - Unique to Staff */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-4xl font-bold text-gray-900">Staff Dashboard</h1>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">Staff Member</span>
          </div>
          <p className="text-gray-600">Welcome, {profile?.firstName || 'Staff Member'} — Manage your responsibilities and team coordination</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Staff Statistics Cards - Different from Individual */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Tasks Assigned */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Tasks Assigned</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.tasksAssigned}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 text-xl">📋</span>
              </div>
            </div>
          </div>

          {/* Tasks Completed */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Tasks Completed</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.tasksCompleted}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 text-xl">✓</span>
              </div>
            </div>
          </div>

          {/* Team Members */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Team Members</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.teamMembers}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-purple-600 text-xl">👥</span>
              </div>
            </div>
          </div>

          {/* Reports Pending */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Reports Pending</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.reportsPending}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <span className="text-orange-600 text-xl">📊</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Sections */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-4">
                <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                  <span className="text-2xl mb-2 block">📨</span>
                  <p className="font-medium text-gray-900 text-sm">Send Message</p>
                  <p className="text-xs text-gray-500">Contact admin or team</p>
                </button>
                <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                  <span className="text-2xl mb-2 block">📋</span>
                  <p className="font-medium text-gray-900 text-sm">View Tasks</p>
                  <p className="text-xs text-gray-500">Check assignments</p>
                </button>
                <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                  <span className="text-2xl mb-2 block">👥</span>
                  <p className="font-medium text-gray-900 text-sm">Team View</p>
                  <p className="text-xs text-gray-500">See your team</p>
                </button>
                <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                  <span className="text-2xl mb-2 block">📊</span>
                  <p className="font-medium text-gray-900 text-sm">View Reports</p>
                  <p className="text-xs text-gray-500">Check statistics</p>
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h2>
              <div className="space-y-4">
                <div className="flex gap-4 pb-4 border-b border-gray-100">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600">📌</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">New task assigned</p>
                    <p className="text-xs text-gray-500 mt-1">You received a new task from your manager</p>
                    <p className="text-xs text-gray-400 mt-2">2 hours ago</p>
                  </div>
                </div>
                <div className="flex gap-4 pb-4 border-b border-gray-100">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600">✓</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">Task completed</p>
                    <p className="text-xs text-gray-500 mt-1">You marked a task as complete</p>
                    <p className="text-xs text-gray-400 mt-2">1 day ago</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-purple-600">💬</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">New message</p>
                    <p className="text-xs text-gray-500 mt-1">Admin sent you an important message</p>
                    <p className="text-xs text-gray-400 mt-2">2 days ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Profile & Info */}
          <div className="space-y-8">
            {/* Profile Card */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 p-6">
              <div className="mb-4">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4">
                  {profile?.firstName?.charAt(0)}{profile?.lastName?.charAt(0)}
                </div>
                <h3 className="text-lg font-bold text-gray-900">{profile?.firstName} {profile?.lastName}</h3>
                <p className="text-sm text-gray-600 mt-1">{profile?.email}</p>
              </div>
              <div className="space-y-3 pt-4 border-t border-blue-200">
                <div>
                  <p className="text-xs text-gray-600 uppercase tracking-wide">Role</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">Staff Member</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 uppercase tracking-wide">Department</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">{profile?.department || 'Not assigned'}</p>
                </div>
              </div>
            </div>

            {/* Access Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Your Access</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <span className="text-green-600 text-lg mt-0.5">✓</span>
                  <div>
                    <p className="font-medium text-gray-900">Team Messages</p>
                    <p className="text-xs text-gray-500">Message admin & colleagues</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-600 text-lg mt-0.5">✓</span>
                  <div>
                    <p className="font-medium text-gray-900">Task Management</p>
                    <p className="text-xs text-gray-500">View & complete tasks</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-600 text-lg mt-0.5">✓</span>
                  <div>
                    <p className="font-medium text-gray-900">Team Reports</p>
                    <p className="text-xs text-gray-500">Access team analytics</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Important Notes */}
            <div className="bg-amber-50 rounded-xl border border-amber-200 p-4">
              <p className="text-sm font-medium text-amber-900 mb-2">💡 Tip</p>
              <p className="text-xs text-amber-800">Use the Messages section to communicate with your team and admin. This is your primary communication channel.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
