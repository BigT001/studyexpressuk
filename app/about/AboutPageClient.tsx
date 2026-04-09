'use client';

import React from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, Variants } from 'framer-motion';
import { ArrowRight, BookOpen, Users, Sparkles, Globe, GraduationCap, Building2, ChevronRight } from 'lucide-react';

export default function AboutPageClient() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
  };

  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <main className="bg-white text-gray-900 overflow-x-hidden">
      {/* ─── HERO ─── */}
      <section className="relative min-h-screen flex flex-col justify-center items-center text-center px-4 py-32 overflow-hidden">
        {/* Ambient blobs */}
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[-10%] left-[10%] w-[500px] h-[500px] rounded-full bg-green-100 blur-[120px] pointer-events-none"
        />
        <motion.div
           animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
           transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
           className="absolute bottom-[-10%] right-[5%] w-[400px] h-[400px] rounded-full bg-blue-50 blur-[100px] pointer-events-none"
        />
        <motion.div
           animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
           transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
           className="absolute top-[40%] left-[-5%] w-[300px] h-[300px] rounded-full bg-emerald-50 blur-[80px] pointer-events-none"
        />

        {/* Dot grid background */}
        <motion.div
          style={{ y }}
          className="absolute inset-0 opacity-[0.03] pointer-events-none origin-top"
        >
          <div className="w-full h-[200%] absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle, #000000 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }} />
        </motion.div>

        <div className="relative z-10 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-green-200 bg-green-50 text-green-700 text-sm font-semibold tracking-widest uppercase mb-8 shadow-sm"
          >
            <Sparkles className="w-4 h-4" />
            Our Story
          </motion.div>

          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.88] mb-8 text-gray-900"
          >
            Education <br />
            <span className="bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500 bg-clip-text text-transparent">
              without limits.
            </span>
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed font-medium"
          >
            Study Express UK was built on a single belief — that transformative education should be
            accessible to every individual and every organisation, regardless of where they start.
          </motion.p>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12"
          >
            <Link
              href="/courses"
              className="group flex items-center gap-3 px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(34,197,94,0.3)]"
            >
              Explore Courses
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/events"
              className="flex items-center gap-3 px-8 py-4 border border-gray-200 hover:border-gray-300 text-gray-700 font-semibold rounded-2xl transition-all duration-300 hover:bg-gray-50"
            >
              View Events
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-400"
        >
          <span className="text-xs tracking-widest uppercase font-semibold">Scroll</span>
          <motion.div
            animate={{ height: ['0px', '48px'], opacity: [0, 1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-px h-12 bg-gradient-to-b from-gray-400 to-transparent origin-top"
          />
        </motion.div>
      </section>

      {/* ─── MANIFESTO ─── */}
      <section className="py-32 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              variants={staggerContainer}
            >
              <motion.p variants={fadeInUp} className="text-xs text-green-600 font-bold tracking-[0.3em] uppercase mb-6">Who We Are</motion.p>
              <motion.h2 variants={fadeInUp} className="text-5xl md:text-6xl font-black tracking-tight leading-[1.05] text-gray-900 mb-8">
                A platform built
                <br />
                <span className="text-gray-400">for the ambitious.</span>
              </motion.h2>
              <motion.div variants={fadeInUp} className="w-16 h-1 bg-green-500 rounded-full mb-8 origin-left" />
              <motion.p variants={fadeInUp} className="text-gray-600 text-lg leading-relaxed mb-6">
                Study Express UK is a next-generation learning platform connecting driven individuals and
                forward-thinking companies with expert-led courses, live events, and bespoke corporate training.
              </motion.p>
              <motion.p variants={fadeInUp} className="text-gray-500 text-base leading-relaxed">
                We believe the distance between where you are and where you want to be can be closed with the
                right knowledge, the right community, and the right tools. That&apos;s what we&apos;ve built.
              </motion.p>
            </motion.div>

            {/* Visual card cluster */}
            <motion.div
               initial="hidden"
               whileInView="visible"
               viewport={{ once: true, margin: '-100px' }}
               variants={staggerContainer}
               className="relative h-[480px]"
            >
              {/* Card 1 */}
              <motion.div
                variants={fadeInUp}
                whileHover={{ y: -5, scale: 1.02 }}
                className="absolute top-0 right-0 w-72 bg-white border border-gray-100 rounded-3xl p-6 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] z-20"
              >
                <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center mb-4">
                  <GraduationCap className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-sm text-gray-600 leading-relaxed font-medium">
                  &ldquo;The courses transformed how our entire team approaches learning.&rdquo;
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-xs font-bold text-white shadow-sm">S</div>
                  <div>
                    <p className="text-xs text-gray-900 font-bold">Sarah M.</p>
                    <p className="text-xs text-gray-500 font-medium">Corporate Client</p>
                  </div>
                </div>
              </motion.div>

              {/* Card 2 */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, x: -30 },
                  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut', delay: 0.2 } }
                }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="absolute top-[120px] left-0 w-64 bg-gradient-to-br from-green-50 to-white border border-green-100 rounded-3xl p-6 shadow-[0_20px_40px_-15px_rgba(34,197,94,0.1)] z-10"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs text-green-700 font-bold tracking-wider">LIVE NOW</span>
                </div>
                <p className="text-gray-900 font-bold mb-1">Digital Marketing Masterclass</p>
                <p className="text-gray-500 text-xs font-medium">234 learners attending</p>
              </motion.div>

              {/* Card 3 */}
              <motion.div
                 variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut', delay: 0.4 } }
                }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="absolute bottom-0 right-8 w-60 bg-white border border-gray-100 rounded-3xl p-5 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] z-20"
              >
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-4">This Month</p>
                <div className="space-y-3">
                  {['Leadership Essentials', 'Data Analytics', 'Project Management'].map((c, i) => (
                    <div key={c} className="flex items-center gap-3">
                      <div className={`w-1.5 h-1.5 rounded-full shadow-sm ${i === 0 ? 'bg-green-500' : i === 1 ? 'bg-blue-500' : 'bg-purple-500'}`} />
                      <p className="text-sm text-gray-700 font-medium">{c}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Floating badge */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, scale: 0.8 },
                  visible: { opacity: 1, scale: 1, transition: { type: 'spring', delay: 0.6 } }
                }}
                className="absolute bottom-32 left-20 bg-white border border-gray-100 rounded-2xl px-5 py-4 shadow-xl z-30"
              >
                <p className="text-xs text-gray-400 font-semibold mb-1">Platform Type</p>
                <p className="text-sm font-black text-green-600 tracking-tight">B2B · B2C · Enterprise</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── CORE PILLARS ─── */}
      <section className="py-24 px-4 bg-gray-50/50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
            className="text-center mb-20"
          >
            <motion.p variants={fadeInUp} className="text-xs text-green-600 font-bold tracking-[0.3em] uppercase mb-4">What We Offer</motion.p>
            <motion.h2 variants={fadeInUp} className="text-5xl md:text-6xl font-black tracking-tight text-gray-900">
              Three ways we help
              <br />
              <span className="text-gray-400">you grow.</span>
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-6"
          >
            {[
              {
                icon: <BookOpen className="w-7 h-7" />,
                accent: 'from-green-500 to-emerald-600',
                glow: 'rgba(34,197,94,0.15)',
                label: 'Individuals',
                title: 'Expert-Led Courses',
                desc: 'Structured, career-defining courses taught by industry veterans. Learn at your pace, earn credentials that matter.',
              },
              {
                icon: <Building2 className="w-7 h-7" />,
                accent: 'from-blue-500 to-indigo-600',
                glow: 'rgba(59,130,246,0.15)',
                label: 'Organisations',
                title: 'Corporate Training',
                desc: 'Upskill your entire workforce with our enterprise programmes. Full analytics, team dashboards, and bespoke content.',
              },
              {
                icon: <Globe className="w-7 h-7" />,
                accent: 'from-purple-500 to-violet-600',
                glow: 'rgba(147,51,234,0.15)',
                label: 'Everyone',
                title: 'Live Masterclasses',
                desc: 'Join live interactive events and workshops. Connect, collaborate, and absorb knowledge in real time.',
              },
            ].map((item) => (
              <motion.div
                variants={fadeInUp}
                whileHover={{ y: -10 }}
                key={item.label}
                className="group relative bg-white border border-gray-100 rounded-[2rem] p-10 hover:border-green-500/30 hover:shadow-[0_20px_60px_-15px_rgba(34,197,94,0.15)] transition-all duration-500 overflow-hidden"
                style={{ '--glow': item.glow } as React.CSSProperties}
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-[2rem] pointer-events-none"
                  style={{ background: `radial-gradient(circle at 30% 30%, ${item.glow} 0%, transparent 70%)` }}
                />

                <div className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${item.accent} flex items-center justify-center text-white mb-8 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                  {item.icon}
                </div>

                <span className="text-xs text-green-600 font-black tracking-widest uppercase">{item.label}</span>
                <h3 className="text-2xl font-black text-gray-900 mt-3 mb-4 tracking-tight">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed font-medium">{item.desc}</p>

                <div className="mt-8 flex items-center gap-2 text-gray-400 group-hover:text-green-600 transition-colors duration-300 text-sm font-bold uppercase tracking-wider">
                  Learn more <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── VALUES STRIP ─── */}
      <section className="py-20 px-4 border-y border-gray-100">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {[
              { emoji: '🎯', title: 'Purpose-Driven', desc: 'Every course, every event is built with clear career outcomes in mind.' },
              { emoji: '🤝', title: 'Community First', desc: 'Learning is better together. We foster connection at every level.' },
              { emoji: '🏆', title: 'Quality Obsessed', desc: 'Our instructors are practitioners, not theorists.' },
              { emoji: '🌍', title: 'Globally Minded', desc: 'UK-rooted, internationally relevant — our content travels.' },
            ].map((v) => (
              <motion.div variants={fadeInUp} key={v.title} className="text-center group">
                <div className="text-4xl mb-6 group-hover:scale-110 transition-transform duration-300 inline-block drop-shadow-sm">{v.emoji}</div>
                <h4 className="text-gray-900 font-bold mb-3">{v.title}</h4>
                <p className="text-gray-600 text-sm leading-relaxed font-medium px-4">{v.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── MISSION STATEMENT ─── */}
      <section className="py-32 px-4 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-green-50/30 rounded-full blur-[100px] w-full max-w-4xl mx-auto pointer-events-none" />
        <motion.div
           initial="hidden"
           whileInView="visible"
           viewport={{ once: true, margin: '-100px' }}
           variants={staggerContainer}
           className="max-w-5xl mx-auto text-center relative z-10"
        >
          <motion.p variants={fadeInUp} className="text-xs text-green-600 font-bold tracking-[0.3em] uppercase mb-8">Our Mission</motion.p>
          <motion.blockquote variants={fadeInUp} className="text-3xl md:text-5xl font-black text-gray-900 leading-[1.25] tracking-tight">
            &ldquo;To make high-quality education radically accessible — empowering every learner
            and every organisation to reach their fullest potential.&rdquo;
          </motion.blockquote>
          <motion.div variants={fadeInUp} className="mt-14 flex items-center justify-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-black text-xl shadow-[0_8px_16px_rgba(34,197,94,0.25)]">SE</div>
            <div className="text-left">
              <p className="text-gray-900 font-bold text-lg">Study Express UK</p>
              <p className="text-gray-500 text-sm font-medium">Founded to change the game</p>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ─── WHO WE SERVE ─── */}
      <section className="py-24 px-4 bg-gray-50/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Audience cards */}
            <motion.div
               initial="hidden"
               whileInView="visible"
               viewport={{ once: true, margin: '-100px' }}
               variants={staggerContainer}
               className="grid grid-cols-2 gap-6"
            >
              {[
                { icon: <Users className="w-7 h-7" />, label: 'Students', color: 'green', desc: 'From foundations to advanced mastery' },
                { icon: <Building2 className="w-7 h-7" />, label: 'Corporates', color: 'blue', desc: 'Workforce development at scale' },
                { icon: <GraduationCap className="w-7 h-7" />, label: 'Professionals', color: 'purple', desc: 'Career pivots and accelerations' },
                { icon: <Globe className="w-7 h-7" />, label: 'Enterprises', color: 'orange', desc: 'Custom programmes for large teams' },
              ].map((a) => {
                const colorMap: Record<string, string> = {
                  green: 'bg-green-50 text-green-600 border-green-100',
                  blue: 'bg-blue-50 text-blue-600 border-blue-100',
                  purple: 'bg-purple-50 text-purple-600 border-purple-100',
                  orange: 'bg-orange-50 text-orange-600 border-orange-100',
                };
                return (
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, scale: 0.9 },
                      visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } }
                    }}
                    whileHover={{ scale: 1.05 }}
                    key={a.label}
                    className={`border rounded-[1.5rem] p-6 shadow-sm transition-shadow hover:shadow-md ${colorMap[a.color]}`}
                  >
                    <div className="mb-4 bg-white/60 p-3 rounded-xl inline-block shadow-sm">{a.icon}</div>
                    <p className="font-bold text-gray-900 text-lg">{a.label}</p>
                    <p className="text-sm mt-2 opacity-80 font-medium text-gray-700">{a.desc}</p>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Right: Text */}
            <motion.div
               initial="hidden"
               whileInView="visible"
               viewport={{ once: true, margin: '-100px' }}
               variants={staggerContainer}
            >
              <motion.p variants={fadeInUp} className="text-xs text-green-600 font-bold tracking-[0.3em] uppercase mb-6">Who We Serve</motion.p>
              <motion.h2 variants={fadeInUp} className="text-5xl font-black tracking-tight text-gray-900 leading-[1.1] mb-8">
                Built for every
                <br />
                <span className="text-gray-400">kind of learner.</span>
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-gray-600 text-lg leading-relaxed mb-6 font-medium">
                Whether you&apos;re an individual stepping up your career, a manager developing your team,
                or an enterprise rethinking how your organisation learns — Study Express UK has a pathway for you.
              </motion.p>
              <motion.p variants={fadeInUp} className="text-gray-500 text-lg leading-relaxed font-medium">
                Our platform adapts to your context, with personal dashboards, corporate accounts, staff management
                tools, and live tracking — so everyone moves forward together.
              </motion.p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="relative py-32 px-4 overflow-hidden bg-gray-900 border-t border-gray-100">
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/30 via-gray-900 to-emerald-900/20 pointer-events-none" />
        <motion.div
           animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
           transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
           className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-green-500/20 blur-[120px] pointer-events-none"
        />

        <motion.div
           initial="hidden"
           whileInView="visible"
           viewport={{ once: true, margin: '-100px' }}
           variants={staggerContainer}
           className="relative z-10 max-w-3xl mx-auto text-center"
        >
          <motion.p variants={fadeInUp} className="text-xs text-green-400 font-bold tracking-[0.3em] uppercase mb-6">Ready?</motion.p>
          <motion.h2 variants={fadeInUp} className="text-5xl md:text-7xl font-black tracking-tight text-white leading-[1.05] mb-8">
            Start your journey
            <br />
            <span className="bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">
              today.
            </span>
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-gray-300 text-lg leading-relaxed mb-12 max-w-xl mx-auto font-medium">
            Whether you&apos;re an individual chasing growth or an organisation building capability —
            we&apos;re your partner every step of the way.
          </motion.p>

          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <Link
              href="/auth/signup"
              className="group flex items-center gap-3 px-10 py-5 bg-green-500 hover:bg-green-400 text-gray-900 font-black text-lg rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(34,197,94,0.4)]"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/courses"
              className="px-10 py-5 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 text-white font-bold text-lg rounded-2xl transition-all duration-300 backdrop-blur-sm"
            >
              Browse Courses
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </main>
  );
}
