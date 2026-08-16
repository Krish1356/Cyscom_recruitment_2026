"use client";

import { motion } from "framer-motion";

export default function VisualCore({ isActive }: { isActive: boolean }) {
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
        {/* Core Ring 1 */}
        <motion.circle 
          cx="200" cy="200" r="120" 
          stroke="#0891B2" strokeWidth="1" strokeOpacity="0.3" strokeDasharray="4 8"
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "200px 200px" }}
        />
        
        {/* Core Ring 2 */}
        <motion.circle 
          cx="200" cy="200" r="140" 
          stroke="#22D3EE" strokeWidth="0.5" strokeOpacity="0.2"
          initial={{ rotate: 0 }}
          animate={{ rotate: -360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "200px 200px" }}
        />

        {/* Central Core */}
        <motion.circle 
          cx="200" cy="200" r="40" 
          fill="#0B1014" stroke="#67E8F9" strokeWidth="2"
        />
        <motion.circle 
          cx="200" cy="200" r="20" 
          fill="#67E8F9" fillOpacity="0.1"
          animate={{ r: [20, 24, 20], opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Connecting Lines */}
        {[0, 60, 120, 180, 240, 300].map((angle, i) => {
          const x1 = 200 + Math.cos((angle * Math.PI) / 180) * 40;
          const y1 = 200 + Math.sin((angle * Math.PI) / 180) * 40;
          const x2 = 200 + Math.cos((angle * Math.PI) / 180) * 160;
          const y2 = 200 + Math.sin((angle * Math.PI) / 180) * 160;
          
          return (
            <motion.line 
              key={i}
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke="#67E8F9" strokeWidth="0.5" strokeOpacity="0.4"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, delay: i * 0.1 }}
            />
          );
        })}
        
        {/* Glowing Data Packets */}
        {[0, 120, 240].map((angle, i) => {
          const x1 = 200 + Math.cos((angle * Math.PI) / 180) * 40;
          const y1 = 200 + Math.sin((angle * Math.PI) / 180) * 40;
          const x2 = 200 + Math.cos((angle * Math.PI) / 180) * 160;
          const y2 = 200 + Math.sin((angle * Math.PI) / 180) * 160;
          
          return (
            <motion.circle
              key={`packet-${i}`}
              r="2"
              fill="#67E8F9"
              initial={{ cx: x1, cy: y1, opacity: 0 }}
              animate={{
                cx: [x1, x2, x1],
                cy: [y1, y2, y1],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 3,
                delay: i * 1.5,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          )
        })}
      </svg>
    </motion.div>
  );
}
