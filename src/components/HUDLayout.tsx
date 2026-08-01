"use client";

import { motion } from "framer-motion";
import { 
  Home, 
  Flame, 
  Briefcase, 
  HeartHandshake, 
  MessageSquare,
  Lock
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

const NAV_ITEMS = [
  { name: "HOME", icon: Home, href: "#home" },
  { name: "MISSION", icon: Flame, href: "#mission" },
  { name: "DIVISIONS", icon: Briefcase, href: "#divisions" },
  { name: "WHY JOIN", icon: HeartHandshake, href: "#why-join" },
  { name: "CONTACT", icon: MessageSquare, href: "#contact" },
];

export function HUDLayout({ children }: { children: React.ReactNode }) {
  const [activeHash, setActiveHash] = useState("#home");
  const [time, setTime] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setTime(now.toISOString().split("T")[1].split(".")[0]); // e.g. 14:32:05
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveHash(`#${entry.target.id}`);
          }
        });
      },
      { rootMargin: "-30% 0px -70% 0px" }
    );

    NAV_ITEMS.forEach((item) => {
      const element = document.querySelector(item.href);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#050B14] text-cyan-500 font-mono">
      
      {/* Sidebar - Hidden on mobile, sticky on desktop */}
      <aside className="hidden md:flex w-64 h-screen sticky top-0 border-r border-cyan-500/20 flex-col z-20 bg-[#02050A]">
        
        {/* Logo Section */}
        <div className="p-6 flex flex-col items-center justify-center border-b border-cyan-500/20">
          <div className="w-20 h-20 mb-4 flex items-center justify-center">
            <img src="/logo.png" alt="CYSCOM Logo" className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(0,255,255,0.3)]" />
          </div>
          <h1 className="font-bold tracking-[0.15em] text-2xl text-white font-[family-name:var(--font-black-ops)]">CYSCOM</h1>
          <p className="text-[8px] text-cyan-600 uppercase tracking-widest mt-1 text-center">Cyber Security Student Community Of VIT Chennai</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto custom-scrollbar">
          <div className="text-[10px] text-cyan-800 uppercase tracking-widest mb-4 px-2 font-[family-name:var(--font-black-ops)]">NAVIGATION</div>
          {NAV_ITEMS.map((item) => (
            <Link 
              key={item.name} 
              href={item.href}
              onClick={() => setActiveHash(item.href)}
              className={`flex items-center gap-4 px-4 py-3 rounded text-xs tracking-widest uppercase transition-all ${
                activeHash === item.href 
                  ? "bg-cyan-900/30 text-cyan-300 border-l-2 border-cyan-400" 
                  : "text-cyan-600 hover:text-cyan-400 hover:bg-cyan-900/10 border-l-2 border-transparent"
              }`}
            >
              <item.icon className={`w-4 h-4 ${activeHash === item.href ? "text-cyan-400" : "text-cyan-700"}`} />
              {item.name}
            </Link>
          ))}
        </nav>

        {/* System Status */}
        <div className="p-6 border-t border-cyan-500/20 bg-[#02050A]">
          <div className="text-[10px] text-cyan-800 uppercase tracking-widest mb-3 font-[family-name:var(--font-black-ops)]">SYSTEM STATUS</div>
          <div className="flex items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_8px_#22c55e] animate-pulse" />
              <span className="text-xs text-green-400 tracking-widest uppercase">ONLINE</span>
            </div>
            <Link href="/admin">
              <div className="w-6 h-6 opacity-0" />
            </Link>
          </div>
          <div className="flex justify-between items-center text-[10px] text-cyan-700">
            <span>RECRUITMENT 2026</span>
            <span>v2.6.0</span>
          </div>
          <div className="flex justify-between items-center text-[10px] text-cyan-700 mt-1">
            <span>SYS_TIME</span>
            <span>{time || "00:00:00"}</span>
          </div>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <main className="flex-1 relative flex flex-col min-h-screen">
        <div className="fixed inset-0 terminal-scanline opacity-10 pointer-events-none z-50" />
        <div className="flex-1 w-full max-w-[1600px] mx-auto p-4 md:p-8 space-y-12 pb-32">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#02050A]/95 backdrop-blur-md border-t border-cyan-500/30 flex items-center justify-around z-50">
        {NAV_ITEMS.map((item) => (
          <Link 
            key={item.name} 
            href={item.href}
            onClick={() => setActiveHash(item.href)}
            className={`p-2 flex flex-col items-center justify-center gap-1 transition-colors ${
              activeHash === item.href ? "text-cyan-400" : "text-cyan-700 hover:text-cyan-500"
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-[8px] tracking-widest">{item.name}</span>
          </Link>
        ))}
      </nav>
      
    </div>
  );
}
