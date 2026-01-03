'use client';

import Link from 'next/link';
import Image from 'next/image';

export function ExploreCategories() {
  const categories = [
    { icon: '📊', label: 'Data Science' },
    { icon: '💡', label: 'Insight' },
    { icon: '🎨', label: 'Creative' },
    { icon: '✍️', label: 'Content Writing' },
    { icon: '📷', label: 'Photography' },
    { icon: '🎬', label: 'Video Editing' },
    { icon: '🖌️', label: 'UI & Design' },
    { icon: '💼', label: 'Management' },
    { icon: '👔', label: 'Business' },
    { icon: '💻', label: 'Programming' },
    { icon: '🌐', label: 'Web Development' },
    { icon: '📱', label: 'Mobile Dev' },
  ];

  const instructors = [
    { 
      name: 'Sarah Johnson', 
      role: 'UI Designer',
      image: '/38080549_8602372.png'
    },
    { 
      name: 'Mike Chen', 
      role: 'Full Stack Developer',
      image: '/38080666_8596492.png'
    },
    { 
      name: 'Alex Rivera', 
      role: 'Product Manager',
      image: '/38080885_8602716.png'
    },
  ];

  return (
    <section className="relative bg-gradient-to-b from-teal-100 via-blue-50 to-slate-900 pt-40 pb-32">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
      <div className="absolute bottom-32 left-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Instructor Cards - Overlapping Hero */}
        <div className="grid md:grid-cols-3 gap-0 -mt-56 mb-32 relative z-10">
          {instructors.map((instructor, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center group"
            >
              <div className="relative w-64 h-80 rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-300 transform group-hover:scale-105 bg-white border-4 border-white">
                <Image
                  src={instructor.image}
                  alt={instructor.name}
                  fill
                  className="object-cover w-full h-full rounded-3xl"
                  priority
                />
              </div>
              <div className="mt-6 text-center">
                <h3 className="font-bold text-gray-900 text-lg">{instructor.name}</h3>
                <p className="text-sm text-gray-600">{instructor.role}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Categories Section */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-12 text-white shadow-2xl border border-slate-700">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Left Content */}
            <div>
              <h2 className="text-4xl font-bold mb-4">
                Explore Our <span className="text-teal-400">Categories</span>
              </h2>
              <p className="text-gray-300 mb-8 leading-relaxed">
                Discover a wide range of learning categories designed to help you develop skills in your area of interest. From creative design to cutting-edge technology, we have something for everyone.
              </p>
              <Link
                href="/courses"
                className="inline-block px-8 py-3 bg-teal-600 text-white font-bold rounded-lg hover:bg-teal-700 transition-colors"
              >
                Explore Categories
              </Link>
            </div>

            {/* Right Grid */}
            <div className="grid grid-cols-3 gap-4">
              {categories.map((category, idx) => (
                <div
                  key={idx}
                  className="bg-slate-700 hover:bg-slate-600 rounded-2xl p-6 flex flex-col items-center justify-center text-center transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-xl"
                >
                  <div className="text-4xl mb-3">{category.icon}</div>
                  <p className="text-sm font-medium text-gray-100">{category.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
