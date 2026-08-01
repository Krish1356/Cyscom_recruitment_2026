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
        <div className="bg-black/60 border border-cyan-500/30 rounded-lg p-6">
          <h3 className="text-lg font-bold text-cyan-300 font-mono mb-4 border-b border-cyan-500/30 pb-2 flex items-center">
            <ShieldAlert className="w-5 h-5 mr-2 text-red-400" />
            Integrity Log
          </h3>
          
          {integrityEvents.length === 0 ? (
            <div className="flex items-center text-green-400 font-mono text-sm">
              <CheckCircle className="w-4 h-4 mr-2" />
              No violations detected.
            </div>
          ) : (
            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {integrityEvents.map((evt: any) => (
                <div key={evt.id} className="p-3 bg-red-950/20 border border-red-500/30 rounded text-xs font-mono">
                  <div className="flex items-center justify-between text-red-400 font-bold mb-1">
                    <span>{evt.eventType}</span>
                    <span className="text-[10px] text-red-300/60">{new Date(evt.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <p className="text-red-200/80">{evt.details}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-black/60 border border-cyan-500/30 rounded-lg p-6 font-mono text-sm">
          <h3 className="text-lg font-bold text-cyan-300 mb-4 border-b border-cyan-500/30 pb-2">Profile Details</h3>
          <div className="space-y-2 text-cyan-100/80">
            <p><strong className="text-cyan-500">Phone:</strong> {applicant.phoneNumber}</p>
            <p><strong className="text-cyan-500">GitHub:</strong> {applicant.githubUrl || "N/A"}</p>
            <p><strong className="text-cyan-500">LinkedIn:</strong> {applicant.linkedinUrl || "N/A"}</p>
          </div>
        </div>
      </div>

      {/* Right Col: Assessment Answers */}
      <div className="lg:col-span-2 space-y-8">
        {applicant.departments.map((dept: any) => {
          const assessment = dept.assessments[0]; // Assuming 1 assessment per dept
          if (!assessment) return null;

          return (
            <div key={dept.id} className="bg-black/60 border border-cyan-500/30 rounded-lg p-6">
              <div className="flex items-center justify-between border-b border-cyan-500/30 pb-4 mb-6">
                <h3 className="text-xl font-bold text-cyan-300 font-mono">
                  {dept.department} Assessment
                </h3>
                <span className="text-xs font-mono text-cyan-500 px-2 py-1 bg-cyan-950/40 rounded border border-cyan-500/30">
                  Status: {assessment.status}
                </span>
              </div>

              {assessment.questions.length === 0 ? (
                <p className="text-cyan-100/60 font-mono text-sm">No questions answered.</p>
              ) : (
                <div className="space-y-8">
                  {assessment.questions.map((q: any, idx: number) => (
                    <div key={q.id} className="space-y-4 pb-6 border-b border-cyan-900/50 last:border-0 last:pb-0">
                      <div className="flex flex-col font-mono">
                        <div className="text-cyan-400 font-bold mb-4 leading-relaxed">
                          SYS.Q: {q.questionBank.title} - <span className="text-cyan-300 font-medium">{q.questionBank.description || q.questionBank.content?.text || "No description provided."}</span>
                        </div>
                        
                        <div className="pl-4 border-l-2 border-cyan-500 bg-[#0a151c] p-4 text-cyan-100/80 whitespace-pre-wrap min-h-[50px] flex items-center">
                          {q.answer?.content || <span className="text-cyan-100/40 italic">No answer provided</span>}
                        </div>
                      </div>

                      {q.answer && (
                        <div className="flex items-center gap-4 bg-cyan-950/40 p-3 rounded border border-cyan-500/20 mt-2 w-fit">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono text-cyan-400">AI Score:</span>
                            <span className="font-bold text-cyan-100">{q.answer.aiScore ?? "N/A"}</span>
                          </div>
                          <div className="h-4 w-px bg-cyan-500/30" />
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono text-cyan-400">Manual Score:</span>
                            <input 
                              type="number" 
                              defaultValue={q.answer.manualScore || ""}
                              onBlur={(e) => handleScoreUpdate(q.answer.id, e.target.value)}
                              className="w-16 bg-black border border-cyan-500/50 rounded px-2 py-1 text-cyan-100 font-mono text-sm focus:outline-none focus:border-cyan-400"
                              placeholder="0-10"
                            />
                            {savingId === q.answer.id && <span className="text-xs text-green-400 animate-pulse">Saving...</span>}
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
