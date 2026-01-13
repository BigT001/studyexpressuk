'use client';

import { useState, useEffect } from 'react';
import { BookOpen, Users, Award, TrendingUp, Loader, X, Check } from 'lucide-react';

interface CourseEnrollment {
  _id: string;
  courseId: { _id: string; title: string; description?: string };
  staffId: string;
  progress: number;
  status: string;
  completionDate?: string;
}

interface StaffMember {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface Course {
  _id: string;
  title: string;
  description?: string;
  category?: string;
  duration?: number;
  level?: string;
  price?: number;
  instructor?: string;
  status?: 'draft' | 'published' | 'active' | 'archived';
}

export default function CorporateCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<CourseEnrollment[]>([]);
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedStaffId, setSelectedStaffId] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [assigningCourse, setAssigningCourse] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch registered courses for this corporate
      const coursesRes = await fetch('/api/corporates/courses');
      const coursesData = await coursesRes.json();
      if (coursesData.success) {
        setCourses(coursesData.registeredCourses || []);
      } else {
        console.error('Error fetching courses:', coursesData.error);
        setError(coursesData.error || 'Failed to fetch courses');
      }

      // Fetch enrollments for this corporate
      const enrollmentsRes = await fetch('/api/corporates/staff/courses');
      const enrollmentsData = await enrollmentsRes.json();
      if (enrollmentsData.success) {
        setEnrollments(enrollmentsData.enrollments || []);
      } else {
        console.error('Error fetching enrollments:', enrollmentsData.error);
      }

      // Fetch staff
      const staffRes = await fetch('/api/corporates/staff');
      const staffData = await staffRes.json();
      if (staffData.success) {
        const staffData_safe = staffData.staff || [];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setStaffMembers(staffData_safe.map((s: any) => ({
          _id: s._id,
          firstName: s.userId?.firstName || '',
          lastName: s.userId?.lastName || '',
          email: s.userId?.email || '',
        })));
      } else {
        console.error('Error fetching staff:', staffData.error);
      }

      if (coursesData.success) {
        setError('');
      }
    } catch (err) {
      setError('Failed to load course data');
      console.error('Error in fetchData:', err);
    } finally {
      setLoading(false);
    }
  };

  const assignCourse = async () => {
    if (!selectedStaffId || !selectedCourseId) {
      setError('Please select both staff member and course');
      return;
    }

    try {
      setAssigningCourse(true);
      const response = await fetch('/api/corporates/staff/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          staffId: selectedStaffId,
          eventId: selectedCourseId,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setShowModal(false);
        setSelectedStaffId('');
        setSelectedCourseId('');
        await fetchData();
        setError('');
      } else {
        setError(data.error || 'Failed to assign course');
      }
    } catch (err) {
      setError('Error assigning course');
      console.error(err);
    } finally {
      setAssigningCourse(false);
    }
  };

  const unregisterCourse = async (courseId: string) => {
    try {
      const response = await fetch('/api/corporates/courses', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId }),
      });

      const data = await response.json();
      if (data.success) {
        setError('');
        await fetchData();
      } else {
        setError(data.error || 'Failed to unregister course');
      }
    } catch (err) {
      setError('Error unregistering course');
      console.error(err);
    }
  };

  const isRegistered = (courseId: string) => {
    return courses.some(c => c._id === courseId);
  };

  // Calculate statistics
  const stats = {
    totalCourses: courses.length,
    totalEnrolled: enrollments.length,
    totalCompleted: enrollments.filter(e => e.status === 'completed').length,
    avgProgress: enrollments.length > 0 
      ? Math.round(enrollments.reduce((sum, e) => sum + e.progress, 0) / enrollments.length)
      : 0,
  };

  // Group enrollments by course
  const enrollmentsByCourseByCourse = courses.map((course: Course) => ({
    ...course,
    enrollments: enrollments.filter(e => e.courseId?._id === course._id),
  })).filter(c => c.enrollments.length > 0);

  // Get staff progress
  const staffProgress = staffMembers.map(staff => {
    const staffEnrollments = enrollments.filter(e => e.staffId === staff._id);
    return {
      ...staff,
      enrolled: staffEnrollments.length,
      completed: staffEnrollments.filter(e => e.status === 'completed').length,
      progress: staffEnrollments.length > 0
        ? Math.round(staffEnrollments.reduce((sum, e) => sum + e.progress, 0) / staffEnrollments.length)
        : 0,
    };
  }).filter(s => s.enrolled > 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader className="w-12 h-12 text-green-600 mx-auto animate-spin mb-4" />
          <p className="text-gray-600">Loading course data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900">Training & Courses</h1>
        <p className="text-gray-600 mt-2">Manage staff enrollment and monitor learning progress</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError('')} className="text-red-500 hover:text-red-700">
            <X className="w-5 h-5" />
          </button>
        </div>
      )}
        <div className="space-y-6">
          {/* Assign Course Modal */}
          {showModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Assign Course to Staff</h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Staff Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Select Staff Member</label>
                    <select
                      value={selectedStaffId}
                      onChange={(e) => setSelectedStaffId(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                    >
                      <option value="">Choose a staff member...</option>
                      {staffMembers.map(staff => (
                        <option key={staff._id} value={staff._id}>
                          {staff.firstName} {staff.lastName}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Course Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Select Course</label>
                    <select
                      value={selectedCourseId}
                      onChange={(e) => setSelectedCourseId(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                    >
                      <option value="">Choose a course...</option>
                      {courses.map(course => (
                        <option key={course._id} value={course._id}>
                          {course.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={assignCourse}
                    disabled={assigningCourse || !selectedStaffId || !selectedCourseId}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {assigningCourse ? 'Assigning...' : 'Assign Course'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Active Courses</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalCourses}</p>
                </div>
                <BookOpen className="w-8 h-8 text-green-600 opacity-20" />
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Staff Enrolled</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalEnrolled}</p>
                </div>
                <Users className="w-8 h-8 text-blue-600 opacity-20" />
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Completed</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalCompleted}</p>
                </div>
                <Award className="w-8 h-8 text-amber-600 opacity-20" />
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Avg. Progress</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.avgProgress}%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600 opacity-20" />
              </div>
            </div>
          </div>

          {/* Active Course Enrollments */}
          {enrollmentsByCourseByCourse.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="bg-linear-to-r from-green-50 to-green-100 p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-green-600" />
                  Active Course Enrollments
                </h2>
                <p className="text-gray-600 mt-1">Courses with active staff assignments</p>
              </div>

              <div className="divide-y divide-gray-200">
                {enrollmentsByCourseByCourse.map((course) => {
                  const courseEnrollments = course.enrollments;
                  const completed = courseEnrollments.filter((e: CourseEnrollment) => e.status === 'completed').length;
                  const inProgress = courseEnrollments.length - completed;
                  const avgProgress = Math.round(
                    courseEnrollments.reduce((sum: number, e: CourseEnrollment) => sum + e.progress, 0) / courseEnrollments.length
                  );

                  return (
                    <div key={course._id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900">{course.title}</h3>
                          {course.description && (
                            <p className="text-gray-600 text-sm mt-1 line-clamp-2">{course.description}</p>
                          )}

                          <div className="mt-4 flex items-center gap-8">
                            <div>
                              <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Staff Enrolled</p>
                              <p className="text-2xl font-bold text-gray-900 mt-1">{courseEnrollments.length}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Completed</p>
                              <p className="text-2xl font-bold text-green-600 mt-1">{completed}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">In Progress</p>
                              <p className="text-2xl font-bold text-blue-600 mt-1">{inProgress}</p>
                            </div>
                          </div>

                          <div className="mt-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-semibold text-gray-700">Overall Progress</span>
                              <span className="text-sm font-bold text-gray-900">{avgProgress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                              <div
                                className="bg-linear-to-r from-green-500 to-green-600 h-3 rounded-full transition-all"
                                style={{ width: `${avgProgress}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Staff Learning Progress */}
          {staffProgress.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="bg-linear-to-r from-blue-50 to-blue-100 p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Users className="w-6 h-6 text-blue-600" />
                  Staff Learning Progress
                </h2>
                <p className="text-gray-600 mt-1">Individual staff member performance tracking</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Staff Member</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Enrolled</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Completed</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Progress</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {staffProgress.map((staff) => (
                      <tr key={staff._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <span className="font-medium text-gray-900">{staff.firstName} {staff.lastName}</span>
                          <p className="text-xs text-gray-500 mt-0.5">{staff.email}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm">
                            {staff.enrolled}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-green-100 text-green-700 font-semibold text-sm">
                            {staff.completed}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-32 bg-gray-200 rounded-full h-2.5">
                              <div
                                className="bg-linear-to-r from-green-500 to-green-600 h-2.5 rounded-full transition-all"
                                style={{ width: `${staff.progress}%` }}
                              />
                            </div>
                            <span className="text-sm font-semibold text-gray-900 w-12 text-right">{staff.progress}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Your Registered Courses */}
          {courses.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="bg-linear-to-r from-purple-50 to-purple-100 p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-purple-600" />
                  Your Registered Courses
                </h2>
                <p className="text-gray-600 mt-1">Courses you have registered and can assign to staff</p>
              </div>

              <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {courses.map((course) => (
                  <div key={course._id} className="border border-gray-200 rounded-lg p-5 hover:shadow-md hover:border-purple-300 transition-all">
                    <h3 className="font-bold text-gray-900 text-base">{course.title}</h3>
                    {course.description && (
                      <p className="text-gray-600 text-sm mt-2 line-clamp-2">{course.description}</p>
                    )}
                    <div className="mt-4 flex flex-wrap gap-2">
                      {course.category && (
                        <span className="px-2.5 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">
                          {course.category}
                        </span>
                      )}
                      {course.level && (
                        <span className="px-2.5 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                          {course.level}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        setSelectedCourseId(course._id);
                        setShowModal(true);
                      }}
                      className="mt-4 w-full px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                    >
                      Assign to Staff
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {courses.length === 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">No courses registered yet</h3>
              <p className="text-gray-600 mb-6">Visit the <a href="/courses" className="text-green-600 hover:text-green-700 font-semibold">Courses page</a> to browse and register courses for your organization.</p>
            </div>
          )}
        </div>
    </div>
  );
}
