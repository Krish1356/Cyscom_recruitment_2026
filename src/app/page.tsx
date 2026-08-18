"use client";

import { MainLayout } from "@/components/MainLayout";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment } from "@react-three/drei";
import { useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { Code2, Palette, ShieldAlert, Cpu, TerminalSquare, Network, Search, Crosshair, Users, CheckCircle2, ChevronRight, Clock, Share2, ArrowRight, Mail, MessageSquare } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import DepartmentLab from "@/components/departments/DepartmentLab";
import { TerminalPreloader } from "@/components/ui/TerminalPreloader";
import { TypewriterText } from "@/components/ui/TypewriterText";
import { CyberTopology } from "@/components/canvas/CyberTopology";

// 3D Objects for Divisions
function FloatingShape({ type, color }: { type: string, color: string }) {
  const mesh = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.x = state.clock.elapsedTime * 0.2;
      mesh.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={1}>
      <mesh ref={mesh} position={[0, 0, 0]} castShadow receiveShadow>
        {type === 'dodecahedron' && <dodecahedronGeometry args={[1.5]} />}
        {type === 'torus' && <torusKnotGeometry args={[1, 0.3, 100, 16]} />}
        {type === 'icosahedron' && <icosahedronGeometry args={[1.5, 0]} />}
        {type === 'box' && <boxGeometry args={[1.8, 1.8, 1.8]} />}
        {type === 'sphere' && <sphereGeometry args={[1.5, 32, 32]} />}
        
        <meshStandardMaterial 
          color={color} 
          roughness={0.2} 
          metalness={0.1}
          envMapIntensity={2}
          emissive={color}
          emissiveIntensity={0.1}
        />
      </mesh>
    </Float>
  );
}

