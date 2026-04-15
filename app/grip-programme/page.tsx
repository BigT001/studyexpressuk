"use client";

import React, { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useSession, signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import { 
  Calendar, Users, MapPin, School, Award, CheckCircle2, ChevronRight, 
  Building2, Globe, Briefcase, TrendingUp, Lightbulb, Handshake, 
  GraduationCap, Clock, ArrowRight, Plus, Minus, Navigation, Check
} from "lucide-react";
import { defaultGripData } from "@/lib/gripData";

/* ─── Icon Mapper ────────────────────────────────────────────────────── */
const IconMap: Record<string, React.ElementType> = {
  Calendar, Users, MapPin, School, Award, CheckCircle2, ChevronRight,
  Building2, Globe, Briefcase, TrendingUp, Lightbulb, Handshake, 
  GraduationCap, Clock, ArrowRight, Plus, Minus, Navigation, Check
};

const DynamicIcon = ({ name, ...props }: { name: string; [key: string]: any }) => {
  const Icon = IconMap[name];
  if (!Icon) return null;
  return <Icon {...props} />;
};

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
      <p className="text-lg text-[#6B6880] max-w-2xl mx-auto leading-relaxed whitespace-pre-wrap">
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
        <span className="text-lg font-bold text-[#0C0B20] group-hover:text-[#008200] transition-colors pr-4">
          {question}
        </span>
        <div className={`p-2 rounded-full transition-colors flex-shrink-0 ${isOpen ? 'bg-[#008200] text-white' : 'bg-[#f0faf0] text-[#008200]'}`}>
          {isOpen ? <Minus size={18} /> : <Plus size={18} />}
        </div>
      </button>
      <motion.div 
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
        className="overflow-hidden"
      >
        <div className="pb-8 text-[#6B6880] leading-relaxed whitespace-pre-wrap">
          {answer}
        </div>
      </motion.div>
    </div>
  );
};

/* ─── Page Component ─────────────────────────────────────────────────── */

