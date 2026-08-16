"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { CyscomCore3D } from "../canvas/CyscomCore3D";
import { ArrowRight } from "lucide-react";

const BOOT_SEQUENCE = [
  { text: "Initializing CYSCOM recruitment environment...", delay: 2200 }, // Wait for 3D boot stage (2.2s)
  { text: "[ OK ] Loaded cryptographic defense systems", delay: 150 },
  { text: "Mounting secure application filesystem...", delay: 200 },
  { text: "Loading assessment modules........ DONE", delay: 300 },
  { text: "Loading Technical CTF challenges... DONE", delay: 100 },
  { text: "Loading department matrix......... DONE", delay: 200 },
  { text: "Loading recruitment services...... DONE", delay: 150 },
  { text: "Verifying encrypted credentials... ACTIVE", delay: 100 },
  { text: "Verifying application environment... READY", delay: 300 },
  { text: "[ OK ] Mounted /sys/recruitment/2026", delay: 50 },
  { text: "Mounting recruitment interface.... DONE", delay: 400 },
];

interface TerminalPreloaderProps {
  onComplete: () => void;
}

export function TerminalPreloader({ onComplete }: TerminalPreloaderProps) {
  const [messages, setMessages] = useState<string[]>([]);
  const [isReady, setIsReady] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [bootStage, setBootStage] = useState(0); 
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;

    // Boot Timeline
    // 0.0s: Stage 0 (Dark)
    // 0.3s: Stage 1 (Tiny point / Particles converging)
    setTimeout(() => { if (isMounted) setBootStage(1); }, 300);
    // 0.7s: Stage 2 (Logo forming)
    setTimeout(() => { if (isMounted) setBootStage(2); }, 700);
    // 1.5s: Stage 3 (Active, Light sweep, Network forming)
    setTimeout(() => { if (isMounted) setBootStage(3); }, 1500);
    
    let currentIndex = 0;

    const runSequence = async () => {
      for (const step of BOOT_SEQUENCE) {
        if (!isMounted) return;
        
        await new Promise(resolve => setTimeout(resolve, step.delay));
        
        if (!isMounted) return;

        setMessages(prev => {
          const newMessages = [...prev, step.text];
          if (newMessages.length > 20) return newMessages.slice(newMessages.length - 20);
          return newMessages;
        });

        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
      }
      
      if (!isMounted) return;
      
      setTimeout(() => {
        if (isMounted) setIsReady(true);
      }, 500);
    };

    runSequence();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleEnter = () => {
    setIsTransitioning(true);
    setBootStage(4);
    // Cinematic camera fly-through takes about 2.5 seconds before hiding
    setTimeout(() => {
      onComplete();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-gradient-to-br from-[#030507] via-[#070B0F] to-[#0A1110] overflow-hidden">
      
      {/* 3D Cinematic Core Background */}
      <div className="absolute inset-0 z-0">
         <Canvas camera={{ position: [0, 0, 5], fov: 45 }} dpr={[1, 1.5]}>
           <CyscomCore3D isTransitioning={isTransitioning} bootStage={bootStage} />
         </Canvas>
      </div>

      {/* Subtle Vignette Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(3,5,7,0)_10%,rgba(3,5,7,0.4)_70%,rgba(3,5,7,0.9)_100%)] pointer-events-none z-10" />

      {/* Terminal UI Layer */}
      <AnimatePresence>
        {!isTransitioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none"
          >
            {/* Subtle CRT/Scanline overlay effect */}
            <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(rgba(255,255,255,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] z-50" />
            
            <div className="w-full max-w-4xl px-6 relative h-[70vh] flex flex-col justify-end pointer-events-auto">
              
              <div 
                ref={scrollRef}
                className="space-y-1 text-[11px] md:text-xs text-[#E4E4E7] font-mono overflow-y-auto whitespace-pre-wrap leading-tight flex-1 pr-4 custom-scrollbar drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]"
                style={{
                  maskImage: "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)",
                  WebkitMaskImage: "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)"
                }}
              >
                {messages.map((msg, idx) => {
                  const isOk = msg.includes("[ OK ]");
                  const isReadyMsg = msg.includes("READY");
                  const isDone = msg.includes("DONE");
                  
                  return (
                    <div key={idx} className="flex">
                      <span>
                        {isOk && <span className="text-[#00D9FF] font-bold">[ OK ] </span>}
                        {msg.replace("[ OK ] ", "").replace(" READY", "").replace(" DONE", "")}
                        {isReadyMsg && <span className="text-[#B7FF00] font-bold"> READY</span>}
                        {isDone && <span className="text-[#A4A8AE] font-bold"> DONE</span>}
                      </span>
                    </div>
                  );
                })}
                
                {!isReady && bootStage >= 2 && (
                  <div className="flex items-center h-5 mt-1">
                    <span className="w-2 h-4 bg-[#00D9FF] animate-pulse inline-block" />
                  </div>
                )}
              </div>

              <div className="h-24 mt-6">
                {isReady && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="border-t border-white/10 pt-6 flex flex-col items-start gap-4"
                  >
                    <div className="text-[#00D9FF] font-bold font-mono text-xs flex items-center gap-2">
                      <span>SYSTEM STATUS:</span>
                      <span className="text-[#B7FF00]">READY</span>
                    </div>
                    <div className="text-[#626A72] font-mono text-xs flex items-center gap-2 mb-2">
                      <span>root@cyscom:~$</span>
                      <span className="text-[#F1F0EA]">./start_recruitment.sh</span>
                    </div>

                    <button
                      onClick={handleEnter}
                      className="group flex items-center gap-3 px-8 py-3 bg-[#10151A] text-[#F1F0EA] border border-[#00D9FF]/30 hover:border-[#B7FF00] hover:bg-[#10151A]/80 hover:text-[#B7FF00] hover:shadow-[0_0_15px_rgba(183,255,0,0.15)] rounded-sm font-bold text-xs tracking-widest transition-all uppercase"
                    >
                      ESTABLISH SECURE UPLINK
                      <ArrowRight className="w-4 h-4 text-[#626A72] group-hover:text-[#B7FF00] group-hover:translate-x-1 transition-all" />
                    </button>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
