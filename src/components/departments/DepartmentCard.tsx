"use client";

import { motion } from "framer-motion";

export type DepartmentType = "TECHNICAL" | "WEB_DEVELOPMENT" | "SOCIAL_MEDIA" | "EVENT_MANAGEMENT" | "OUTREACH" | "DESIGN";

interface DepartmentCardProps {
  type: DepartmentType;
  title: string;
  description: string;
  isActive: boolean;
  onHover: () => void;
  onLeave: () => void;
}

const IconTechnical = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
    <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
    <rect x="8" y="8" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.5" />
    <path d="M4 12H2M22 12H20M12 4V2M12 22V20M8 4V2M16 4V2M8 22V20M16 22V20M4 8H2M22 8H20M4 16H2M22 16H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const IconWebDev = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
    <rect x="3" y="4" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
    <path d="M3 8H21" stroke="currentColor" strokeWidth="1.5" />
    <path d="M8 20L16 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M12 16V20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M6 12L8 14L10 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconSocialMedia = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
    <rect x="3" y="6" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="12" cy="13" r="4" stroke="currentColor" strokeWidth="1.5" />
    <path d="M8 6V4C8 3.44772 8.44772 3 9 3H15C15.5523 3 16 3.44772 16 4V6" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="18" cy="9" r="1" fill="currentColor" />
  </svg>
);

const IconEvent = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
    <rect x="5" y="4" width="14" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
    <path d="M9 8H15M9 12H15M9 16H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M7 2V4M17 2V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const IconOutreach = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
    <circle cx="6" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="18" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
    <path d="M9 12H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M4 9L2 7M4 15L2 17M20 9L22 7M20 15L22 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const IconDesign = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
    <path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 13.5 4 14.5 5 14.5H7.5C8.32843 14.5 9 15.1716 9 16C9 16.8284 8.32843 17.5 7.5 17.5H6.5C8.03377 19.5694 10.3653 21 12 21Z" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="7.5" cy="9.5" r="1.5" fill="currentColor" />
    <circle cx="11.5" cy="7.5" r="1.5" fill="currentColor" />
    <circle cx="16.5" cy="10.5" r="1.5" fill="currentColor" />
  </svg>
);

const getIcon = (type: DepartmentType) => {
  switch (type) {
    case "TECHNICAL": return <IconTechnical />;
    case "WEB_DEVELOPMENT": return <IconWebDev />;
    case "SOCIAL_MEDIA": return <IconSocialMedia />;
    case "EVENT_MANAGEMENT": return <IconEvent />;
    case "OUTREACH": return <IconOutreach />;
    case "DESIGN": return <IconDesign />;
    default: return <IconTechnical />;
  }
};

export default function DepartmentCard({ type, title, description, isActive, onHover, onLeave }: DepartmentCardProps) {
  return (
    <motion.div
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={onHover}
      className={`relative p-5 rounded-lg border transition-colors duration-500 cursor-pointer overflow-hidden group
        ${isActive ? 'bg-[#0B1014]/80 border-[#67E8F9]/40' : 'bg-[#050608]/60 border-white/5 hover:bg-[#07090C]/80 hover:border-white/10'}
      `}
    >
      {/* Active Glow Backdrop */}
      {isActive && (
        <div className="absolute inset-0 bg-gradient-to-r from-[#67E8F9]/5 to-transparent pointer-events-none" />
      )}
      
      <div className="flex items-start gap-4 relative z-10">
        <div className={`mt-1 p-2 rounded-md border transition-colors duration-500
          ${isActive ? 'bg-[#0891B2]/20 border-[#67E8F9]/30 text-[#67E8F9]' : 'bg-black/40 border-white/10 text-[#A4A8AE] group-hover:text-white'}
        `}>
          {getIcon(type)}
        </div>
        
        <div className="flex-1">
          <h4 className={`text-lg font-bold tracking-tight mb-1 transition-colors duration-500
            ${isActive ? 'text-[#F1F0EA]' : 'text-[#A4A8AE] group-hover:text-[#F1F0EA]'}
          `}>
            {title}
          </h4>
          
          <motion.div 
            initial={{ opacity: isActive ? 1 : 0.6 }}
            animate={{ height: isActive ? 'auto' : 'auto', opacity: isActive ? 1 : 0.6 }}
            className="text-sm text-[#626A72] leading-relaxed"
          >
            {description}
          </motion.div>
        </div>
      </div>
      
      {/* Cyan edge highlight when active */}
      {isActive && (
        <motion.div 
          layoutId="activeEdge"
          className="absolute left-0 top-0 bottom-0 w-1 bg-[#67E8F9] shadow-[0_0_15px_rgba(103,232,249,0.5)]" 
        />
      )}
    </motion.div>
  );
}