function Division3DCard({ title, desc, type, color, icon: Icon, image }: { title: string, desc: string, type: string, color: string, icon: any, image?: string }) {
  return (
    <div className="group relative bg-[#10151A] border border-white/5 hover:border-[#67E8F9]/30 rounded-sm p-8 transition-all duration-500 overflow-hidden flex flex-col h-[400px]">
      <div className="absolute inset-0 h-[220px] w-full pointer-events-none flex items-center justify-center p-8">
        {image ? (
          <motion.img 
            src={image} 
            alt={`${title} visual`} 
            className="w-full h-full object-contain opacity-80 group-hover:opacity-100 transition-opacity drop-shadow-[0_0_15px_rgba(103,232,249,0.3)] group-hover:drop-shadow-[0_0_25px_rgba(103,232,249,0.6)]"
            animate={{ y: [-5, 5, -5] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          />
        ) : (
          <Canvas camera={{ position: [0, 0, 6], fov: 45 }} dpr={[1, 2]}>
            <ambientLight intensity={0.2} />
            <directionalLight position={[10, 10, 5]} intensity={1} color={color} />
            <FloatingShape type={type} color={color} />
          </Canvas>
        )}
      </div>
      
      <div className="mt-auto relative z-10 pt-4 bg-gradient-to-t from-[#10151A] via-[#10151A]/90 to-transparent">
        <div className="w-12 h-12 rounded-sm bg-[#050608] flex items-center justify-center text-[#F1F0EA] mb-6 border border-white/5 group-hover:border-[#67E8F9]/50 group-hover:text-[#67E8F9] transition-colors shadow-sm">
          {typeof Icon === 'string' ? (
            <img src={Icon} alt={`${title} icon`} className="w-8 h-8 object-contain" />
          ) : (
            <Icon className="w-5 h-5" />
          )}
        </div>
        <h4 className="text-xl font-bold text-[#F1F0EA] tracking-tight mb-3 font-mono uppercase">{title}</h4>
        <p className="text-sm text-[#A4A8AE] leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

// HUD Panel Component
function HUDPanel({ title, children, className }: { title: string, children: React.ReactNode, className?: string }) {
  return (
    <div className={`border border-white/5 bg-[#10151A]/40 backdrop-blur-md p-4 rounded-sm ${className}`}>
      <div className="text-[10px] font-mono tracking-widest text-[#626A72] uppercase mb-3 pb-2 border-b border-white/5">
        {title}
      </div>
      <div className="font-mono text-xs text-[#A4A8AE] space-y-2">
        {children}
      </div>
    </div>
  );
}

import { getSession, signOut } from "next-auth/react";
import { getRegistrationCount } from "@/app/actions/stats";

export default function Home() {
  const [showPreloader, setShowPreloader] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [session, setSession] = useState<any>(null);
  const [regCount, setRegCount] = useState<number>(0);

  useEffect(() => {
    const hasVisited = sessionStorage.getItem("cyscom_visited");
    if (!hasVisited) {
      setShowPreloader(true);
      sessionStorage.setItem("cyscom_visited", "true");
    }
    
    // Fetch session and stats on client side
    Promise.all([
      getSession(),
      getRegistrationCount()
    ]).then(([sess, count]) => {
      setSession(sess);
      setRegCount(count);
      setIsFirstLoad(false);
    });
  }, []);

  if (isFirstLoad) {
    return <main className="min-h-screen bg-[#050608]" />;
  }

  return (
    <main className="min-h-screen bg-[#050608] relative selection:bg-[#67E8F9] selection:text-[#050608]">
      {/* 1. BOOT / TERMINAL PRELOADER */}
      {showPreloader && (
        <TerminalPreloader onComplete={() => setShowPreloader(false)} />
      )}

      {/* GLOBAL CYBER TOPOLOGY BACKGROUND - Outside motion.div to preserve 'fixed' behavior */}
      <div 
        className="fixed inset-0 z-[0] pointer-events-none transition-opacity duration-1000"
        style={{ opacity: showPreloader ? 0 : 1 }}
      >
        {/* Layer 1: Base Atmosphere */}
        <div className="absolute inset-0 bg-[#050608]" />
        
        {/* Layer 2: Live 3D Cyber Topology */}
        <div className="absolute inset-0">
          <Canvas camera={{ position: [0, 0, 15], fov: 45 }} dpr={[1, 1.5]}>
            <CyberTopology />
          </Canvas>
        </div>
        
        {/* Layer 2.5: Subtle Center Light/Vignette with Blue-Violet atmosphere */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.04)_0%,rgba(5,6,8,0.8)_60%,rgba(5,6,8,1)_100%)] mix-blend-multiply" />
      </div>

      {/* 2. MAIN CYSCOM WORLD (revealed after transition) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
        animate={{ 
          opacity: showPreloader ? 0 : 1, 
          scale: showPreloader ? 0.95 : 1,
          filter: showPreloader ? "blur(10px)" : "blur(0px)" 
        }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="relative z-10 bg-transparent min-h-screen text-[#F1F0EA]"
        style={{ pointerEvents: showPreloader ? 'none' : 'auto' }}
      >

        <MainLayout session={session}>
        {/* HERO */}
        <section id="home" className="pt-20 pb-24 px-6 relative overflow-hidden min-h-screen flex items-center justify-center">
          
          {/* Background is now global */}

          {/* HUD Elements Overlay */}
          <div className="absolute top-32 left-6 hidden xl:block z-10">
            <HUDPanel title="SYSTEM STATUS">
              <div className="flex justify-between gap-8"><span>NODE</span> <span className="text-[#A4A8AE]">VIT_CHENNAI</span></div>
              <div className="flex justify-between gap-8"><span>ACTIVE DEPTS</span> <span className="text-[#00D9FF]">6</span></div>
              <div className="flex justify-between gap-8"><span>REGISTRATIONS</span> <span className="text-[#67E8F9]">{regCount}</span></div>
            </HUDPanel>
          </div>

          <div className="absolute bottom-12 right-6 hidden xl:block z-10">
            <HUDPanel title="RECRUITMENT">
              <div className="flex justify-between gap-8"><span>STATUS</span> <span className="text-[#67E8F9]">OPEN</span></div>
              <div className="flex justify-between gap-8"><span>PHASE</span> <span className="text-[#A4A8AE]">01_REGISTRATION</span></div>
            </HUDPanel>
          </div>

          {/* Layer 3: Foreground Typography */}
          <div className="container mx-auto text-center max-w-4xl relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2, duration: 0.8 }}
            >
              <h1 className="text-6xl md:text-[8rem] font-bold tracking-tighter mb-6 leading-[0.9] uppercase font-orbitron inline-flex flex-col items-start text-left">
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  transition={{ delay: 2.2 }}
                  className="text-[#F1F0EA] opacity-90"
                >BUILD.</motion.div>
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  transition={{ delay: 2.5 }}
                  className="text-[#F1F0EA] opacity-90"
                >BREAK.</motion.div>
                <motion.div 
                  initial={{ opacity: 0, filter: "blur(10px)" }} 
                  animate={{ opacity: 1, filter: "blur(0px)" }} 
                  transition={{ delay: 3, duration: 0.8 }}
                  className="inline-block"
                >
                  <TypewriterText />
                </motion.div>
              </h1>
              <h2 className="text-xl md:text-2xl text-[#A4A8AE] mb-8 font-mono tracking-widest uppercase">
                CYSCOM — Cyber Security Community, VIT Chennai
              </h2>
              
              <div className="mb-12">
                <CountdownTimer />
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 3.5, duration: 0.8 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6"
            >
              <Link 
                href="/register" 
                className="group w-full sm:w-auto flex items-center justify-center px-10 py-5 bg-[#10151A] text-[#F1F0EA] border border-[#67E8F9]/30 rounded-sm font-bold tracking-widest hover:border-[#67E8F9] hover:bg-[#10151A]/80 transition-all shadow-[0_0_0px_rgba(103,232,249,0)] hover:shadow-[0_0_15px_rgba(103,232,249,0.15)] uppercase"
              >
                BEGIN INFILTRATION PROTOCOL <ArrowRight className="ml-2 w-5 h-5 text-[#626A72] group-hover:text-[#67E8F9] group-hover:translate-x-1 transition-all" />
              </Link>
              
              {session && (
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="w-full sm:w-auto px-6 py-5 border border-[#ef4444]/20 text-[#ef4444]/70 hover:bg-[#ef4444]/10 hover:border-[#ef4444]/50 hover:text-[#ef4444] rounded-sm font-mono text-xs uppercase tracking-widest transition-all"
                >
                  ABORT / LOGOUT
                </button>
              )}
            </motion.div>
          </div>
        </section>

        {/* Recruitment Process Timeline */}
        <section className="py-24 bg-black/20 backdrop-blur-[2px] px-6 border-t border-white/5 relative z-10">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-base md:text-lg font-mono tracking-[0.2em] text-[#A4A8AE] mb-4">01 PROCESS</h2>
            <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-[#F1F0EA] mb-16 font-orbitron uppercase">Application Process</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-20 relative">
              <div className="hidden md:block absolute top-6 left-0 right-0 h-px bg-white/5 -z-10" />
              
              <ProcessStep icon={Search} label="Stage 01" desc="Dossier Submission" active />
              <ProcessStep icon={Crosshair} label="Stage 02" desc="Assessment & Verification" />
              <ProcessStep icon={Users} label="Stage 03" desc="Clearance Interview" />
              <ProcessStep icon={CheckCircle2} label="Stage 04" desc="Access Granted" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <EventCard 
                status="ACTIVE" 
                title="Assessments" 
                desc="Complete the technical assessments and department-specific challenges." 
                date="August 16 - August 27, 2026" 
                active 
              />
              <EventCard 
                status="PENDING" 
                title="Portal Closes" 
                desc="The deadline to submit all challenges and finalize your application." 
                date="August 27, 2026 • 23:59" 
              />
            </div>
          </div>
        </section>

        {/* DEPARTMENTS - DIGITAL LAB */}
        <DepartmentLab />

        {/* WHY JOIN */}
        <section id="why-join" className="py-32 bg-black/20 backdrop-blur-[2px] border-t border-white/5 relative z-10">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row gap-16 items-center">
              <div className="flex-1 space-y-8">
                <h2 className="text-base md:text-lg font-mono tracking-[0.2em] text-[#A4A8AE] mb-4">03 THE COMMUNITY</h2>
                <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-[#F1F0EA]">Why join CYSCOM?</h3>
                <p className="text-lg text-[#A4A8AE] leading-relaxed">
                  We are the largest cybersecurity community at VIT Chennai. We organize mind-blowing events, intense Capture The Flag (CTF) competitions, and hands-on workshops that bridge the gap between theory and real-world application.
                </p>
                <ul className="space-y-4 text-[#F1F0EA] font-medium font-mono text-sm">
                  <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-[#00D9FF]" /> HANDS-ON TECHNICAL EXPERIENCE</li>
                  <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-[#00D9FF]" /> MASSIVE NETWORKING OPPORTUNITIES</li>
                  <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-[#00D9FF]" /> REAL-WORLD PROJECT BUILDING</li>
                  <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-[#00D9FF]" /> MENTORSHIP FROM ALUMNI</li>
                </ul>
              </div>
              <div className="flex-1 w-full">
                <div className="aspect-square bg-[#10151A] border border-white/5 p-2 rounded-sm overflow-hidden relative">
                  <div className="absolute inset-0 bg-[#67E8F9] mix-blend-overlay opacity-5 z-10" />
                  <img src="/community.JPG" alt="CYSCOM Community" className="w-full h-full object-cover grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-700 rounded-sm" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 07: CONTACT / COMMS */}
        <section id="contact" className="py-24 bg-black/20 backdrop-blur-[2px] border-t border-white/5 relative z-10">
          <div className="container mx-auto px-6 max-w-5xl">
            <div className="text-center mb-16">
              <h2 className="text-base md:text-lg font-mono tracking-[0.2em] text-[#A4A8AE] mb-4">04 COMMS LINK</h2>
              <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-[#F1F0EA]">Establish Secure Connection</h3>
              <p className="text-[#626A72] mt-4 max-w-2xl mx-auto">Ping the CYSCOM command center. We monitor these channels actively.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Email Comm */}
              <a href="mailto:cyscom@vit.ac.in" className="group p-8 flex flex-col items-center justify-center bg-[#050608] border border-white/5 hover:border-[#67E8F9]/30 hover:bg-[#67E8F9]/5 rounded-sm transition-all text-center">
                <div className="w-12 h-12 bg-[#10151A] rounded-sm flex items-center justify-center border border-white/5 group-hover:border-[#67E8F9]/30 group-hover:text-[#67E8F9] text-[#626A72] transition-colors mb-6">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="text-[10px] font-mono tracking-widest text-[#A4A8AE] uppercase mb-2">Direct Mail Protocol</div>
                <div className="text-lg font-bold text-[#F1F0EA] tracking-wider group-hover:text-[#67E8F9] transition-colors">cyscom@vit.ac.in</div>
              </a>

              {/* Social Comm */}
              <div className="p-8 flex flex-col items-center justify-center bg-[#050608] border border-white/5 rounded-sm text-center">
                <div className="text-[10px] font-mono tracking-widest text-[#A4A8AE] uppercase mb-8">Social Networks</div>
                <div className="flex flex-wrap justify-center gap-8">
                  <a href="https://www.instagram.com/cyscomvit?igsh=MWRiazFuZ3RxMG84dQ==" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-3 text-[#626A72] hover:text-[#67E8F9] transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                    <span className="text-[10px] uppercase tracking-widest font-mono">Instagram</span>
                  </a>
                  <a href="https://www.linkedin.com/company/cyscomvit/posts/?feedView=all" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-3 text-[#626A72] hover:text-[#67E8F9] transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                    <span className="text-[10px] uppercase tracking-widest font-mono">LinkedIn</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-32 bg-black/20 backdrop-blur-[2px] border-t border-white/5 text-center px-6 relative z-10">
          <h2 className="text-base md:text-lg font-mono tracking-[0.2em] text-[#626A72] mb-4">05 JOIN</h2>
          <h3 className="text-4xl md:text-5xl font-bold tracking-tight text-[#F1F0EA] mb-10">Ready to secure the future?</h3>
          <Link href="/register" className="inline-flex items-center justify-center px-10 py-5 bg-transparent text-[#A4A8AE] border border-white/10 rounded-sm font-bold text-lg tracking-widest hover:border-[#67E8F9]/50 hover:text-[#67E8F9] transition-all uppercase">
            Apply to CYSCOM 2026
          </Link>
        </section>

      </MainLayout>
      </motion.div>
    </main>
  );
}

// Helper Components
function ProcessStep({ icon: Icon, label, desc, active }: { icon: any, label: string, desc: string, active?: boolean }) {
  return (
    <div className={`flex flex-col items-center gap-3 text-center p-6 rounded-sm border shadow-sm relative z-10 ${active ? 'bg-[#10151A] border-white/10' : 'bg-[#050608] border-white/5'}`}>
      <div className={`w-12 h-12 rounded-sm flex items-center justify-center border transition-all duration-500 ${active ? 'border-[#00D9FF]/50 bg-[#00D9FF]/5 text-[#00D9FF] shadow-[0_0_15px_rgba(0,217,255,0.1)] scale-110' : 'border-white/5 bg-[#10151A] text-[#626A72]'}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="mt-2">
        <div className={`text-xs uppercase tracking-widest font-bold mb-1 font-mono ${active ? 'text-[#F1F0EA]' : 'text-[#626A72]'}`}>{label}</div>
        <div className="text-sm text-[#626A72]">{desc}</div>
      </div>
    </div>
  );
}

function EventCard({ status, title, desc, date, active }: { status: string, title: string, desc: string, date: string, active?: boolean }) {
  return (
    <div className={`p-6 flex flex-col rounded-sm border transition-colors ${active ? 'bg-[#00D9FF]/5 border-[#00D9FF]/20 shadow-[0_0_20px_rgba(0,217,255,0.05)]' : 'bg-[#10151A] border-white/5'}`}>
      <div className={`text-[10px] font-mono uppercase tracking-widest mb-6 ${active ? 'text-[#00D9FF]' : 'text-[#626A72]'}`}>{status}</div>
      <h4 className="text-lg font-bold tracking-tight text-[#F1F0EA] mb-3">{title}</h4>
      <p className="text-sm text-[#A4A8AE] mb-8 leading-relaxed flex-1">{desc}</p>
      
      <div className="mt-auto pt-4 border-t border-white/5 flex justify-between items-center">
        <span className="text-xs text-[#626A72] font-mono flex items-center gap-2">
          <Clock className="w-3 h-3" /> {date}
        </span>
      </div>
    </div>
  );
}

function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const targetDate = new Date("August 27, 2026 23:59:00 GMT+0530").getTime();

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

  if (!mounted) return <div className="h-24"></div>;

  return (
    <div className="flex justify-center items-start gap-4 md:gap-8 text-center font-mono">
      <div className="flex flex-col items-center">
        <div className="text-3xl md:text-5xl font-orbitron font-black tracking-wider text-[#F1F0EA] mb-2">{timeLeft.days.toString().padStart(2, '0')}</div>
        <div className="text-[10px] text-[#A4A8AE] uppercase tracking-widest">Days</div>
      </div>
      <div className="text-3xl md:text-5xl font-orbitron font-bold text-[#626A72] -mt-1">:</div>
      <div className="flex flex-col items-center">
        <div className="text-3xl md:text-5xl font-orbitron font-black tracking-wider text-[#F1F0EA] mb-2">{timeLeft.hours.toString().padStart(2, '0')}</div>
        <div className="text-[10px] text-[#A4A8AE] uppercase tracking-widest">Hours</div>
      </div>
      <div className="text-3xl md:text-5xl font-orbitron font-bold text-[#626A72] -mt-1">:</div>
      <div className="flex flex-col items-center">
        <div className="text-3xl md:text-5xl font-orbitron font-black tracking-wider text-[#F1F0EA] mb-2">{timeLeft.minutes.toString().padStart(2, '0')}</div>
        <div className="text-[10px] text-[#A4A8AE] uppercase tracking-widest">Mins</div>
      </div>
      <div className="text-3xl md:text-5xl font-orbitron font-bold text-[#626A72] -mt-1">:</div>
      <div className="flex flex-col items-center">
        <div className="text-3xl md:text-5xl font-orbitron font-black tracking-wider text-[#67E8F9] mb-2">{timeLeft.seconds.toString().padStart(2, '0')}</div>
        <div className="text-[10px] text-[#67E8F9] uppercase tracking-widest">Secs</div>
      </div>
    </div>
  );
}
