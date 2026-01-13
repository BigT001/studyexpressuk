'use client';

import { useState, useEffect } from 'react';
import { BookOpen, Calendar, User, LogOut } from 'lucide-react';

interface EnrolledCourse {
  _id: string;
  courseId: {
    _id: string;
    title: string;
    description?: string;
  };
  progress: number;
  status: 'enrolled' | 'in_progress' | 'completed';
  enrollmentDate: string;
  completionDate?: string;
}

interface EnrolledEvent {
  _id: string;
  eventId: {
    _id: string;
    title: string;
    date?: string;
    description?: string;
  };
  registrationDate: string;
  status: 'registered' | 'attended' | 'cancelled';
}

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
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [enrolledEvents, setEnrolledEvents] = useState<EnrolledEvent[]>([]);
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

      // Fetch enrolled courses
      const coursesRes = await fetch('/api/staff/enrollments/courses');
      const coursesData = await coursesRes.json();
      if (coursesData.success) {
        setEnrolledCourses(coursesData.enrollments || []);
      }

      // Fetch enrolled events
      const eventsRes = await fetch('/api/staff/enrollments/events');
      const eventsData = await eventsRes.json();
      if (eventsData.success) {
        setEnrolledEvents(eventsData.enrollments || []);
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
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome, {profile?.firstName || 'Staff Member'}</h1>
          <p className="text-gray-600 mt-1">{profile?.role} • {profile?.department || 'General'}</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Enrolled Courses</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{enrolledCourses.length}</p>
              </div>
              <BookOpen className="w-12 h-12 text-blue-100" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Registered Events</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{enrolledEvents.length}</p>
              </div>
              <Calendar className="w-12 h-12 text-green-100" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Completed Courses</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {enrolledCourses.filter(c => c.status === 'completed').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 text-lg">✓</span>
              </div>
            </div>
          </div>
        </div>

        {/* Enrolled Courses */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Enrolled Courses</h2>
          
          {enrolledCourses.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600">You are not enrolled in any courses yet.</p>
              <p className="text-sm text-gray-500 mt-2">Your organization will assign courses to you.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {enrolledCourses.map((course) => (
                <div key={course._id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{course.courseId.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{course.courseId.description}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      course.status === 'completed' ? 'bg-green-100 text-green-800' :
                      course.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {course.status === 'completed' ? '✓ Completed' :
                       course.status === 'in_progress' ? 'In Progress' :
                       'Enrolled'}
                    </span>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Progress</span>
                      <span className="text-sm font-medium text-gray-900">{course.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500">
                    Enrolled on {new Date(course.enrollmentDate).toLocaleDateString()}
                    {course.completionDate && (
                      <> • Completed on {new Date(course.completionDate).toLocaleDateString()}</>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Registered Events */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Registered Events</h2>
          
          {enrolledEvents.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600">You are not registered for any events yet.</p>
              <p className="text-sm text-gray-500 mt-2">Your organization will register you for events.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {enrolledEvents.map((event) => (
                <div key={event._id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{event.eventId.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{event.eventId.description}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      event.status === 'attended' ? 'bg-green-100 text-green-800' :
                      event.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {event.status === 'attended' ? '✓ Attended' :
                       event.status === 'cancelled' ? 'Cancelled' :
                       'Registered'}
                    </span>
                  </div>

                  {event.eventId.date && (
                    <div className="text-sm text-gray-600 mb-4">
                      <Calendar className="w-4 h-4 inline mr-2" />
                      {new Date(event.eventId.date).toLocaleDateString()}
                    </div>
                  )}

                  <div className="text-xs text-gray-500">
                    Registered on {new Date(event.registrationDate).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Profile Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <User className="w-5 h-5" />
            Your Profile
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-600">Email Address</p>
              <p className="text-lg font-medium text-gray-900 mt-1">{profile?.email}</p>
            </div>

            <div>
              <p className="text-sm text-gray-600">Role</p>
              <p className="text-lg font-medium text-gray-900 mt-1">{profile?.role}</p>
            </div>

            <div>
              <p className="text-sm text-gray-600">Department</p>
              <p className="text-lg font-medium text-gray-900 mt-1">{profile?.department || '—'}</p>
            </div>

            <div>
              <p className="text-sm text-gray-600">Full Name</p>
              <p className="text-lg font-medium text-gray-900 mt-1">
                {profile?.firstName || 'Not set'} {profile?.lastName || ''}
              </p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-3">Limited Access</p>
            <p className="text-gray-700 text-sm">
              As a staff member, you have access to view and track your assigned courses and events. 
              Your organization controls what you can access. Contact your organization administrator for more information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
