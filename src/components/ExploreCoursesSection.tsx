'use client';

import { useState } from 'react';
import Image from 'next/image';

export function ExploreCoursesSection() {
  const [activeTab, setActiveTab] = useState('Featured');

  const courses = [
    {
      id: 1,
      title: 'Advanced Leadership in Global Organizations',
      description: 'Master the skills needed to lead teams across diverse cultures and markets.',
      instructor: 'Dr. Sarah Mitchell',
      duration: '8 weeks',
      type: 'course',
      badge: 'Staff Pick',
      image: '/38080549_8602372.png',
    },
    {
      id: 2,
      title: 'Professional Communication Mastery',
      description: 'Enhance your communication skills for greater impact and influence.',
      instructor: 'James Thompson',
      duration: '6 weeks',
      type: 'course',
      badge: 'Original',
      image: '/38080666_8596492.png',
    },
    {
      id: 3,
      title: 'Digital Transformation Strategy',
      description: 'Learn how to navigate digital transformation in modern businesses.',
      instructor: 'Emma Johnson',
      duration: '10 weeks',
      type: 'course',
      badge: 'Staff Pick',
      image: '/38080885_8602716.png',
    },
    {
      id: 4,
      title: 'Financial Planning for Professionals',
      description: 'Develop expertise in financial planning and investment strategies.',
      instructor: 'Michael Brown',
      duration: '12 weeks',
      type: 'course',
      badge: 'Original',
      image: '/blackgirl.png',
    },
    {
      id: 5,
      title: 'UK Business Expo 2026',
      description: 'Network with industry leaders and explore the latest business innovations.',
      location: 'London, UK',
      date: 'March 15-17, 2026',
      type: 'event',
      badge: 'Featured Event',
      image: '/blackgirl2.png',
    },
    {
      id: 6,
      title: 'Professional Development Summit',
      description: 'Join us for a comprehensive summit on career growth and development.',
      location: 'Manchester, UK',
      date: 'April 10-12, 2026',
      type: 'event',
      badge: 'Featured Event',
      image: '/38080549_8602372.png',
    },
    {
      id: 7,
      title: 'Executive Presence & Impact',
      description: 'Build executive presence and create lasting impact in your organization.',
      instructor: 'Lisa Anderson',
      duration: '7 weeks',
      type: 'course',
      badge: 'Staff Pick',
      image: '/38080666_8596492.png',
    },
    {
      id: 8,
      title: 'Navigating UK Business Culture',
      description: 'Understand the nuances of UK business culture and practices.',
      instructor: 'Robert Wells',
      duration: '5 weeks',
      type: 'course',
      badge: 'Original',
      image: '/38080885_8602716.png',
    },
  ];

  const categories = ['Featured', 'Courses', 'Events'];

  const filteredCards = activeTab === 'Featured' 
    ? courses 
    : activeTab === 'Courses'
    ? courses.filter(item => item.type === 'course')
    : courses.filter(item => item.type === 'event');

  return (
    <section className="py-24 relative overflow-hidden" style={{ background: 'linear-gradient(to bottom right, rgba(0, 130, 0, 0.05), white, rgba(14, 51, 134, 0.05))' }}>
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-10" style={{ backgroundColor: '#008200' }}></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="mb-16 text-center">
          <div className="mb-6">
            <h2 className="text-4xl md:text-4xl font-black mb-4 text-gray-900">
              Explore <span style={{ color: '#008200' }}>Courses</span> And Recent Events
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our curated selection of professional development courses and upcoming industry events.
            </p>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-4 mt-10 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveTab(category)}
                className={`px-8 py-3 rounded-lg font-bold text-sm transition-all duration-300 relative overflow-hidden group ${
                  activeTab === category
                    ? 'text-white shadow-lg hover:shadow-xl hover:scale-105'
                    : 'border-2 hover:scale-105'
                }`}
                style={activeTab === category ? { backgroundColor: '#008200' } : { borderColor: '#008200', color: '#008200', backgroundColor: 'rgba(0, 130, 0, 0.05)' }}
              >
                {activeTab !== category && (
                  <span className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300" style={{ backgroundColor: '#008200' }}></span>
                )}
                <span className="relative z-10 flex items-center gap-2">
                  {category === 'Featured' && '⭐'}
                  {category === 'Courses' && '📚'}
                  {category === 'Events' && '🎯'}
                  {category}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Courses & Events Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredCards.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
              {/* Image Container */}
              <div className="relative w-full h-48 overflow-hidden" style={{ background: 'linear-gradient(to bottom right, #008200, #00B300)' }}>
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {item.description}
                </p>

                {/* Meta Info */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-500">
                    {item.type === 'course' ? item.duration : item.date}
                  </span>
                  {item.type === 'course' && (
                    <span className="text-xs text-gray-500">
                      by {item.instructor}
                    </span>
                  )}
                  {item.type === 'event' && (
                    <span className="text-xs text-gray-500">
                      📍 {item.location}
                    </span>
                  )}
                </div>

                {/* Button */}
                <button className="w-full px-4 py-2 text-white rounded hover:opacity-90 transition-colors text-sm font-bold" style={{ backgroundColor: '#008200' }}>
                  {item.type === 'course' ? 'Enroll Now' : 'Register Now'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
