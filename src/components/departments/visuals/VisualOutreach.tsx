"use client";

import { motion } from "framer-motion";

export default function VisualOutreach({ isActive }: { isActive: boolean }) {
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
        
        {/* Background Grid Lines */}
        <g stroke="#626A72" strokeWidth="0.5" strokeOpacity="0.2">
          <line x1="200" y1="50" x2="200" y2="350" />
          <line x1="50" y1="200" x2="350" y2="200" />
          <circle cx="200" cy="200" r="120" strokeDasharray="4 4" fill="none" />
        </g>

        {/* Left Hand (Cybernetic outline) */}
        <motion.g
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          {/* Arm Left */}
          <path d="M40 240 L120 220 L160 210" stroke="#0891B2" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M40 260 L130 240 L160 230" stroke="#0891B2" strokeWidth="2" strokeOpacity="0.5" />
          
          {/* Hand Left Outline */}
          <path 
            d="M160 210 L190 180 L210 190 L195 210 L220 200 L210 220 L180 230 L160 230 Z" 
            fill="#050608" stroke="#22D3EE" strokeWidth="2" strokeLinejoin="round"
          />
          {/* Digital nodes on left hand */}
          <circle cx="160" cy="210" r="3" fill="#67E8F9" />
          <circle cx="190" cy="180" r="3" fill="#67E8F9" />
          <circle cx="210" cy="190" r="3" fill="#67E8F9" />
        </motion.g>

        {/* Right Hand (Cybernetic outline) */}
        <motion.g
          initial={{ x: 30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          {/* Arm Right */}
          <path d="M360 160 L280 180 L240 190" stroke="#626A72" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M360 140 L270 160 L240 170" stroke="#626A72" strokeWidth="2" strokeOpacity="0.5" />
          
          {/* Hand Right Outline */}
          <path 
            d="M240 190 L210 220 L190 210 L205 190 L180 200 L190 180 L220 170 L240 170 Z" 
            fill="#050608" stroke="#A4A8AE" strokeWidth="2" strokeLinejoin="round"
          />
          {/* Digital nodes on right hand */}
          <circle cx="240" cy="190" r="3" fill="#F1F0EA" />
          <circle cx="210" cy="220" r="3" fill="#F1F0EA" />
          <circle cx="190" cy="210" r="3" fill="#F1F0EA" />
        </motion.g>

        {/* Handshake Energy Connection (Center intersection) */}
        <motion.g
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <path 
            d="M190 180 L210 190 L195 210 L205 190 Z" 
            fill="#67E8F9" fillOpacity="0.2"
          />
          <motion.circle 
            cx="200" cy="200" r="15" 
            fill="none" stroke="#67E8F9" strokeWidth="1"
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: [1, 2.5], opacity: [1, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 1.5 }}
          />
          <motion.circle 
            cx="200" cy="200" r="25" 
            fill="none" stroke="#22D3EE" strokeWidth="0.5"
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: [1, 3], opacity: [0.5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 1.8 }}
          />
          <circle cx="200" cy="200" r="2" fill="#67E8F9" />
        </motion.g>

        {/* Cyber Data Streams bridging the gap */}
        <motion.path
          d="M140 180 Q 200 120 260 160"
          stroke="#67E8F9" strokeWidth="1" strokeDasharray="4 8" fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.6 }}
          transition={{ duration: 2, delay: 1.5 }}
        />
        <motion.path
          d="M140 220 Q 200 280 260 240"
          stroke="#A4A8AE" strokeWidth="1" strokeDasharray="4 8" fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.6 }}
          transition={{ duration: 2, delay: 1.5 }}
        />

        {/* Floating background nodes */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        >
          <circle cx="120" cy="120" r="1.5" fill="#67E8F9" />
          <circle cx="280" cy="280" r="1.5" fill="#67E8F9" />
          <circle cx="280" cy="120" r="1.5" fill="#A4A8AE" />
          <circle cx="120" cy="280" r="1.5" fill="#A4A8AE" />
        </motion.g>

      </svg>
    </motion.div>
  );
}