function GripContent() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Data state logic
  const [pageData, setPageData] = useState(defaultGripData);
  const [loadingConfig, setLoadingConfig] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/site-content?key=grip-programme');
        if (res.ok) {
          const dbData = await res.json();
          if (dbData && dbData.content) {
            setPageData(JSON.parse(dbData.content));
          }
        }
      } catch (err) {
        console.error("Failed to load custom page data", err);
      } finally {
        setLoadingConfig(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
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

  if (loadingConfig) {
      return <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-[#008200] border-t-transparent rounded-full animate-spin"></div>
      </div>;
  }

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
                {pageData.hero.label}
              </span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-7xl md:text-9xl font-black text-[#0C0B20] tracking-tighter mb-4"
            >
              {pageData.hero.title}
            </motion.h1>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#008200] to-[#0E3386] bg-clip-text text-transparent mb-8">
                {pageData.hero.subtitle}
              </h2>
              <p className="text-2xl font-medium italic text-[#6B6880] mb-12">
                {pageData.hero.tagline}
              </p>
              <p className="text-xl text-[#333333] max-w-2xl mx-auto leading-relaxed mb-12 whitespace-pre-wrap">
                {pageData.hero.description}
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
            {pageData.hero.stats.map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1, duration: 0.8 }}
                className="bg-[#0C0B20] p-8 rounded-[32px] text-center group transition-transform duration-500 hover:scale-105"
              >
                <div className="flex justify-center mb-4 opacity-70 group-hover:opacity-100 transition-opacity">
                  <DynamicIcon name={stat.icon} size={24} className="text-[#008200]" />
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
            label={pageData.whoIsFor.label}
            title={pageData.whoIsFor.title}
            subtitle={pageData.whoIsFor.subtitle}
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pageData.whoIsFor.items.map((item, i) => (
              <motion.div key={i} {...fadeInUp} transition={{ delay: i * 0.1 }}>
                <Card className="h-full bg-[#F9FAFB]">
                  <div className="mb-6"><DynamicIcon name={item.icon} size={36} className="text-[#008200]" /></div>
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
            label={pageData.programme.label}
            title={pageData.programme.title}
            subtitle={pageData.programme.subtitle}
          />

          <div className="grid lg:grid-cols-2 gap-12 bg-[#F9FAFB] p-12 rounded-[40px] mb-20">
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#008200]/10 flex items-center justify-center text-[#008200]">
                  <Calendar size={24} />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#008200] uppercase tracking-widest">DATES</div>
                  <div className="text-xl font-bold text-[#0C0B20]">{pageData.programme.info.dates}</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#008200]/10 flex items-center justify-center text-[#008200]">
                  <MapPin size={24} />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#008200] uppercase tracking-widest">BASE LOCATION</div>
                  <div className="text-xl font-bold text-[#0C0B20]">{pageData.programme.info.location}</div>
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
                  <div className="text-xl font-bold text-[#0C0B20]">{pageData.programme.info.certificate}</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#008200]/10 flex items-center justify-center text-[#008200]">
                  <Users size={24} />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#008200] uppercase tracking-widest">COHORT SIZE</div>
                  <div className="text-xl font-bold text-[#0C0B20]">{pageData.programme.info.cohortSize}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="max-w-5xl mx-auto space-y-12">
            {pageData.programme.timeline.map((item, i) => (
              <motion.div key={i} {...fadeInUp} className="flex gap-8 group">
                <div className="hidden md:flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full border-4 border-[#008200]/20 bg-white flex items-center justify-center text-sm font-black text-[#008200] group-hover:bg-[#008200] group-hover:text-white transition-all">
                    {i + 1}
                  </div>
                  {i < pageData.programme.timeline.length - 1 && <div className="w-1 grow bg-gradient-to-b from-[#008200]/20 to-transparent mt-4" />}
                </div>
                <div className="grow mb-12">
                  <div className="text-xs font-black text-[#AAAAAA] tracking-[0.3em] mb-2">{item.day} — {item.subtitle}</div>
                  <h3 className="text-3xl font-bold text-[#0C0B20] mb-4">{item.title}</h3>
                  <p className="text-lg text-[#6B6880] mb-8 leading-relaxed max-w-3xl whitespace-pre-wrap">
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
              {pageData.masterclass.label}
            </span>
            <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">
              {pageData.masterclass.title}
            </h2>
            <p className="text-xl text-[#AAAAAA] mb-8 italic">
              {pageData.masterclass.dateInfo}
            </p>
            <p className="text-lg text-white/70 max-w-3xl mx-auto leading-relaxed whitespace-pre-wrap">
              {pageData.masterclass.description}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-1">
            {pageData.masterclass.slots.map((slot, i) => (
              <div key={i} className="p-8 border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
                <div className="text-[#008200] font-black text-xs tracking-widest mb-4">{slot.time}</div>
                <h4 className="text-lg font-bold mb-4">{slot.title}</h4>
                <p className="text-sm text-[#AAAAAA] leading-relaxed">{slot.desc}</p>
              </div>
            ))}
          </div>

          {/* Academic Partner Info */}
          <div className="mt-32 p-12 rounded-[40px] border-2 border-[#008200]/30 bg-[#008200]/5 max-w-5xl mx-auto text-center">
            <div className="text-[#008200] text-xs font-black tracking-widest mb-4">{pageData.masterclass.partner.label}</div>
            <h3 className="text-3xl font-black mb-6">{pageData.masterclass.partner.title}</h3>
            <p className="text-[#AAAAAA] text-lg leading-relaxed max-w-3xl mx-auto whitespace-pre-wrap">
              {pageData.masterclass.partner.description}
            </p>
          </div>
        </div>
      </section>

      {/* ─── Investment Section ─────────────────────────────────────────────── */}
      <section className="py-32 bg-[#F9FAFB]">
        <div className="section-container">
          <SectionTitle 
            label={pageData.investment.label}
            title={pageData.investment.title}
            subtitle={pageData.investment.subtitle}
          />

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pageData.investment.plans.map((plan, i) => (
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
            <h4 className="text-[#0C0B20] font-black text-xl mb-4">{pageData.investment.flexiblePayment.title}</h4>
            <p className="text-[#6B6880] leading-relaxed whitespace-pre-wrap">
              {pageData.investment.flexiblePayment.desc}
            </p>
            <p className="mt-4 text-xs font-bold text-[#008200] uppercase tracking-widest">
              {pageData.investment.flexiblePayment.footer}
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
                  label={pageData.whyStudyexpress.label}
                  title={pageData.whyStudyexpress.title}
                />
                <div className="space-y-6 text-lg text-[#6B6880] leading-relaxed mb-12">
                  {pageData.whyStudyexpress.description.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {pageData.whyStudyexpress.stats.map((stat, i) => (
                    <div key={i} className="p-6 rounded-3xl bg-[#008200]/5 border border-[#008200]/10 text-center">
                      <div className="text-3xl font-black text-[#008200] mb-1">{stat.value}</div>
                      <div className="text-[10px] font-bold text-[#6B6880] uppercase tracking-wider">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative">
                <div className="aspect-square rounded-[60px] bg-[#EEEEEE] overflow-hidden rotate-3 scale-95 shadow-2xl relative">
                   <Image 
                     src="/blackgirl.png" 
                     alt="African Business Leader" 
                     fill
                     className="object-cover object-top"
                     sizes="(max-width: 768px) 100vw, 50vw"
                   />
                   <div className="absolute inset-0 bg-gradient-to-br from-[#008200] to-[#0E3386] opacity-10" />
                </div>
                <div className="absolute -bottom-10 -left-10 aspect-video w-64 rounded-3xl bg-white shadow-2xl p-6 border border-[#EEEEEE] -rotate-6">
                   <div className="text-[#008200] mb-4 font-black text-xs tracking-widest uppercase">TESTIMONIAL</div>
                   <p className="text-sm font-bold text-[#0C0B20] italic">{pageData.whyStudyexpress.testimonial}</p>
                </div>
              </div>
           </div>
         </div>
      </section>

      {/* ─── FAQ Section ────────────────────────────────────────────────────── */}
      <section className="py-32 bg-[#F9FAFB]">
        <div className="section-container max-w-4xl mx-auto">
          <SectionTitle 
            label={pageData.faq.label}
            title={pageData.faq.title}
          />
          <div className="space-y-4">
            {pageData.faq.items.map((faq, i) => (
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
               <h2 className="text-3xl md:text-7xl font-black mb-8 leading-tight tracking-tighter">{pageData.cta.title}</h2>
               <p className="text-xl text-white/80 mb-12 whitespace-pre-wrap">{pageData.cta.subtitle}</p>
               <div className="flex flex-col items-center gap-6">
                 <a href={`mailto:${pageData.cta.emailLink}`} className="bg-white text-[#008200] py-6 px-16 rounded-full text-xl font-black hover:scale-105 transition-all shadow-xl text-center">
                   {pageData.cta.emailText}
                 </a>
                 <p className="text-xs font-black tracking-[0.3em] uppercase opacity-60 text-center">{pageData.cta.footer}</p>
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
