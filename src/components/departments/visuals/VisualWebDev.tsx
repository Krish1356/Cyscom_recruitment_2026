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
      <motion.div
        animate={{ y: [-10, 10, -10] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
        className="relative"
      >
        <div className="absolute inset-0 bg-[#00D9FF] blur-[40px] opacity-20 rounded-full animate-pulse" />
        <img 
          src="/departments/dEV.png" 
          alt="Web Development Department" 
          className="w-48 h-48 object-contain relative z-10 drop-shadow-[0_0_25px_rgba(0,217,255,0.5)]" 
        />
      </motion.div>
    </motion.div>
  );
}
