
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Clock, 
  User, 
  BookOpen, 
  ArrowUpRight 
} from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

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
  imageUrl?: string;
}

const LEVEL_CONFIG = {
  beginner: { label: 'Beginner', color: 'emerald' },
  intermediate: { label: 'Intermediate', color: 'blue' },
  advanced: { label: 'Advanced', color: 'purple' },
};

export function ExploreCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch('/api/courses');
        const data = await res.json();
        if (data.success) {
          const publicCourses = (data.courses || []).filter(
            (c: Course) => c.status === 'published' || c.status === 'active'
          );
          setCourses(publicCourses.slice(0, 3));
        }
      } catch (err) {
        console.error('Failed to load courses', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  return (
    <section className="py-32 relative bg-white overflow-hidden">
      {/* Abstract Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-50 rounded-full blur-[120px] opacity-40 -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-50 rounded-full blur-[100px] opacity-30 translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="max-w-2xl space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs font-bold uppercase tracking-wider"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Professional Excellence</span>
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight"
            >
              Master Your Field with <span className="text-emerald-600 italic">Expert-Led</span> Courses
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-lg text-gray-500 leading-relaxed"
            >
              Join thousands of professionals advancing their careers through our industry-recognised certifications and executive training.
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <Link 
              href="/courses" 
              className="group flex items-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-2xl font-bold transition-all hover:bg-emerald-600 hover:shadow-xl hover:shadow-emerald-200"
            >
              View Full Catalog
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-gray-50 rounded-[2.5rem] h-[500px] animate-pulse" />
            ))
          ) : (
            courses.map((course, idx) => (
              <motion.div
                key={course._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group relative bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-emerald-100/50 transition-all duration-500 flex flex-col h-full"
              >
                {/* Image Container */}
                <div className="relative h-44 overflow-hidden">
                  {course.imageUrl ? (
                    <Image
                      src={course.imageUrl}
                      alt={course.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full bg-emerald-50 flex items-center justify-center">
                      <BookOpen className="w-12 h-12 text-emerald-100" />
                    </div>
                  )}
                  <div className="absolute top-6 left-6">
                    <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm border border-white/20 text-[10px] font-black uppercase tracking-widest text-emerald-600 shadow-sm">
                      {course.category}
                    </span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                    <div className="text-white">
                      <span className="text-2xl font-black">{course.price ? `£${course.price}` : 'Free'}</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-base font-extrabold text-gray-900 mb-3 line-clamp-2 leading-tight group-hover:text-emerald-600 transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-gray-400 text-xs leading-relaxed line-clamp-2 mb-4">
                    {course.description}
                  </p>


                  <Link 
                    href="/courses"
                    className="mt-4 relative group/link inline-flex items-center justify-center w-full py-3 bg-gray-900 text-white rounded-xl font-bold overflow-hidden transition-all hover:bg-emerald-600 text-sm"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      Enroll Now
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </Link>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
