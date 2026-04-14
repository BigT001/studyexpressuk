
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Clock, 
  User, 
  Tag, 
  ChevronRight, 
  Star,
  BookOpen,
  Filter,
  CheckCircle2
} from 'lucide-react';
import { LoginPrompt } from '@/components/LoginPrompt';
import { EnrollmentConfirmation } from '@/components/EnrollmentConfirmation';

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
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const { status } = useSession();
  const router = useRouter();

  // Login prompt state
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [enrollmentError, setEnrollmentError] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isEnrolling, setIsEnrolling] = useState(false);

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
          const publicCourses = (data.courses || []).filter(
            (c: Course) => c.status === 'published' || c.status === 'active'
          );
          setCourses(publicCourses);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const categories = ['All', ...Array.from(new Set(courses.map(c => c.category || 'General')))];

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Group courses by category for display
  const groupedCourses = filteredCourses.reduce((acc, course) => {
    const cat = course.category || 'General';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(course);
    return acc;
  }, {} as Record<string, Course[]>);

  const getLevelBadge = (level?: string) => {
    const styles = {
      beginner: 'bg-emerald-50 text-emerald-700 border-emerald-100',
      intermediate: 'bg-blue-50 text-blue-700 border-blue-100',
      advanced: 'bg-purple-50 text-purple-700 border-purple-100',
      default: 'bg-gray-50 text-gray-700 border-gray-100'
    };
    const style = styles[level as keyof typeof styles] || styles.default;
    return (
      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${style}`}>
        {level?.charAt(0).toUpperCase()}{level?.slice(1)}
      </span>
    );
  };

  const handleEnrollClick = async (course: Course) => {
    if (status === 'loading') return;
    setSelectedCourse(course);
    setEnrollmentError(null);
    if (status !== 'authenticated') {
      setShowLoginPrompt(true);
      return;
    }
    setShowConfirmation(true);
  };

  const handleConfirmEnrollment = async () => {
    if (!selectedCourse) return;
    setIsEnrolling(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId: selectedCourse._id, itemType: 'course' }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to initiate checkout');

      if (data.free) {
        setShowConfirmation(false);
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-emerald-600 text-white px-6 py-3 rounded-lg shadow-xl z-50 flex items-center gap-2 transform transition-all duration-300';
        notification.innerHTML = `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg><span>${data.message || 'Successfully enrolled!'}</span>`;
        document.body.appendChild(notification);
        setTimeout(() => {
          notification.remove();
          window.location.href = '/individual/enrollments';
        }, 2000);
        return;
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (err) {
      setEnrollmentError(err instanceof Error ? err.message : 'Enrollment failed.');
      setShowConfirmation(false);
    } finally {
      setIsEnrolling(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white pt-24 pb-16 border-b border-gray-100">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-emerald-50 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-blue-50 rounded-full blur-3xl opacity-50" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-wider">
              <Star className="w-3 h-3 fill-emerald-700" />
              <span>Premium Learning Experience</span>
            </div>
            
            <div className="space-y-4 px-4">
              <h1 className="text-4xl md:text-7xl font-extrabold text-gray-900 tracking-tight leading-[1.1]">
                Advance Your <span className="text-emerald-600">Career</span>
              </h1>
              <p className="text-base md:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
                Unlock your potential with our world-class executive and professional courses designed for the modern global landscape.
              </p>
            </div>

            {/* Search & Filter Bar */}
            <div className="max-w-4xl mx-auto mt-12 bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-3 md:p-2 flex flex-col md:flex-row items-center gap-4 border border-gray-100 mx-4">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="What would you like to learn today?"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 md:py-4 text-gray-900 placeholder-gray-400 rounded-xl focus:outline-none text-base md:text-lg"
                />
              </div>
              <div className="flex items-center gap-2 p-1 bg-gray-50 rounded-xl w-full md:w-auto overflow-x-auto no-scrollbar scroll-smooth">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`whitespace-nowrap px-4 md:px-6 py-2.5 md:py-3 rounded-lg text-xs md:text-sm font-semibold transition-all duration-200 ${
                      selectedCategory === cat
                        ? 'bg-white text-emerald-600 shadow-sm ring-1 ring-gray-200/50'
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin" />
            <p className="text-gray-500 font-medium animate-pulse">Curating your experience...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20 bg-red-50 rounded-3xl border border-red-100 max-w-2xl mx-auto">
            <p className="text-red-600 text-lg font-semibold">{error}</p>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="text-center py-32 space-y-4">
            <div className="inline-flex p-6 rounded-full bg-gray-100 text-gray-400">
              <Search className="w-12 h-12" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">No courses found</h3>
            <p className="text-gray-500">Try adjusting your filters or search terms.</p>
          </div>
        ) : (
          <div className="space-y-24">
            {Object.entries(groupedCourses)
              .sort(([catA], [catB]) => {
                if (catA === 'Short Executive Courses') return -1;
                if (catB === 'Short Executive Courses') return 1;
                return catA.localeCompare(catB);
              })
              .map(([category, catCourses]) => (
              <div key={category} className="space-y-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-200">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">{category}</h2>
                  </div>
                  <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">{catCourses.length} Courses</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  <AnimatePresence mode='popLayout'>
                    {catCourses.map((course, idx) => (
                      <motion.div
                        key={course._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="group relative bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-emerald-100/50 transition-all duration-500 flex flex-col"
                      >
                        {/* Course Image */}
                        <div className="relative h-48 overflow-hidden">
                          {course.imageUrl ? (
                            <Image
                              src={course.imageUrl}
                              alt={course.title}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                          ) : (
                            <div className="w-full h-full bg-emerald-50 flex items-center justify-center">
                              <BookOpen className="w-12 h-12 text-emerald-200" />
                            </div>
                          )}
                          <div className="absolute top-6 left-6 flex flex-col gap-2">
                            <div className="bg-white/90 backdrop-blur-sm border border-white/20 px-3 py-1.5 rounded-xl text-xs font-bold text-gray-900 shadow-sm flex items-center gap-1.5">
                              <Tag className="w-3 h-3 text-emerald-600" />
                              <span>{course.category}</span>
                            </div>
                          </div>
                          
                          <div className="absolute bottom-6 right-6">
                            <div className="bg-emerald-600 text-white px-5 py-2.5 rounded-2xl text-lg font-black shadow-xl shadow-emerald-200/50">
                              {course.price ? `£${course.price}` : 'Free'}
                            </div>
                          </div>
                        </div>

                        {/* Course Body */}
                        <div className="p-5 flex-1 flex flex-col space-y-3">
                          <div className="space-y-2">
                            <h3 className="text-lg font-extrabold text-gray-900 leading-tight group-hover:text-emerald-600 transition-colors">
                              {course.title}
                            </h3>
                            <p className="text-gray-400 text-xs leading-relaxed line-clamp-2">
                              {course.description}
                            </p>
                          </div>


                          <div className="flex flex-col gap-2 mt-auto">
                            <button
                              onClick={() => handleEnrollClick(course)}
                              className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold shadow-lg shadow-gray-200 hover:bg-emerald-600 transition-all duration-300 transform active:scale-[0.98] flex items-center justify-center gap-2 group/btn text-sm"
                            >
                              <span>Enroll Now</span>
                              <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                            </button>
                            {/* Course Details Hidden for now */}
                            {false && (
                              <button
                                onClick={() => router.push(`/courses/${course._id}`)}
                                className="w-full py-4 text-gray-600 font-bold hover:text-emerald-600 transition-colors bg-white border border-transparent hover:border-emerald-100 rounded-[1.25rem]"
                              >
                                Course Details
                              </button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Login Prompt Modal */}
      <LoginPrompt
        isOpen={showLoginPrompt}
        courseName={selectedCourse?.title || 'this course'}
        onLogin={() => {
          setShowLoginPrompt(false);
          window.location.href = '/auth/signin';
        }}
        onClose={() => setShowLoginPrompt(false)}
      />

      {/* Enrollment Confirmation Modal */}
      <EnrollmentConfirmation
        isOpen={showConfirmation}
        courseName={selectedCourse?.title || 'this course'}
        onConfirm={handleConfirmEnrollment}
        onCancel={() => setShowConfirmation(false)}
        isLoading={isEnrolling}
      />

      {/* Error Toast */}
      <AnimatePresence>
        {enrollmentError && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed bottom-8 right-8 bg-red-600 text-white p-6 rounded-2xl shadow-2xl max-w-sm z-50 flex flex-col gap-2"
          >
            <div className="flex items-start justify-between">
              <span className="font-bold text-lg">Error</span>
              <button onClick={() => setEnrollmentError(null)} className="opacity-60 hover:opacity-100">×</button>
            </div>
            <p className="text-sm opacity-90">{enrollmentError}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
