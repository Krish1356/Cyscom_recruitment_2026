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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#0B1014] border border-white/10 w-full max-w-2xl rounded-xl shadow-2xl flex flex-col overflow-hidden max-h-[90vh]">
        
        {loading || !data ? (
          <div className="p-8 text-center text-sm text-[#626A72]">Loading...</div>
        ) : (
          <>
            <div className="p-6 overflow-y-auto flex-1 text-sm space-y-4">
              {/* Integrity Tracking */}
              {data.assessmentSession && (
                <div className="mb-6 p-4 bg-white/5 rounded-lg border border-white/10">
                  <h3 className="font-semibold text-[#F1F0EA] text-sm mb-4">Integrity Tracking</h3>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="bg-[#050608] border border-white/5 p-3 rounded-md">
                      <p className={`text-xl font-bold ${tabSwitches > 0 ? 'text-[#f87171]' : 'text-[#F1F0EA]'}`}>{tabSwitches}</p>
                      <p className="text-xs text-[#626A72] mt-1">Tab Switches</p>
                    </div>
                    <div className="bg-[#050608] border border-white/5 p-3 rounded-md">
                      <p className={`text-xl font-bold ${copies > 0 ? 'text-[#fbbf24]' : 'text-[#F1F0EA]'}`}>{copies}</p>
                      <p className="text-xs text-[#626A72] mt-1">Copy Attempts</p>
                    </div>
                    <div className="bg-[#050608] border border-white/5 p-3 rounded-md">
                      <p className={`text-xl font-bold ${pastes > 0 ? 'text-[#fbbf24]' : 'text-[#F1F0EA]'}`}>{pastes}</p>
                      <p className="text-xs text-[#626A72] mt-1">Paste Attempts</p>
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
                        <p className="text-[#626A72] text-xs italic">No data submitted for {dept.department}.</p>
                      )}
                      {assessment.questions.map((q: any) => (
                        <div key={q.id} className="border-b border-white/5 pb-4">
                          <p className="font-semibold mb-2 text-[#F1F0EA] text-sm">Q: {q.questionBank?.title} - {q.questionBank?.description || q.questionBank?.content}</p>
                          <p className="text-[#A4A8AE] whitespace-pre-wrap pl-4 border-l-2 border-[#67E8F9]/50 bg-white/5 p-3 text-sm leading-relaxed rounded-r-md">{q.answer?.content || q.mcqAnswer?.selectedOption || "No answer provided"}</p>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ))}
              
              <div className="pt-4 space-y-2 text-xs text-[#626A72]">
                <p>Dossier ID: <span className="font-mono text-[#A4A8AE]">{data.id}</span></p>
                <p>Timestamp: <span className="text-[#A4A8AE]">{new Date(data.createdAt).toLocaleString()}</span></p>
              </div>
            </div>

            <div className="p-4 bg-[#050608] border-t border-white/10 flex flex-wrap gap-3 items-center">
              {data.departments.map((dept: any) => (
                <button
                  key={dept.id}
                  onClick={() => handleShortlist(dept.id)}
                  disabled={data.overallStatus === "SHORTLISTED" || shortlisting !== null}
                  className={`px-4 py-2 rounded-md text-sm font-semibold transition-all ${
                    data.overallStatus === "SHORTLISTED" 
                      ? "bg-[#052e16] text-[#4ade80]/50 border border-[#4ade80]/20 cursor-not-allowed"
                      : "bg-[#052e16] text-[#4ade80] border border-[#4ade80]/30 hover:bg-[#052e16]/80"
                  }`}
                >
                  {shortlisting === dept.id ? "Processing..." : 
                   data.overallStatus === "SHORTLISTED" ? `Shortlisted` : `Shortlist: ${dept.department}`}
                </button>
              ))}
              
              <button 
                onClick={onClose}
                className="px-6 py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-[#F1F0EA] rounded-md text-sm font-semibold ml-auto transition-all"
              >
                Close
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
