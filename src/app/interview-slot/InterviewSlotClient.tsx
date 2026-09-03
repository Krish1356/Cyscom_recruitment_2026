"use client";

import { useState } from "react";
import { MainLayout } from "@/components/MainLayout";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { registerInterviewSession } from "@/app/actions/interview";
import { INTERVIEW_SESSIONS } from "@/lib/interview-sessions";
import { useRouter } from "next/navigation";

export function InterviewSlotClient({ 
  session, 
  pref1, 
  pref2, 
  availableSessions, 
  existingSelection 
}: any) {
  const router = useRouter();
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successSelection, setSuccessSelection] = useState<any>(existingSelection);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSession) return;

    setIsSubmitting(true);
    setError(null);

    const result = await registerInterviewSession(selectedSession as any);
    
    if (result.error) {
      setError(result.error);
      setIsSubmitting(false);
    } else {
      setSuccessSelection(result.selection);
      setIsSubmitting(false);
      router.refresh(); // refresh to update navbar state
    }
  };

  const getSessionDetails = (id: string) => {
    return INTERVIEW_SESSIONS[id as keyof typeof INTERVIEW_SESSIONS];
  };

  return (
    <MainLayout session={session}>
      <div className="pt-32 pb-24 px-6 min-h-[80vh] flex flex-col items-center relative z-10 font-mono text-[#F1F0EA]">
        <div className="w-full max-w-2xl">
          
          <div className="mb-10 text-center">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#F1F0EA] mb-4 font-orbitron uppercase">
              Interview Slot Selection
            </h1>
            <p className="text-[#A4A8AE] text-sm md:text-base">
              Secure your interview session for Stage 3 of the CYSCOM Recruitment Process.
            </p>
          </div>

          <div className="bg-[#10151A]/80 border border-white/10 p-6 md:p-8 rounded-sm shadow-[0_0_20px_rgba(0,0,0,0.5)] mb-8">
            <h2 className="text-[#67E8F9] text-xs font-bold tracking-widest uppercase mb-4 border-b border-white/10 pb-2">
              Your Profile Data
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
              <div>
                <div className="text-[10px] text-[#A4A8AE] uppercase tracking-widest mb-1">Preference 1</div>
                <div className="font-bold text-[#F1F0EA]">{pref1 || "NONE"}</div>
              </div>
              <div>
                <div className="text-[10px] text-[#A4A8AE] uppercase tracking-widest mb-1">Preference 2</div>
                <div className="font-bold text-[#F1F0EA]">{pref2 || "NONE"}</div>
              </div>
            </div>
            <p className="text-xs text-[#626A72] mt-4">
              Based on your department preferences, the following interview sessions are available.
            </p>
          </div>

          {successSelection ? (
            <div className="bg-[#050608] border border-emerald-500/30 p-8 rounded-sm shadow-[0_0_20px_rgba(16,185,129,0.1)] text-center">
              <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-emerald-400 mb-4 tracking-wider uppercase">
                Interview Slot Confirmed
              </h2>
              
              <div className="bg-[#10151A] border border-white/5 p-4 rounded-sm mb-8 text-left max-w-md mx-auto">
                <div className="text-[10px] text-[#A4A8AE] uppercase tracking-widest mb-1">Registered Session</div>
                <div className="font-bold text-lg text-[#F1F0EA] mb-1">
                  {getSessionDetails(successSelection.sessionId)?.label}
                </div>
              </div>

              <p className="text-sm text-[#A4A8AE] mb-8">
                Your interview session has been successfully registered. Further interview details and exact timings will be announced soon.
              </p>

              <div className="pt-6 border-t border-white/10">
                <p className="text-xs text-[#626A72] mb-4 uppercase tracking-widest">For further updates:</p>
                <a
                  href="https://chat.whatsapp.com/L0oAJwzieqaDSsuiKhNuh0?s=sh&p=i&mlu=0&ilr=4"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-8 py-3.5 bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/30 rounded-md font-bold tracking-wider hover:bg-[#25D366] hover:text-black transition-colors uppercase text-xs"
                >
                  Join WhatsApp Channel
                </a>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                {availableSessions.length === 0 ? (
                  <div className="text-center p-8 bg-[#10151A] border border-white/10 text-[#ef4444]">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                    No eligible sessions found for your department combination. Please contact support.
                  </div>
                ) : (
                  availableSessions.map((s: any) => {
                    const isSelected = selectedSession === s.id;
                    
                    return (
                      <label 
                        key={s.id} 
                        className={`block p-5 border rounded-sm cursor-pointer transition-all ${
                          s.isFull 
                            ? "bg-[#10151A]/50 border-white/5 opacity-60 cursor-not-allowed" 
                            : isSelected
                              ? "bg-[#00D9FF]/5 border-[#00D9FF]/50 shadow-[0_0_15px_rgba(0,217,255,0.1)]"
                              : "bg-[#10151A] border-white/10 hover:border-[#00D9FF]/30"
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div className="pt-1 flex-shrink-0">
                            <input 
                              type="radio" 
                              name="session" 
                              value={s.id}
                              disabled={s.isFull}
                              checked={isSelected}
                              onChange={() => setSelectedSession(s.id)}
                              className="w-4 h-4 accent-[#00D9FF] cursor-pointer disabled:cursor-not-allowed"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between flex-wrap gap-2">
                              <div className={`font-bold ${s.isFull ? "text-[#626A72]" : (isSelected ? "text-[#F1F0EA]" : "text-[#A4A8AE]")}`}>
                                {s.label}
                              </div>
                              <div className={`text-[10px] tracking-widest uppercase px-2 py-1 rounded-sm border ${
                                s.isFull 
                                  ? "bg-red-500/10 text-red-400 border-red-500/20" 
                                  : "bg-[#67E8F9]/10 text-[#67E8F9] border-[#67E8F9]/20"
                              }`}>
                                {s.isFull ? "FULL" : `${s.capacity - s.registered} Seats Left`}
                              </div>
                            </div>
                            <div className="text-xs text-[#626A72] mt-2">
                              Capacity: {s.registered} / {s.capacity}
                            </div>
                          </div>
                        </div>
                      </label>
                    );
                  })
                )}
              </div>

              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={!selectedSession || isSubmitting}
                className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-[#67E8F9] text-[#050608] border border-[#67E8F9] rounded-sm font-bold tracking-wider hover:bg-[#22D3EE] transition-colors shadow-[0_0_15px_rgba(103,232,249,0.2)] disabled:opacity-50 disabled:cursor-not-allowed uppercase"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Confirm Interview Session"
                )}
              </button>
            </form>
          )}

        </div>
      </div>
    </MainLayout>
  );
}
