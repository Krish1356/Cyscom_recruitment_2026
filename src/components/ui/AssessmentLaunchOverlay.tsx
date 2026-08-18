"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Terminal, ShieldCheck, Cpu } from "lucide-react";

interface AssessmentLaunchOverlayProps {
  onComplete: () => void;
}

const LAUNCH_LOGS = [
  { text: "Connecting to assessment sandbox...", delay: 200 },
  { text: "Verifying security token and applicant profile...", delay: 300 },
  { text: "Initializing environment metrics & integrity tracker...", delay: 250 },
  { text: "Decrypting challenge modules...", delay: 350 },
  { text: "Environment ready. Launching terminal...", delay: 400 },
];

export function AssessmentLaunchOverlay({ onComplete }: AssessmentLaunchOverlayProps) {
  const [messages, setMessages] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    let isMounted = true;

    // Progress bar
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 4;
      });
    }, 50);

    // Logs runner
    const runSequence = async () => {
      for (let i = 0; i < LAUNCH_LOGS.length; i++) {
        if (!isMounted) return;
        const log = LAUNCH_LOGS[i];
        await new Promise((resolve) => setTimeout(resolve, log.delay));
        if (!isMounted) return;

        setMessages((prev) => [...prev, log.text]);

        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
      }

      await new Promise((resolve) => setTimeout(resolve, 400));
      if (isMounted) {
        onCompleteRef.current();
      }
    };

    runSequence();

    return () => {
      isMounted = false;
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[150] bg-[#050608]/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-[#F1F0EA] font-mono select-none"
    >
      <motion.div
        initial={{ scale: 0.96, y: 10 }}
        animate={{ scale: 1, y: 0 }}
        className="w-full max-w-lg bg-[#0E1217] border border-white/10 rounded-lg p-6 md:p-8 shadow-2xl flex flex-col gap-5"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#67E8F9]" />
            <span className="text-xs tracking-wider text-[#F1F0EA] font-bold uppercase flex items-center gap-2">
              <Terminal className="w-4 h-4 text-[#67E8F9]" /> INITIALIZING ASSESSMENT
            </span>
          </div>
          <span className="text-[10px] text-[#A4A8AE] bg-white/5 border border-white/10 px-2 py-0.5 rounded font-mono uppercase">
            SANDBOX
          </span>
        </div>

        {/* Clean Loader Icon */}
        <div className="flex items-center justify-center py-2">
          <div className="w-12 h-12 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#67E8F9]">
            {progress < 100 ? (
              <Cpu className="w-6 h-6 animate-pulse text-[#67E8F9]" />
            ) : (
              <ShieldCheck className="w-6 h-6 text-[#22c55e]" />
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-mono text-[#A4A8AE]">
            <span>LOADING MODULES</span>
            <span className="text-[#67E8F9] font-bold">{progress}%</span>
          </div>
          <div className="h-1.5 w-full bg-white/5 border border-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#67E8F9] rounded-full transition-all duration-150"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Terminal Log Console */}
        <div
          ref={scrollRef}
          className="h-28 bg-[#050608] border border-white/10 rounded-md p-3 text-xs font-mono overflow-y-auto space-y-1 text-[#A4A8AE] custom-scrollbar"
        >
          {messages.map((msg, index) => (
            <div key={index} className="flex items-start gap-2">
              <span className="text-[#67E8F9] select-none">&gt;</span>
              <span className={index === messages.length - 1 ? "text-[#F1F0EA]" : ""}>
                {msg}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
