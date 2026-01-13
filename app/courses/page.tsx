
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { AlertCircle, CheckCircle, Loader } from 'lucide-react';

interface Course {
  _id: string;
  title: string;
  description?: string;
  category?: string;
  level?: 'beginner' | 'intermediate' | 'advanced';
  duration?: number;
  price?: number;
  imageUrl?: string;
  instructor?: string;
  enrolledCount?: number;
  status: 'draft' | 'published' | 'active' | 'archived';
  createdAt?: string;
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    referralCode: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [enrollmentError, setEnrollmentError] = useState<string | null>(null);

  // Fetch full user profile from /api/users/me and prefill form fields
  useEffect(() => {
    async function fetchUserProfile() {
      if (session?.user) {
        try {
          const res = await fetch('/api/users/me');
          if (res.ok) {
            const data = await res.json();
            if (data.success && data.user) {
              setForm(f => ({
                ...f,
                firstName: data.user.firstName || f.firstName || '',
                lastName: data.user.lastName || f.lastName || '',
                email: data.user.email || f.email || '',
                phone: data.user.phone || f.phone || '',
                location: data.user.location || f.location || '',
              }));
            }
          }
        } catch {
          // fallback: do not set fields from session.user, only keep existing form values
          setForm(f => ({ ...f }));
        }
      }
    }
    fetchUserProfile();
  }, [session]);

  function isUserLoggedIn(sessionData: unknown, status: string) {
    return status === 'authenticated' && sessionData && typeof sessionData === 'object' && 'user' in sessionData;
  }

  const handleEnrollClick = (course: Course) => {
    if (status === 'loading') return;
    if (!isUserLoggedIn(session, status)) {
      window.location.href = '/auth/signin';
      return;
    }
    setSelectedCourse(course);
    setShowModal(true);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setEnrollmentError(null);
    
    try {
      // Validate all required fields
      if (!form.firstName.trim() || !form.lastName.trim() || !form.email.trim() || !form.phone.trim() || !form.location.trim()) {
        setEnrollmentError('Please fill in all required fields');
        setSubmitting(false);
        return;
      }

      // Call API to enroll user in course
      const res = await fetch('/api/enroll-course', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId: selectedCourse?._id,
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
          location: form.location,
          referralCode: form.referralCode || null
        })
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to enroll. Please try again.');
      }

      setSuccess(true);
      
