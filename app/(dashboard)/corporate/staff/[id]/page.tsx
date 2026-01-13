'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, BookOpen, Mail, FileText, Award, Briefcase } from 'lucide-react';
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
    try {
      setUpdatingProgress(true);
      const response = await fetch(`/api/corporates/staff/courses/${enrollmentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ progress }),
      });

      if (response.ok) {
        setEnrollments(enrollments.map(e => 
          e._id === enrollmentId ? { ...e, progress } : e
        ));
      }
    } catch (err) {
      console.error('Error updating progress:', err);
    } finally {
      setUpdatingProgress(false);
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
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <BookOpen className="w-6 h-6 text-green-600" />
          Assigned Courses & Events
        </h2>

        {enrollments.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No courses assigned yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {enrollments.map((enrollment) => (
              <div
                key={enrollment._id}
                className="border border-gray-200 rounded-xl p-6 hover:shadow-md hover:border-green-200 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-gray-900">{enrollment.eventId.title}</h4>
                    {enrollment.eventId.description && (
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">{enrollment.eventId.description}</p>
                    )}
                  </div>
                  <button
                    onClick={() => removeEnrollment(enrollment._id)}
                    className="ml-4 px-3 py-2 hover:bg-red-50 rounded-lg transition-colors text-red-600 hover:text-red-700 font-medium text-sm whitespace-nowrap"
                  >
                    Remove
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-700">Progress</span>
                      <span className="text-sm font-bold text-green-600">{enrollment.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-green-600 h-2.5 rounded-full transition-all duration-300"
                        style={{ width: `${enrollment.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    {[25, 50, 75, 100].map((value) => (
                      <button
                        key={value}
                        onClick={() => updateProgress(enrollment._id, value)}
                        disabled={updatingProgress}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                          enrollment.progress === value
                            ? 'bg-green-600 text-white shadow-md'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        } ${updatingProgress ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {value}%
                      </button>
                    ))}
                  </div>

                  {enrollment.status === 'completed' && (
                    <div className="text-sm text-green-700 font-medium pt-3 border-t border-green-200 mt-3">
                      ✓ Completed on {new Date(enrollment.completionDate!).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
