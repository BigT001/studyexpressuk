'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import PublicCourseCard from '@/components/PublicCourseCard';

interface Course {
  _id: string;
  title: string;
  description?: string;
  category?: string;
  level?: 'beginner' | 'intermediate' | 'advanced';
  status: 'draft' | 'published' | 'active' | 'archived';
  duration?: number;
  price?: number;
  instructor?: string;
  enrolledCount?: number;
  imageUrl?: string;
}

export function ExploreCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/courses');
        if (!response.ok) {
          throw new Error('Failed to fetch courses');
        }
        const data = await response.json();
        if (data.success) {
          // Filter only published and active courses
          const activeCourses = (data.courses || []).filter(
            (c: Course) => c.status === 'published' || c.status === 'active'
          );
          setCourses(activeCourses);
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

  // Limit to 6 courses for home page
  const displayedCourses = courses.slice(0, 6);
  const hasMoreCourses = courses.length > 6;

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 text-center">
          <h2 className="text-4xl md:text-4xl font-black mb-4 text-gray-900">
            Explore <span style={{ color: '#008200' }}>Popular Courses</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our most sought-after courses designed by industry experts.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading courses...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-600">Error loading courses: {error}</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && displayedCourses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No courses available at the moment.</p>
          </div>
        )}

        {/* Courses Grid */}
        {!loading && !error && displayedCourses.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedCourses.map((course) => (
                <PublicCourseCard
                  key={course._id}
                  _id={course._id}
                  title={course.title}
                  description={course.description}
                  category={course.category}
                  level={course.level}
                  duration={course.duration}
                  price={course.price}
                  instructor={course.instructor}
                  imageUrl={course.imageUrl}
                />
              ))}
            </div>

            {/* View All Button */}
            {hasMoreCourses && (
              <div className="text-center mt-16">
                <Link
                  href="/courses"
                  className="inline-block px-8 py-4 text-white rounded-lg hover:opacity-90 font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                  style={{ backgroundColor: '#008200' }}
                >
                  View All {courses.length} Courses
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
