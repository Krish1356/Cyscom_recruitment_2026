"use client";

import { motion } from "framer-motion";

export default function VisualDesign({ isActive }: { isActive: boolean }) {
  if (!isActive) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="w-full h-full flex items-center justify-center relative"
    >
      <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full max-w-[400px]">
        
        {/* Composition Grid */}
        <motion.g 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {/* Vertical Lines */}
          {[120, 160, 200, 240, 280].map((x, i) => (
            <line key={`v-${i}`} x1={x} y1="80" x2={x} y2="320" stroke="#626A72" strokeWidth="0.5" strokeOpacity="0.3" />
          ))}
          {/* Horizontal Lines */}
          {[120, 160, 200, 240, 280].map((y, i) => (
            <line key={`h-${i}`} x1="80" y1={y} x2="320" y2={y} stroke="#626A72" strokeWidth="0.5" strokeOpacity="0.3" />
          ))}
        </motion.g>

        {/* Brush Stroke / Path */}
        <motion.path 
          d="M 120 280 C 160 200, 240 120, 280 160 C 300 180, 260 240, 200 240"
          stroke="#0891B2" strokeWidth="4" strokeLinecap="round" strokeOpacity="0.4"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 4, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
        />
        <motion.path 
          d="M 120 280 C 160 200, 240 120, 280 160 C 300 180, 260 240, 200 240"
          stroke="#67E8F9" strokeWidth="2" strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 1 }}
          animate={{ pathLength: [0, 1, 1], opacity: [1, 1, 0] }}
          transition={{ duration: 4, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
        />

        {/* Floating Geometric Elements forming composition */}
        <motion.rect 
          x="120" y="120" width="80" height="120" rx="4"
          fill="#0B1014" stroke="#22D3EE" strokeWidth="1.5"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
        />
        <motion.circle 
          cx="240" cy="160" r="40"
          fill="#07090C" stroke="#A4A8AE" strokeWidth="1" strokeDasharray="4 4"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
        />
        <motion.rect 
          x="200" y="200" width="80" height="80" rx="4"
          fill="#050608" stroke="#67E8F9" strokeWidth="2"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 2 }}
        />

        {/* Abstract UI Layers shifting */}
        <motion.rect 
          x="130" y="130" width="60" height="10" rx="2" fill="#67E8F9"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2 }}
        />
        <motion.rect 
          x="130" y="150" width="40" height="4" rx="2" fill="#626A72"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.3 }}
        />
        <motion.rect 
          x="210" y="210" width="60" height="60" rx="2" fill="#22D3EE" fillOpacity="0.1"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 }}
        />

        {/* Floating Brush/Cursor Element */}
        <motion.g
          initial={{ x: 120, y: 280 }}
          animate={{ 
            x: [120, 200, 280, 280, 200, 120], 
            y: [280, 160, 160, 240, 240, 280] 
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        >
          <circle cx="0" cy="0" r="4" fill="#F1F0EA" />
          <circle cx="0" cy="0" r="12" fill="none" stroke="#67E8F9" strokeWidth="1" opacity="0.5" />
          <path d="M4 4 L12 12" stroke="#F1F0EA" strokeWidth="1.5" strokeLinecap="round" />
        </motion.g>
        
      </svg>
    </motion.div>
  );
}
