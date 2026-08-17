"use client";

import { useState, useEffect } from "react";
import { CyberMatrixBackground } from "@/components/CyberMatrixBackground";
import { ShieldAlert, Clock, Terminal, Send } from "lucide-react";
import { logIntegrityEvent } from "../actions/integrity";
import { startTimedAssessments, submitAssessment } from "../actions/assessment";
import { useRouter } from "next/navigation";

export function AssessmentClient({ assessments }: { assessments: any[] }) {
  const router = useRouter();
  
  const [localAssessments, setLocalAssessments] = useState(assessments);
  const inProgressAssessments = localAssessments.filter(a => a.status === "IN_PROGRESS");
  const pendingAssessments = localAssessments.filter(a => a.status === "PENDING");
  
  const isTimedPhaseLocked = inProgressAssessments.length === 0 && pendingAssessments.length > 0;
  const currentAssessments = isTimedPhaseLocked ? pendingAssessments : inProgressAssessments;

  const [activeTab, setActiveTab] = useState(0);
  const initialTimeLeft = inProgressAssessments.reduce((total, a) => {
    if (!a.startedAt) return total + (a.timeRemaining || 0);
    const deadline = new Date(a.startedAt).getTime() + (a.timeRemaining || 1800) * 1000;
    const remaining = Math.max(0, Math.floor((deadline - Date.now()) / 1000));
    return total + remaining;
  }, 0);
  const [timeLeft, setTimeLeft] = useState<number | null>(initialTimeLeft > 0 ? initialTimeLeft : null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  useEffect(() => {
    if (timeLeft === null) return;
    if (timeLeft <= 0 && !isSubmitting) {
      handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev !== null ? Math.max(0, prev - 1) : null);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isSubmitting]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await submitAssessment(answers);
      
      if (pendingAssessments.length > 0) {
        setLocalAssessments(prev => prev.map(a => a.status === "IN_PROGRESS" ? { ...a, status: "COMPLETED" } : a));
        setActiveTab(0);
        setIsSubmitting(false);
      } else {
        router.push("/status");
      }
    } catch (e) {
      console.error(e);
      alert("Failed to submit assessment. Please try again.");
      setIsSubmitting(false);
    }
  };

  const handleStartTimed = async () => {
    setIsSubmitting(true);
    try {
      await startTimedAssessments();
      setLocalAssessments(prev => prev.map(a => a.status === "PENDING" ? { ...a, status: "IN_PROGRESS" } : a));
      setActiveTab(0);
      
      const newTime = pendingAssessments.reduce((acc, a) => acc + (a.timeRemaining || 0), 0);
      setTimeLeft(newTime > 0 ? newTime : null);
      setIsSubmitting(false);
    } catch(e) {
      console.error(e);
      alert("Failed to start timed assessment.");
      setIsSubmitting(false);
    }
  };

  // Anti-Cheat / Integrity Monitoring
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        logIntegrityEvent("PAGE_HIDDEN", "User switched tabs or minimized window");
      }
    };

    const blockAndLog = (e: Event, eventType: string, msg: string) => {
      e.preventDefault();
      logIntegrityEvent(eventType, msg);
    };

    const handleCopy = (e: ClipboardEvent) => blockAndLog(e, "COPY_ATTEMPT", "User attempted to copy text");
    const handlePaste = (e: ClipboardEvent) => blockAndLog(e, "PASTE_ATTEMPT", "User attempted to paste text");
    const handleCut = (e: ClipboardEvent) => blockAndLog(e, "CUT_ATTEMPT", "User attempted to cut text");
    const handleContextMenu = (e: MouseEvent) => blockAndLog(e, "CONTEXT_MENU_ATTEMPT", "User attempted to open context menu");
    const handleDragDrop = (e: DragEvent) => blockAndLog(e, "TEXT_DRAG_ATTEMPT", "User attempted to drag/drop text");

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && ['c', 'v', 'x', 'a'].includes(e.key.toLowerCase())) {
        e.preventDefault();
        logIntegrityEvent("KEYBOARD_SHORTCUT_ATTEMPT", `User attempted shortcut: ${e.ctrlKey ? 'Ctrl' : 'Cmd'}+${e.key.toUpperCase()}`);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("copy", handleCopy);
    document.addEventListener("paste", handlePaste);
    document.addEventListener("cut", handleCut);
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("dragover", handleDragDrop);
    document.addEventListener("drop", handleDragDrop);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("copy", handleCopy);
      document.removeEventListener("paste", handlePaste);
      document.removeEventListener("cut", handleCut);
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("dragover", handleDragDrop);
      document.removeEventListener("drop", handleDragDrop);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const currentAssessment = currentAssessments[activeTab];

  if (isTimedPhaseLocked) {
    return (
      <div className="relative min-h-screen flex flex-col items-center justify-center text-white bg-black/90">
        <CyberMatrixBackground />
        <div className="z-10 bg-black/60 p-10 border border-cyan-500/50 rounded max-w-lg text-center backdrop-blur-sm shadow-[0_0_30px_rgba(0,255,255,0.1)] cyber-bracket">
          <Terminal className="w-12 h-12 text-cyan-400 mx-auto mb-6" />
          <h2 className="text-2xl font-mono text-cyan-300 mb-4 font-bold tracking-widest uppercase">General Phase Complete</h2>
          <p className="text-cyan-100/70 mb-8 font-mono">
            You have successfully submitted the general questions. You now have a timed technical assessment for your remaining departments.
            The timer will begin as soon as you proceed.
          </p>
          <button 
            onClick={handleStartTimed}
            disabled={isSubmitting}
            className="inline-flex items-center justify-center border border-yellow-500 bg-yellow-950/20 text-yellow-400 px-8 py-4 text-xs uppercase tracking-widest hover:bg-yellow-500 hover:text-black transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "INITIALIZING..." : "BEGIN TIMED ASSESSMENT"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col text-white overflow-hidden bg-black/90">
      <CyberMatrixBackground />
      
      {/* Header */}
      <header className="z-10 flex items-center justify-between p-4 border-b border-cyan-500/30 bg-black/80 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <Terminal className="w-6 h-6 text-cyan-400" />
          <h1 className="font-mono text-xl font-bold tracking-widest text-cyan-400">CYSCOM // TERMINAL</h1>
        </div>
        
        {timeLeft !== null && (
          <div className="flex items-center gap-4 bg-cyan-950/50 px-4 py-2 rounded border border-cyan-500/50">
            <Clock className="w-5 h-5 text-cyan-300" />
            <span className="font-mono text-xl font-bold text-cyan-100">{formatTime(timeLeft)}</span>
          </div>
        )}
      </header>

      {/* Main Content */}
      <div className="z-10 flex flex-col md:flex-row flex-1 overflow-hidden">
        
        {/* Sidebar */}
        <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-cyan-500/30 bg-black/60 backdrop-blur-md p-4 flex flex-col gap-4 flex-shrink-0">
          <div className="text-xs font-mono text-cyan-500 mb-0 md:mb-2 uppercase tracking-widest hidden md:block">Departments</div>
          
          <div className="flex flex-row md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            {currentAssessments.map((assessment, idx) => (
              <button
                key={assessment.id}
                onClick={() => setActiveTab(idx)}
                className={`text-left font-mono p-3 rounded border transition-all whitespace-nowrap flex-shrink-0 ${
                  activeTab === idx 
                    ? "bg-cyan-900/50 border-cyan-400 text-cyan-100 shadow-[0_0_15px_rgba(0,255,255,0.2)]" 
                    : "bg-black/40 border-cyan-900/50 text-cyan-100/60 hover:border-cyan-500/50 hover:text-cyan-300"
                }`}
              >
                {assessment.departmentSelection.department} {assessment.timeRemaining ? "(Timed)" : "(General)"}
              </button>
            ))}
          </div>

          <div className="mt-auto p-4 bg-red-950/30 border border-red-500/30 rounded hidden md:block">
            <div className="flex items-center gap-2 text-red-400 mb-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span className="text-sm font-bold font-mono">INTEGRITY CHECK</span>
            </div>
            <p className="text-xs text-red-200/70 font-mono">
              Tab switching and copy-pasting is strictly monitored. Violations will flag your application.
            </p>
          </div>
        </aside>

        {/* Assessment Area */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto bg-black/40 backdrop-blur-sm">
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
                    <p className="text-cyan-50 mb-6 whitespace-pre-wrap select-none">{q.questionBank.description || q.questionBank.content}</p>
                    {q.questionBank.content?.options ? (
                      <div className="space-y-3">
                        {q.questionBank.content.options.map((opt: string, optIdx: number) => (
                          <label key={optIdx} className={`flex items-center gap-3 p-3 border rounded cursor-pointer transition-colors ${answers[q.id] === opt ? 'border-cyan-400 bg-cyan-900/30' : 'border-cyan-900/50 bg-black/40 hover:border-cyan-700'}`}>
                            <input 
                              type="radio" 
                              name={`q-${q.id}`} 
                              value={opt}
                              checked={answers[q.id] === opt}
                              onChange={() => setAnswers(prev => ({ ...prev, [q.id]: opt }))}
                              className="hidden"
                            />
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${answers[q.id] === opt ? 'border-cyan-400' : 'border-cyan-700'}`}>
                              {answers[q.id] === opt && <div className="w-2 h-2 rounded-full bg-cyan-400" />}
                            </div>
                            <span className="font-mono text-sm text-cyan-100">{opt}</span>
                          </label>
                        ))}
                      </div>
                    ) : q.questionBank.content?.subQuestions ? (
                      <div className="space-y-4">
                        {q.questionBank.content.subQuestions.map((subQ: string, subIdx: number) => {
                          const parsed = (() => {
                            try { return JSON.parse(answers[q.id] || "{}") } catch { return {} }
                          })();
                          return (
                            <div key={subIdx} className="space-y-2">
                              <label className="text-cyan-300 font-mono text-sm font-bold">{subQ}</label>
                              <textarea 
                                value={parsed[subQ] || ""}
                                onChange={(e) => {
                                  const newParsed = { ...parsed, [subQ]: e.target.value };
                                  setAnswers(prev => ({ ...prev, [q.id]: JSON.stringify(newParsed) }));
                                }}
                                className="w-full bg-cyan-950/30 border border-cyan-500/50 rounded p-4 font-mono text-cyan-100 min-h-[100px] focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
                                placeholder={`Enter your response for ${subQ}...`}
                              />
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <textarea 
                          value={answers[q.id] || ""}
                          onChange={(e) => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                          className="w-full bg-cyan-950/30 border border-cyan-500/50 rounded p-4 font-mono text-cyan-100 min-h-[250px] focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
                          placeholder="Enter your response here..."
                        />
                        <p className="text-xs text-cyan-500/60 font-mono italic">
                          * If this question asks for an upload or file, please paste your public Google Drive (or similar) link in the box above. Ensure access is set to "Anyone with the link".
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            
            <div className="pt-8 border-t border-cyan-500/30 flex justify-end">
              {activeTab < currentAssessments.length - 1 ? (
                <button 
                  onClick={() => setActiveTab(prev => prev + 1)}
                  className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-lg px-8 py-4 rounded shadow-[0_0_15px_rgba(0,255,255,0.4)] transition-all font-mono tracking-wider flex items-center"
                >
                  NEXT SECTION <Send className="w-5 h-5 ml-2" />
                </button>
              ) : (
                <button 
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-lg px-8 py-4 rounded shadow-[0_0_15px_rgba(0,255,255,0.4)] transition-all font-mono tracking-wider flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "SUBMITTING..." : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      SUBMIT ALL ASSESSMENTS
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
