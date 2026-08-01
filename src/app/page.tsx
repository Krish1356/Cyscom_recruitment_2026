"use client";

import { HUDLayout } from "@/components/HUDLayout";
import { 
  Terminal, ShieldAlert, Code2, Globe, Cpu, Palette, Users, Hexagon,
  ChevronRight, Play, CheckSquare, ShieldCheck, Target, Network, FileText, ArrowDown, Share2, Mail
} from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { RecruitmentAction } from "@/components/RecruitmentAction";

export default function Home() {
  return (
    <HUDLayout>
      
      {/* 01: HERO SECTION */}
      <section id="home" className="min-h-[85vh] flex flex-col justify-center relative">
        <div className="absolute inset-0 pointer-events-none hidden md:flex items-center justify-center overflow-hidden z-0">
          <img 
            src="/logo.png" 
            alt="" 
            className="absolute opacity-10 w-full h-full object-cover object-center drop-shadow-[0_0_30px_rgba(0,255,255,0.2)]" 
          />
        </div>
        
        <div className="relative z-10 flex flex-col items-center text-center mt-8">
          <div className="text-xs text-cyan-600 mb-8 flex items-center justify-center gap-2 tracking-widest font-mono">
            <span className="w-2.5 h-2.5 bg-cyan-500 rounded-full animate-pulse" />
            INITIALIZING SECURE CONNECTION...
          </div>
          
          <h1 className="text-5xl md:text-[8rem] text-white tracking-widest mb-2 drop-shadow-[0_0_30px_rgba(0,255,255,0.3)] font-[family-name:var(--font-black-ops)] leading-none">
            CYSCOM
          </h1>
          <h2 className="text-xl md:text-5xl text-cyan-400 tracking-[0.2em] mb-12 font-[family-name:var(--font-black-ops)] drop-shadow-[0_0_15px_rgba(0,255,255,0.4)]">RECRUITMENTS 2026</h2>
          
          <div className="text-sm text-cyan-600 mb-4 font-mono">&gt; BUILDING THE FUTURE OF CYBERSECURITY</div>
          <p className="text-base md:text-lg text-cyan-100/70 max-w-lg mb-12 leading-relaxed font-mono">
            We don't just learn cybersecurity.<br/>
            We Exploit, We Understand, We Protect.
          </p>

          {/* Countdown Timer */}
          <div className="mb-16">
            <div className="text-xs text-cyan-800 uppercase tracking-[0.2em] mb-6 font-mono font-bold">T-MINUS UNTIL PORTAL CLOSES</div>
            <CountdownTimer />
          </div>

          <RecruitmentAction />
        </div>

        <div className="w-full mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-cyan-500/20 text-center bg-[#030710]/80 backdrop-blur-sm pb-8">
          <div className="text-center">
            <div className="text-[9px] text-cyan-700 uppercase tracking-widest mb-1">RECRUITMENT STATUS</div>
            <div className="text-sm text-green-400 font-bold tracking-wider">ACTIVE</div>
          </div>
          <div className="text-center">
            <div className="text-[9px] text-cyan-700 uppercase tracking-widest mb-1">OPEN DIVISIONS</div>
            <div className="text-sm text-cyan-200 font-bold tracking-wider">05</div>
          </div>
        </div>
      </section>

      {/* 02: MISSION BRIEFING */}
      <section id="mission" className="pt-24 pb-12">
        <Panel title="02 MISSION BRIEFING">
          <div className="flex flex-col md:flex-row gap-12 p-4 md:p-8">
            
            <div className="flex-1">
              <h3 className="text-2xl text-green-400 mb-6 tracking-widest font-[family-name:var(--font-black-ops)]">DECRYPTING TRANSMISSION...</h3>
              <div className="space-y-6 text-sm text-cyan-100/70 leading-relaxed font-mono">
                <p>Welcome, Candidate.</p>
                <p>You are attempting to join the Cyber Security Community.</p>
                <p>We do not recruit based on CGPA.<br/>We recruit curiosity.</p>
                <p>If you are ready to learn, build, break and secure systems - you are in the right place.</p>
                <p>Mission begins below.</p>
              </div>
            </div>


          </div>

          <div className="mt-8 mx-4 md:mx-8 pt-8 border-t border-cyan-500/20">
            <div className="text-xs text-cyan-600 mb-8 tracking-widest">RECRUITMENT PROTOCOL</div>
            <div className="grid grid-cols-2 md:flex justify-between items-center gap-8">
              <ProcessStep icon={Globe} label="1. RECON" desc="Discover CYSCOM" active />
              <ProcessStep icon={FileText} label="2. APPLICATION" desc="Submit Dossier" />
              <ProcessStep icon={Terminal} label="3. TECHNICAL" desc="Skill Assessment" />
              <ProcessStep icon={Users} label="4. INTERVIEW" desc="Personal Evaluation" />
              <ProcessStep icon={CheckSquare} label="5. CLEARANCE" desc="Final Selection" />
            </div>
          </div>
        </Panel>
      </section>

      {/* 03: DIVISIONS OVERVIEW */}
      <section id="divisions" className="py-12">
        <Panel title="03 DIVISIONS OVERVIEW">
          <div className="p-4 md:p-8">
            <h3 className="text-2xl text-green-400 mb-2 tracking-widest font-[family-name:var(--font-black-ops)]">OUR DIVISIONS</h3>
            <p className="text-sm text-cyan-100/50 mb-12">Choose your battlefield. Make an impact.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <DivisionCard title="TECHNICAL" icon={ShieldAlert} desc="Offensive & Defensive Security. Break systems, find vulnerabilities, secure networks." />
              <DivisionCard title="WEB DEV" icon={Code2} desc="Build scalable platforms. Secure web applications and architect digital infrastructure." />
              <DivisionCard title="DESIGN" icon={Palette} desc="Craft stunning, creative posters for events and bring the hacker aesthetic to life." />
              <DivisionCard title="EVENT MANAGEMENT" icon={Users} desc="Orchestrate mega hackathons and CTF (Capture The Flag) competitions. Logistics, sponsorships, and execution." />
              <DivisionCard title="SOCIAL MEDIA" icon={Share2} desc="Manage digital presence, craft campaigns, and engage with the global cyber community." />
            </div>
          </div>
        </Panel>
      </section>

      {/* 04: WHY JOIN CYSCOM */}
      <section id="why-join" className="py-12">
        <Panel title="04 WHY JOIN US">
          <div className="p-4 md:p-8">
            <h3 className="text-2xl text-green-400 mb-2 tracking-widest font-[family-name:var(--font-black-ops)]">WHY JOIN US ?</h3>
            <p className="text-sm text-cyan-100/50 mb-12">We organize mind blowing events and we try to do the unthinkable. See it for yourself.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Box 1 */}
              <div className="border border-cyan-500/20 bg-[#030710]/40 p-6 cyber-bracket group">
                <h4 className="text-xl font-bold text-white tracking-wider mb-2 font-[family-name:var(--font-black-ops)] group-hover:text-cyan-300 transition-colors">Biggest cybersecurity community in VIT</h4>
                <p className="text-xs text-cyan-100/60 leading-relaxed mb-6">We have the biggest cybersecurity community in VIT and we are proud of it.</p>
                <div className="aspect-video w-full bg-cyan-950/20 border border-cyan-900/50 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-[url('/community.JPG')] bg-cover bg-center opacity-80 group-hover:opacity-100 transition-opacity hover:scale-105 duration-500"></div>
                </div>
              </div>

              {/* Box 2 */}
              <div className="border border-cyan-500/20 bg-[#030710]/40 p-6 cyber-bracket group">
                <h4 className="text-xl font-bold text-white tracking-wider mb-2 font-[family-name:var(--font-black-ops)] group-hover:text-cyan-300 transition-colors">We conduct some of the biggest events in VIT Chennai</h4>
                <p className="text-xs text-cyan-100/60 leading-relaxed mb-6">And we have received a lot of love from the community and participants.</p>
                <div className="aspect-video w-full bg-cyan-950/20 border border-cyan-900/50 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-[url('/events.JPG')] bg-cover bg-center opacity-80 group-hover:opacity-100 transition-opacity hover:scale-105 duration-500"></div>
                </div>
              </div>
            </div>
          </div>
        </Panel>
      </section>

      {/* 05: CONTACT */}
      <section id="contact" className="py-12">
        <Panel title="05 SECURE COMM LINK (CONTACT)">
          <div className="p-4 md:p-8">
            <h3 className="text-2xl text-green-400 mb-2 tracking-widest font-[family-name:var(--font-black-ops)]">TRANSMISSION CHANNEL</h3>
            <p className="text-sm text-cyan-100/50 mb-12">Establish a secure connection with CYSCOM command.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
              {/* Box 1: Email */}
              <a href="mailto:cyscom@vit.ac.in" className="flex flex-col items-center justify-center p-8 border border-cyan-500/20 hover:bg-cyan-900/20 hover:border-cyan-500/50 transition-all cyber-bracket text-center group h-full">
                <Mail className="w-8 h-8 text-cyan-500 group-hover:scale-110 transition-transform mb-4" />
                <div>
                  <div className="text-[10px] text-cyan-600 tracking-widest uppercase mb-2">Email</div>
                  <div className="text-sm text-white font-mono tracking-wider">cyscom@vit.ac.in</div>
                </div>
              </a>

              {/* Box 2: Social Networks */}
              <div className="flex flex-col items-center justify-center border border-cyan-500/10 bg-[#030710]/40 p-8 text-center cyber-bracket h-full">
                 <h4 className="text-cyan-400 font-bold tracking-widest mb-6">SOCIAL NETWORKS</h4>
                 <div className="flex flex-wrap justify-center gap-6">
                   <a href="https://www.instagram.com/cyscomvit?igsh=MWRiazFuZ3RxMG84dQ==" target="_blank" rel="noopener noreferrer" className="text-xs text-cyan-600 hover:text-cyan-300 tracking-widest uppercase border-b border-transparent hover:border-cyan-300 transition-colors">Instagram</a>
                   <a href="https://www.linkedin.com/company/cyscomvit/posts/?feedView=all" target="_blank" rel="noopener noreferrer" className="text-xs text-cyan-600 hover:text-cyan-300 tracking-widest uppercase border-b border-transparent hover:border-cyan-300 transition-colors">LinkedIn</a>
                   <a href="https://github.com/cyscomvit" target="_blank" rel="noopener noreferrer" className="text-xs text-cyan-600 hover:text-cyan-300 tracking-widest uppercase border-b border-transparent hover:border-cyan-300 transition-colors">GitHub</a>
                 </div>
              </div>
            </div>
          </div>
        </Panel>
      </section>

      {/* CALL TO ACTION */}
      <section id="apply" className="py-24 text-center border-t border-cyan-500/20 mt-12">
        <h2 className="text-4xl font-bold text-white mb-4 tracking-wider font-[family-name:var(--font-black-ops)]">You scrolled till here ?</h2>
        <p className="text-cyan-400/70 mb-10">You might as well apply :)</p>
        <Link href="/register" className="inline-flex items-center justify-center border-2 border-cyan-500/50 bg-black text-white px-8 py-3 text-sm font-bold tracking-widest hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(0,255,255,0.2)] transition-all rounded-full group">
          Join Us <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-cyan-500/20 pt-16 pb-8 flex flex-col items-center justify-center text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-10 h-10 flex items-center justify-center">
            <img src="/logo.png" alt="CYSCOM Logo" className="w-full h-full object-contain drop-shadow-[0_0_10px_rgba(0,255,255,0.3)]" />
          </div>
          <span className="text-white font-bold tracking-widest text-lg font-[family-name:var(--font-black-ops)]">CYSCOM VIT</span>
        </div>
        <div className="text-[10px] text-cyan-600/80 tracking-widest">
          &copy; CYSCOM 2026. All Rights Reserved.
        </div>
      </footer>

    </HUDLayout>
  );
}

