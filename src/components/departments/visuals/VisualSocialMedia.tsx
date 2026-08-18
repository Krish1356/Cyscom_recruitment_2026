"use client";

import { motion } from "framer-motion";

export default function VisualSocialMedia({ isActive }: { isActive: boolean }) {
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
        
        {/* Audience Network Lines */}
        {[0, 60, 120, 180, 240, 300].map((angle, i) => {
          const x2 = 200 + Math.cos((angle * Math.PI) / 180) * 140;
          const y2 = 200 + Math.sin((angle * Math.PI) / 180) * 140;
          return (
            <motion.line 
              key={`net-line-${i}`}
              x1="200" y1="200" x2={x2} y2={y2}
              stroke="#0891B2" strokeWidth="1" strokeOpacity="0.4"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, delay: 1 + i * 0.1, ease: "easeOut" }}
            />
          );
        })}

        {/* Orbiting Content Nodes */}
        {[0, 120, 240].map((angle, i) => (
          <motion.circle 
            key={`orbit-node-${i}`}
            cx="200" cy="200" r="120"
            fill="none" stroke="#22D3EE" strokeWidth="0.5" strokeOpacity="0.3" strokeDasharray="50 300"
            animate={{ rotate: 360 }}
            transition={{ duration: 20 + i * 5, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "200px 200px" }}
          />
        ))}

        {/* Audience Nodes */}
        {[0, 60, 120, 180, 240, 300].map((angle, i) => {
          const cx = 200 + Math.cos((angle * Math.PI) / 180) * 140;
          const cy = 200 + Math.sin((angle * Math.PI) / 180) * 140;
          return (
            <motion.circle 
              key={`aud-node-${i}`}
              cx={cx} cy={cy} r="4"
              fill="#0B1014" stroke="#67E8F9" strokeWidth="1.5"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 1.5 + i * 0.1, type: "spring" }}
            />
          );
        })}
        
        {/* Tiny Media Frames */}
        <motion.rect x="30" y="80" width="30" height="20" rx="2" fill="none" stroke="#67E8F9" strokeWidth="1" strokeOpacity="0.5"
          initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: [0, 1, 0], scale: 1 }} transition={{ duration: 4, repeat: Infinity, delay: 2 }} />
        <motion.rect x="340" y="280" width="20" height="30" rx="2" fill="none" stroke="#67E8F9" strokeWidth="1" strokeOpacity="0.5"
          initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: [0, 1, 0], scale: 1 }} transition={{ duration: 4, repeat: Infinity, delay: 4 }} />

        {/* Central Camera Body */}
        <motion.rect 
          x="140" y="150" width="120" height="90" rx="8"
          fill="#0B1014" stroke="#626A72" strokeWidth="2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
        {/* Camera Top Details */}
        <motion.path 
          d="M170 150 L180 135 L220 135 L230 150" 
          fill="#07090C" stroke="#626A72" strokeWidth="2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        />
        <motion.circle cx="160" cy="165" r="4" fill="#626A72" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5 }} />

        {/* Focus Rings expanding */}
        <motion.circle cx="200" cy="195" r="30" fill="none" stroke="#67E8F9" strokeWidth="1" strokeOpacity="0"
          animate={{ r: [30, 80], strokeOpacity: [0.6, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeOut", delay: 1 }} />
          
        <motion.circle cx="200" cy="195" r="30" fill="none" stroke="#22D3EE" strokeWidth="1" strokeOpacity="0"
          animate={{ r: [30, 60], strokeOpacity: [0.4, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeOut", delay: 2.5 }} />

        {/* Camera Lens System */}
        <motion.circle 
          cx="200" cy="195" r="34" 
          fill="#050608" stroke="#A4A8AE" strokeWidth="2"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        />
        <motion.circle 
          cx="200" cy="195" r="26" 
          fill="#07090C" stroke="#626A72" strokeWidth="1.5"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        />
        {/* Inner Lens Glass Reflection */}
        <motion.path 
          d="M185 180 Q195 175 210 185" 
          stroke="#67E8F9" strokeWidth="3" strokeLinecap="round" strokeOpacity="0.6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ duration: 1, delay: 1 }}
        />
        <motion.circle cx="200" cy="195" r="14" fill="#0B1014" stroke="#0891B2" strokeWidth="1" />
        
        {/* Focus adjustment twist animation on the lens ring */}
        <motion.circle 
          cx="200" cy="195" r="30" 
          stroke="#626A72" strokeWidth="1" strokeDasharray="4 4" fill="none"
          animate={{ rotate: [0, 45, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "200px 195px" }}
        />
      </svg>
      <img src="/departments/SM.png" alt="Social Media" className="absolute w-24 h-24 object-contain drop-shadow-[0_0_25px_rgba(103,232,249,0.5)] z-10 animate-pulse" />
    </motion.div>
  );
}
