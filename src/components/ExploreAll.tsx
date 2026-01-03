'use client';

import Link from 'next/link';
import Image from 'next/image';

export function ExploreAll() {
  const creators = [
    {
      name: '',
      title: 'Personalized Solutions',
      description: 'Custom learning paths for your goals.',
      image: '/38080549_8602372.png',
      bgColor: 'bg-gradient-to-r from-orange-400 to-orange-500',
      buttonColor: 'bg-gray-800 hover:bg-gray-900'
    },
    {
      name: '',
      title: 'Leading UK Institutions',
      description: 'Collaborate with top universities.',
      image: '/blackgirl.png',
      bgColor: 'bg-gradient-to-r from-yellow-400 to-yellow-500',
      buttonColor: 'bg-gray-800 hover:bg-gray-900'
    },
    {
      name: '',
      title: 'Global & Local',
      description: 'International reach, local support.',
      image: '/38080885_8602716.png',
      bgColor: 'bg-gradient-to-r from-[#008200] to-[#00B300]',
      buttonColor: 'bg-gray-800 hover:bg-gray-900'
    },
  ];

  return (
    <section className="relative bg-gradient-to-br from-pink-50 via-purple-50 to-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-6 mb-16 pb-8">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900">
            Benefits of
            <br />
            <span className="text-transparent bg-clip-text font-black" style={{ backgroundImage: 'linear-gradient(to right, #008200, #00B300)' }}>Studying with Us</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Upskill, explore, and connect. We guide you toward success.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {creators.map((creator, idx) => (
            <div
              key={idx}
              className={`${creator.bgColor} rounded-3xl overflow-visible shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105`}
            >
              <div className="flex items-center h-32 p-6">
                {/* Image - Left Side with head poking out */}
                <div className="relative flex-shrink-0 w-40 h-56 -ml-6 -mt-24">
                  <Image
                    src={creator.image}
                    alt={creator.name}
                    fill
                    className="object-cover rounded-2xl"
                    objectPosition="top"
                    priority
                  />
                </div>

                {/* Content - Right Side */}
                <div className="flex-1 ml-4 text-white overflow-hidden flex flex-col justify-center">
                  <h3 className="text-base font-black mb-2 leading-snug break-words">{creator.title}</h3>
                  <p className="text-xs opacity-90 leading-relaxed break-words">{creator.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section Below Cards */}
        <div className="text-center space-y-6 mt-16">
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We are committed to delivering excellence in executive education and professional development. Whether you&apos;re advancing your career, leading a team, or transforming your organization, our tailored solutions empower you to achieve your goals and unlock your full potential.
          </p>
          <Link
            href="/all-pathways"
            className="inline-block px-8 py-3 text-white font-bold rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-105 group"
            style={{ backgroundColor: '#008200' }}
          >
            <span className="inline-flex items-center gap-2">
              Explore
              <span className="inline-block transform group-hover:translate-x-1 transition-transform duration-300">→</span>
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
