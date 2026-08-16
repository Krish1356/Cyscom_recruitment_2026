"use client";

import { useState, useEffect, useRef } from "react";
import { Html } from "@react-three/drei";
import { ArrowRight, ShieldCheck, Loader2 } from "lucide-react";

export function ScreenUI({ onEnter, isEntering }: { onEnter: () => void, isEntering: boolean }) {
  const [mounted, setMounted] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setProgress((p) => Math.min(p + Math.random() * 20, 100));
    }, 300);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  return (
    <div
      className="flex flex-col justify-between w-[1024px] h-[576px] bg-[#f8fafc] text-slate-900 overflow-hidden font-sans select-none"
      style={{
        borderRadius: "12px",
        padding: "48px",
        cursor: "default"
      }}
      onClick={(e) => e.stopPropagation()} // Prevent closing the laptop when clicking the screen
    >
      {/* Top Bar */}
      <div className="flex justify-between items-center opacity-70">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-blue-600" />
          <span className="font-semibold tracking-wide text-sm">CYSCOM / SECURE WORKSPACE</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />
          <span className="text-xs font-semibold tracking-wider text-emerald-600">SYSTEM ONLINE</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center flex-1">
        <h1 className="text-5xl font-bold tracking-tight mb-4 text-slate-800">
          Welcome to CYSCOM.
        </h1>
        <p className="text-lg text-slate-500 mb-12 max-w-lg text-center leading-relaxed">
          The premier cybersecurity student community at VIT Chennai. We don't just learn security; we exploit, understand, and protect.
        </p>

        <button
          onClick={onEnter}
          disabled={isEntering}
          className="group relative flex items-center justify-center gap-3 px-10 py-5 bg-blue-600 text-white rounded-full font-bold text-xl transition-all hover:bg-blue-700 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 shadow-[0_10px_30px_rgba(37,99,235,0.3)] cursor-pointer"
        >
          {isEntering ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              <span>Entering...</span>
            </>
          ) : (
            <>
              <span>Join</span>
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </div>

      {/* Bottom Bar */}
      <div className="flex justify-between items-center text-xs text-slate-400 font-mono">
        <div>SYS_VERSION: 2.6.0</div>
        <div>TERMINAL_ID: CYS-091</div>
      </div>
    </div>
  );
}
