"use client";

import { updateApplicantStage } from "../actions/admin";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User as UserIcon, AlertCircle, MessageCircle, Eye, Clock } from "lucide-react";
import { QuickReviewModal } from "./QuickReviewModal";
import { formatDistanceToNow } from "date-fns";

const STAGES = [
  "APPLIED",
  "ASSESSMENT_COMPLETED",
  "UNDER_REVIEW",
  "SHORTLISTED",
  "INTERVIEW_SCHEDULED",
  "INTERVIEW_COMPLETED",
  "SELECTED",
  "REJECTED"
];

export function KanbanBoard({ applicants }: { applicants: any[] }) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [quickViewId, setQuickViewId] = useState<string | null>(null);

  const handleStageChange = async (applicantId: string, newStage: string) => {
    setLoadingId(applicantId);
    try {
      await updateApplicantStage(applicantId, newStage as any);
    } catch (e) {
      alert("Failed to update stage");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="flex gap-6 overflow-x-auto pb-8 h-full">
      {STAGES.map(stage => {
        const stageApplicants = applicants.filter(a => a.overallStatus === stage);
        
        return (
          <div key={stage} className="min-w-[320px] max-w-[320px] bg-[#060A13]/90 border border-cyan-500/30 rounded-none flex flex-col h-full cyber-bracket shadow-[0_0_10px_rgba(0,255,255,0.02)]">
            <div className="p-4 border-b border-cyan-500/30 bg-cyan-950/20">
              <h3 className="font-mono font-bold text-cyan-400 text-[10px] tracking-widest uppercase">{stage.replace(/_/g, " ")}</h3>
              <p className="text-[10px] tracking-widest uppercase text-cyan-600 mt-1">SYS.COUNT: {stageApplicants.length}</p>
            </div>
            
            <div className="p-4 flex-1 overflow-y-auto space-y-4">
              {stageApplicants.map(applicant => (
                <div key={applicant.id} className="bg-[#030710]/80 border border-cyan-500/30 rounded-none p-4 shadow-[0_0_15px_rgba(0,255,255,0.02)] hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(0,255,255,0.1)] transition-all group">
                  
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-none bg-cyan-950/50 flex items-center justify-center border border-cyan-500/50 group-hover:border-cyan-400 transition-colors">
                        <UserIcon className="w-4 h-4 text-cyan-400" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-cyan-100 tracking-widest uppercase">{applicant.user.name}</p>
                        <p className="text-[10px] font-mono text-cyan-600 tracking-widest uppercase">{applicant.registrationNumber}</p>
                      </div>
                    </div>
                  </div>

                  <div className="text-[10px] tracking-widest font-mono text-cyan-600 uppercase mb-4 space-y-2">
                    <p>BRANCH: <span className="text-cyan-400">{applicant.branch}</span></p>
                    <div className="flex gap-2">
                      {applicant.departments.map((d: any) => (
                        <span key={d.id} className="px-2 py-0.5 bg-cyan-950/30 border border-cyan-500/30 rounded-none text-[9px] text-cyan-400">
                          {d.department.slice(0, 4)}
                        </span>
                      ))}
                    </div>
                    
                    {applicant.stageHistory && applicant.stageHistory.length > 0 && (
                      <div className="flex items-center gap-1 mt-2 text-[9px] text-cyan-500/80">
                        <Clock className="w-3 h-3" />
                        <span>
                          by {applicant.stageHistory[0].admin.user.name?.split(' ')[0]} • {formatDistanceToNow(new Date(applicant.stageHistory[0].timestamp), { addSuffix: true })}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <Select 
                      disabled={loadingId === applicant.id}
                      value={applicant.overallStatus} 
                      onValueChange={(val) => handleStageChange(applicant.id, val)}
                    >
                      <SelectTrigger className="h-8 text-[10px] tracking-widest uppercase bg-[#030710] border-cyan-500/30 rounded-none focus:border-cyan-400 font-mono text-cyan-400">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#060A13] border border-cyan-500/50 rounded-none">
                        {STAGES.map(s => (
                          <SelectItem key={s} value={s} className="text-[10px] tracking-widest uppercase font-mono text-cyan-400 focus:bg-cyan-950/50 focus:text-cyan-300">{s.replace(/_/g, " ")}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <div className="flex items-center gap-2 mt-2">
                      <a 
                        href={`/admin/review/${applicant.id}`} 
                        className="flex-1 flex items-center justify-center gap-2 h-8 text-[10px] bg-cyan-600/20 border border-cyan-500/50 rounded hover:bg-cyan-500/30 text-cyan-200 transition-colors font-mono"
                      >
                        Review Assessment
                      </a>
                      
                      <button 
                        onClick={() => setQuickViewId(applicant.id)}
                        title="Quick View Answers"
                        className="flex items-center justify-center h-8 w-8 bg-blue-900/40 border border-blue-500/50 rounded hover:bg-blue-800/60 text-blue-400 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {applicant.phoneNumber && (
                        <a 
                          href={`https://wa.me/${applicant.phoneNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi ${applicant.user.name.split(' ')[0]}, this is an update regarding your CYSCOM recruitment process.`)}`}
                          target="_blank"
                          rel="noreferrer"
                          title="Message on WhatsApp"
                          className="flex items-center justify-center h-8 w-8 bg-green-900/40 border border-green-500/50 rounded hover:bg-green-800/60 text-green-400 transition-colors"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>
        );
      })}
      
      <QuickReviewModal 
        applicantId={quickViewId || ""} 
        isOpen={!!quickViewId} 
        onClose={() => setQuickViewId(null)} 
      />
    </div>
  );
}
