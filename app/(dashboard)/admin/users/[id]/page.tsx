"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Mail, Phone, Calendar, Users, BookOpen, Zap, Trophy, TrendingUp, DollarSign, Clock, AlertCircle, Briefcase } from "lucide-react";

interface User {
  _id: string;
  email: string;
  phone?: string;
  role: "INDIVIDUAL" | "CORPORATE" | "STAFF" | "SUB_ADMIN" | "ADMIN";
  status: "subscribed" | "not-subscribed";
  createdAt: string;
  firstName?: string;
  lastName?: string;
  profileImage?: string;
  [key: string]: any;
}

interface Profile {
  firstName?: string;
  lastName?: string;
  avatar?: string;
  companyName?: string;
  logo?: string;
  bio?: string;
  description?: string;
  teamMembers?: string[];
  [key: string]: any;
}

interface Enrollment {
  _id: string;
  userId: string;
  eventId: any;
  status: string;
  progress?: number;
  enrolledDate?: string;
  completedDate?: string;
  createdAt?: string;
  [key: string]: any;
}

interface Membership {
  _id: string;
  tier: string;
  startDate: string;
  endDate: string;
  status: string;
  [key: string]: any;
}

interface StaffMember extends User {
  stats: {
    totalEnrolled: number;
    totalCourses: number;
    totalEvents: number;
    completed: number;
    inProgress: number;
    completionRate: number;
  };
  courses: Enrollment[];
  events: Enrollment[];
}

interface DashboardData {
  user: User;
  profile: Profile;
  enrollments: Enrollment[];
  events: Enrollment[];
  courses: Enrollment[];
  membership: Membership | null;
  completionStats: {
    enrolledCount: number;
    completedCount: number;
    inProgressCount: number;
    completionRate: number;
  };
  engagement: {
    totalMessages: number;
    unreadMessages: number;
    accountAge: number;
    lastActivity: string | null;
    lastActivityStatus: string;
    isCurrentlyActive: boolean;
    timeSinceActivity: { value: number; unit: string } | null;
    // Legacy fields
    lastLogin: string | null;
    daysSinceLastLogin: number | null;
  };
  corporateTeam?: StaffMember[];
  corporateStats?: {
    totalStaff: number;
    totalCourses: number;
    totalEvents: number;
    totalEnrollments: number;
    averageCompletionRate: number;
    staffCoursesBreakdown: any[];
  };
  staffContent?: {
    eventsCreated: number;
    coursesCreated: number;
  };
  staffCorporation?: {
    _id: string;
    name: string;
    logo?: string;
    staffRole?: string;
    department?: string;
    joinDate?: string;
    approvalStatus?: string;
  };
}

