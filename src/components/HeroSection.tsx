'use client';

import Link from 'next/link';
import Image from 'next/image';

export function HeroSection() {
  return (
    <section className="min-h-[600px] relative overflow-hidden" style={{ background: 'linear-gradient(to bottom right, rgba(0, 130, 0, 0.05), white, rgba(14, 51, 134, 0.05))' }}>
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-20" style={{ backgroundColor: '#008200' }}></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      <div className="absolute top-1/2 left-1/2 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-10" style={{ backgroundColor: '#008200' }}></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center min-h-[600px] py-20">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-black leading-tight text-gray-900">
                Learn, Connect, and <span style={{ color: '#008200' }}>Transform</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Learn practical skills from experienced professionals. Connect with peers and industry experts in a supportive community. Grow your career through quality courses, meaningful relationships, and respected certifications.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/courses"
                className="px-8 py-4 text-white rounded-lg hover:opacity-90 font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl text-center"
                style={{ backgroundColor: '#008200' }}
              >
                Start Learning Today
              </Link>
              <Link
                href="/events"
                className="px-8 py-4 border-2 rounded-lg font-bold text-lg transition-all duration-200 text-center"
                style={{ borderColor: '#008200', color: '#008200', backgroundColor: 'rgba(0, 130, 0, 0.05)' }}
              >
                Explore Events
              </Link>
            </div>

            {/* Stats */}
            <div className="flex gap-8 pt-4">
              <div>
                <div className="text-3xl font-black" style={{ color: '#008200' }}>500+</div>
                <p className="text-gray-600 text-sm">Expert-Curated Courses</p>
              </div>
              <div>
                <div className="text-3xl font-black" style={{ color: '#008200' }}>50K+</div>
                <p className="text-gray-600 text-sm">Global Learners</p>
              </div>
              <div>
                <div className="text-3xl font-black" style={{ color: '#008200' }}>95%</div>
                <p className="text-gray-600 text-sm">Completion Rate</p>
              </div>
            </div>
          </div>

          {/* Right Visual */}
          <div className="hidden md:flex justify-center items-center relative">
            {/* Background Image */}
            <div className="absolute inset-0 flex items-center justify-start -z-10 pl-8 -mt-48">
              <Image
                src="/blackgirl2.png"
                alt="Hero background"
                width={350}
                height={500}
                className="object-contain"
              />
            </div>

            <div className="relative w-full h-96">
              {/* Card 1 */}
              <div className="absolute -top-16 right-0 w-64 bg-white rounded-2xl shadow-2xl p-6 transform hover:scale-105 transition-transform duration-300">
                <div className="text-4xl mb-4">🎓</div>
                <h3 className="font-bold text-gray-900 mb-2">Executive Programs</h3>
                <p className="text-sm text-gray-600">Expert-led training and immersive experiences</p>
              </div>

              {/* Card 2 */}
              <div className="absolute -bottom-16 left-0 w-64 bg-white rounded-2xl shadow-2xl p-6 transform hover:scale-105 transition-transform duration-300 delay-100">
                <div className="text-4xl mb-4">📚</div>
                <h3 className="font-bold text-gray-900 mb-2">UK Certifications</h3>
                <p className="text-sm text-gray-600">Accredited qualifications, flexible learning</p>
              </div>

              {/* Card 3 */}
              <div className="absolute -bottom-6 right-1/5 w-64 bg-white rounded-2xl shadow-2xl p-6 transform hover:scale-105 transition-transform duration-300 delay-200">
                <div className="text-4xl mb-4">🎫</div>
                <h3 className="font-bold text-gray-900 mb-2">UK Events Support</h3>
                <p className="text-sm text-gray-600">Visas, accommodations, and networking</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}