// Helper Components
function Panel({ title, children, className = "" }: { title: string, children: React.ReactNode, className?: string }) {
  return (
    <div className={`border border-cyan-500/30 bg-[#060A13]/80 backdrop-blur-md relative overflow-hidden group ${className}`}>
      <div className="absolute top-0 left-0 px-6 py-2 bg-cyan-500/10 border-b border-r border-cyan-500/30 text-base md:text-lg text-cyan-400 tracking-widest font-[family-name:var(--font-black-ops)] shadow-[0_0_15px_rgba(0,255,255,0.1)]">
        {title}
      </div>
      <div className="mt-14 h-full">
        {children}
      </div>
    </div>
  );
}

function ProcessStep({ icon: Icon, label, desc, active }: { icon: any, label: string, desc: string, active?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <div className={`w-12 h-12 rounded flex items-center justify-center border transition-all duration-500 ${active ? 'border-green-400 bg-green-400/10 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.3)] scale-110' : 'border-cyan-700 bg-cyan-900/10 text-cyan-700 opacity-70'}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <div className={`text-sm uppercase tracking-widest font-bold mb-1 font-[family-name:var(--font-black-ops)] ${active ? 'text-green-400' : 'text-cyan-600'}`}>{label}</div>
        <div className="text-[9px] text-cyan-800 uppercase tracking-widest">{desc}</div>
      </div>
    </div>
  );
}

function DivisionCard({ title, icon: Icon, desc }: { title: string, icon: any, desc: string }) {
  return (
    <div className="group relative border border-cyan-500/20 p-8 bg-[#030710]/40 backdrop-blur-sm flex flex-col justify-between hover:bg-cyan-950/20 transition-all duration-300 overflow-hidden">
      {/* Subtle hover gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 via-cyan-500/0 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10 flex items-center justify-between mb-8">
        <div className="w-12 h-12 rounded bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(0,255,255,0.2)] transition-all duration-300">
          <Icon className="w-5 h-5" />
        </div>
        <div className="text-[9px] text-cyan-600 uppercase tracking-widest border border-cyan-800/50 px-2 py-1 bg-cyan-950/20">Active</div>
      </div>
      
      <div className="relative z-10">
        <h4 className="text-lg font-bold text-white tracking-wider mb-2 group-hover:text-cyan-300 transition-colors">{title}</h4>
        <p className="text-xs text-cyan-100/60 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function EventCard({ status, title, desc, date, link, color, active }: { status: string, title: string, desc: string, date: string, link: string, color: string, active?: boolean }) {
  return (
    <div className={`border p-6 flex flex-col bg-black/40 ${color} ${active ? 'shadow-[0_0_20px_rgba(59,130,246,0.15)] border-opacity-100 bg-blue-900/10 cyber-bracket' : 'border-opacity-30'}`}>
      <div className="text-[10px] uppercase tracking-widest mb-6 opacity-80">{status}</div>
      <h4 className="text-lg font-bold tracking-widest mb-3">{title}</h4>
      <p className="text-xs opacity-70 mb-8 leading-relaxed">{desc}</p>
      
      <div className="mt-auto pt-4 border-t border-current border-opacity-20 flex justify-between items-center">
        <span className="text-[10px] opacity-60 tracking-widest">{date}</span>
        <a href={link} className="text-[10px] font-bold tracking-widest hover:underline flex items-center gap-1">
          VIEW <ChevronRight className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}

function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const targetDate = new Date("August 17, 2026 23:59:00").getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) return <div className="h-32"></div>; // Placeholder to avoid hydration mismatch

  return (
    <div className="flex justify-center items-start gap-4 md:gap-8 text-center font-[family-name:var(--font-black-ops)]">
        <div className="flex flex-col items-center">
          <div className="text-4xl sm:text-5xl md:text-8xl font-bold text-white mb-2 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">{timeLeft.days.toString().padStart(2, '0')}</div>
          <div className="text-[8px] md:text-xs text-cyan-500 uppercase tracking-wider md:tracking-[0.2em] font-black font-sans">Days</div>
        </div>
        <div className="text-4xl sm:text-5xl md:text-8xl font-bold text-cyan-700/80 -mt-2 drop-shadow-[0_0_10px_rgba(0,255,255,0.3)]">:</div>
        <div className="flex flex-col items-center">
          <div className="text-4xl sm:text-5xl md:text-8xl font-bold text-white mb-2 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">{timeLeft.hours.toString().padStart(2, '0')}</div>
          <div className="text-[8px] md:text-xs text-cyan-500 uppercase tracking-wider md:tracking-[0.2em] font-black font-sans">Hours</div>
        </div>
        <div className="text-4xl sm:text-5xl md:text-8xl font-bold text-cyan-700/80 -mt-2 drop-shadow-[0_0_10px_rgba(0,255,255,0.3)]">:</div>
        <div className="flex flex-col items-center">
          <div className="text-4xl sm:text-5xl md:text-8xl font-bold text-white mb-2 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">{timeLeft.minutes.toString().padStart(2, '0')}</div>
          <div className="text-[8px] md:text-xs text-cyan-500 uppercase tracking-wider md:tracking-[0.2em] font-black font-sans">Minutes</div>
        </div>
        <div className="text-4xl sm:text-5xl md:text-8xl font-bold text-cyan-700/80 -mt-2 drop-shadow-[0_0_10px_rgba(0,255,255,0.3)]">:</div>
        <div className="flex flex-col items-center">
          <div className="text-4xl sm:text-5xl md:text-8xl font-bold text-cyan-400 mb-2 drop-shadow-[0_0_20px_rgba(0,255,255,0.4)]">{timeLeft.seconds.toString().padStart(2, '0')}</div>
          <div className="text-xs text-cyan-500 uppercase tracking-[0.2em] font-black font-sans">Seconds</div>
        </div>
      </div>
  );
}
