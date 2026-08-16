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
          <div key={stage} className="min-w-[320px] max-w-[320px] bg-[#0B1014] border border-white/5 rounded-lg flex flex-col h-full shadow-lg">
            <div className="p-4 border-b border-white/5 bg-white/5 rounded-t-lg">
              <h3 className="font-bold text-[#F1F0EA] text-sm">{stage.replace(/_/g, " ")}</h3>
              <p className="text-xs text-[#626A72] mt-1">{stageApplicants.length} Applicants</p>
            </div>
            
            <div className="p-4 flex-1 overflow-y-auto space-y-4">
              {stageApplicants.map(applicant => (
                <div key={applicant.id} className="bg-[#050608] border border-white/5 rounded-lg p-4 shadow-sm hover:border-[#67E8F9]/30 transition-all group">
                  
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#0B1014] flex items-center justify-center border border-white/10 group-hover:border-[#67E8F9]/50 transition-colors">
                        <UserIcon className="w-4 h-4 text-[#A4A8AE]" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#F1F0EA]">{applicant.user.name}</p>
                        <p className="text-xs text-[#626A72]">{applicant.registrationNumber}</p>
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-[#626A72] mb-4 space-y-2">
                    <p>Branch: <span className="text-[#A4A8AE]">{applicant.branch}</span></p>
                    <div className="flex gap-2">
                      {applicant.departments.map((d: any) => (
                        <span key={d.id} className="px-2 py-0.5 bg-white/5 border border-white/10 rounded-md text-[10px] text-[#A4A8AE]">
                          {d.department.slice(0, 4)}
                        </span>
                      ))}
                    </div>
                    
                    {applicant.stageHistory && applicant.stageHistory.length > 0 && (
                      <div className="flex items-center gap-1 mt-2 text-[10px] text-[#626A72]">
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
                      <SelectTrigger className="h-8 text-xs bg-[#0B1014] border-white/10 rounded-md focus:border-[#67E8F9]/50 text-[#F1F0EA]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#0B1014] border border-white/10 rounded-md">
                        {STAGES.map(s => (
                          <SelectItem key={s} value={s} className="text-xs text-[#A4A8AE] focus:bg-white/5 focus:text-[#F1F0EA]">{s.replace(/_/g, " ")}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <div className="flex items-center gap-2 mt-2">
                      <a 
                        href={`/admin/review/${applicant.id}`} 
                        className="flex-1 flex items-center justify-center gap-2 h-8 text-xs bg-white/5 border border-white/10 rounded-md hover:bg-white/10 text-[#F1F0EA] transition-colors"
                      >
                        Review Assessment
                      </a>
                      
                      <button 
                        onClick={() => setQuickViewId(applicant.id)}
                        title="Quick View Answers"
                        className="flex items-center justify-center h-8 w-8 bg-[#0891B2]/20 border border-[#67E8F9]/30 rounded-md hover:bg-[#0891B2]/40 text-[#67E8F9] transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {applicant.phoneNumber && (
                        <a 
                          href={`https://wa.me/${applicant.phoneNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi ${applicant.user.name.split(' ')[0]}, this is an update regarding your CYSCOM recruitment process.`)}`}
                          target="_blank"
                          rel="noreferrer"
                          title="Message on WhatsApp"
                          className="flex items-center justify-center h-8 w-8 bg-green-500/10 border border-green-500/30 rounded-md hover:bg-green-500/20 text-green-400 transition-colors"
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
