"use client";

import { motion } from "framer-motion";

export default function VisualEvent({ isActive }: { isActive: boolean }) {
  if (!isActive) return null;
  
  const nodes = [
    { label: "TASK", y: 110, delay: 0.5 },
    { label: "VENUE", y: 150, delay: 1.5 },
    { label: "SPEAKER", y: 190, delay: 2.5 },
    { label: "TEAM", y: 230, delay: 3.5 },
    { label: "AUDIENCE", y: 270, delay: 4.5 },
    { label: "EVENT", y: 310, delay: 5.5 },
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
        
        {/* Background Planning Board */}
        <motion.rect 
          x="60" y="60" width="280" height="280" rx="8"
          fill="#0B1014" stroke="#626A72" strokeWidth="2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        />
        <motion.line x1="60" y1="90" x2="340" y2="90" stroke="#626A72" strokeWidth="2" />
        <motion.line x1="220" y1="90" x2="220" y2="340" stroke="#626A72" strokeWidth="1" strokeOpacity="0.5" />

        {/* Board Header Details */}
        <rect x="75" y="72" width="40" height="6" rx="3" fill="#A4A8AE" />
        <rect x="235" y="72" width="60" height="6" rx="3" fill="#A4A8AE" opacity="0.5" />

        {/* Timeline Path (Right Side) */}
        <motion.path 
          d="M 280 120 L 280 300"
          stroke="#0891B2" strokeWidth="2" strokeOpacity="0.3"
        />
        <motion.path 
          d="M 280 120 L 280 300"
          stroke="#67E8F9" strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: [0, 1, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />

        {/* Timeline Nodes */}
        {nodes.map((node, i) => (
          <g key={`tl-node-${i}`}>
            {/* Timeline Connection Line */}
            <motion.line 
              x1="220" y1={node.y} x2="280" y2={node.y} 
              stroke="#22D3EE" strokeWidth="1" strokeOpacity="0.5" strokeDasharray="4 4"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: [0, 1, 0] }}
              transition={{ duration: 8, delay: node.delay, repeat: Infinity, ease: "linear" }}
            />
            {/* Timeline Circle */}
            <motion.circle 
              cx="280" cy={node.y} r="4" 
              fill="#0B1014" stroke="#67E8F9" strokeWidth="1.5"
              initial={{ scale: 0, fill: "#0B1014" }}
              animate={{ scale: [0, 1.2, 1, 0], fill: ["#0B1014", "#67E8F9", "#0B1014", "#0B1014"] }}
              transition={{ duration: 8, delay: node.delay, repeat: Infinity, ease: "linear" }}
            />
          </g>
        ))}

        {/* Logistics / Checklist Nodes (Left Side) */}
        {nodes.map((node, i) => (
          <g key={`check-node-${i}`}>
            {/* Checkbox Box */}
            <motion.rect 
              x="80" y={node.y - 6} width="12" height="12" rx="2" 
              fill="none" stroke="#626A72" strokeWidth="1.5"
            />
            {/* Checkmark Fill */}
            <motion.rect 
              x="83" y={node.y - 3} width="6" height="6" rx="1" 
              fill="#67E8F9"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
              transition={{ duration: 8, delay: node.delay + 0.3, repeat: Infinity, ease: "easeInOut" }}
            />
            {/* Pseudo-text bar */}
            <motion.rect 
              x="105" y={node.y - 4} width="80" height="8" rx="4" 
              fill="#0891B2"
              initial={{ opacity: 0.3, width: 40 }}
              animate={{ opacity: [0.3, 1, 0.3], width: [40, 80, 40] }}
              transition={{ duration: 8, delay: node.delay, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.rect 
              x="105" y={node.y + 6} width="50" height="4" rx="2" 
              fill="#626A72" opacity="0.5"
            />
          </g>
        ))}

      </svg>
    </motion.div>
  );
}
