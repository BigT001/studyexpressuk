'use client';

import Link from 'next/link';

export function CorporateComponent() {
  const features = [
    {
      title: 'Personalized Learning Paths',
      description: 'AI-powered curriculum tailored to individual learning styles and organizational goals',
      icon: '🎯',
      stat: 'Up to 40% faster completion'
    },
    {
      title: 'Advanced Analytics Dashboard',
      description: 'Real-time insights into learner engagement, skill acquisition, and business impact',
      icon: '📊',
      stat: '100+ custom metrics'
    },
    {
      title: 'Dedicated Account Manager',
      description: 'Strategic partnership with a senior advisor committed to your program\'s success',
      icon: '👥',
      stat: '24/7 priority support'
    },
    {
      title: 'Industry-Recognized Credentials',
      description: 'Certificates valued by employers across 50+ industries and 150+ countries',
      icon: '🏆',
      stat: 'Lifetime validity'
    }
  ];

  const testimonials = [
    { company: 'TechCorp Inc.', stat: '89% promotion rate', desc: 'Among trained employees within 18 months' },
    { company: 'Global Finance Ltd.', stat: '$2.3M saved', desc: 'In operational efficiency through upskilling' },
    { company: 'Healthcare Plus', stat: '95% retention', desc: 'Of employees post-training program' }
  ];

  return (
    <section className="bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-50 py-24">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#008200]/5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#0E3386]/5 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-3">
                <div className="inline-block px-4 py-2 bg-[#008200]/10 text-[#008200] text-sm font-semibold rounded-full border border-[#008200]/20">
                  ENTERPRISE SOLUTIONS
                </div>
                <h1 className="text-5xl md:text-6xl font-black text-gray-900 leading-tight">
                  Upskill Your Team,
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#008200] to-[#0E3386]"> Drive Growth</span>
                </h1>
              </div>

              <p className="text-xl text-gray-600 leading-relaxed max-w-xl">
                Comprehensive, scalable training solutions designed for organizations committed to developing world-class talent and achieving measurable business outcomes.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/corporate-signup"
                  className="px-8 py-4 bg-gradient-to-r from-[#008200] to-[#00B300] text-white font-bold rounded-lg hover:shadow-lg hover:shadow-[#008200]/30 transition-all duration-300 text-center"
                >
                  Schedule Free Consultation
                </Link>
                <button className="px-8 py-4 border-2 border-gray-300 text-gray-700 font-bold rounded-lg hover:border-[#008200] hover:text-[#008200] transition-all duration-300">
                  Watch Demo
                </button>
              </div>

              <div className="grid grid-cols-2 gap-8 pt-6 border-t border-gray-200">
                <div>
                  <p className="text-3xl font-black text-gray-900">500+</p>
                  <p className="text-sm text-gray-600">Enterprise Partners</p>
                </div>
                <div>
                  <p className="text-3xl font-black text-gray-900">50K+</p>
                  <p className="text-sm text-gray-600">Professionals Trained</p>
                </div>
              </div>
            </div>

            {/* Right Image - Analytics Card */}
            <div className="relative h-96 md:h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-[#008200] via-[#006b00] to-[#0E3386] rounded-2xl overflow-hidden shadow-2xl"></div>
              
              {/* Content */}
              <div className="relative w-full h-full flex flex-col justify-between p-8 text-white">
                {/* Top Section */}
                <div>
                  <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur px-3 py-1 rounded-full mb-6">
                    <span className="w-2 h-2 bg-lime-300 rounded-full animate-pulse"></span>
                    <span className="text-xs font-semibold">Live Analytics</span>
                  </div>
                  <h3 className="text-2xl font-black mb-2">Performance Insights</h3>
                  <p className="text-white/80 text-sm">Real-time tracking of 1,240+ active learners</p>
                </div>

                {/* Middle - Key Metrics */}
                <div className="space-y-4">
                  {[
                    { label: 'Completion Rate', value: '78%' },
                    { label: 'Avg Engagement', value: '4.8/5' },
                    { label: 'Time to Mastery', value: '15.2h' }
                  ].map((metric, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-white/10 backdrop-blur px-4 py-3 rounded-lg border border-white/20 hover:border-white/40 transition-all">
                      <div>
                        <p className="text-xs text-white/70 font-semibold">{metric.label}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-black">{metric.value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bottom - Visual Element */}
                <div className="relative h-16 rounded-lg bg-white/10 backdrop-blur border border-white/20 overflow-hidden">
                  <div className="absolute inset-0 flex items-end justify-around px-2 gap-2">
                    {[65, 45, 80, 55, 90, 70, 85].map((height, idx) => (
                      <div
                        key={idx}
                        className="flex-1 bg-gradient-to-t from-lime-300 to-lime-400 rounded-t opacity-80 hover:opacity-100 transition-opacity"
                        style={{ height: `${height}%` }}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Purpose-Built for Enterprise
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Every feature designed with organizational scale, security, and success in mind
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="group relative overflow-hidden rounded-xl border border-gray-200 hover:border-[#008200] transition-all duration-300 bg-white hover:shadow-xl hover:shadow-[#008200]/10"
              >
                <div className="absolute top-0 left-0 w-1 h-12 bg-gradient-to-b from-[#008200] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <span className="text-4xl">{feature.icon}</span>
                    <span className="text-xs font-bold text-[#008200] bg-[#008200]/10 px-3 py-1 rounded-full">{feature.stat}</span>
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-20 bg-gradient-to-r from-gray-50 to-slate-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 mb-4">
              Proven Results
            </h2>
            <p className="text-xl text-gray-600">
              Trusted by leading companies across industries
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl p-8 border border-gray-200 hover:shadow-lg transition-all duration-300"
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-2xl font-black text-gray-900">{item.company}</span>
                  <span className="text-2xl">⭐</span>
                </div>
                <p className="text-3xl font-black text-[#008200] mb-2">{item.stat}</p>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-[#008200] to-[#0E3386] rounded-2xl overflow-hidden shadow-2xl">
            <div className="grid md:grid-cols-2 gap-0">
              {/* Left Content */}
              <div className="p-12 text-white flex flex-col justify-center">
                <h3 className="text-3xl font-black mb-4">Ready to Transform Your Organization?</h3>
                <p className="text-white/90 mb-8 text-lg leading-relaxed">
                  Let our enterprise specialists design a custom learning strategy for your team. Get started with a free assessment.
                </p>
                <div className="flex items-center gap-4">
                  <Link
                    href="/corporate-signup"
                    className="px-8 py-4 bg-white text-[#008200] font-bold rounded-lg hover:bg-gray-50 transition-all duration-300"
                  >
                    Start Free Assessment
                  </Link>
                  <span className="text-white/70 text-sm">No credit card required</span>
                </div>
              </div>

              {/* Right Image */}
              <div className="relative hidden md:block bg-white/10 backdrop-blur">
                <div className="absolute inset-0 flex items-center justify-center opacity-20">
                  <span className="text-8xl">🚀</span>
                </div>
                <div className="relative h-full flex flex-col justify-center items-center text-center text-white p-12">
                  <p className="text-sm font-semibold mb-2">TRUSTED BY ENTERPRISE LEADERS</p>
                  <p className="text-2xl font-black">Let us help you build</p>
                  <p className="text-2xl font-black">world-class teams</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-16 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-600 font-semibold mb-12">TRUSTED BY LEADING ORGANIZATIONS</p>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <p className="text-3xl font-black text-gray-900 mb-2">🔒</p>
              <p className="font-bold text-gray-900">SOC 2 Type II</p>
              <p className="text-sm text-gray-600">Certified Secure</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-black text-gray-900 mb-2">📋</p>
              <p className="font-bold text-gray-900">ISO 27001</p>
              <p className="text-sm text-gray-600">Compliance Ready</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-black text-gray-900 mb-2">⚡</p>
              <p className="font-bold text-gray-900">99.9% Uptime</p>
              <p className="text-sm text-gray-600">Always Available</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-black text-gray-900 mb-2">🌍</p>
              <p className="font-bold text-gray-900">Global Scale</p>
              <p className="text-sm text-gray-600">150+ Countries</p>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
}
