"use client";

import { useState, useEffect } from "react";
import { CyberMatrixBackground } from "@/components/CyberMatrixBackground";
import { ShieldAlert, Clock, Terminal, Send } from "lucide-react";

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



  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const currentAssessment = currentAssessments[activeTab];

  if (isTimedPhaseLocked) {
    return (
      <div className="relative min-h-screen flex flex-col items-center justify-center text-gray-300 bg-[#0A0A0A] font-mono p-4">
        <div className="z-10 bg-[#111111] p-8 border border-gray-800 rounded-sm max-w-lg text-center w-full shadow-2xl">
          <Terminal className="w-8 h-8 text-gray-400 mx-auto mb-4" />
          <h2 className="text-lg text-gray-200 mb-4 font-bold uppercase tracking-widest border-b border-gray-800 pb-4">
            STATUS: GENERAL PHASE COMPLETE
          </h2>
          <p className="text-gray-400 mb-8 text-sm leading-relaxed text-left">
            &gt; You have successfully submitted the general questions.
            <br /><br />
            &gt; You now have a timed technical assessment for your remaining departments. The timer will begin as soon as you proceed.
          </p>
          <button 
            onClick={handleStartTimed}
            disabled={isSubmitting}
            className="w-full inline-flex items-center justify-center border border-gray-700 bg-[#1A1A1A] text-gray-300 px-8 py-4 text-xs uppercase tracking-widest hover:border-[#4ade80] hover:text-[#4ade80] transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "[ INITIALIZING... ]" : "[ BEGIN TIMED ASSESSMENT ]"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col text-gray-300 overflow-hidden bg-[#0A0A0A] font-mono selection:bg-[#4ade80] selection:text-[#0A0A0A]">
      
      {/* Header */}
      <header className="z-10 flex flex-col sm:flex-row sm:items-center justify-between p-4 border-b border-gray-800 bg-[#111111] gap-4">
        <div className="flex items-center gap-3">
          <Terminal className="w-5 h-5 text-gray-500" />
          <div className="flex flex-col">
            <h1 className="text-sm font-bold tracking-widest text-gray-200">CYSCOM ASSESSMENT TERMINAL</h1>
            <span className="text-xs text-gray-500">SESSION: ACTIVE</span>
          </div>
        </div>
        
        {timeLeft !== null && (
          <div className="flex items-center gap-3 bg-[#1A1A1A] px-4 py-2 border border-gray-800 rounded-sm">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className={`text-sm font-bold tracking-widest ${timeLeft < 300 ? 'text-red-400' : timeLeft < 600 ? 'text-amber-400' : 'text-gray-200'}`}>
              [ TIMER ] {formatTime(timeLeft)}
            </span>
          </div>
        )}
      </header>

      {/* Main Content */}
      <div className="z-10 flex flex-col md:flex-row flex-1 overflow-hidden">
        
        {/* Sidebar */}
        <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-gray-800 bg-[#111111] p-4 flex flex-col gap-2 flex-shrink-0">
          <div className="text-xs text-gray-500 mb-2 uppercase tracking-widest">/departments/</div>
          
          <div className="flex flex-row md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            {currentAssessments.map((assessment, idx) => (
              <button
                key={assessment.id}
                onClick={() => {
                  setActiveTab(idx);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`text-left text-xs p-3 rounded-sm border transition-all whitespace-nowrap flex-shrink-0 ${
                  activeTab === idx 
                    ? "bg-[#1A1A1A] border-[#4ade80] text-[#4ade80]" 
                    : "bg-transparent border-gray-800 text-gray-400 hover:border-gray-600 hover:text-gray-200"
                }`}
              >
                {activeTab === idx ? '> ' : '  '}
                {assessment.departmentSelection.department} {assessment.timeRemaining ? "(Timed)" : "(General)"}
              </button>
            ))}
          </div>
        </aside>

        {/* Assessment Area */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto bg-[#0A0A0A]">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="border-b border-gray-800 pb-4">
              <h2 className="text-sm font-bold text-gray-200 uppercase tracking-widest">
                $ view-assessment --dept="{currentAssessment?.departmentSelection.department}"
              </h2>
            </div>
            
            {currentAssessment?.questions.length === 0 ? (
              <div className="p-8 text-center border border-gray-800 bg-[#111111] rounded-sm text-gray-500 text-sm">
                &gt; No questions available for this department yet.
              </div>
            ) : (
              <div className="space-y-12">
                {currentAssessment?.questions.map((q: any, i: number) => (
                  <div key={q.id} className="space-y-4">
                    <div className="text-xs text-gray-500 uppercase tracking-widest">
                      $ assessment --question {String(i + 1).padStart(2, '0')}
                    </div>
                    
                    <p className="text-gray-300 whitespace-pre-wrap select-none leading-relaxed text-sm md:text-base">
                      {q.questionBank.description || q.questionBank.content}
                    </p>
                    
                    {q.questionBank.content?.options ? (
                      <div className="space-y-2 mt-4">
                        {q.questionBank.content.options.map((opt: string, optIdx: number) => {
                          const optionLabel = String.fromCharCode(65 + optIdx); // A, B, C, D...
                          const isSelected = answers[q.id] === opt;
                          return (
                            <label 
                              key={optIdx} 
                              className={`flex items-start gap-4 p-4 border rounded-sm cursor-pointer transition-colors ${
                                isSelected 
                                  ? 'border-[#4ade80] bg-[#112211] text-[#4ade80]' 
                                  : 'border-gray-800 bg-[#111111] hover:border-gray-600 text-gray-400'
                              }`}
                            >
                              <input 
                                type="radio" 
                                name={`q-${q.id}`} 
                                value={opt}
                                checked={isSelected}
                                onChange={() => setAnswers(prev => ({ ...prev, [q.id]: opt }))}
                                className="hidden"
                              />
                              <span className="font-bold shrink-0 mt-0.5">
                                [ {optionLabel} ]
                              </span>
                              <span className={`text-sm ${isSelected ? 'text-[#4ade80]' : 'text-gray-300'}`}>
                                {opt}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    ) : q.questionBank.content?.subQuestions ? (
                      <div className="space-y-6 mt-6">
                        {q.questionBank.content.subQuestions.map((subQ: string, subIdx: number) => {
                          const parsed = (() => {
                            try { return JSON.parse(answers[q.id] || "{}") } catch { return {} }
                          })();
                          return (
                            <div key={subIdx} className="space-y-2">
                              <label className="text-gray-400 text-xs font-bold uppercase tracking-widest">
                                &gt; {subQ}
                              </label>
                              <textarea 
                                value={parsed[subQ] || ""}
                                onChange={(e) => {
                                  const newParsed = { ...parsed, [subQ]: e.target.value };
                                  setAnswers(prev => ({ ...prev, [q.id]: JSON.stringify(newParsed) }));
                                }}
                                className="w-full bg-[#111111] border border-gray-800 rounded-sm p-4 text-gray-300 text-sm min-h-[100px] focus:outline-none focus:border-[#4ade80] focus:ring-1 focus:ring-[#4ade80]/50 transition-colors placeholder:text-gray-700"
                                placeholder="..."
                              />
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="space-y-2 mt-6">
                        <textarea 
                          value={answers[q.id] || ""}
                          onChange={(e) => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                          className="w-full bg-[#111111] border border-gray-800 rounded-sm p-4 text-gray-300 text-sm min-h-[200px] focus:outline-none focus:border-[#4ade80] focus:ring-1 focus:ring-[#4ade80]/50 transition-colors placeholder:text-gray-700"
                          placeholder="> Enter response here..."
                        />
                        <p className="text-xs text-gray-600 italic">
                          &gt; Note: If this question requires a file, paste a public link (e.g. Google Drive with "Anyone with link" access) above.
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            
            <div className="pt-12 mt-12 border-t border-gray-800 flex justify-between items-center">
              <div className="text-xs text-gray-500 uppercase tracking-widest hidden sm:block">
                STATUS: READY
              </div>
              <div className="flex justify-end w-full sm:w-auto">
                {activeTab < currentAssessments.length - 1 ? (
                  <button 
                    onClick={() => {
                      setActiveTab(prev => prev + 1);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="bg-transparent border border-gray-700 hover:border-[#4ade80] hover:text-[#4ade80] text-gray-300 font-bold text-sm px-6 py-3 rounded-sm transition-all tracking-wider flex items-center"
                  >
                    [ NEXT → ]
                  </button>
                ) : (
                  <button 
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="bg-transparent border border-gray-700 hover:border-[#4ade80] hover:text-[#4ade80] text-gray-300 font-bold text-sm px-6 py-3 rounded-sm transition-all tracking-wider flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "[ SUBMITTING... ]" : "[ SUBMIT ALL ASSESSMENTS ]"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