      // Show success message for 2 seconds, then redirect
      setTimeout(() => {
        setShowModal(false);
        setSuccess(false);
        // Redirect based on user role
        const userRole = session?.user?.role?.toUpperCase();
        if (userRole === 'INDIVIDUAL') {
          router.push('/individual/enrollments');
        } else if (userRole === 'CORPORATE') {
          router.push('/corporate/courses');
        } else if (userRole === 'STAFF') {
          router.push('/staff/courses');
        } else {
          router.push('/dashboard');
        }
      }, 2000);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Enrollment failed. Please try again.';
      setEnrollmentError(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/courses');
        if (!response.ok) {
          throw new Error('Failed to fetch courses');
        }
        const data = await response.json();
        console.log('Fetched courses:', data);
        if (data.success) {
          // Filter only published and active courses for users
          const publicCourses = (data.courses || []).filter(
            (c: Course) => c.status === 'published' || c.status === 'active'
          );
          setCourses(publicCourses);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching courses:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getLevelColor = (level?: string) => {
    switch (level) {
      case 'beginner':
      case 'intermediate':
      case 'advanced':
      default:
        return {
          backgroundColor: 'rgba(0, 130, 0, 0.1)',
          color: '#008200'
        };
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Header Section */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center space-y-6 mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                Explore Our <span style={{ color: '#008200' }}>Courses</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Learn from industry experts and advance your skills with our comprehensive course catalog.
              </p>
            </div>

            {/* Search Bar */}
            <div className="max-w-md mx-auto">
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                style={{ borderColor: '#008200' }}
              />
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">Loading courses...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-12">
              <p className="text-red-600 text-lg">Error loading courses: {error}</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && filteredCourses.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">
                {searchTerm ? 'No courses match your search.' : 'No courses available at the moment.'}
              </p>
            </div>
          )}

          {/* Courses Grid */}
          {!loading && !error && filteredCourses.length > 0 && (
            <div className="columns-1 md:columns-2 lg:columns-3 gap-6">
              {filteredCourses.map((course) => (
                <div
                  key={course._id}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden break-inside-avoid mb-6"
                >
                  {/* Image */}
                  {course.imageUrl && (
                    <div className="relative w-full aspect-video overflow-hidden bg-gray-200">
                      <Image
                        src={course.imageUrl}
                        alt={course.title}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
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
                        <span
                          className="inline-flex text-xs font-semibold px-3 py-1 rounded-full"
                          style={getLevelColor(course.level)}
                        >
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
                      {course.price ? (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Price:</span>
                          <span className="font-semibold text-gray-900">${course.price}</span>
                        </div>
                      ) : (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Price:</span>
                          <span className="font-semibold" style={{ color: '#008200' }}>Free</span>
                        </div>
                      )}
                    </div>

                    {/* Button */}
                    <button
                      className="block w-full mt-4 px-4 py-3 text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-bold text-center"
                      style={{ backgroundColor: '#008200' }}
                      onClick={() => handleEnrollClick(course)}
                    >
                      Enroll Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Results Counter */}
          {!loading && !error && filteredCourses.length > 0 && (
            <div className="mt-12 text-center text-gray-600">
              <p className="text-sm">
                Showing <span className="font-bold text-gray-900">{filteredCourses.length}</span> of{' '}
                <span className="font-bold text-gray-900">{courses.length}</span> courses
              </p>
            </div>
          )}
        </div>
      </div>
      {/* Enrollment Modal */}
      {showModal && selectedCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-8 relative max-h-96 overflow-y-auto">
            {/* Close Button */}
            <button 
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              onClick={() => {
                setShowModal(false);
                setEnrollmentError(null);
              }}
            >
              <span className="text-2xl">&times;</span>
            </button>

            {/* Success State */}
            {success ? (
              <div className="text-center py-8">
                <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Enrollment Successful!</h3>
                <p className="text-gray-600">You have been enrolled in {selectedCourse.title}. Redirecting to your learning page...</p>
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Enroll in {selectedCourse.title}</h2>
                  <p className="text-sm text-gray-600 mt-1">Please provide your details to complete enrollment</p>
                </div>

                {/* Error Alert */}
                {enrollmentError && (
                  <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                    <div className="text-sm text-red-700">{enrollmentError}</div>
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <input 
                      name="firstName" 
                      value={form.firstName} 
                      onChange={handleFormChange} 
                      required 
                      placeholder="First Name" 
                      className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      autoComplete="given-name"
                      disabled={submitting}
                    />
                    <input 
                      name="lastName" 
                      value={form.lastName} 
                      onChange={handleFormChange} 
                      required 
                      placeholder="Last Name" 
                      className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      autoComplete="family-name"
                      disabled={submitting}
                    />
                  </div>

                  <input 
                    name="email" 
                    value={form.email} 
                    onChange={handleFormChange} 
                    required 
                    placeholder="Email Address" 
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    type="email"
                    autoComplete="email"
                    disabled={submitting}
                  />

                  <input 
                    name="phone" 
                    value={form.phone} 
                    onChange={handleFormChange} 
                    required 
                    placeholder="Phone Number" 
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    autoComplete="tel"
                    disabled={submitting}
                  />

                  <input 
                    name="location" 
                    value={form.location} 
                    onChange={handleFormChange} 
                    required 
                    placeholder="Address / Location" 
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    disabled={submitting}
                  />

                  <input 
                    name="referralCode" 
                    value={form.referralCode} 
                    onChange={handleFormChange} 
                    placeholder="Referral Code (optional)" 
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    disabled={submitting}
                  />

                  {/* Submit Button */}
                  <button 
                    type="submit" 
                    disabled={submitting}
                    className="w-full bg-green-600 text-white py-3 rounded-lg font-bold mt-6 hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        Enrolling...
                      </>
                    ) : (
                      'Confirm Enrollment'
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
