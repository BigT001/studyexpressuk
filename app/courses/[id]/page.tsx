'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

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

export default function CourseDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { data: session, status } = useSession();
    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [enrolling, setEnrolling] = useState(false);

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const response = await fetch(`/api/courses/${params.id}`);
                const data = await response.json();

                if (data.success) {
                    setCourse(data.course);
                } else {
                    setError(data.error || 'Failed to load course');
                }
            } catch (err) {
                setError('Failed to load course');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchCourse();
        }
    }, [params.id]);

    const handleEnroll = async () => {
        if (status !== 'authenticated') {
            router.push('/auth/signin');
            return;
        }

        if (!course) return;

        setEnrolling(true);
        try {
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    itemId: course._id,
                    itemType: 'course',
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to initiate checkout');
            }

            // Handle free enrollment
            if (data.free) {
                alert(data.message || 'Successfully enrolled!');
                router.push('/individual/enrollments');
                return;
            }

            if (data.url) {
                window.location.href = data.url;
            } else {
                throw new Error('No checkout URL received');
            }
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Enrollment failed');
        } finally {
            setEnrolling(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading course details...</p>
                </div>
            </div>
        );
    }

    if (error || !course) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Course Not Found</h1>
                    <p className="text-gray-600 mb-4">{error || 'This course does not exist'}</p>
                    <button
                        onClick={() => router.push('/courses')}
                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                        Back to Courses
                    </button>
                </div>
            </div>
        );
    }

    const getLevelColor = (level?: string) => {
        switch (level) {
            case 'beginner': return 'bg-emerald-100 text-emerald-800';
            case 'intermediate': return 'bg-amber-100 text-amber-800';
            case 'advanced': return 'bg-purple-100 text-purple-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <button
                        onClick={() => router.push('/courses')}
                        className="mb-6 flex items-center text-white hover:text-green-100 transition-colors"
                    >
                        ← Back to Courses
                    </button>
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        <div>
                            <div className="flex gap-2 mb-4">
                                {course.category && (
                                    <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-semibold">
                                        {course.category}
                                    </span>
                                )}
                                {course.level && (
                                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getLevelColor(course.level)}`}>
                                        {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                                    </span>
                                )}
                            </div>
                            <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
                            {course.instructor && (
                                <p className="text-lg text-green-100">Instructor: {course.instructor}</p>
                            )}
                        </div>
                        <div className="relative h-64 rounded-lg overflow-hidden shadow-xl">
                            {course.imageUrl ? (
                                <img
                                    src={course.imageUrl}
                                    alt={course.title}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                                    <span className="text-6xl">📚</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid md:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="md:col-span-2 space-y-8">
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Course</h2>
                            <p className="text-gray-700 leading-relaxed">
                                {course.description || 'No description available for this course.'}
                            </p>
                        </div>

                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Course Details</h2>
                            <div className="grid sm:grid-cols-2 gap-4">
                                {course.duration && (
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">⏱️</span>
                                        <div>
                                            <p className="text-sm text-gray-500">Duration</p>
                                            <p className="font-semibold text-gray-900">{course.duration} hours</p>
                                        </div>
                                    </div>
                                )}
                                {course.level && (
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">📊</span>
                                        <div>
                                            <p className="text-sm text-gray-500">Level</p>
                                            <p className="font-semibold text-gray-900">
                                                {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                                            </p>
                                        </div>
                                    </div>
                                )}
                                {course.enrolledCount !== undefined && (
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">👥</span>
                                        <div>
                                            <p className="text-sm text-gray-500">Students Enrolled</p>
                                            <p className="font-semibold text-gray-900">{course.enrolledCount}</p>
                                        </div>
                                    </div>
                                )}
                                {course.category && (
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">📁</span>
                                        <div>
                                            <p className="text-sm text-gray-500">Category</p>
                                            <p className="font-semibold text-gray-900">{course.category}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="md:col-span-1">
                        <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
                            <div className="text-center mb-6">
                                <p className="text-sm text-gray-500 mb-2">Price</p>
                                <p className="text-4xl font-bold text-green-600">
                                    {course.price ? `$${course.price}` : 'Free'}
                                </p>
                            </div>
                            <button
                                onClick={handleEnroll}
                                disabled={enrolling}
                                className="w-full py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {enrolling ? 'Processing...' : 'Enroll Now'}
                            </button>
                            <p className="text-xs text-gray-500 text-center mt-4">
                                30-day money-back guarantee
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
