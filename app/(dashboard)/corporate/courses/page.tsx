'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { BookOpen, Users, Award, Loader, X } from 'lucide-react';

interface CourseEnrollment {
  _id: string;
  courseId?: { _id: string; title: string; description?: string };
  eventId?: { _id: string; title: string; description?: string };
  userId?: { _id: string; firstName: string; lastName: string; email: string };
  staffId?: string;
  progress?: number;
  status?: string;
  completionDate?: string;
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
  imageUrl?: string;
  status?: 'draft' | 'published' | 'active' | 'archived';
}

interface StaffMember {
  _id: string;
  userId?: string;
  firstName: string;
  lastName: string;
  email: string;
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
        const registeredCourses = coursesData.registeredCourses || [];
        console.log('Fetched registered courses:', registeredCourses.length);
        setCourses(registeredCourses);
      } else {
        console.error('Error fetching courses:', coursesData.error);
        setError(coursesData.error || 'Failed to fetch courses');
      }

      // Fetch enrollments for this corporate
      const enrollmentsRes = await fetch('/api/corporates/staff/courses');
      const enrollmentsData = await enrollmentsRes.json();
      if (enrollmentsData.success) {
        const enrollmentsList = enrollmentsData.enrollments || [];
        console.log('Fetched enrollments:', enrollmentsList.length);
        console.log('Sample enrollment:', enrollmentsList[0]);
        setEnrollments(enrollmentsList);
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
          _id: s._id, // This is CorporateStaffModel ID
          userId: s.userId?._id, // This is the actual User ID used in enrollments
          firstName: s.userId?.firstName || '',
          lastName: s.userId?.lastName || '',
          email: s.userId?.email || '',
        })));
      } else {
        console.error('Error fetching staff:', staffData.error);
      }

      setError('');
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
    totalStaffEnrolled: new Set(enrollments.map(e => e.userId?._id || e.userId)).size,
    totalCompleted: enrollments.filter(e => e.status === 'completed').length,
  };

  // Group enrollments by course
  const enrollmentsByCourseByCourse = courses.map((course: Course) => {
    const courseEnrollments = enrollments.filter(e => {
      const enrollmentCourseId = e.courseId?._id || e.eventId?._id || e.courseId || e.eventId;
      const courseId = course._id;
      const matches = enrollmentCourseId === courseId || enrollmentCourseId?.toString() === courseId?.toString();
      return matches;
    });
    return {
      ...course,
      enrollments: courseEnrollments,
    };
  }).filter(c => c.enrollments.length > 0);

  // Get staff progress
  const staffProgress = staffMembers.map(staff => {
    const staffEnrollments = enrollments.filter(e => e.userId?._id === staff._id);
    return {
      ...staff,
      enrolled: staffEnrollments.length,
      completed: staffEnrollments.filter(e => e.status === 'completed').length,
      progress: staffEnrollments.length > 0
        ? Math.round(staffEnrollments.reduce((sum, e) => sum + (e.progress || 0), 0) / staffEnrollments.length)
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Training & Courses</h1>
          <p className="text-gray-600 mt-2">Manage staff enrollment and monitor learning progress</p>
        </div>
        <a
          href="/courses"
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold whitespace-nowrap"
        >
          + Add Courses
        </a>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <p className="text-gray-600 text-sm font-medium">Completed</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalCompleted}</p>
                </div>
                <Award className="w-8 h-8 text-amber-600 opacity-20" />
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
                    courseEnrollments.reduce((sum: number, e: CourseEnrollment) => sum + (e.progress || 0), 0) / courseEnrollments.length
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

          {/* Your Registered Courses */}
          {courses.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="bg-linear-to-r from-purple-50 to-purple-100 p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-purple-600" />
                  Registered Courses ({courses.length})
                </h2>
                <p className="text-gray-600 mt-1">All courses your organization has registered. You can assign these to your staff members.</p>
              </div>

              <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course: Course) => {
                  const courseEnrollments = enrollments.filter(e => {
                    const enrollmentCourseId = e.courseId?._id || e.eventId?._id || e.courseId || e.eventId;
                    const courseId = course._id;
                    return enrollmentCourseId === courseId || enrollmentCourseId?.toString() === courseId?.toString();
                  });
                  const enrolledCount = courseEnrollments.length;
                  
                  return (
                    <div
                      key={course._id}
                      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                    >
                      {/* Course Image */}
                      {course.imageUrl && (
                        <div className="relative w-full aspect-video overflow-hidden bg-gray-200">
                          <Image
                            src={course.imageUrl}
                            alt={course.title}
                            fill
                            className="object-cover hover:scale-105 transition-transform duration-300"
                            unoptimized
                          />
                        </div>
                      )}

                      {/* Content */}
                      <div className="p-6 space-y-4">
                        {/* Header */}
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 line-clamp-2">{course.title}</h3>
                          {course.category && (
                            <p className="text-xs text-gray-600 mt-1">{course.category}</p>
                          )}
                        </div>

                        {/* Description */}
                        {course.description && (
                          <p className="text-gray-600 text-sm line-clamp-2">{course.description}</p>
                        )}

                        {/* Badges */}
                        <div className="flex flex-wrap gap-2">
                          {course.level && (
                            <span className="inline-flex text-xs font-semibold px-3 py-1 rounded-full bg-blue-100 text-blue-700">
                              {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                            </span>
                          )}
                        </div>

                        {/* Info */}
                        <div className="space-y-2 pt-2 border-t border-gray-200">
                          {course.instructor && (
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Instructor:</span>
                              <span className="font-semibold text-gray-900">{course.instructor}</span>
                            </div>
                          )}
                          {course.duration && (
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Duration:</span>
                              <span className="font-semibold text-gray-900">{course.duration}h</span>
                            </div>
                          )}
                        </div>

                        {/* Buttons */}
                        <button
                          onClick={() => {
                            setSelectedCourseId(course._id);
                            setShowModal(true);
                          }}
                          className="w-full px-4 py-3 text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-bold bg-green-600 mt-4"
                        >
                          Enroll Staff
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Empty State */}
          {courses.length === 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">No courses registered yet</h3>
              <p className="text-gray-600 mb-6">Your organization hasn&apos;t registered any courses yet. Browse available courses and add them to get started.</p>
              <a
                href="/courses"
                className="inline-flex px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
              >
                Browse & Add Courses
              </a>
            </div>
          )}
        </div>
    </div>
  );
}
