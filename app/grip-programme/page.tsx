"use client";

import React, { Suspense } from "react";
import Head from "next/head";
import Image from "next/image";
import { motion } from "framer-motion";
import { useSession, signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import { 
  Calendar, 
  Users, 
  MapPin, 
  School, 
  Award, 
  CheckCircle2, 
  ChevronRight, 
  Building2, 
  Globe, 
  Briefcase, 
  TrendingUp, 
  Lightbulb, 
  Handshake, 
  GraduationCap,
  Clock,
  ArrowRight,
  Plus,
  Minus,
  Navigation,
  Check
} from "lucide-react";

/* ─── Components ─────────────────────────────────────────────────────── */

const SectionTitle = ({ title, subtitle, label }: { title: string; subtitle?: string; label?: string }) => (
  <div className="text-center mb-16 px-4">
    {label && (
      <span className="section-label section-label-green mb-4 animate-fade-up">
        {label}
      </span>
    )}
    <h2 className="text-4xl md:text-5xl font-extrabold text-[#0C0B20] tracking-tight mb-6">
      {title}
    </h2>
    {subtitle && (
      <p className="text-lg text-[#6B6880] max-w-2xl mx-auto leading-relaxed">
        {subtitle}
      </p>
    )}
  </div>
);

const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className={`bg-white rounded-[24px] border border-[#EEEEEE] p-8 shadow-sm hover:shadow-xl transition-all duration-300 ${className}`}
  >
    {children}
  </motion.div>
);

const FAQItem = ({ question, answer }: { question: string; answer: string }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <div className="border-b border-[#EEEEEE] last:border-0">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex items-center justify-between text-left group"
      >
        <span className="text-lg font-bold text-[#0C0B20] group-hover:text-[#008200] transition-colors">
          {question}
        </span>
        <div className={`p-2 rounded-full transition-colors ${isOpen ? 'bg-[#008200] text-white' : 'bg-[#f0faf0] text-[#008200]'}`}>
          {isOpen ? <Minus size={18} /> : <Plus size={18} />}
        </div>
      </button>
      <motion.div 
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
        className="overflow-hidden"
      >
        <div className="pb-8 text-[#6B6880] leading-relaxed">
          {answer}
        </div>
      </motion.div>
    </div>
  );
};

/* ─── Page Component ─────────────────────────────────────────────────── */

