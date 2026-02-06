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
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Hero Image Section - Full Width */}
            <div className="relative h-[60vh] min-h-[400px] w-full bg-gray-900">
                {course.imageUrl ? (
                    <img
                        src={course.imageUrl}
                        alt={course.title}
                        className="w-full h-full object-cover opacity-60"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-green-800 to-gray-900 opacity-80" />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />

                {/* Hero Content Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
                    <div className="max-w-7xl mx-auto">
                        <button
                            onClick={() => router.push('/courses')}
                            className="mb-6 flex items-center text-white/80 hover:text-white transition-colors text-sm font-medium uppercase tracking-wide"
                        >
                            ← Back to Courses
                        </button>

                        <div className="flex flex-wrap gap-3 mb-6">
                            {course.category && (
                                <span className="px-3 py-1 bg-green-600 text-white rounded-full text-xs font-bold uppercase tracking-wider">
                                    {course.category}
                                </span>
                            )}
                            {course.level && (
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white border border-white/30 ${course.level === 'beginner' ? 'bg-emerald-500/20' :
                                        course.level === 'intermediate' ? 'bg-amber-500/20' :
                                            'bg-purple-500/20'
                                    }`}>
                                    {course.level}
                                </span>
                            )}
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight max-w-4xl">
                            {course.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-6 text-white/90 text-sm md:text-base font-medium">
                            {course.instructor && (
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold">
                                        {course.instructor.charAt(0)}
                                    </div>
                                    <span>{course.instructor}</span>
                                </div>
                            )}
                            {course.duration && (
                                <div className="flex items-center gap-2">
                                    <span className="text-green-400">⏱️</span>
                                    {course.duration} Hours
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Main Content - Blog Style */}
                    <div className="lg:col-span-2 space-y-12">
                        {/* Overview Card */}
                        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                <span className="w-8 h-1 bg-green-500 rounded-full block"></span>
                                Course Overview
                            </h2>
                            <div className="prose prose-lg prose-green max-w-none text-gray-600 leading-relaxed whitespace-pre-line">
                                {course.description || 'No description available for this course.'}
                            </div>
                        </div>

                        {/* Curriculum / Modules (Placeholder) */}
                        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                <span className="w-8 h-1 bg-green-500 rounded-full block"></span>
                                What You Will Learn
                            </h2>
                            <ul className="grid sm:grid-cols-2 gap-4">
                                {[
                                    'Comprehensive understanding of core concepts',
                                    'Practical real-world applications',
                                    'Industry best practices and standards',
                                    'Hands-on projects and case studies',
                                    'Expert guidance and mentorship',
                                    'Certificate upon completion'
                                ].map((item, idx) => (
                                    <li key={idx} className="flex items-start gap-3">
                                        <span className="text-green-500 font-bold text-lg">✓</span>
                                        <span className="text-gray-700">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Sidebar Sticky */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-6">
                            {/* Enrollment Card */}
                            <div className="bg-white rounded-2xl shadow-xl p-8 border-t-8 border-green-500">
                                <div className="text-center mb-8">
                                    <p className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-2">Total Price</p>
                                    <div className="flex items-baseline justify-center gap-1">
                                        <span className="text-5xl font-black text-gray-900">
                                            {course.price ? `$${course.price}` : 'Free'}
                                        </span>
                                    </div>
                                    <p className="text-sm text-green-600 mt-2 font-medium">All-inclusive lifetime access</p>
                                </div>

                                <div className="space-y-4 mb-8">
                                    <div className="flex items-center justify-between text-sm py-2 border-b border-gray-100">
                                        <span className="text-gray-500">Level</span>
                                        <span className="font-bold text-gray-900 text-right capitalize">{course.level || 'All Levels'}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm py-2 border-b border-gray-100">
                                        <span className="text-gray-500">Duration</span>
                                        <span className="font-bold text-gray-900 text-right">{course.duration || 0} Hours</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm py-2 border-b border-gray-100">
                                        <span className="text-gray-500">Enrolled</span>
                                        <span className="font-bold text-gray-900 text-right">{course.enrolledCount || 0} Students</span>
                                    </div>
                                </div>

                                <button
                                    onClick={handleEnroll}
                                    disabled={enrolling}
                                    className="w-full py-4 bg-green-600 text-white rounded-xl font-bold text-lg hover:bg-green-700 transition-all transform hover:scale-[1.02] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                >
                                    {enrolling ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Processing...
                                        </span>
                                    ) : 'Enroll Now'}
                                </button>

                                <div className="mt-6 space-y-3 text-center">
                                    <p className="text-xs text-gray-500 flex items-center justify-center gap-2">
                                        <span className="text-green-500">🔒</span> 30-Day Money-Back Guarantee
                                    </p>
                                    <p className="text-xs text-gray-500 flex items-center justify-center gap-2">
                                        <span className="text-green-500">📱</span> Access on Mobile and TV
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
