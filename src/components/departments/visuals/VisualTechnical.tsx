"use client";

import { motion } from "framer-motion";

export default function VisualTechnical({ isActive }: { isActive: boolean }) {
  if (!isActive) return null;
  
  // Circuit Paths for data packets
  const paths = [
    "M200 120 L200 40 L120 40",
    "M200 280 L200 360 L280 360",
    "M120 200 L40 200 L40 120",
    "M280 200 L360 200 L360 280",
    "M140 140 L80 80 L80 120",
    "M260 260 L320 320 L280 320",
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="w-full h-full flex items-center justify-center relative"
    >
      <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full max-w-[400px]">
        {/* Subtle Security Perimeter */}
        <motion.rect 
          x="20" y="20" width="360" height="360" rx="20"
          stroke="#0891B2" strokeWidth="1" strokeOpacity="0.2" strokeDasharray="10 20"
          animate={{ strokeDashoffset: [0, 60] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Circuit Traces */}
        {paths.map((d, i) => (
          <motion.path 
            key={`trace-${i}`}
            d={d}
            stroke="#22D3EE" strokeWidth="1" strokeOpacity="0.3"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, delay: i * 0.2, ease: "easeOut" }}
          />
        ))}

        {/* Data Packets along Traces (simulated by animating small circles along coordinates or just paths) */}
        {/* Actually, animating stroke-dasharray is easier for data packets on SVGs */}
        {paths.map((d, i) => (
          <motion.path 
            key={`packet-${i}`}
            d={d}
            stroke="#67E8F9" strokeWidth="2"
            strokeDasharray="0 1000"
            animate={{ strokeDasharray: ["0 1000", "20 1000", "0 1000"], strokeDashoffset: [0, -300] }}
            transition={{ duration: 3, delay: i * 0.5, repeat: Infinity, ease: "linear" }}
          />
        ))}

        {/* Microchip Base */}
        <motion.rect 
          x="120" y="120" width="160" height="160" rx="8"
          fill="#0B1014" stroke="#626A72" strokeWidth="2"
        />

        {/* Chip Pins */}
        {[...Array(8)].map((_, i) => (
          <g key={`pin-top-${i}`}>
            <rect x={135 + i * 18} y="110" width="6" height="10" fill="#A4A8AE" />
            <rect x={135 + i * 18} y="280" width="6" height="10" fill="#A4A8AE" />
            <rect x="110" y={135 + i * 18} width="10" height="6" fill="#A4A8AE" />
            <rect x="280" y={135 + i * 18} width="10" height="6" fill="#A4A8AE" />
          </g>
        ))}

        {/* Central Processor Core */}
        <motion.rect 
          x="150" y="150" width="100" height="100" rx="4"
          fill="#07090C" stroke="#22D3EE" strokeWidth="1.5"
        />

        {/* Core Pulse */}
        <motion.rect 
          x="150" y="150" width="100" height="100" rx="4"
          fill="#67E8F9"
          animate={{ opacity: [0, 0.15, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Inner Core Detailing */}
        <rect x="170" y="170" width="60" height="60" fill="none" stroke="#0891B2" strokeWidth="1" strokeDasharray="4 4" />
        <motion.circle 
          cx="200" cy="200" r="10" 
          fill="#67E8F9"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Network Nodes on Traces */}
        {[
          { cx: 120, cy: 40 }, { cx: 280, cy: 360 }, { cx: 40, cy: 120 }, { cx: 360, cy: 280 }
        ].map((pos, i) => (
          <motion.circle 
            key={`node-${i}`}
            cx={pos.cx} cy={pos.cy} r="4" 
            fill="#050608" stroke="#67E8F9" strokeWidth="1.5"
            animate={{ scale: [1, 1.5, 1], strokeOpacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3, delay: i * 0.7, repeat: Infinity }}
          />
        ))}
      </svg>
    </motion.div>
  );
}