export default function AdminUserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedStaff, setExpandedStaff] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        setLoading(true);
        setError("");
        const res = await fetch(`/api/users/${id}`);
        if (!res.ok) throw new Error("Failed to fetch user");
        const json = await res.json();
        if (json.success) {
          setData(json as unknown as DashboardData);
        } else {
          throw new Error(json.error || "Failed to load user data");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load user");
        setData(null);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchUser();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading user profile...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error || "User not found"}</p>
          <Link href="/admin/users" className="text-blue-600 hover:underline font-medium">
            Back to Users
          </Link>
        </div>
      </div>
    );
  }

  const { user, profile, enrollments, events, courses, membership, completionStats, engagement, corporateTeam, corporateStats, staffContent, staffCorporation } = data;
  const displayName = user.role === 'CORPORATE' 
    ? profile?.companyName 
    : `${user.firstName || profile?.firstName || ''} ${user.lastName || profile?.lastName || ''}`.trim();

  const isPaidUser = user.status === 'subscribed' && membership;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100">
      {/* Header with Navigation */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/admin/users" className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2">
              ← Back to Users
            </Link>
            <div className="flex items-center gap-3">
              <Link 
                href={`/admin/messages?user=${user._id}`} 
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
              >
                Open Chat
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <img
                src={profile?.avatar || profile?.logo || user.profileImage || "/default-avatar.png"}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-blue-200 shadow-md"
              />
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <h1 className="text-3xl font-bold text-gray-900">{displayName}</h1>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                  isPaidUser ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                }`}>
                  {isPaidUser ? '💳 PAID' : 'FREE'}
                </span>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                  {user.role}
                </span>
              </div>

              {/* Contact Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-3 text-gray-700">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{user.email}</p>
                  </div>
                </div>
                
                {user.phone && (
                  <div className="flex items-center gap-3 text-gray-700">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium">{user.phone}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3 text-gray-700">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Joined</p>
                    <p className="font-medium">{new Date(user.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-gray-700">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Account Age</p>
                    <p className="font-medium">{engagement.accountAge} days</p>
                  </div>
                </div>
              </div>

              {/* Bio/Description */}
              {(profile?.bio || profile?.description) && (
                <p className="text-gray-600 italic border-t pt-4">
                  "{profile?.bio || profile?.description}"
                </p>
              )}
            </div>

            {/* Activity Status */}
            <div className={`rounded-lg p-6 min-w-[280px] border-2 ${
              engagement.isCurrentlyActive 
                ? 'bg-gradient-to-br from-green-50 to-green-100 border-green-300' 
                : 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200'
            }`}>
              <h3 className="font-bold text-gray-900 mb-6 text-lg">User Activity</h3>
              
              {/* Activity Status Display */}
              <div className="mb-6">
                <p className="text-sm font-semibold text-gray-600 mb-2">Last Active</p>
                <p className="text-3xl font-bold break-words">
                  {engagement.lastActivityStatus}
                </p>
                {engagement.lastActivity && (
                  <p className="text-xs text-gray-600 mt-3">
                    {new Date(engagement.lastActivity).toLocaleDateString('en-US', { 
                      weekday: 'short', 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                )}
              </div>

              {/* Currently Active Indicator */}
              <div className={`rounded-lg p-4 mb-4 border-2 ${
                engagement.isCurrentlyActive
                  ? 'bg-green-100 border-green-300'
                  : 'bg-gray-100 border-gray-300'
              }`}>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full animate-pulse ${
                    engagement.isCurrentlyActive ? 'bg-green-600' : 'bg-gray-400'
                  }`}></div>
                  <p className={`text-sm font-semibold ${
                    engagement.isCurrentlyActive ? 'text-green-700' : 'text-gray-600'
                  }`}>
                    {engagement.isCurrentlyActive ? 'Currently Online' : 'Offline'}
                  </p>
                </div>
              </div>

              <p className="text-xs text-gray-600 pt-3 border-t border-gray-300">
                Account age: {engagement.accountAge} days
              </p>
            </div>
          </div>
        </div>

        {/* Membership & Subscription Info */}
        {(isPaidUser || user.role === 'CORPORATE') && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <DollarSign className="w-6 h-6 text-green-600" />
              Subscription Details
            </h2>
            {membership ? (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-2">Membership Tier</p>
                  <p className="text-xl font-semibold text-gray-900 capitalize">{membership.tier}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-2">Status</p>
                  <p className="text-xl font-semibold capitalize">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                      membership.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {membership.status}
                    </span>
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-2">Started</p>
                  <p className="text-xl font-semibold text-gray-900">{new Date(membership.startDate).toLocaleDateString()}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-2">Renews</p>
                  <p className="text-xl font-semibold text-gray-900">{new Date(membership.endDate).toLocaleDateString()}</p>
                </div>
              </div>
            ) : (
              <p className="text-gray-600">No active membership</p>
            )}
          </div>
        )}

        {/* STAFF SPECIFIC SECTION */}
        {user.role === 'STAFF' && staffCorporation && (
          <>
            {/* Corporation Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Briefcase className="w-6 h-6 text-indigo-600" />
                Organization Details
              </h2>
              <div className="flex flex-col md:flex-row gap-8 items-start">
                {staffCorporation.logo && (
                  <div className="flex-shrink-0">
                    <img
                      src={staffCorporation.logo}
                      alt={staffCorporation.name}
                      className="w-24 h-24 rounded-lg object-cover border border-gray-200"
                    />
                  </div>
                )}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Company Name</p>
                    <p className="text-xl font-semibold text-gray-900">{staffCorporation.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Staff Role</p>
                    <p className="text-xl font-semibold text-gray-900 capitalize">{staffCorporation.staffRole || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Department</p>
                    <p className="text-xl font-semibold text-gray-900">{staffCorporation.department || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Join Date</p>
                    <p className="text-xl font-semibold text-gray-900">
                      {staffCorporation.joinDate ? new Date(staffCorporation.joinDate).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Approval Status</p>
                    <p>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                        staffCorporation.approvalStatus === 'approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {staffCorporation.approvalStatus || 'Pending'}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Staff Learning Progress */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Trophy className="w-6 h-6 text-purple-600" />
                Learning Progress
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-blue-50 rounded-lg p-6 text-center border-l-4 border-blue-500">
                  <p className="text-sm text-blue-600 font-medium mb-2">Total Enrolled</p>
                  <p className="text-4xl font-bold text-blue-900">{completionStats.enrolledCount}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-6 text-center border-l-4 border-green-500">
                  <p className="text-sm text-green-600 font-medium mb-2">Completed</p>
                  <p className="text-4xl font-bold text-green-900">{completionStats.completedCount}</p>
                </div>
                <div className="bg-orange-50 rounded-lg p-6 text-center border-l-4 border-orange-500">
                  <p className="text-sm text-orange-600 font-medium mb-2">In Progress</p>
                  <p className="text-4xl font-bold text-orange-900">{completionStats.inProgressCount}</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-6 text-center border-l-4 border-purple-500">
                  <p className="text-sm text-purple-600 font-medium mb-2">Completion Rate</p>
                  <p className="text-4xl font-bold text-purple-900">{completionStats.completionRate}%</p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* CORPORATE SPECIFIC SECTION */}
        {user.role === 'CORPORATE' && corporateStats && (
          <>
            {/* Corporate Overview Stats */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Briefcase className="w-6 h-6 text-indigo-600" />
                Corporate Overview
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-indigo-50 rounded-lg p-6 text-center">
                  <p className="text-sm text-indigo-600 font-medium mb-2">Total Staff</p>
                  <p className="text-4xl font-bold text-indigo-900">{corporateStats.totalStaff}</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-6 text-center">
                  <p className="text-sm text-blue-600 font-medium mb-2">Total Courses</p>
                  <p className="text-4xl font-bold text-blue-900">{corporateStats.totalCourses}</p>
                </div>
                <div className="bg-orange-50 rounded-lg p-6 text-center">
                  <p className="text-sm text-orange-600 font-medium mb-2">Total Events</p>
                  <p className="text-4xl font-bold text-orange-900">{corporateStats.totalEvents}</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-6 text-center">
                  <p className="text-sm text-purple-600 font-medium mb-2">Avg Completion</p>
                  <p className="text-4xl font-bold text-purple-900">{corporateStats.averageCompletionRate}%</p>
                </div>
              </div>
            </div>

            {/* Staff Members Detailed Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Users className="w-6 h-6 text-blue-600" />
                Staff Members & Progress ({corporateTeam?.length || 0})
              </h2>

              {corporateTeam && corporateTeam.length > 0 ? (
                <div className="space-y-4">
                  {corporateTeam.map((member: StaffMember) => (
                    <div key={member._id} className="border border-gray-200 rounded-lg overflow-hidden hover:border-blue-300 transition">
                      {/* Staff Member Header */}
                      <div
                        onClick={() => setExpandedStaff(expandedStaff === member._id ? null : member._id)}
                        className="p-6 bg-gray-50 hover:bg-gray-100 cursor-pointer transition flex items-center justify-between"
                      >
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                            {member.firstName?.[0] || '?'}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-semibold text-gray-900 truncate">{member.firstName} {member.lastName}</h3>
                            <p className="text-sm text-gray-600 truncate">{member.email}</p>
                          </div>
                        </div>

                        {/* Quick Stats with Progress Indicators */}
                        <div className="hidden md:grid grid-cols-4 gap-4 flex-shrink-0 ml-4">
                          {/* Courses */}
                          <div className="text-center bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 border border-blue-200">
                            <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Courses</p>
                            <p className="text-2xl font-bold text-blue-700 mt-1">{member.stats.totalCourses}</p>
                            <div className="text-xs text-blue-600 mt-1">{member.stats.totalCourses === 1 ? 'registered' : 'registered'}</div>
                          </div>
                          
                          {/* Events */}
                          <div className="text-center bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-3 border border-orange-200">
                            <p className="text-xs font-semibold text-orange-600 uppercase tracking-wider">Events</p>
                            <p className="text-2xl font-bold text-orange-700 mt-1">{member.stats.totalEvents}</p>
                            <div className="text-xs text-orange-600 mt-1">{member.stats.totalEvents === 1 ? 'attended' : 'attended'}</div>
                          </div>
                          
                          {/* Completion Rate */}
                          <div className="text-center bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3 border border-green-200">
                            <p className="text-xs font-semibold text-green-600 uppercase tracking-wider">Completion</p>
                            <p className="text-2xl font-bold text-green-700 mt-1">{member.stats.completionRate}%</p>
                            <div className="w-full bg-green-200 rounded-full h-1.5 mt-2">
                              <div className="bg-green-600 h-1.5 rounded-full" style={{width: `${member.stats.completionRate}%`}} />
                            </div>
                          </div>
                          
                          {/* Status Badge */}
                          <div className="text-center">
                            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">Status</p>
                            <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold ${
                              member.status === 'subscribed' 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-gray-100 text-gray-700'
                            }`}>
                              <span className={`w-2 h-2 rounded-full mr-1.5 ${member.status === 'subscribed' ? 'bg-green-600' : 'bg-gray-400'}`}></span>
                              {member.status === 'subscribed' ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Expanded Staff Details */}
                      {expandedStaff === member._id && (
                        <div className="border-t border-gray-200 p-6 bg-gradient-to-br from-gray-50 to-white">
                          {/* Summary Stats Bar */}
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
                            <div className="bg-white border-l-4 border-blue-500 rounded-r-lg p-4 shadow-sm">
                              <p className="text-xs text-gray-600 font-semibold uppercase">Total Enrolled</p>
                              <p className="text-3xl font-bold text-blue-600 mt-1">{member.stats.totalEnrolled}</p>
                            </div>
                            <div className="bg-white border-l-4 border-green-500 rounded-r-lg p-4 shadow-sm">
                              <p className="text-xs text-gray-600 font-semibold uppercase">Completed</p>
                              <p className="text-3xl font-bold text-green-600 mt-1">{member.stats.completed}</p>
                            </div>
                            <div className="bg-white border-l-4 border-orange-500 rounded-r-lg p-4 shadow-sm">
                              <p className="text-xs text-gray-600 font-semibold uppercase">In Progress</p>
                              <p className="text-3xl font-bold text-orange-600 mt-1">{member.stats.inProgress}</p>
                            </div>
                            <div className="bg-white border-l-4 border-purple-500 rounded-r-lg p-4 shadow-sm md:col-span-2">
                              <p className="text-xs text-gray-600 font-semibold uppercase">Overall Completion Rate</p>
                              <div className="flex items-center gap-3 mt-1">
                                <p className="text-3xl font-bold text-purple-600">{member.stats.completionRate}%</p>
                                <div className="flex-1">
                                  <div className="w-24 bg-gray-200 rounded-full h-2.5">
                                    <div className="bg-purple-600 h-2.5 rounded-full transition-all duration-500" style={{width: `${member.stats.completionRate}%`}} />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Courses Section */}
                          {member.courses && member.courses.length > 0 && (
                            <div className="mb-8">
                              <h4 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2 pb-3 border-b-2 border-blue-200">
                                <BookOpen className="w-5 h-5 text-blue-600" />
                                <span>Courses ({member.courses.length})</span>
                                <span className="ml-auto text-sm font-normal text-gray-600">
                                  {member.courses.filter(c => c.status === 'completed').length} completed
                                </span>
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto pr-2">
                                {member.courses.map((course: Enrollment) => (
                                  <div key={course._id} className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-300 rounded-lg p-4 hover:shadow-md transition">
                                    <div className="flex items-start justify-between mb-3">
                                      <h5 className="font-semibold text-gray-900 flex-1 line-clamp-2">{course.eventId?.title || 'Untitled Course'}</h5>
                                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold flex-shrink-0 ml-2 whitespace-nowrap ${
                                        course.status === 'completed' ? 'bg-green-200 text-green-800' :
                                        course.status === 'in_progress' ? 'bg-blue-200 text-blue-800' :
                                        'bg-gray-200 text-gray-800'
                                      }`}>
                                        {course.status === 'completed' ? '✓ Completed' : 
                                         course.status === 'in_progress' ? '⏳ In Progress' : 
                                         'Not Started'}
                                      </span>
                                    </div>
                                    {course.progress !== undefined ? (
                                      <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                          <span className="text-xs font-semibold text-gray-700">Progress</span>
                                          <span className="text-sm font-bold text-blue-700">{course.progress}%</span>
                                        </div>
                                        <div className="w-full bg-blue-300 rounded-full h-2">
                                          <div className="bg-gradient-to-r from-blue-600 to-blue-500 h-2 rounded-full transition-all" style={{width: `${course.progress}%`}} />
                                        </div>
                                      </div>
                                    ) : null}
                                    <div className="text-xs text-gray-700 mt-3 pt-3 border-t border-blue-200">
                                      <div>📅 Enrolled: {new Date(course.enrolledDate || course.createdAt || '').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                                      {course.completedDate && <div className="text-green-700">✓ Completed: {new Date(course.completedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Events Section */}
                          {member.events && member.events.length > 0 && (
                            <div>
                              <h4 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2 pb-3 border-b-2 border-orange-200">
                                <Zap className="w-5 h-5 text-orange-600" />
                                <span>Events & Trainings ({member.events.length})</span>
                                <span className="ml-auto text-sm font-normal text-gray-600">
                                  {member.events.filter(e => e.status === 'completed').length} attended
                                </span>
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto pr-2">
                                {member.events.map((event: Enrollment) => (
                                  <div key={event._id} className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-300 rounded-lg p-4 hover:shadow-md transition">
                                    <div className="flex items-start justify-between mb-3">
                                      <h5 className="font-semibold text-gray-900 flex-1 line-clamp-2">{event.eventId?.title || 'Untitled Event'}</h5>
                                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold flex-shrink-0 ml-2 whitespace-nowrap ${
                                        event.status === 'completed' ? 'bg-green-200 text-green-800' :
                                        event.status === 'in_progress' ? 'bg-orange-200 text-orange-800' :
                                        'bg-gray-200 text-gray-800'
                                      }`}>
                                        {event.status === 'completed' ? '✓ Completed' : 
                                         event.status === 'in_progress' ? '⏳ In Progress' : 
                                         'Registered'}
                                      </span>
                                    </div>
                                    {event.eventId?.startDate && (
                                      <div className="space-y-2 text-xs text-gray-700">
                                        <div className="flex items-center gap-2">
                                          <span>📅</span>
                                          <span><strong>Start:</strong> {new Date(event.eventId.startDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                        </div>
                                        {event.eventId?.endDate && (
                                          <div className="flex items-center gap-2">
                                            <span>📅</span>
                                            <span><strong>End:</strong> {new Date(event.eventId.endDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                          </div>
                                        )}
                                      </div>
                                    )}
                                    <div className="text-xs text-gray-700 mt-3 pt-3 border-t border-orange-200">
                                      Registered: {new Date(event.enrolledDate || event.createdAt || '').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {member.courses?.length === 0 && member.events?.length === 0 && (
                            <p className="text-gray-500 text-sm text-center py-4">No enrollments yet</p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p>No staff members added yet</p>
                </div>
              )}
            </div>
          </>
        )}

        {/* Individual Learning Progress */}
        {user.role === 'INDIVIDUAL' && enrollments.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-blue-600" />
              Learning Progress
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-blue-50 rounded-lg p-6">
                <p className="text-sm text-blue-600 font-medium mb-2">Total Enrolled</p>
                <p className="text-3xl font-bold text-blue-900">{completionStats.enrolledCount}</p>
              </div>
              <div className="bg-green-50 rounded-lg p-6">
                <p className="text-sm text-green-600 font-medium mb-2">Completed</p>
                <p className="text-3xl font-bold text-green-900">{completionStats.completedCount}</p>
              </div>
              <div className="bg-orange-50 rounded-lg p-6">
                <p className="text-sm text-orange-600 font-medium mb-2">In Progress</p>
                <p className="text-3xl font-bold text-orange-900">{completionStats.inProgressCount}</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-6">
                <p className="text-sm text-purple-600 font-medium mb-2">Completion Rate</p>
                <p className="text-3xl font-bold text-purple-900">{completionStats.completionRate}%</p>
              </div>
            </div>

            {/* Courses & Events */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Events */}
              {events.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-orange-600" />
                    Registered Events ({events.length})
                  </h3>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {events.map((enrollment: any) => (
                      <div key={enrollment._id} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-orange-300 transition">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-gray-900">{enrollment.eventId?.title}</h4>
                          <span className={`inline-block px-2 py-1 rounded text-xs font-bold capitalize ${
                            enrollment.status === 'completed' ? 'bg-green-100 text-green-700' :
                            enrollment.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {enrollment.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{enrollment.eventId?.description?.substring(0, 100)}</p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>Enrolled: {new Date(enrollment.enrolledDate || enrollment.createdAt).toLocaleDateString()}</span>
                          {enrollment.progress && <span>Progress: {enrollment.progress}%</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Courses */}
              {courses.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-green-600" />
                    Enrolled Courses ({courses.length})
                  </h3>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {courses.map((enrollment: any) => (
                      <div key={enrollment._id} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-green-300 transition">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-gray-900">{enrollment.eventId?.title}</h4>
                          <span className={`inline-block px-2 py-1 rounded text-xs font-bold capitalize ${
                            enrollment.status === 'completed' ? 'bg-green-100 text-green-700' :
                            enrollment.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {enrollment.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{enrollment.eventId?.description?.substring(0, 100)}</p>
                        {enrollment.progress ? (
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-xs text-gray-600">Progress</span>
                              <span className="text-xs font-semibold text-gray-900">{enrollment.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-green-500 h-2 rounded-full" style={{width: `${enrollment.progress}%`}} />
                            </div>
                          </div>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Staff Content Info */}
        {user.role === 'STAFF' && staffContent && (
          <>
            {/* Staff Courses & Events Enrollments */}
            {(courses.length > 0 || events.length > 0) && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                  Courses & Events
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Events */}
                  {events.length > 0 && (
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Zap className="w-5 h-5 text-orange-600" />
                        Registered Events ({events.length})
                      </h3>
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {events.map((enrollment: any) => (
                          <div key={enrollment._id} className="bg-orange-50 rounded-lg p-4 border border-orange-200 hover:border-orange-400 transition">
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="font-semibold text-gray-900">{enrollment.eventId?.title}</h4>
                              <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold capitalize ${
                                enrollment.status === 'completed' ? 'bg-green-100 text-green-700' :
                                enrollment.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {enrollment.status}
                              </span>
                            </div>
                            {enrollment.eventId?.description && (
                              <p className="text-sm text-gray-600 mb-2">{enrollment.eventId.description.substring(0, 100)}</p>
                            )}
                            <div className="text-xs text-gray-600">
                              📅 {enrollment.eventId?.startDate ? new Date(enrollment.eventId.startDate).toLocaleDateString() : 'TBA'}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Courses */}
                  {courses.length > 0 && (
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-blue-600" />
                        Enrolled Courses ({courses.length})
                      </h3>
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {courses.map((enrollment: any) => (
                          <div key={enrollment._id} className="bg-blue-50 rounded-lg p-4 border border-blue-200 hover:border-blue-400 transition">
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="font-semibold text-gray-900">{enrollment.eventId?.title}</h4>
                              <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold capitalize ${
                                enrollment.status === 'completed' ? 'bg-green-100 text-green-700' :
                                enrollment.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {enrollment.status}
                              </span>
                            </div>
                            {enrollment.eventId?.description && (
                              <p className="text-sm text-gray-600 mb-2">{enrollment.eventId.description.substring(0, 100)}</p>
                            )}
                            {enrollment.progress ? (
                              <div>
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-xs text-gray-600">Progress</span>
                                  <span className="text-xs font-semibold text-gray-900">{enrollment.progress}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div className="bg-blue-500 h-2 rounded-full" style={{width: `${enrollment.progress}%`}} />
                                </div>
                              </div>
                            ) : null}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}

        {/* No Activity State */}
        {enrollments.length === 0 && user.role !== 'STAFF' && user.role !== 'CORPORATE' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No courses or events enrolled yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
