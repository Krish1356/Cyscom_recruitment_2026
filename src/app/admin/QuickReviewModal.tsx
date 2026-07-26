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
      <div className="bg-[#e4e4e4] text-black w-full max-w-2xl rounded-lg shadow-2xl flex flex-col overflow-hidden max-h-[90vh]">
        
        {loading || !data ? (
          <div className="p-8 text-center font-mono">Loading applicant data...</div>
        ) : (
          <>
            <div className="p-6 overflow-y-auto flex-1 text-sm space-y-4">
              {/* Integrity Tracking */}
              {data.assessmentSession && (
                <div className="mb-6 p-4 bg-gray-300 rounded-lg border border-gray-400">
                  <h3 className="font-bold text-gray-800 mb-2">Integrity Tracking</h3>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="bg-white p-2 rounded shadow-sm">
                      <p className="text-xl font-mono font-bold text-gray-800">{tabSwitches}</p>
                      <p className="text-xs text-gray-600 uppercase">Tab Switches</p>
                    </div>
                    <div className="bg-white p-2 rounded shadow-sm">
                      <p className="text-xl font-mono font-bold text-gray-800">{copies}</p>
                      <p className="text-xs text-gray-600 uppercase">Copy Attempts</p>
                    </div>
                    <div className="bg-white p-2 rounded shadow-sm">
                      <p className="text-xl font-mono font-bold text-gray-800">{pastes}</p>
                      <p className="text-xs text-gray-600 uppercase">Paste Attempts</p>
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
                        <p className="text-gray-500 italic">No answers submitted yet for {dept.department}.</p>
                      )}
                      {assessment.questions.map((q: any) => (
                        <div key={q.id} className="border-b border-gray-300 pb-2">
                          <p className="font-bold mb-1 text-gray-800">{q.questionBank?.title}: {q.questionBank?.description || q.questionBank?.content}</p>
                          <p className="text-gray-700 whitespace-pre-wrap">{q.answer?.content || "No answer provided"}</p>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ))}
              
              <div className="pt-4 space-y-1">
                <p>Application ID: <span className="font-mono">{data.id}</span></p>
                <p>Submitted: {new Date(data.createdAt).toLocaleString()}</p>
              </div>
            </div>

            <div className="p-4 bg-gray-200 border-t border-gray-300 flex flex-wrap gap-3 items-center">
              {data.departments.map((dept: any) => (
                <button
                  key={dept.id}
                  onClick={() => handleShortlist(dept.id)}
                  disabled={data.overallStatus === "SHORTLISTED" || shortlisting !== null}
                  className={`px-4 py-2 rounded font-medium shadow-sm transition-colors ${
                    data.overallStatus === "SHORTLISTED" 
                      ? "bg-gray-400 text-white cursor-not-allowed"
                      : "bg-[#22c55e] hover:bg-[#16a34a] text-white"
                  }`}
                >
                  {shortlisting === dept.id ? "Processing..." : 
                   data.overallStatus === "SHORTLISTED" ? `Shortlisted` : `Shortlist: ${dept.department}`}
                </button>
              ))}
              
              <button 
                onClick={onClose}
                className="px-4 py-2 bg-[#3b82f6] hover:bg-[#2563eb] text-white rounded font-medium shadow-sm ml-auto"
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
