'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, BookOpen, Mail, FileText, Award, Briefcase, Zap, CheckCircle2, AlertCircle, TrendingUp } from 'lucide-react';
import Image from 'next/image';

interface StaffDetail {
  _id: string;
  userId: {
    _id: string;
    firstName?: string;
    lastName?: string;
    email: string;
    phone?: string;
    dob?: string;
    bio?: string;
    interests?: string;
    qualifications?: string;
    profileImage?: string;
  };
  role: string;
  department?: string;
  status: string;
  joinDate?: string;
  approvalStatus?: string;
}

interface Enrollment {
  _id: string;
  eventId: { _id: string; title: string; description?: string };
  status: string;
  progress: number;
  completionDate?: string;
  createdAt?: string;
}

interface ProgressUpdate {
  enrollmentId: string;
  oldProgress: number;
  newProgress: number;
  timestamp: string;
}

export default function StaffDetailPage() {
  const router = useRouter();
  const params = useParams();
  const staffId = params.id as string;

  const [staffDetail, setStaffDetail] = useState<StaffDetail | null>(null);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingProgress, setUpdatingProgress] = useState(false);
  const [progressHistory, setProgressHistory] = useState<Map<string, ProgressUpdate[]>>(new Map());
  const [selectedEnrollmentId, setSelectedEnrollmentId] = useState<string | null>(null);
  const [customProgressInput, setCustomProgressInput] = useState<Map<string, number>>(new Map());

  useEffect(() => {
    if (staffId) {
      fetchStaffDetail();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [staffId]);

  const fetchStaffDetail = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/corporates/staff/${staffId}`);
      const data = await response.json();
      
      console.log('API Response:', { status: response.status, data });
      
      if (!response.ok) {
        setError(`Error: ${response.status} - ${data.error || 'Failed to load staff details'}`);
        return;
      }
      
      if (data.success) {
        setStaffDetail(data.staff);
        await fetchEnrollments(data.staff._id);
        setError('');
      } else {
        setError(data.error || 'Failed to load staff details');
      }
    } catch (err) {
      setError(`Error loading staff details: ${err instanceof Error ? err.message : 'Unknown error'}`);
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchEnrollments = async (staffIdValue: string) => {
    try {
      const response = await fetch(`/api/corporates/staff/courses?staffId=${staffIdValue}`);
      const data = await response.json();
      
      if (data.success) {
        setEnrollments(data.enrollments);
      }
    } catch (err) {
      console.error('Error fetching enrollments:', err);
    }
  };

  const updateProgress = async (enrollmentId: string, progress: number) => {
    const currentEnrollment = enrollments.find(e => e._id === enrollmentId);
    if (!currentEnrollment) return;

    try {
      setUpdatingProgress(true);
      const response = await fetch(`/api/corporates/staff/courses/${enrollmentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ progress }),
      });

      if (response.ok) {
        const oldProgress = currentEnrollment.progress;
        setEnrollments(enrollments.map(e => 
          e._id === enrollmentId ? { ...e, progress } : e
        ));
        
        // Track progress history
        const history = progressHistory.get(enrollmentId) || [];
        history.push({
          enrollmentId,
          oldProgress,
          newProgress: progress,
          timestamp: new Date().toISOString()
        });
        progressHistory.set(enrollmentId, history);
        setProgressHistory(new Map(progressHistory));
      }
    } catch (err) {
      console.error('Error updating progress:', err);
    } finally {
      setUpdatingProgress(false);
    }
  };

  const handleCustomProgressUpdate = async (enrollmentId: string) => {
    const value = customProgressInput.get(enrollmentId);
    if (value !== undefined && value >= 0 && value <= 100) {
      await updateProgress(enrollmentId, Math.round(value));
      customProgressInput.delete(enrollmentId);
      setCustomProgressInput(new Map(customProgressInput));
    }
  };

  const removeEnrollment = async (enrollmentId: string) => {
    if (!confirm('Remove this course enrollment?')) return;

    try {
      const response = await fetch(`/api/corporates/staff/courses/${enrollmentId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setEnrollments(enrollments.filter(e => e._id !== enrollmentId));
      }
    } catch (err) {
      console.error('Error removing enrollment:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">Loading staff details...</div>
      </div>
    );
  }

  if (error || !staffDetail) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Staff
        </button>
        <div className="text-center py-12">
          <p className="text-red-600 font-medium">{error || 'Staff member not found'}</p>
          <p className="text-gray-500 text-sm mt-4">Staff ID: {staffId}</p>
          {process.env.NODE_ENV === 'development' && (
            <details className="mt-4 text-left inline-block bg-gray-100 p-4 rounded text-xs text-gray-700">
              <summary className="cursor-pointer font-semibold">Debug Info</summary>
              <pre className="mt-2 whitespace-pre-wrap">{JSON.stringify({ staffId, error, loading }, null, 2)}</pre>
            </details>
          )}
        </div>
      </div>
    );
  }

  const fullName = staffDetail.userId.firstName && staffDetail.userId.lastName 
    ? `${staffDetail.userId.firstName} ${staffDetail.userId.lastName}`
    : staffDetail.userId.email;

  return (
    <div className="space-y-6 p-6">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Staff
      </button>

      {/* Header Card with Profile */}
      <div className="bg-linear-to-r from-green-600 to-green-700 rounded-2xl p-8 text-white shadow-lg overflow-hidden relative">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-1/3 w-32 h-32 bg-white/5 rounded-full -mb-16"></div>
        
        <div className="relative z-10 flex items-center gap-8">
          <div className="shrink-0">
            {staffDetail.userId.profileImage ? (
              <Image
                src={staffDetail.userId.profileImage}
                alt={fullName}
                width={140}
                height={140}
                className="rounded-full object-cover border-4 border-white shadow-xl w-35 h-35"
              />
            ) : (
              <div className="w-35 h-35 rounded-full bg-white/20 flex items-center justify-center text-white text-3xl font-bold border-4 border-white shadow-xl">
                {fullName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <p className="text-green-100 text-sm font-semibold uppercase tracking-wide mb-1">Staff Member</p>
            <h1 className="text-3xl font-bold mb-3">{fullName}</h1>
            <p className="text-green-100 mb-6 flex items-center gap-2">{staffDetail.userId.email}</p>
            
            <div className="flex flex-wrap gap-3">
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2.5 rounded-lg border border-white/30 flex items-center gap-2">
                <span className="text-xs text-green-100 font-semibold">Position</span>
                <span className="font-semibold text-sm">{staffDetail.role}</span>
              </div>
              {staffDetail.department && (
                <div className="bg-white/20 backdrop-blur-sm px-4 py-2.5 rounded-lg border border-white/30 flex items-center gap-2">
                  <span className="text-xs text-green-100 font-semibold">Department</span>
                  <span className="font-semibold text-sm">{staffDetail.department}</span>
                </div>
              )}
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2.5 rounded-lg border border-white/30 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-green-200"></span>
                <span className="font-semibold text-sm capitalize">{staffDetail.status}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Left Column - Contact & Employment Info */}
        <div className="space-y-6">
          {/* Contact Information Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <h3 className="font-bold text-lg text-gray-900 flex items-center gap-3 mb-6">
              <Mail className="w-5 h-5 text-green-600" />
              Contact Information
            </h3>
            
            <div className="space-y-5">
              <div className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Email</p>
                <p className="text-gray-900 font-medium">{staffDetail.userId.email}</p>
              </div>

              {staffDetail.userId.phone && (
                <div className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Phone</p>
                  <p className="text-gray-900 font-medium">{staffDetail.userId.phone}</p>
                </div>
              )}

              {staffDetail.userId.dob && (
                <div className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Date of Birth</p>
                  <p className="text-gray-900 font-medium">{new Date(staffDetail.userId.dob).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
              )}
            </div>
          </div>

          {/* Employment Information Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <h3 className="font-bold text-lg text-gray-900 flex items-center gap-3 mb-6">
              <Briefcase className="w-5 h-5 text-green-600" />
              Employment Information
            </h3>

            <div className="space-y-5">
              {staffDetail.joinDate && (
                <div className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Join Date</p>
                  <p className="text-gray-900 font-medium">{new Date(staffDetail.joinDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
              )}

              {staffDetail.approvalStatus && (
                <div className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Approval Status</p>
                  <div className="flex items-center gap-3">
                    <span className={`w-3 h-3 rounded-full ${
                      staffDetail.approvalStatus === 'approved' ? 'bg-green-500' :
                      staffDetail.approvalStatus === 'rejected' ? 'bg-red-500' : 'bg-yellow-500'
                    }`}></span>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      staffDetail.approvalStatus === 'approved' ? 'bg-green-100 text-green-800' :
                      staffDetail.approvalStatus === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {staffDetail.approvalStatus.charAt(0).toUpperCase() + staffDetail.approvalStatus.slice(1)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Bio & Additional Info */}
        <div className="space-y-6">
          {/* Bio Card */}
          {staffDetail.userId.bio && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <h3 className="font-bold text-lg text-gray-900 mb-4">Bio</h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-sm">{staffDetail.userId.bio}</p>
            </div>
          )}

          {/* Interests Card */}
          {staffDetail.userId.interests && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <h3 className="font-bold text-lg text-gray-900 flex items-center gap-3 mb-4">
                <Award className="w-5 h-5 text-green-600" />
                Interests
              </h3>
              {Array.isArray(staffDetail.userId.interests) ? (
                <div className="flex flex-wrap gap-2">
                  {staffDetail.userId.interests.map((interest, i) => (
                    <span key={i} className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium border border-green-200">
                      {interest}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-700 text-sm whitespace-pre-wrap">{staffDetail.userId.interests}</p>
              )}
            </div>
          )}

          {/* Qualifications Card */}
          {staffDetail.userId.qualifications && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <h3 className="font-bold text-lg text-gray-900 flex items-center gap-3 mb-4">
                <FileText className="w-5 h-5 text-green-600" />
                Qualifications
              </h3>
              {Array.isArray(staffDetail.userId.qualifications) ? (
                <div className="space-y-2">
                  {staffDetail.userId.qualifications.map((qual, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-green-600 font-bold mt-0.5">✓</span>
                      <span>{qual}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-700 text-sm whitespace-pre-wrap">{staffDetail.userId.qualifications}</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Enrolled Courses/Events */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-green-600" />
            Assigned Courses & Events
          </h2>
          {enrollments.length > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg border border-blue-200">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-semibold text-blue-900">
                Avg Progress: {Math.round(enrollments.reduce((sum, e) => sum + e.progress, 0) / enrollments.length)}%
              </span>
            </div>
          )}
        </div>

        {enrollments.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No courses assigned yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {enrollments.map((enrollment) => {
              const isCompleted = enrollment.progress === 100;
              const progressPercentage = enrollment.progress;
              const history = progressHistory.get(enrollment._id) || [];
              
              return (
                <div
                  key={enrollment._id}
                  className={`border rounded-xl p-6 transition-all ${
                    selectedEnrollmentId === enrollment._id
                      ? 'border-green-400 bg-green-50 shadow-md'
                      : 'border-gray-200 hover:border-green-200 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-start justify-between mb-5">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-lg font-bold text-gray-900">{enrollment.eventId.title}</h4>
                        {isCompleted && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Completed
                          </span>
                        )}
                      </div>
                      {enrollment.eventId.description && (
                        <p className="text-sm text-gray-600 line-clamp-2">{enrollment.eventId.description}</p>
                      )}
                    </div>
                    <button
                      onClick={() => removeEnrollment(enrollment._id)}
                      className="ml-4 px-3 py-2 hover:bg-red-50 rounded-lg transition-colors text-red-600 hover:text-red-700 font-medium text-sm whitespace-nowrap"
                    >
                      Remove
                    </button>
                  </div>

                  {/* Progress Section */}
                  <div className="space-y-5 bg-white -mx-6 -mb-6 px-6 py-5 rounded-b-xl border-t border-gray-100">
                    {/* Progress Bar with Stats */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-semibold text-gray-700">Progress Tracking</span>
                        <div className="flex items-center gap-4">
                          <span className="text-2xl font-bold text-green-600">{progressPercentage}%</span>
                          {enrollment.status === 'completed' && enrollment.completionDate && (
                            <span className="text-xs text-gray-500 font-medium">
                              Completed: {new Date(enrollment.completionDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full transition-all duration-300 ${
                            progressPercentage < 50 ? 'bg-red-500' :
                            progressPercentage < 80 ? 'bg-yellow-500' :
                            'bg-green-600'
                          }`}
                          style={{ width: `${progressPercentage}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Quick Progress Buttons */}
                    <div className="grid grid-cols-5 gap-2">
                      {[0, 25, 50, 75, 100].map((value) => (
                        <button
                          key={value}
                          onClick={() => updateProgress(enrollment._id, value)}
                          disabled={updatingProgress}
                          className={`px-3 py-2.5 text-xs font-bold rounded-lg transition-all ${
                            progressPercentage === value
                              ? 'bg-green-600 text-white shadow-md ring-2 ring-green-300'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          } ${updatingProgress ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          {value}%
                        </button>
                      ))}
                    </div>

                    {/* Custom Progress Input */}
                    <div className="flex gap-2">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        placeholder="Custom %"
                        value={customProgressInput.get(enrollment._id) ?? ''}
                        onChange={(e) => {
                          const val = e.target.value ? parseInt(e.target.value) : undefined;
                          if (val !== undefined) {
                            customProgressInput.set(enrollment._id, val);
                          } else {
                            customProgressInput.delete(enrollment._id);
                          }
                          setCustomProgressInput(new Map(customProgressInput));
                        }}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleCustomProgressUpdate(enrollment._id);
                          }
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                      <button
                        onClick={() => handleCustomProgressUpdate(enrollment._id)}
                        disabled={updatingProgress}
                        className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                      >
                        Update
                      </button>
                    </div>

                    {/* Status & Details */}
                    <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-100">
                      <div className="space-y-1">
                        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Status</p>
                        <p className={`text-sm font-bold capitalize ${
                          enrollment.status === 'completed' ? 'text-green-600' :
                          enrollment.status === 'in_progress' ? 'text-blue-600' :
                          'text-gray-600'
                        }`}>
                          {enrollment.status.replace('_', ' ')}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Enrolled</p>
                        <p className="text-sm font-medium text-gray-700">
                          {enrollment.createdAt ? new Date(enrollment.createdAt).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                    </div>

                    {/* Progress History */}
                    {history.length > 0 && (
                      <div className="pt-3 border-t border-gray-100">
                        <button
                          onClick={() => setSelectedEnrollmentId(
                            selectedEnrollmentId === enrollment._id ? null : enrollment._id
                          )}
                          className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors mb-2"
                        >
                          <Zap className="w-4 h-4" />
                          Update History ({history.length} {history.length === 1 ? 'update' : 'updates'})
                        </button>
                        {selectedEnrollmentId === enrollment._id && (
                          <div className="mt-3 max-h-48 overflow-y-auto space-y-2">
                            {[...history].reverse().map((update, idx) => (
                              <div key={idx} className="flex items-center justify-between text-xs bg-gray-50 p-2 rounded">
                                <span className="text-gray-600">
                                  {update.oldProgress}% → <span className="font-bold text-green-600">{update.newProgress}%</span>
                                </span>
                                <span className="text-gray-500">
                                  {new Date(update.timestamp).toLocaleDateString()} {new Date(update.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
