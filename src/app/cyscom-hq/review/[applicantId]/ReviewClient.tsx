"use client";

import { useState } from "react";
import { saveManualScore } from "@/app/actions/review";
import { ShieldAlert, CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ReviewClient({ applicant }: { applicant: any }) {
  const [savingId, setSavingId] = useState<string | null>(null);

  const handleScoreUpdate = async (answerId: string, scoreStr: string) => {
    const score = parseInt(scoreStr, 10);
    if (isNaN(score)) return;
    
    setSavingId(answerId);
    try {
      await saveManualScore(answerId, score);
    } catch (e) {
      alert("Failed to save score");
    } finally {
      setSavingId(null);
    }
  };

  const integrityEvents = applicant.assessmentSession?.events || [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* Left Col: Integrity & Summary */}
      <div className="space-y-6">
        <div className="bg-[#0B1014] border border-white/5 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-[#F1F0EA] mb-4 border-b border-white/10 pb-2 flex items-center">
            <ShieldAlert className="w-5 h-5 mr-2 text-[#f87171]" />
            Integrity Log
          </h3>
          
          {integrityEvents.length === 0 ? (
            <div className="flex items-center text-[#4ade80] text-sm">
              <CheckCircle className="w-4 h-4 mr-2" />
              No violations detected.
            </div>
          ) : (
            <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar">
              {integrityEvents.map((evt: any) => (
                <div key={evt.id} className="p-3 bg-[#450a0a]/50 border border-[#f87171]/20 rounded-md text-sm">
                  <div className="flex items-center justify-between text-[#f87171] font-semibold mb-1">
                    <span>{evt.eventType}</span>
                    <span className="text-xs text-[#f87171]/70">{new Date(evt.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <p className="text-[#fca5a5]">{evt.details}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-[#0B1014] border border-white/5 rounded-xl p-6 text-sm">
          <h3 className="text-lg font-semibold text-[#F1F0EA] mb-4 border-b border-white/10 pb-2">Profile Details</h3>
          <div className="space-y-2 text-[#F1F0EA]">
            <p><strong className="text-[#A4A8AE]">Phone:</strong> {applicant.phoneNumber}</p>
            <p><strong className="text-[#A4A8AE]">GitHub:</strong> {applicant.githubUrl || "N/A"}</p>
            <p><strong className="text-[#A4A8AE]">LinkedIn:</strong> {applicant.linkedinUrl || "N/A"}</p>
          </div>
        </div>
      </div>

      {/* Right Col: Assessment Answers */}
      <div className="lg:col-span-2 space-y-8">
        {applicant.departments.map((dept: any) => {
          const assessment = dept.assessments[0]; // Assuming 1 assessment per dept
          if (!assessment) return null;

          return (
            <div key={dept.id} className="bg-[#0B1014] border border-white/5 rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                <h3 className="text-xl font-semibold text-[#F1F0EA]">
                  {dept.department} Assessment
                </h3>
                <span className="text-xs font-medium text-[#626A72] px-2 py-1 bg-white/5 rounded-md border border-white/10">
                  Status: {assessment.status}
                </span>
              </div>

              {assessment.questions.length === 0 ? (
                <p className="text-[#626A72] text-sm italic">No questions answered.</p>
              ) : (
                <div className="space-y-8">
                  {assessment.questions.map((q: any, idx: number) => (
                    <div key={q.id} className="space-y-4 pb-6 border-b border-white/5 last:border-0 last:pb-0">
                      <div className="flex flex-col">
                        <div className="text-[#F1F0EA] font-semibold mb-4 leading-relaxed text-sm">
                          Q: {q.questionBank.title} - <span className="text-[#A4A8AE] font-normal">{q.questionBank.description || q.questionBank.content?.text || "No description provided."}</span>
                        </div>
                        
                        <div className="pl-4 border-l-2 border-[#67E8F9]/50 bg-white/5 p-4 text-[#F1F0EA] whitespace-pre-wrap min-h-[50px] flex items-center rounded-r-md text-sm">
                          {q.answer?.content || <span className="text-[#626A72] italic">No answer provided</span>}
                        </div>
                      </div>

                      {q.answer && (
                        <div className="flex items-center gap-4 bg-white/5 p-3 rounded-md border border-white/10 mt-2 w-fit">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-[#626A72]">AI Score:</span>
                            <span className="font-semibold text-[#F1F0EA] text-sm">{q.answer.aiScore ?? "N/A"}</span>
                          </div>
                          <div className="h-4 w-px bg-white/10" />
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-[#626A72]">Manual Score:</span>
                            <input 
                              type="number" 
                              defaultValue={q.answer.manualScore || ""}
                              onBlur={(e) => handleScoreUpdate(q.answer.id, e.target.value)}
                              className="w-16 bg-[#050608] border border-white/10 rounded-md px-2 py-1 text-[#F1F0EA] text-sm focus:outline-none focus:border-[#67E8F9]/50"
                              placeholder="0-10"
                            />
                            {savingId === q.answer.id && <span className="text-xs text-[#4ade80] animate-pulse">Saving...</span>}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
      
    </div>
  );
}
