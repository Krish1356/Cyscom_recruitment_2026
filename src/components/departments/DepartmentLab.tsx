"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import DepartmentCard, { DepartmentType } from "./DepartmentCard";
import dynamic from "next/dynamic";

const VisualCore = dynamic(() => import("./visuals/VisualCore"), { ssr: false });
const VisualTechnical = dynamic(() => import("./visuals/VisualTechnical"), { ssr: false });
const VisualWebDev = dynamic(() => import("./visuals/VisualWebDev"), { ssr: false });
const VisualSocialMedia = dynamic(() => import("./visuals/VisualSocialMedia"), { ssr: false });
const VisualEvent = dynamic(() => import("./visuals/VisualEvent"), { ssr: false });
const VisualOutreach = dynamic(() => import("./visuals/VisualOutreach"), { ssr: false });
const VisualDesign = dynamic(() => import("./visuals/VisualDesign"), { ssr: false });

const DEPARTMENTS = [
  {
    type: "TECHNICAL" as DepartmentType,
    title: "Technical",
    description: "Dive into cybersecurity, solve CTF challenges, participate in CTF competitions, and sharpen your skills by breaking, analysing, and securing systems."
  },
  {
    type: "WEB_DEVELOPMENT" as DepartmentType,
    title: "Web Development",
    description: "Build secure websites, interactive platforms, and fun web-based games while learning how to develop with security in mind."
  },
  {
    type: "DESIGN" as DepartmentType,
    title: "Design",
    description: "Turn ideas into visuals. Design posters, Instagram posts, event creatives, graphics, and the overall visual identity of the club."
  },
  {
    type: "EVENT_MANAGEMENT" as DepartmentType,
    title: "Event Management",
    description: "Plan, organize, and execute workshops, CTFs, seminars, competitions, and everything that happens behind the scenes."
  },
  {
    type: "SOCIAL_MEDIA" as DepartmentType,
    title: "Social Media",
    description: "Capture the moments. Click photos, shoot reels, create content, and keep the community active across social platforms."
  },
  {
    type: "OUTREACH" as DepartmentType,
    title: "Outreach",
    description: "Connect with people and organizations, bring in sponsorships, build collaborations, and socialize with the cybersecurity community."
  }
];

export default function DepartmentLab() {
  const [activeDept, setActiveDept] = useState<DepartmentType | null>(null);

  const renderVisual = () => {
    switch (activeDept) {
      case "TECHNICAL": return <VisualTechnical key="tech" isActive={true} />;
      case "WEB_DEVELOPMENT": return <VisualWebDev key="web" isActive={true} />;
      case "SOCIAL_MEDIA": return <VisualSocialMedia key="social" isActive={true} />;
      case "EVENT_MANAGEMENT": return <VisualEvent key="event" isActive={true} />;
      case "OUTREACH": return <VisualOutreach key="outreach" isActive={true} />;
      case "DESIGN": return <VisualDesign key="design" isActive={true} />;
      default: return <VisualCore key="core" isActive={true} />;
    }
  };

  return (
    <section id="divisions" className="py-24 md:py-32 border-t border-white/5 bg-black/20 backdrop-blur-[2px] relative z-10">
      <div className="container mx-auto px-6">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 md:mb-24">
          <h2 className="text-base md:text-lg font-mono tracking-[0.2em] text-[#A4A8AE] mb-4">02 DEPARTMENTS</h2>
          <h3 className="text-4xl md:text-5xl font-bold tracking-tight text-[#F1F0EA] mb-6">Choose your battlefield.</h3>
          <p className="text-lg text-[#626A72]">Six divisions. Endless possibilities. Where will you make an impact?</p>
        </div>

        {/* CYSCOM DIGITAL LAB LAYOUT */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-stretch min-h-[600px]">
          
          {/* Main Visual Display Area (Left) */}
          <div className="flex-1 rounded-2xl bg-[#050608]/80 border border-white/5 overflow-hidden relative flex flex-col shadow-2xl min-h-[400px] lg:min-h-full">
            {/* Header/UI framing for the visual */}
            <div className="h-12 border-b border-white/5 flex items-center px-6 justify-between bg-black/40">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-[#626A72]"></div>
                <div className="w-3 h-3 rounded-full bg-[#A4A8AE]"></div>
                <div className="w-3 h-3 rounded-full bg-[#67E8F9]"></div>
              </div>
              <div className="font-mono text-xs text-[#A4A8AE] tracking-widest uppercase">
                {activeDept ? `${activeDept}_MODULE` : "CYSCOM_CORE"}
              </div>
            </div>
            
            {/* Visual Container */}
            <div className="flex-1 relative overflow-hidden flex items-center justify-center p-8 bg-gradient-to-b from-transparent to-[#050608]">
              {/* Background Glow */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(8,145,178,0.1)_0%,transparent_70%)] pointer-events-none" />
              
              <AnimatePresence mode="wait">
                {renderVisual()}
              </AnimatePresence>

              {/* Overlay Text Description */}
              <AnimatePresence mode="wait">
                {activeDept && (
                  <motion.div
                    key={activeDept}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-6 left-6 right-6 p-4 rounded-md bg-[#050608]/80 border border-white/10 backdrop-blur-sm pointer-events-none"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#67E8F9] animate-pulse" />
                      <p className="text-xs font-mono text-[#67E8F9] uppercase tracking-widest">
                        {DEPARTMENTS.find(d => d.type === activeDept)?.title}
                      </p>
                    </div>
                    <p className="text-sm text-[#A4A8AE] leading-relaxed">
                      {DEPARTMENTS.find(d => d.type === activeDept)?.description}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Footer data framing */}
            <div className="h-10 border-t border-white/5 flex items-center px-6 justify-between text-[10px] font-mono text-[#626A72] uppercase bg-black/40">
              <div>SYS.STATUS: {activeDept ? "ACTIVE" : "STANDBY"}</div>
              <div className="flex gap-4">
                <span>MEM: NORMAL</span>
                <span>NET: SECURE</span>
              </div>
            </div>
          </div>

          {/* Department Selection List (Right) */}
          <div className="w-full lg:w-[400px] xl:w-[450px] flex flex-col gap-4">
            <h4 className="font-mono text-sm tracking-widest text-[#A4A8AE] mb-2 pl-1 hidden lg:block">SELECT MODULE:</h4>
            <div className="grid grid-cols-1 gap-4 h-full content-start">
              {DEPARTMENTS.map((dept) => (
                <DepartmentCard
                  key={dept.type}
                  type={dept.type}
                  title={dept.title}
                  description={dept.description}
                  isActive={activeDept === dept.type}
                  onHover={() => setActiveDept(dept.type)}
                  onLeave={() => {
                    // Optional: return to core when mouse leaves? 
                    // No, keeping it selected is better for mobile/tablet where hover doesn't exist nicely.
                  }}
                />
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