function GripContent() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isProcessing, setIsProcessing] = React.useState(false);

  React.useEffect(() => {
    if (searchParams.get("success") === "true") {
      toast.success("Deposit received! Check your email for next steps.", {
        duration: 6000,
        icon: '🎉',
      });
    }
  }, [searchParams]);

  const handleCheckout = async (tier: string) => {
    if (!session) {
      signIn("google", { callbackUrl: "/grip-programme" });
      return;
    }

    try {
      setIsProcessing(true);
      const res = await fetch("/api/grip/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier }),
      });

      const data = await res.json();
      if (data.success && data.url) {
        window.location.href = data.url;
      } else {
        toast.error(data.error || "Failed to initiate checkout");
      }
    } catch (err) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  return (
    <main className="bg-white selection:bg-[#008200]/10 selection:text-[#008200]">
      {/* ─── Hero Section ─────────────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#008200]/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-[10%] left-[-5%] w-[400px] h-[400px] bg-[#0E3386]/5 rounded-full blur-[100px]" />
        </div>

        <div className="section-container relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="flex justify-center mb-8"
            >
              <span className="section-label section-label-green">
                Flagship Programme · London 2026
              </span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-7xl md:text-9xl font-black text-[#0C0B20] tracking-tighter mb-4"
            >
              GRIP
            </motion.h1>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#008200] to-[#0E3386] bg-clip-text text-transparent mb-8">
                Global Readiness Immersion Programme
              </h2>
              <p className="text-2xl font-medium italic text-[#6B6880] mb-12">
                "Get a GRIP on the global market."
              </p>
              <p className="text-xl text-[#333333] max-w-2xl mx-auto leading-relaxed mb-12">
                A curated 7-day cohort experience for African founders and CEOs ready to engage the UK market — not just visit it.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="flex flex-wrap justify-center gap-6"
            >
              <a href="#register" className="btn-primary py-4 px-10 text-lg rounded-full">
                Reserve Your Place <ChevronRight size={20} />
              </a>
              <a href="#programme" className="btn-secondary py-4 px-10 text-lg rounded-full">
                View Schedule
              </a>
            </motion.div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-24">
            {[
              { label: "DAYS IN LONDON", value: "7", icon: <MapPin size={24} className="text-[#008200]" /> },
              { label: "COHORT LIMIT", value: "15", icon: <Users size={24} className="text-[#008200]" /> },
              { label: "SHOW DELEGATES", value: "25K+", icon: <Globe size={24} className="text-[#008200]" /> },
              { label: "YEARS EXPERTISE", value: "18+", icon: <Award size={24} className="text-[#008200]" /> },
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1, duration: 0.8 }}
                className="bg-[#0C0B20] p-8 rounded-[32px] text-center group transition-transform duration-500 hover:scale-105"
              >
                <div className="flex justify-center mb-4 opacity-70 group-hover:opacity-100 transition-opacity">
                  {stat.icon}
                </div>
                <div className="text-4xl font-black text-[#008200] mb-2">{stat.value}</div>
                <div className="text-[10px] font-bold tracking-[0.2em] text-[#AAAAAA] uppercase">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Who This Is For Section ────────────────────────────────────────── */}
      <section className="py-32 bg-[#F9FAFB] relative overflow-hidden">
        <div className="section-container relative z-10">
          <SectionTitle 
            label="WHO THIS IS FOR"
            title="Built for the Ambitious African Business Leader"
            subtitle="This is not a networking trip or a group holiday. It is a structured, results-oriented programme for professionals who are serious about the UK market."
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { 
                icon: <Building2 className="text-[#008200]" size={36} />, 
                title: "Founders & CEOs", 
                description: "Nigerian and African business owners exploring UK market entry, legal entity setup, or cross-border trade partnerships." 
              },
              { 
                icon: <Globe className="text-[#008200]" size={36} />, 
                title: "Diaspora Entrepreneurs", 
                description: "UK-based Africans building or scaling businesses who want structured exposure to the UK SME ecosystem." 
              },
              { 
                icon: <TrendingUp className="text-[#008200]" size={36} />, 
                title: "Senior Executives", 
                description: "Directors and C-suite professionals seeking to build UK networks and understand post-Brexit trade dynamics." 
              },
              { 
                icon: <Lightbulb className="text-[#008200]" size={36} />, 
                title: "Startup Founders", 
                description: "Early-stage founders in fintech, edtech, and agritech looking to validate their proposition in the UK market." 
              },
              { 
                icon: <GraduationCap className="text-[#008200]" size={36} />, 
                title: "Professional Development", 
                description: "Ambitious professionals investing in their global business education and seeking a credible UK learning experience." 
              },
              { 
                icon: <Handshake className="text-[#008200]" size={36} />, 
                title: "Coaches & Consultants", 
                description: "Advisors who serve African businesses and want first-hand exposure to sharpen their global advisory practice." 
              },
            ].map((item, i) => (
              <motion.div key={i} {...fadeInUp} transition={{ delay: i * 0.1 }}>
                <Card className="h-full bg-[#F9FAFB]">
                  <div className="mb-6">{item.icon}</div>
                  <h3 className="text-xl font-extrabold text-[#0C0B20] mb-4">{item.title}</h3>
                  <p className="text-[#6B6880] leading-relaxed italic">{item.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── The Programme Overview Section ─────────────────────────────────── */}
      <section id="programme" className="py-32">
        <div className="section-container">
          <SectionTitle 
            label="THE PROGRAMME"
            title="Seven Days That Will Change How You Do Business"
            subtitle="A guided immersion, not a solo trip. Most professionals leave with business cards and jet lag. GRIP participants leave with a UK strategy, a curated network, and a 90-day action plan."
          />

          <div className="grid lg:grid-cols-2 gap-12 bg-[#F9FAFB] p-12 rounded-[40px] mb-20">
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#008200]/10 flex items-center justify-center text-[#008200]">
                  <Calendar size={24} />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#008200] uppercase tracking-widest">DATES</div>
                  <div className="text-xl font-bold text-[#0C0B20]">9–15 November 2026</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#008200]/10 flex items-center justify-center text-[#008200]">
                  <MapPin size={24} />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#008200] uppercase tracking-widest">BASE LOCATION</div>
                  <div className="text-xl font-bold text-[#0C0B20]">London — near ExCeL, Royal Docks</div>
                </div>
              </div>
            </div>
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#008200]/10 flex items-center justify-center text-[#008200]">
                  <Award size={24} />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#008200] uppercase tracking-widest">CERTIFICATE</div>
                  <div className="text-xl font-bold text-[#0C0B20]">Studyexpress & GBS Corporate Training</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#008200]/10 flex items-center justify-center text-[#008200]">
                  <Users size={24} />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#008200] uppercase tracking-widest">COHORT SIZE</div>
                  <div className="text-xl font-bold text-[#0C0B20]">Maximum 15 participants</div>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="max-w-5xl mx-auto space-y-12">
            {[
              { 
                day: "DAY 1–2", 
                title: "Welcome & Orientation", 
                subtitle: "ARRIVAL",
                desc: "Airport arrival, group check-in, and welcome dinner. An evening briefing covers UK business culture, etiquette, and how to extract maximum value from The Business Show.",
                features: ["Airport Transfers", "Welcome Dinner", "Cohort Briefing", "UK Business Culture Session"]
              },
              { 
                day: "DAY 3", 
                title: "GRIP Going Global Masterclass", 
                subtitle: "MASTERCLASS @ GBS CORPORATE",
                desc: "A full-day executive masterclass co-facilitated by Studyexpress and GBS Corporate Training. CMI/ILM CPD endorsed.",
                features: ["GBS Corporate Faculty", "Guest Experts", "Hot Seats", "CMI/ILM CPD Certificate"]
              },
              { 
                day: "DAY 4–5", 
                title: "The World's Largest SME Event", 
                subtitle: "THE BUSINESS SHOW · EXCEL LONDON",
                desc: "Two full days at The Business Show with a personalised show guide, speed networking, and investor pitch zones.",
                features: ["500+ Exhibitors", "Personalised Guide", "Speed Networking", "Evening Debrief"]
              },
              { 
                day: "DAY 6", 
                title: "London's Business Districts", 
                subtitle: "SITE VISITS",
                desc: "Guided visits to Canary Wharf, Tech City, and the City of London. Meetings with UK SMEs and trade bodies.",
                features: ["Canary Wharf", "Tech City / Shoreditch", "City of London", "UK Market Briefing"]
              },
              { 
                day: "DAY 7", 
                title: "90-Day Action Plan", 
                subtitle: "DEPARTURE DAY",
                desc: "Every participant leaves with a written 90-day action plan. Final group session consolidates connections.",
                features: ["90-Day Plan", "GAIN Community Launch", "Certification Ceremony"]
              },
            ].map((item, i) => (
              <motion.div key={i} {...fadeInUp} className="flex gap-8 group">
                <div className="hidden md:flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full border-4 border-[#008200]/20 bg-white flex items-center justify-center text-sm font-black text-[#008200] group-hover:bg-[#008200] group-hover:text-white transition-all">
                    {i + 1}
                  </div>
                  {i < 4 && <div className="w-1 grow bg-gradient-to-b from-[#008200]/20 to-transparent mt-4" />}
                </div>
                <div className="grow mb-12">
                  <div className="text-xs font-black text-[#AAAAAA] tracking-[0.3em] mb-2">{item.day} — {item.subtitle}</div>
                  <h3 className="text-3xl font-bold text-[#0C0B20] mb-4">{item.title}</h3>
                  <p className="text-lg text-[#6B6880] mb-8 leading-relaxed max-w-3xl">
                    {item.desc}
                  </p>
                  <div className="flex flex-wrap gap-x-8 gap-y-4">
                    {item.features.map((feat, j) => (
                      <div key={j} className="flex items-center gap-2 text-sm font-bold text-[#008200]">
                        <CheckCircle2 size={16} /> {feat}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── The Masterclass Detail Section ─────────────────────────────────── */}
      <section className="py-32 bg-[#0C0B20] text-white relative overflow-hidden">
        <div className="section-container relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-20 px-4">
            <span className="section-label section-label-green bg-[#008200]/20 border-#008200/30 text-white mb-6">
              THE GRIP MASTERCLASS
            </span>
            <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">
              Going Global: The African Entrepreneur's Roadmap
            </h2>
            <p className="text-xl text-[#AAAAAA] mb-8 italic">
              Monday 10 November 2026 · Co-facilitated by Studyexpress & GBS Corporate Training
            </p>
            <p className="text-lg text-white/70 max-w-3xl mx-auto leading-relaxed">
              Primes every GRIP participant for maximum impact. Sessions are delivered by GBS Corporate faculty, specialist guest speakers, and Kehinde — CEO of Studyexpress.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-1">
            {[
              { time: "9:00 AM", title: "Welcome & Introductions", desc: "Setting objectives and cohort synergy." },
              { time: "9:30 AM", title: "Market Entry Essentials", desc: "Legal, structural and financial foundational briefing." },
              { time: "10:30 AM", title: "UK-Africa Trade", desc: "Supply chains, sectors, and post-Brexit policy." },
              { time: "1:30 PM", title: "UK-Facing Brand", desc: "Positioning and messaging for a UK audience." },
              { time: "2:30 PM", title: "Funding & Investment", desc: "Accessing UK capital, grants, and accelerators." },
              { time: "3:30 PM", title: "Business Hot Seats", desc: "Live pitches with structured expert feedback." },
              { time: "4:30 PM", title: "Certification", desc: "CMI/ILM CPD certificates issued." },
            ].map((slot, i) => (
              <div key={i} className="p-8 border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
                <div className="text-[#008200] font-black text-xs tracking-widest mb-4">{slot.time}</div>
                <h4 className="text-lg font-bold mb-4">{slot.title}</h4>
                <p className="text-sm text-[#AAAAAA] leading-relaxed">{slot.desc}</p>
              </div>
            ))}
          </div>

          {/* Academic Partner Info */}
          <div className="mt-32 p-12 rounded-[40px] border-2 border-[#008200]/30 bg-[#008200]/5 max-w-5xl mx-auto text-center">
            <div className="text-[#008200] text-xs font-black tracking-widest mb-4">TRAINING PARTNER</div>
            <h3 className="text-3xl font-black mb-6">GBS Corporate Training</h3>
            <p className="text-[#AAAAAA] text-lg leading-relaxed max-w-3xl mx-auto">
              Established 1966 · ISO 9001:2015 Certified · Approved CMI & ILM Centre. GBS Corporate brings over 50 years of management and leadership development expertise.
            </p>
          </div>
        </div>
      </section>

      {/* ─── Investment Section ─────────────────────────────────────────────── */}
      <section className="py-32 bg-[#F9FAFB]">
        <div className="section-container">
          <SectionTitle 
            label="PROGRAMME INVESTMENT"
            title="Choose the Experience That Matches Your Ambition"
            subtitle="All tiers include the GRIP Masterclass and two days at The Business Show. Flights not included."
          />

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              { 
                tier: "STANDARD", 
                price: "£1,500", 
                features: ["5 nights hotel (twin share)", "Airport & ground transfers", "GRIP Masterclass", "2 days @ The Business Show", "Personalised Show Guide", "Welcome dinner"] 
              },
              { 
                tier: "PREMIUM", 
                price: "£2,200", 
                popular: true,
                features: ["All Standard features", "Private Hotel Room", "VIP Speed Networking", "Pre-show Investor Briefing", "Digital Brand Audit"] 
              },
              { 
                tier: "EXECUTIVE", 
                price: "£3,000", 
                features: ["All Premium features", "5-star Accommodation", "Private 1:1 with Guest Speaker", "Company Setup Consultation", "Ongoing GAIN Mentorship"] 
              },
            ].map((plan, i) => (
              <Card key={i} className={`flex flex-col relative ${plan.popular ? 'border-[#008200] scale-105 z-10' : ''}`}>
                {plan.popular && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <span className="bg-[#008200] text-white text-[10px] font-black tracking-widest py-2 px-6 rounded-full shadow-lg">
                      MOST POPULAR
                    </span>
                  </div>
                )}
                <div className="text-center mb-8">
                  <div className="text-xs font-black tracking-[0.4em] text-[#008200] uppercase mb-4">{plan.tier}</div>
                  <div className="text-5xl font-black text-[#0C0B20] mb-2">{plan.price}</div>
                  <div className="text-[#AAAAAA] text-sm uppercase font-bold tracking-widest italic">exc. flights</div>
                </div>
                <div className="space-y-4 mb-10 grow">
                  {plan.features.map((feat, j) => (
                    <div key={j} className="flex gap-3 text-sm font-medium text-[#6B6880]">
                      <Check size={18} className="text-[#008200] shrink-0" /> {feat}
                    </div>
                  ))}
                </div>
                <button 
                  disabled={isProcessing}
                  onClick={() => handleCheckout(plan.tier)}
                  className={`w-full py-4 rounded-xl font-black text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed ${plan.popular ? 'bg-[#008200] text-white hover:bg-[#006600]' : 'bg-[#0C0B20] text-white hover:bg-[#008200]'}`}
                >
                  {isProcessing ? "PROCESSING..." : `CHOOSE ${plan.tier}`}
                </button>
              </Card>
            ))}
          </div>

          <div className="mt-16 max-w-4xl mx-auto bg-[#F0F8F4] p-8 rounded-[32px] border border-[#008200]/10 text-center">
            <h4 className="text-[#0C0B20] font-black text-xl mb-4">Flexible Payment Options</h4>
            <p className="text-[#6B6880] leading-relaxed">
              £350 deposit secures your place · 50% balance due August 2026 · Remaining balance due 1 October 2026
            </p>
            <p className="mt-4 text-xs font-bold text-[#008200] uppercase tracking-widest">
              Full refund if visa refused (terms apply)
            </p>
          </div>
        </div>
      </section>

      {/* ─── Why Studyexpress Section ────────────────────────────────────────── */}
      <section className="py-32 bg-white flex flex-col items-center">
         <div className="section-container">
           <div className="grid lg:grid-cols-2 gap-20 items-center">
              <div>
                <SectionTitle 
                  label="WHY STUDYEXPRESS"
                  title="Eighteen Years of Opening Global Doors"
                />
                <div className="space-y-6 text-lg text-[#6B6880] leading-relaxed mb-12">
                  <p>Studyexpress Nigeria Limited has spent nearly two decades at the intersection of African ambition and global opportunity.</p>
                  <p>Developed to help Nigerian and African professionals successfully navigate the UK, the GRIP Programme is the natural evolution of our commitment to your growth.</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-6 rounded-3xl bg-[#008200]/5 border border-[#008200]/10 text-center">
                    <div className="text-3xl font-black text-[#008200] mb-1">18+</div>
                    <div className="text-[10px] font-bold text-[#6B6880] uppercase tracking-wider">Years Status</div>
                  </div>
                  <div className="p-6 rounded-3xl bg-[#008200]/5 border border-[#008200]/10 text-center">
                    <div className="text-3xl font-black text-[#008200] mb-1">500+</div>
                    <div className="text-[10px] font-bold text-[#6B6880] uppercase tracking-wider">Clients Placed</div>
                  </div>
                  <div className="p-6 rounded-3xl bg-[#008200]/5 border border-[#008200]/10 text-center">
                    <div className="text-3xl font-black text-[#008200] mb-1">15</div>
                    <div className="text-[10px] font-bold text-[#6B6880] uppercase tracking-wider">Cohort Size</div>
                  </div>
                  <div className="p-6 rounded-3xl bg-[#008200]/5 border border-[#008200]/10 text-center">
                    <div className="text-3xl font-black text-[#008200] mb-1">2</div>
                    <div className="text-[10px] font-bold text-[#6B6880] uppercase tracking-wider">Partners</div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-square rounded-[60px] bg-[#EEEEEE] overflow-hidden rotate-3 scale-95 shadow-2xl relative">
                   <Image 
                     src="/blackgirl.png" 
                     alt="African Business Leader" 
                     fill
                     className="object-cover object-top"
                   />
                   <div className="absolute inset-0 bg-gradient-to-br from-[#008200] to-[#0E3386] opacity-10" />
                </div>
                <div className="absolute -bottom-10 -left-10 aspect-video w-64 rounded-3xl bg-white shadow-2xl p-6 border border-[#EEEEEE] -rotate-6">
                   <div className="text-[#008200] mb-4 font-black text-xs tracking-widest uppercase">TESTIMONIAL</div>
                   <p className="text-sm font-bold text-[#0C0B20] italic">"The most structured UK entry programme I have attended."</p>
                </div>
              </div>
           </div>
         </div>
      </section>

      {/* ─── FAQ Section ────────────────────────────────────────────────────── */}
      <section className="py-32 bg-[#F9FAFB]">
        <div className="section-container max-w-4xl mx-auto">
          <SectionTitle 
            label="FREQUENTLY ASKED QUESTIONS"
            title="Everything You Need to Know"
          />
          <div className="space-y-4">
            {[
              { q: "Do I need a UK visa to attend?", a: "Most Nigerian passport holders require a Standard Visitor Visa. Studyexpress provides a formal invitation letter upon registration and deposit payment. We recommend applying 10–12 weeks in advance." },
              { q: "What is not included in the programme fee?", a: "Flights to and from London are not included. Meals outside the included cohort dinners and masterclass lunch are also at your own cost." },
              { q: "Can I attend just the Masterclass?", a: "The GRIP Masterclass is available as a standalone day for London-based participants at £350, subject to availability. Priority goes to full cohort members." },
              { q: "What happens if my visa is refused?", a: "A full refund of payments (excluding a £100 admin fee) is available where a visa refusal is evidenced by official documentation from UKVI." },
              { q: "Is the certificate officially accredited?", a: "The co-branded Certificate of Participation is a professional development certificate, CMI/ILM CPD endorsed upon confirmation of that partnership. It is issued jointly by Studyexpress and GBS Corporate on completion of the masterclass and programme." },
              { q: "How do I secure my place?", a: "Places are reserved on a first-come, first-served basis with a £350 deposit. The cohort is capped at 15 participants. Email info@studyexpress.uk to begin the registration process." }
            ].map((faq, i) => (
              <FAQItem key={i} question={faq.q} answer={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── Final CTA ──────────────────────────────────────────────────────── */}
      <section id="register" className="py-32">
        <div className="section-container">
          <div className="bg-[#008200] rounded-[32px] md:rounded-[50px] p-10 md:p-20 text-center text-white relative overflow-hidden shadow-2xl group">
             <div className="absolute inset-0 z-0">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:bg-white/20 transition-all duration-700" />
                <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-sky-500/20 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2" />
             </div>
             
             <div className="relative z-10 max-w-2xl mx-auto">
               <h2 className="text-3xl md:text-7xl font-black mb-8 leading-tight tracking-tighter">Your next chapter starts in London.</h2>
               <p className="text-xl text-white/80 mb-12">15 places. One cohort. November 2026. Don't let another year pass without a UK strategy.</p>
               <div className="flex flex-col items-center gap-6">
                 <a href="mailto:info@studyexpress.uk" className="bg-white text-[#008200] py-6 px-16 rounded-full text-xl font-black hover:scale-105 transition-all shadow-xl">
                   Email to Reserve: info@studyexpress.uk
                 </a>
                 <p className="text-xs font-black tracking-[0.3em] uppercase opacity-60">Registration confirmation provided on deposit</p>
               </div>
             </div>
          </div>
        </div>
      </section>

      <footer className="py-12 border-t border-[#EEEEEE] text-center text-xs font-bold text-[#AAAAAA] uppercase tracking-[0.2em]">
        © 2026 Studyexpress Nigeria Limited. All Rights Reserved.
      </footer>
    </main>
  );
}

export default function GripProgramme() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <GripContent />
    </Suspense>
  );
}
