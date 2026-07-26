"use client";

import { useState, useEffect } from "react";
import { CyberMatrixBackground } from "@/components/CyberMatrixBackground";
import { ShieldAlert, Clock, Terminal, Send } from "lucide-react";
import { logIntegrityEvent } from "../actions/integrity";
import { submitAssessment } from "../actions/assessment";
import { useRouter } from "next/navigation";

export function AssessmentClient({ assessments }: { assessments: any[] }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300); // 5 mins
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0 && !isSubmitting) {
      handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isSubmitting]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await submitAssessment();
      router.push("/dashboard");
    } catch (e) {
      console.error(e);
      alert("Failed to submit assessment. Please try again.");
      setIsSubmitting(false);
    }
  };

  // Anti-Cheat / Integrity Monitoring
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        logIntegrityEvent("TAB_SWITCH", "User switched tabs or minimized window");
        alert("WARNING: Tab switching is strictly prohibited and has been recorded.");
      }
    };

    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      logIntegrityEvent("COPY", "User attempted to copy text");
    };

    const handlePaste = (e: ClipboardEvent) => {
      e.preventDefault();
      logIntegrityEvent("PASTE", "User attempted to paste text");
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      logIntegrityEvent("RIGHT_CLICK", "User attempted to open context menu");
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("copy", handleCopy);
    document.addEventListener("paste", handlePaste);
    document.addEventListener("contextmenu", handleContextMenu);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("copy", handleCopy);
      document.removeEventListener("paste", handlePaste);
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const currentAssessment = assessments[activeTab];

  return (
    <div className="relative min-h-screen flex flex-col text-white overflow-hidden bg-black/90">
      <CyberMatrixBackground />
      
      {/* Header */}
      <header className="z-10 flex items-center justify-between p-4 border-b border-cyan-500/30 bg-black/80 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <Terminal className="w-6 h-6 text-cyan-400" />
          <h1 className="font-mono text-xl font-bold tracking-widest text-cyan-400">CYSCOM // TERMINAL</h1>
        </div>
        
        <div className="flex items-center gap-4 bg-cyan-950/50 px-4 py-2 rounded border border-cyan-500/50">
          <Clock className="w-5 h-5 text-cyan-300" />
          <span className="font-mono text-xl font-bold text-cyan-100">{formatTime(timeLeft)}</span>
        </div>
      </header>

      {/* Main Content */}
      <div className="z-10 flex flex-1 overflow-hidden">
        
        {/* Sidebar */}
        <aside className="w-64 border-r border-cyan-500/30 bg-black/60 backdrop-blur-md p-4 flex flex-col gap-4">
          <div className="text-xs font-mono text-cyan-500 mb-2 uppercase tracking-widest">Departments</div>
          {assessments.map((assessment, idx) => (
            <button
              key={assessment.id}
              onClick={() => setActiveTab(idx)}
              className={`text-left font-mono p-3 rounded border transition-all ${
                activeTab === idx 
                  ? "bg-cyan-900/50 border-cyan-400 text-cyan-100 shadow-[0_0_15px_rgba(0,255,255,0.2)]" 
                  : "bg-black/40 border-cyan-900/50 text-cyan-100/60 hover:border-cyan-500/50 hover:text-cyan-300"
              }`}
            >
              {assessment.departmentSelection.department}
            </button>
          ))}

          <div className="mt-auto p-4 bg-red-950/30 border border-red-500/30 rounded">
            <div className="flex items-center gap-2 text-red-400 mb-2">
              <ShieldAlert className="w-4 h-4" />
              <span className="text-sm font-bold font-mono">INTEGRITY CHECK</span>
            </div>
            <p className="text-xs text-red-200/70 font-mono">
              Tab switching and copy-pasting is strictly monitored. Violations will flag your application.
            </p>
          </div>
        </aside>

        {/* Assessment Area */}
        <main className="flex-1 p-8 overflow-y-auto bg-black/40 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto space-y-8">
            <h2 className="text-2xl font-mono font-bold text-cyan-300 border-b border-cyan-500/30 pb-4">
              {currentAssessment?.departmentSelection.department} Assessment
            </h2>
            
            {currentAssessment?.questions.length === 0 ? (
              <div className="p-8 text-center border border-cyan-500/20 bg-cyan-950/20 rounded text-cyan-100/60 font-mono">
                No questions available for this department yet.
              </div>
            ) : (
              <div className="space-y-6">
                {currentAssessment?.questions.map((q: any, i: number) => (
                  <div key={q.id} className="p-6 border border-cyan-500/30 bg-black/60 rounded">
                    <h3 className="font-mono text-cyan-400 font-bold mb-4">Question {i + 1}</h3>
                    <p className="text-cyan-50 mb-6">{q.questionBank.title}</p>
                    <textarea 
                      className="w-full bg-cyan-950/30 border border-cyan-500/50 rounded p-4 font-mono text-cyan-100 min-h-[150px] focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                      placeholder="Enter your response here..."
                    />
                  </div>
                ))}
              </div>
            )}
            
            <div className="pt-8 border-t border-cyan-500/30 flex justify-end">
              <button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-lg px-8 py-4 rounded shadow-[0_0_15px_rgba(0,255,255,0.4)] transition-all font-mono tracking-wider flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "SUBMITTING..." : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    SUBMIT ASSESSMENT
                  </>
                )}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
