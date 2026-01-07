'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

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
                  <Link
                    href={`/auth/signin`}
                    className="block w-full mt-4 px-4 py-3 text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-bold text-center"
                    style={{ backgroundColor: '#008200' }}
                  >
                    Enroll Now
                  </Link>
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
  );
}
