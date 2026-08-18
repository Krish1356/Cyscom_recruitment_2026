"use client";

import { motion } from "framer-motion";

export default function VisualWebDev({ isActive }: { isActive: boolean }) {
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
        
        {/* Connection Lines UI -> Component -> API -> DB */}
        <motion.path 
          d="M100 240 L100 320 L200 320 L200 360"
          stroke="#0891B2" strokeWidth="1.5" strokeOpacity="0.5" strokeDasharray="4 4"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, delay: 1 }}
        />
        <motion.path 
          d="M300 240 L300 320 L200 320"
          stroke="#0891B2" strokeWidth="1.5" strokeOpacity="0.5" strokeDasharray="4 4"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, delay: 1.5 }}
        />

        {/* Database Node */}
        <motion.rect
          x="170" y="340" width="60" height="30" rx="4"
          fill="#050608" stroke="#22D3EE" strokeWidth="1.5"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2 }}
        />
        <motion.line x1="180" y1="350" x2="220" y2="350" stroke="#67E8F9" strokeWidth="2" strokeLinecap="round" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2 }} />
        <motion.line x1="180" y1="360" x2="210" y2="360" stroke="#67E8F9" strokeWidth="2" strokeLinecap="round" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.4 }} />


        {/* Browser Frame */}
        <motion.rect 
          x="60" y="60" width="280" height="180" rx="8"
          fill="#0B1014" stroke="#626A72" strokeWidth="2"
          initial={{ pathLength: 0, fillOpacity: 0 }}
          animate={{ pathLength: 1, fillOpacity: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
        {/* Browser Top Bar */}
        <motion.line 
          x1="60" y1="84" x2="340" y2="84" 
          stroke="#626A72" strokeWidth="2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
        />
        {/* Window Controls */}
        {[75, 90, 105].map((cx, i) => (
          <motion.circle 
            key={`ctrl-${i}`}
            cx={cx} cy="72" r="3" 
            fill={i === 0 ? "#626A72" : i === 1 ? "#A4A8AE" : "#67E8F9"}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 1 + i * 0.1 }}
          />
        ))}

        {/* DOM/Component Structure */}
        {/* Sidebar */}
        <motion.rect 
          x="70" y="94" width="60" height="136" rx="4"
          fill="#07090C" stroke="#0891B2" strokeWidth="1"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 1.5 }}
        />
        {/* Code Blocks in Sidebar */}
        {[104, 118, 132, 146, 160].map((y, i) => (
          <motion.rect 
            key={`sidebar-code-${i}`}
            x="80" y={y} width={i % 2 === 0 ? "40" : "30"} height="4" rx="2" fill="#22D3EE" fillOpacity="0.4"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.3, delay: 1.7 + i * 0.1 }}
            style={{ transformOrigin: "0" }}
          />
        ))}

        {/* Main Content Area */}
        <motion.rect 
          x="140" y="94" width="190" height="80" rx="4"
          fill="#07090C" stroke="#22D3EE" strokeWidth="1" strokeOpacity="0.5"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.6 }}
        />
        {/* Hero Element */}
        <motion.rect 
          x="150" y="104" width="100" height="12" rx="2" fill="#67E8F9"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.0 }}
        />
        <motion.rect 
          x="150" y="124" width="170" height="6" rx="3" fill="#A4A8AE" fillOpacity="0.3"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.1 }}
        />
        <motion.rect 
          x="150" y="138" width="140" height="6" rx="3" fill="#A4A8AE" fillOpacity="0.3"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2 }}
        />

        {/* Component Grid */}
        {[0, 1, 2].map((i) => (
          <motion.rect 
            key={`grid-item-${i}`}
            x={140 + i * 66} y="184" width="56" height="46" rx="4"
            fill="#050608" stroke="#0891B2" strokeWidth="1"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 2.3 + i * 0.15 }}
          />
        ))}

        {/* Floating Code Snippets / Nodes */}
        <motion.path 
          d="M20 200 L40 180 M380 200 L360 180" 
          stroke="#67E8F9" strokeWidth="1.5" strokeOpacity="0.3" 
          animate={{ opacity: [0.1, 0.5, 0.1] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <motion.text x="20" y="170" fill="#22D3EE" fontSize="10" fontFamily="monospace" opacity="0.4"
          animate={{ y: [170, 165, 170] }} transition={{ duration: 4, repeat: Infinity }}>
          &lt;div/&gt;
        </motion.text>
        <motion.text x="350" y="170" fill="#22D3EE" fontSize="10" fontFamily="monospace" opacity="0.4"
          animate={{ y: [170, 175, 170] }} transition={{ duration: 3.5, repeat: Infinity }}>
          &#123; API &#125;
        </motion.text>
        
        {/* Subtle Cyber Pulse overlay */}
        <motion.rect 
          x="60" y="60" width="280" height="180" rx="8"
          fill="#67E8F9"
          animate={{ opacity: [0, 0.05, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          pointerEvents="none"
        />
      </svg>
      <img src="/departments/dEV.png" alt="Web Development" className="absolute w-24 h-24 object-contain drop-shadow-[0_0_25px_rgba(103,232,249,0.5)] z-10 animate-pulse" />
    </motion.div>
  );
}
