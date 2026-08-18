"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { AssessmentLaunchOverlay } from "@/components/ui/AssessmentLaunchOverlay";
import { Clock, Terminal } from "lucide-react";
import { startTimedAssessments, submitAssessment } from "../actions/assessment";
import { useRouter } from "next/navigation";

// Use the existing 3D Cyber Topology Background from the Homepage
const CyberTopologyCanvas = dynamic(
  () => import("@/components/canvas/CyberTopologyCanvas"),
  { ssr: false }
);

type HistoryItem = {
  id: string;
  type: "system" | "question" | "answer" | "error" | "command";
  content: string | React.ReactNode;
};

export function AssessmentClient({ assessments, serverTime }: { assessments: any[], serverTime: number }) {
  const router = useRouter();
  
  const [localAssessments, setLocalAssessments] = useState(assessments);
  const [showLaunchOverlay, setShowLaunchOverlay] = useState(false);
  
  // Calculate local clock skew offset to synchronize perfectly with the backend
  const [clockOffset] = useState(() => Date.now() - serverTime);
  const getRealNow = () => Date.now() - clockOffset;
  
  const inProgressAssessments = localAssessments.filter(a => a.status === "IN_PROGRESS");
  const pendingAssessments = localAssessments.filter(a => a.status === "PENDING");
  
  const isTimedPhaseLocked = inProgressAssessments.length === 0 && pendingAssessments.length > 0;
  const currentAssessments = isTimedPhaseLocked ? pendingAssessments : inProgressAssessments;

  const [activeTab, setActiveTab] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentSubIndex, setCurrentSubIndex] = useState(0);
  
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const historyEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Time management
  const initialTimeLeft = (() => {
    if (inProgressAssessments.length === 0) return 0;
    
    const timedAssessments = inProgressAssessments.filter(a => a.timeRemaining !== null && a.timeRemaining > 0);
    if (timedAssessments.length === 0) return 0;

    const totalTimeAllocated = timedAssessments.reduce((sum, a) => sum + a.timeRemaining, 0);
    const startedAt = timedAssessments.find(a => a.startedAt)?.startedAt;
    
    if (!startedAt) return totalTimeAllocated;
    
    // Allow negative time so the useEffect can instantly trigger a submit if the clock says we're late
    const timeElapsed = Math.floor((getRealNow() - new Date(startedAt).getTime()) / 1000);
    return totalTimeAllocated - timeElapsed;
  })();
  
  // If there are timed assessments, we MUST track timeLeft (even if it's <= 0) to trigger auto-submit
  const hasTimedAssessments = inProgressAssessments.some(a => a.timeRemaining && a.timeRemaining > 0);
  const [timeLeft, setTimeLeft] = useState<number | null>(hasTimedAssessments ? initialTimeLeft : null);

  useEffect(() => {
    if (timeLeft === null) return;
    if (timeLeft <= 0 && !isSubmitting) {
      handleFinalSubmit();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft(prev => prev !== null ? Math.max(0, prev - 1) : null);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isSubmitting]);

  // Scroll to bottom on history change
  useEffect(() => {
    historyEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  // Auto-focus input
  useEffect(() => {
    if (!isTimedPhaseLocked) {
      inputRef.current?.focus();
    }
  }, [isTimedPhaseLocked, activeTab, currentQuestionIndex, currentSubIndex]);

  const pushHistory = (type: HistoryItem["type"], content: string | React.ReactNode) => {
    setHistory(prev => [...prev, { id: Math.random().toString(36).substr(2, 9), type, content }]);
  };

  // Initialization & Question Printing
  const currentAssessment = currentAssessments[activeTab];
  const question = currentAssessment?.questions[currentQuestionIndex];
  
  // Track last printed context to avoid re-printing on every render
  const lastPrintedRef = useRef<string>("");

  useEffect(() => {
    if (!currentAssessment) return;
    
    const contextKey = `${currentAssessment.id}-${currentQuestionIndex}-${currentSubIndex}`;
    if (lastPrintedRef.current === contextKey) return;
    lastPrintedRef.current = contextKey;

    if (currentQuestionIndex === 0 && currentSubIndex === 0) {
      pushHistory("system", `--- INITIALIZING ${currentAssessment.departmentSelection.department} ASSESSMENT ---`);
    }

    if (!question) {
      pushHistory("system", `You have reached the end of the ${currentAssessment.departmentSelection.department} section. Type '/next' to proceed to the next department, or '/finish' to submit all.`);
      return;
    }

    // Print Question
    if (currentSubIndex === 0) {
      pushHistory("question", `[Q${currentQuestionIndex + 1}] ${question.questionBank.description || question.questionBank.content}`);
    }

    if (question.questionBank.content?.options) {
      const options = question.questionBank.content.options;
      const optsRender = (
        <div className="ml-4 mt-2 space-y-1">
          {options.map((opt: string, idx: number) => (
            <div key={idx} className="text-gray-300">[{idx + 1}] {opt}</div>
          ))}
          <div className="text-gray-500 italic mt-2">* Type the option number to select (e.g., '1')</div>
        </div>
      );
      pushHistory("system", optsRender);
    } else if (question.questionBank.content?.subQuestions) {
      const subQ = question.questionBank.content.subQuestions[currentSubIndex];
      pushHistory("question", `> Sub-question: ${subQ}`);
    } else {
      pushHistory("system", <div className="text-gray-500 italic">* Type your response. Press Ctrl+Enter to submit.</div>);
    }
    
  }, [activeTab, currentQuestionIndex, currentSubIndex, currentAssessment, question]);

  const handleCommand = (cmd: string) => {
    const parts = cmd.toLowerCase().trim().split(" ");
    const command = parts[0];

    switch (command) {
      case "/help":
        pushHistory("system", (
          <div className="ml-4 space-y-1">
            <div><strong className="text-white">/next</strong>       - Skip to the next question or department</div>
            <div><strong className="text-white">/back</strong>       - Return to the previous question</div>
            <div><strong className="text-white">/departments</strong>- List all assessment departments</div>
            <div><strong className="text-white">/switch [num]</strong>- Switch to a specific department</div>
            <div><strong className="text-white">/finish</strong>     - Submit the entire assessment</div>
            <div><strong className="text-white">/clear</strong>      - Clear the terminal screen</div>
          </div>
        ));
        break;
      case "/clear":
        setHistory([]);
        // Re-print current state
        lastPrintedRef.current = "";
        break;
      case "/next":
        advanceQuestion();
        break;
      case "/back":
        regressQuestion();
        break;
      case "/departments":
        pushHistory("system", (
          <div className="ml-4 space-y-1">
            {currentAssessments.map((a, idx) => (
              <div key={a.id}>
                <strong className="text-white">[{idx + 1}]</strong> {a.departmentSelection.department} {a.timeRemaining ? "(Timed)" : "(General)"}
                {idx === activeTab ? " <-- (Active)" : ""}
              </div>
            ))}
          </div>
        ));
        break;
      case "/switch":
        const idx = parseInt(parts[1]) - 1;
        if (idx >= 0 && idx < currentAssessments.length) {
          setActiveTab(idx);
          setCurrentQuestionIndex(0);
          setCurrentSubIndex(0);
        } else {
          pushHistory("error", "Invalid department number. Type '/departments' to see the list.");
        }
        break;
      case "/finish":
        handleFinalSubmit();
        break;
      default:
        pushHistory("error", `Command not found: ${command}. Type '/help' for a list of commands.`);
    }
  };

  const advanceQuestion = () => {
    if (!question) {
      // At the end of a department
      if (activeTab < currentAssessments.length - 1) {
        setActiveTab(prev => prev + 1);
        setCurrentQuestionIndex(0);
        setCurrentSubIndex(0);
      } else {
        pushHistory("system", "All departments completed. Type '/finish' to submit your assessments.");
      }
      return;
    }

    if (question.questionBank.content?.subQuestions) {
      if (currentSubIndex < question.questionBank.content.subQuestions.length - 1) {
        setCurrentSubIndex(prev => prev + 1);
        return;
      }
    }

    // Move to next question
    setCurrentQuestionIndex(prev => prev + 1);
    setCurrentSubIndex(0);
  };

  const regressQuestion = () => {
    if (currentSubIndex > 0) {
      setCurrentSubIndex(prev => prev - 1);
      return;
    }
    
    if (currentQuestionIndex > 0) {
      const prevQIdx = currentQuestionIndex - 1;
      const prevQ = currentAssessment?.questions[prevQIdx];
      setCurrentQuestionIndex(prevQIdx);
      if (prevQ?.questionBank.content?.subQuestions) {
        setCurrentSubIndex(prevQ.questionBank.content.subQuestions.length - 1);
      } else {
        setCurrentSubIndex(0);
      }
      return;
    }

    if (activeTab > 0) {
      const prevTab = activeTab - 1;
      setActiveTab(prevTab);
      const targetAssessment = currentAssessments[prevTab];
      const targetQIdx = Math.max(0, targetAssessment.questions.length - 1);
      setCurrentQuestionIndex(targetQIdx);
      const targetQ = targetAssessment.questions[targetQIdx];
      if (targetQ?.questionBank.content?.subQuestions) {
        setCurrentSubIndex(targetQ.questionBank.content.subQuestions.length - 1);
      } else {
        setCurrentSubIndex(0);
      }
      return;
    }
    
    pushHistory("error", "Already at the beginning of the assessment.");
  };

  const saveAnswer = (input: string) => {
    if (!question) return;

    let finalAnswer = input;

    // Handle multiple choice parsing
    if (question.questionBank.content?.options) {
      const num = parseInt(input.trim());
      const opts = question.questionBank.content.options;
      if (!isNaN(num) && num > 0 && num <= opts.length) {
        finalAnswer = opts[num - 1];
      } else {
        // Find if they typed the text directly
        const matched = opts.find((o: string) => o.toLowerCase() === input.trim().toLowerCase());
        if (matched) finalAnswer = matched;
        else {
          pushHistory("error", "Invalid option. Please type the option number.");
          return false;
        }
      }
    }

    // Handle Subquestions JSON storage
    if (question.questionBank.content?.subQuestions) {
      const subQ = question.questionBank.content.subQuestions[currentSubIndex];
      setAnswers(prev => {
        let currentParsed = {};
        try { currentParsed = JSON.parse(prev[question.id] || "{}"); } catch {}
        return {
          ...prev,
          [question.id]: JSON.stringify({ ...currentParsed, [subQ]: finalAnswer })
        };
      });
    } else {
      setAnswers(prev => ({ ...prev, [question.id]: finalAnswer }));
    }

    return true;
  };

  const handleInputSubmit = () => {
    const val = inputValue.trim();
    if (!val) return;
    
    setInputValue("");
    
    // Always print what the user typed
    pushHistory("answer", `> ${val}`);

    if (val.startsWith("/")) {
      handleCommand(val);
      return;
    }

    if (!question) {
      pushHistory("error", "No active question. Type '/next' or '/finish'.");
      return;
    }

    const saved = saveAnswer(val);
    if (saved) {
      advanceQuestion();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleInputSubmit();
    }
  };

  const handleFinalSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    pushHistory("system", "--- INITIATING SECURE TRANSMISSION ---");
    try {
      const result = await submitAssessment(answers);
      
      if (result && !result.success) {
        if (result.error === "deadline") {
          pushHistory("error", "Transmission failed: Deadline passed. Assessment locked.");
          return;
        }
        throw new Error(result.error || "Unknown transmission error");
      }

      pushHistory("system", "Payload transmitted successfully.");
      
      if (pendingAssessments.length > 0) {
        setLocalAssessments(prev => prev.map(a => a.status === "IN_PROGRESS" ? { ...a, status: "COMPLETED" } : a));
        setActiveTab(0);
        setCurrentQuestionIndex(0);
        setCurrentSubIndex(0);
        setHistory([]);
        lastPrintedRef.current = "";
        setIsSubmitting(false);
      } else {
        setTimeout(() => router.push("/status"), 1500);
      }
    } catch (e: any) {
      console.error(e);
      if (e?.message?.includes("deadline") || String(e).includes("deadline")) {
        pushHistory("error", "Transmission failed: Deadline passed. Please contact an admin.");
      } else {
        pushHistory("error", "Transmission failed. Next attempt in 10 seconds...");
        setTimeout(() => setIsSubmitting(false), 10000);
      }
    }
  };

  const executeStartTimed = async () => {
    setIsSubmitting(true);
    try {
      await startTimedAssessments();
      setLocalAssessments(prev => prev.map(a => a.status === "PENDING" ? { ...a, status: "IN_PROGRESS" } : a));
      setActiveTab(0);
      setCurrentQuestionIndex(0);
      setCurrentSubIndex(0);
      setHistory([]);
      lastPrintedRef.current = "";
      
      const newTime = pendingAssessments.reduce((acc, a) => acc + (a.timeRemaining || 0), 0);
      setTimeLeft(newTime > 0 ? newTime : null);
      setIsSubmitting(false);
      setShowLaunchOverlay(false);
    } catch(e) {
      console.error(e);
      alert("Failed to start timed assessment.");
      setIsSubmitting(false);
      setShowLaunchOverlay(false);
    }
  };

  const formatTime = (seconds: number) => {
    const absSeconds = Math.max(0, seconds);
    const m = Math.floor(absSeconds / 60);
    const s = absSeconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (isTimedPhaseLocked) {
    return (
      <div className="relative min-h-screen flex flex-col items-center justify-center text-white bg-[#000000] font-mono">
        {showLaunchOverlay && (
          <AssessmentLaunchOverlay onComplete={executeStartTimed} />
        )}
        <div className="z-10 max-w-2xl text-center space-y-6">
          <Terminal className="w-16 h-16 text-white mx-auto mb-6" />
          <h2 className="text-2xl font-bold tracking-widest uppercase">General Phase Complete</h2>
          <p className="text-gray-400 leading-relaxed">
            You have successfully submitted the general questions. You now have a timed technical assessment for your remaining departments.
            The timer will begin as soon as you proceed.
          </p>
          <button 
            onClick={() => setShowLaunchOverlay(true)}
            disabled={isSubmitting}
            className="inline-flex items-center justify-center border border-white bg-white text-black font-bold px-8 py-4 text-xs uppercase tracking-widest hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "INITIALIZING..." : "BEGIN TIMED ASSESSMENT"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen flex flex-col bg-[#000000] text-gray-200 overflow-hidden font-mono text-sm sm:text-base">
      
      {/* 3D Background - Kept very subtle */}
      <div className="fixed inset-0 z-[0] pointer-events-none opacity-40">
        <div className="absolute inset-0 bg-[#000000]" />
        <div className="absolute inset-0 grayscale">
          <CyberTopologyCanvas />
        </div>
        <div className="absolute inset-0 bg-black/50" />
      </div>
      
      {/* Header */}
      <header className="z-10 flex flex-col sm:flex-row items-center justify-between p-4 border-b border-gray-800 bg-black/90">
        <div className="flex items-center gap-3">
          <Terminal className="w-5 h-5 text-gray-400" />
          <h1 className="font-bold tracking-widest text-gray-300">CYSCOM // TERMINAL</h1>
          <span className="text-gray-600 hidden sm:inline">| {currentAssessment?.departmentSelection.department}</span>
        </div>
        
        {timeLeft !== null && (
          <div className="flex items-center gap-3 mt-2 sm:mt-0">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="font-bold text-white tracking-widest">{formatTime(timeLeft)}</span>
          </div>
        )}
      </header>

      {/* Main Terminal Window */}
      <main className="z-10 flex-1 flex flex-col overflow-hidden bg-transparent">
        
        {/* Terminal History */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
          <div className="text-gray-600 mb-6">
            <p>Welcome to CYSCOM Secure Assessment Terminal v2.0</p>
            <p>Type '/help' for a list of available commands.</p>
          </div>

          {history.map((item) => (
            <div key={item.id} className={`leading-relaxed ${
              item.type === "question" ? "text-white font-bold mt-6" :
              item.type === "system" ? "text-gray-400" :
              item.type === "error" ? "text-red-400" :
              "text-green-400" // answer or command
            }`}>
              {item.content}
            </div>
          ))}
          <div ref={historyEndRef} />
        </div>

        {/* Active Prompt Area */}
        <div className="border-t border-gray-800 bg-black p-4 flex flex-col gap-2 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
          <div className="flex items-start gap-2">
            <span className="text-green-500 mt-1 font-bold">$&gt;</span>
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full bg-transparent border-none outline-none resize-none text-white font-mono leading-relaxed min-h-[4rem] max-h-[40vh] py-1"
              placeholder="Type your response here..."
              disabled={isSubmitting}
              autoFocus
            />
          </div>
          <div className="flex justify-between items-center text-xs text-gray-600 select-none">
            <span>[Ctrl+Enter to Submit] or [Type /help]</span>
            <button 
              onClick={handleInputSubmit}
              className="hover:text-white transition-colors"
            >
              EXECUTE
            </button>
          </div>
        </div>

      </main>
    </div>
  );
}
