"use client";

import { useEffect, useState } from "react";
import { getApplicantQuickReview, shortlistCandidate } from "../actions/admin";

export function QuickReviewModal({ 
  applicantId, 
  isOpen, 
  onClose 
}: { 
  applicantId: string; 
  isOpen: boolean; 
  onClose: () => void;
}) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [shortlisting, setShortlisting] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && applicantId) {
      setLoading(true);
      getApplicantQuickReview(applicantId)
        .then((res) => setData(res))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [isOpen, applicantId]);

  if (!isOpen) return null;

  const handleShortlist = async (deptId: string) => {
    setShortlisting(deptId);
    try {
      await shortlistCandidate(applicantId);
      // Update local state to reflect the change
      setData((prev: any) => ({
        ...prev,
        overallStatus: "SHORTLISTED"
      }));
    } catch (e) {
      alert("Failed to shortlist");
    } finally {
      setShortlisting(null);
    }
  };

  const tabSwitches = data?.assessmentSession?.events?.filter((e: any) => e.eventType === "TAB_SWITCH").length || 0;
  const copies = data?.assessmentSession?.events?.filter((e: any) => e.eventType === "COPY").length || 0;
  const pastes = data?.assessmentSession?.events?.filter((e: any) => e.eventType === "PASTE").length || 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="bg-[#030710] border border-cyan-500/50 text-cyan-500 w-full max-w-2xl rounded-none shadow-[0_0_30px_rgba(0,255,255,0.1)] flex flex-col overflow-hidden max-h-[90vh] cyber-bracket font-mono">
        
        {loading || !data ? (
          <div className="p-8 text-center text-[10px] uppercase tracking-widest text-cyan-400">LOADING DOSSIER...</div>
        ) : (
          <>
            <div className="p-6 overflow-y-auto flex-1 text-sm space-y-4">
              {/* Integrity Tracking */}
              {data.assessmentSession && (
                <div className="mb-6 p-4 bg-cyan-950/20 rounded-none border border-cyan-500/30">
                  <h3 className="font-bold tracking-widest text-cyan-400 text-[10px] uppercase mb-4">INTEGRITY TRACKING</h3>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="bg-[#060A13] border border-cyan-500/30 p-2 rounded-none">
                      <p className={`text-xl font-mono font-bold ${tabSwitches > 0 ? 'text-red-400' : 'text-cyan-400'}`}>{tabSwitches}</p>
                      <p className="text-[9px] text-cyan-600 uppercase tracking-widest mt-1">TAB SWITCHES</p>
                    </div>
                    <div className="bg-[#060A13] border border-cyan-500/30 p-2 rounded-none">
                      <p className={`text-xl font-mono font-bold ${copies > 0 ? 'text-amber-400' : 'text-cyan-400'}`}>{copies}</p>
                      <p className="text-[9px] text-cyan-600 uppercase tracking-widest mt-1">COPY ATTEMPTS</p>
                    </div>
                    <div className="bg-[#060A13] border border-cyan-500/30 p-2 rounded-none">
                      <p className={`text-xl font-mono font-bold ${pastes > 0 ? 'text-amber-400' : 'text-cyan-400'}`}>{pastes}</p>
                      <p className="text-[9px] text-cyan-600 uppercase tracking-widest mt-1">PASTE ATTEMPTS</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Combine all answers into one list for a quick read */}
              {data.departments.map((dept: any) => (
                <div key={dept.id} className="mb-4">
                  {dept.assessments.map((assessment: any) => (
                    <div key={assessment.id} className="space-y-4">
                      {assessment.questions.length === 0 && (
                        <p className="text-cyan-600/50 text-[10px] uppercase tracking-widest italic">NO DATA SUBMITTED FOR {dept.department}.</p>
                      )}
                      {assessment.questions.map((q: any) => (
                        <div key={q.id} className="border-b border-cyan-500/20 pb-4">
                          <p className="font-bold mb-2 text-cyan-300 text-xs">SYS.Q: {q.questionBank?.title} - {q.questionBank?.description || q.questionBank?.content}</p>
                          <p className="text-cyan-100 whitespace-pre-wrap pl-4 border-l-2 border-cyan-500/50 bg-cyan-950/20 p-3 text-xs leading-relaxed">{q.answer?.content || q.mcqAnswer?.selectedOption || "No answer provided"}</p>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ))}
              
              <div className="pt-4 space-y-2 text-[10px] uppercase tracking-widest text-cyan-600">
                <p>DOSSIER ID: <span className="font-mono text-cyan-400">{data.id}</span></p>
                <p>TIMESTAMP: <span className="text-cyan-400">{new Date(data.createdAt).toLocaleString()}</span></p>
              </div>
            </div>

            <div className="p-4 bg-[#060A13] border-t border-cyan-500/30 flex flex-wrap gap-3 items-center">
              {data.departments.map((dept: any) => (
                <button
                  key={dept.id}
                  onClick={() => handleShortlist(dept.id)}
                  disabled={data.overallStatus === "SHORTLISTED" || shortlisting !== null}
                  className={`px-4 py-2 rounded-none text-[10px] uppercase tracking-widest font-bold border transition-colors ${
                    data.overallStatus === "SHORTLISTED" 
                      ? "bg-green-950/30 text-green-500/50 border-green-500/30 cursor-not-allowed"
                      : "bg-green-950/50 text-green-400 border-green-500/50 hover:bg-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.1)]"
                  }`}
                >
                  {shortlisting === dept.id ? "PROCESSING..." : 
                   data.overallStatus === "SHORTLISTED" ? `SHORTLISTED` : `SHORTLIST: ${dept.department}`}
                </button>
              ))}
              
              <button 
                onClick={onClose}
                className="px-6 py-2 bg-[#030710] border border-cyan-500/50 hover:bg-cyan-950/50 text-cyan-400 rounded-none text-[10px] uppercase tracking-widest font-bold shadow-[0_0_10px_rgba(0,255,255,0.1)] ml-auto transition-colors"
              >
                TERMINATE
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
