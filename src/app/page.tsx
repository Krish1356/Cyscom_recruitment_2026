"use client";

import { CyberMatrixBackground } from "@/components/CyberMatrixBackground";
import { motion, useScroll, useTransform } from "framer-motion";
import { 
  ChevronRight, 
  ShieldAlert, 
  Code2, 
  Palette, 
  Megaphone, 
  PenTool, 
  CalendarDays,
  Target,
  Trophy,
  Users,
  Briefcase,
  Zap,
  Globe
} from "lucide-react";
import Link from "next/link";
import { Orbitron } from "next/font/google";
import { useEffect, useState } from "react";

const orbitron = Orbitron({ subsets: ["latin"], weight: ["400", "700", "900"] });

export default function LandingPage() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  return (
    <main className="relative min-h-screen bg-[#0D1117] text-white selection:bg-cyan-500/30 overflow-x-hidden">
      {/* Background layer */}
      <div className="fixed inset-0 z-0">
        <CyberMatrixBackground />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0D1117]/80 to-[#0D1117]" />
      </div>

      <div className="relative z-10 flex flex-col">
        {/* Navigation */}
        <nav className="flex items-center justify-between p-6 max-w-7xl w-full mx-auto backdrop-blur-sm border-b border-white/5 sticky top-0 z-50">
          <div className={`text-2xl font-black tracking-wider text-cyan-400 ${orbitron.className}`}>
            CYSCOM
          </div>
          <div className="flex gap-4">
            <Link href="/login" className="px-6 py-2 rounded-full text-sm font-medium text-cyan-300 hover:text-cyan-100 transition-colors">
              Login
            </Link>
            <Link href="/dashboard" className="px-6 py-2 rounded-full bg-cyan-600/20 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500 hover:text-white transition-all shadow-[0_0_15px_rgba(0,255,255,0.2)]">
              Dashboard
            </Link>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="min-h-[85vh] flex flex-col items-center justify-center text-center px-4 pt-20 pb-32">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center gap-8 max-w-5xl"
          >
            <div className="inline-block px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-sm font-medium mb-4 backdrop-blur-md">
              <span className="animate-pulse mr-2">●</span> Build. Secure. Innovate.
            </div>

            <h1 className={`text-6xl md:text-8xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-cyan-100 to-cyan-800 drop-shadow-2xl leading-tight ${orbitron.className}`}>
              CYSCOM<br />Recruitment 2026
            </h1>

            <p className="text-lg md:text-xl text-gray-400 max-w-2xl font-light leading-relaxed">
              Join the elite cybersecurity and technology community at VIT Chennai. We are looking for passionate builders, hackers, and creators to shape the future of tech.
            </p>

            <CountdownTimer />

            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Link href="/register">
                <button className="group relative px-8 py-4 bg-cyan-500 text-[#0D1117] font-bold rounded-lg overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(0,255,255,0.4)]">
                  <span className="relative z-10 flex items-center gap-2">
                    Apply Now <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </Link>
              <a href="#departments">
                <button className="px-8 py-4 bg-[#161B22] border border-gray-700 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors">
                  Explore Departments
                </button>
              </a>
            </div>
          </motion.div>
        </section>

        {/* Statistics Section */}
        <section className="py-20 border-y border-white/5 bg-[#0D1117]/50 backdrop-blur-lg">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatCard icon={Users} value="500+" label="Active Members" />
            <StatCard icon={CalendarDays} value="50+" label="Events Conducted" />
            <StatCard icon={Target} value="20+" label="CTF Competitions" />
            <StatCard icon={Briefcase} value="10+" label="Industry Partners" />
          </div>
        </section>

        {/* Departments Section */}
        <section id="departments" className="py-32 px-4 max-w-7xl mx-auto w-full">
          <div className="text-center mb-20">
            <h2 className={`text-4xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 ${orbitron.className}`}>Our Departments</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Choose your domain of expertise and grow with like-minded peers.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <DeptCard 
              icon={ShieldAlert} title="Technical" 
              desc="Master ethical hacking, penetration testing, cryptography, and secure architecture."
              color="from-red-500/20 to-orange-500/20" border="border-red-500/30" iconColor="text-red-400"
            />
            <DeptCard 
              icon={Code2} title="Development" 
              desc="Build scalable platforms, web applications, and robust internal tools for the community."
              color="from-blue-500/20 to-cyan-500/20" border="border-blue-500/30" iconColor="text-blue-400"
            />
            <DeptCard 
              icon={Palette} title="Design" 
              desc="Craft stunning UI/UX, immersive graphics, and striking visual identities."
              color="from-purple-500/20 to-pink-500/20" border="border-purple-500/30" iconColor="text-purple-400"
            />
            <DeptCard 
              icon={Megaphone} title="Social Media" 
              desc="Strategize campaigns, grow our digital footprint, and engage with the global community."
              color="from-green-500/20 to-emerald-500/20" border="border-green-500/30" iconColor="text-green-400"
            />
            <DeptCard 
              icon={PenTool} title="Content" 
              desc="Write compelling narratives, deep-dive technical blogs, and engaging newsletters."
              color="from-yellow-500/20 to-amber-500/20" border="border-yellow-500/30" iconColor="text-yellow-400"
            />
            <DeptCard 
              icon={Users} title="Event Management" 
              desc="Orchestrate mega-hackathons, workshops, and manage logistics flawlessly."
              color="from-indigo-500/20 to-blue-500/20" border="border-indigo-500/30" iconColor="text-indigo-400"
            />
          </div>
        </section>

        {/* Why Join Section */}
        <section className="py-32 px-4 bg-[#161B22]/50 border-t border-white/5 relative overflow-hidden">
          {/* Subtle glowing orb in background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />
          
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-20">
              <h2 className={`text-4xl md:text-5xl font-bold mb-4 text-white ${orbitron.className}`}>Why Join CYSCOM?</h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <FeatureCard icon={Trophy} title="Hackathons & CTFs" />
              <FeatureCard icon={Zap} title="Hands-on Projects" />
              <FeatureCard icon={Globe} title="Industry Exposure" />
              <FeatureCard icon={Users} title="Networking" />
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="py-32 px-4 max-w-4xl mx-auto w-full">
          <div className="text-center mb-20">
            <h2 className={`text-4xl md:text-5xl font-bold mb-4 text-white ${orbitron.className}`}>Recruitment Timeline</h2>
          </div>

          <div className="relative border-l-2 border-cyan-500/30 ml-4 md:ml-10 space-y-12">
            <TimelineItem title="Applications Open" date="Now" active />
            <TimelineItem title="Applications Close" date="TBD" />
            <TimelineItem title="Shortlisting & Online Assessment" date="TBD" />
            <TimelineItem title="Personal Interviews" date="TBD" />
            <TimelineItem title="Final Results" date="TBD" />
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 text-center text-gray-500 border-t border-white/5 text-sm">
          <p>© 2026 CYSCOM VIT Chennai. All rights reserved.</p>
        </footer>
      </div>
    </main>
  );
}

function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

  useEffect(() => {
    // Mock countdown to 7 days from now for visual purposes
    const target = new Date().getTime() + 7 * 24 * 60 * 60 * 1000;
    
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = target - now;
      
      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        mins: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        secs: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex gap-4 sm:gap-8 mt-6">
      <TimeUnit value={timeLeft.days} label="DAYS" />
      <TimeUnit value={timeLeft.hours} label="HOURS" />
      <TimeUnit value={timeLeft.mins} label="MINS" />
      <TimeUnit value={timeLeft.secs} label="SECS" />
    </div>
  );
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="text-3xl md:text-5xl font-bold font-mono text-cyan-400 drop-shadow-[0_0_10px_rgba(0,255,255,0.3)]">
        {value.toString().padStart(2, '0')}
      </div>
      <div className="text-xs md:text-sm text-gray-500 font-semibold tracking-widest mt-2">{label}</div>
    </div>
  );
}

function StatCard({ icon: Icon, value, label }: { icon: any; value: string; label: string }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="flex flex-col items-center text-center p-6 rounded-2xl bg-white/5 border border-white/10"
    >
      <Icon className="w-8 h-8 text-cyan-400 mb-4" />
      <div className="text-4xl font-bold text-white mb-2">{value}</div>
      <div className="text-sm text-gray-400 font-medium">{label}</div>
    </motion.div>
  );
}

function DeptCard({ icon: Icon, title, desc, color, border, iconColor }: { icon: any; title: string; desc: string; color: string; border: string; iconColor: string }) {
  return (
    <motion.div 
      whileHover={{ y: -10, scale: 1.02 }}
      className={`relative overflow-hidden p-8 rounded-2xl bg-[#161B22] border ${border} group`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
      <Icon className={`w-12 h-12 ${iconColor} mb-6 drop-shadow-[0_0_15px_currentColor]`} />
      <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>
      <p className="text-gray-400 leading-relaxed">{desc}</p>
    </motion.div>
  );
}

function FeatureCard({ icon: Icon, title }: { icon: any; title: string }) {
  return (
    <div className="flex flex-col items-center p-6 bg-[#0D1117] border border-white/5 rounded-xl hover:border-cyan-500/30 hover:bg-cyan-500/5 transition-colors cursor-default">
      <Icon className="w-8 h-8 text-cyan-500 mb-4" />
      <h4 className="font-semibold text-gray-200 text-center">{title}</h4>
    </div>
  );
}

function TimelineItem({ title, date, active = false }: { title: string; date: string; active?: boolean }) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      className="relative pl-8 md:pl-12"
    >
      {/* Node */}
      <div className={`absolute left-0 top-1.5 w-4 h-4 -translate-x-[9px] rounded-full border-2 ${active ? 'bg-cyan-400 border-cyan-400 shadow-[0_0_15px_rgba(0,255,255,0.6)]' : 'bg-[#0D1117] border-gray-600'}`} />
      
      <h3 className={`text-xl font-bold ${active ? 'text-cyan-400' : 'text-gray-300'}`}>{title}</h3>
      <p className="text-gray-500 mt-2 font-mono text-sm">{date}</p>
    </motion.div>
  );
}
