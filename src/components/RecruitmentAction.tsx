"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getUserStatus } from "@/app/actions/getUserStatus";
import { startAssessment } from "@/app/actions/dashboard";
import { Play, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export function RecruitmentAction() {
  const [status, setStatus] = useState<string | null>(null);
  const [overallStatus, setOverallStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getUserStatus().then(res => {
      setStatus(res.status);
      if (res.overallStatus) setOverallStatus(res.overallStatus);
    });
  }, []);

  const handleStart = async () => {
    setLoading(true);
    try {
      await startAssessment();
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  if (!status) {
    return <div className="text-cyan-600 text-[10px] animate-pulse h-[46px] flex items-center justify-center">CHECKING CLEARANCE...</div>;
  }

  if (status === "unauthenticated" || status === "unregistered") {
    return (
      <div className="flex flex-col items-center gap-4">
        <Link href="/register" className="inline-flex items-center justify-center border border-cyan-500 bg-cyan-950/20 text-cyan-400 px-8 py-4 text-xs uppercase tracking-widest hover:bg-cyan-500 hover:text-black transition-colors cyber-bracket">
          &gt; INITIALIZE RECRUITMENT
        </Link>
        {status === "unregistered" && (
          <button 
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center text-[10px] text-gray-500 hover:text-red-400 transition-colors uppercase tracking-widest"
          >
            <LogOut className="w-3 h-3 mr-1" /> Terminate Session
          </button>
        )}
      </div>
    );
  }

  const LogoutButton = () => (
    <button 
      onClick={() => signOut({ callbackUrl: "/" })}
      className="flex items-center text-[10px] text-gray-500 hover:text-red-400 transition-colors uppercase tracking-widest"
    >
      <LogOut className="w-3 h-3 mr-1" /> Terminate Session
    </button>
  );

  if (status === "no_assessment" || status === "completed") {
    return (
      <div className="flex flex-col items-center gap-6 w-full max-w-sm mx-auto mt-4">
        <div className="w-full bg-[#0a151c]/80 border border-cyan-900/40 rounded p-6 shadow-md text-left">
          <h3 className="text-cyan-500 font-bold mb-4 uppercase tracking-widest text-xs border-b border-cyan-900/30 pb-2">Application Status</h3>
          <div className="space-y-4">
            <div>
              <div className="text-[10px] text-cyan-600 uppercase tracking-widest mb-1">Current Phase</div>
              <div className="text-white font-mono text-base">{overallStatus ? overallStatus.replace(/_/g, ' ') : "AWAITING CLEARANCE"}</div>
            </div>
            
            {overallStatus === 'REJECTED' && (
              <div className="text-red-400/80 text-sm mt-2">
                We appreciate your interest, but we are not moving forward with your application at this time. Keep learning and hacking!
              </div>
            )}
            {(overallStatus === 'SHORTLISTED' || overallStatus === 'INTERVIEW_SCHEDULED') && (
              <div className="text-green-400/90 text-sm mt-2">
                You have cleared the assessment phase! Please check your email for the next steps and interview details.
              </div>
            )}
            {overallStatus === 'SELECTED' && (
              <div className="text-green-400 text-sm mt-2 font-bold">
                Congratulations! You have been selected to join CYSCOM. Welcome to the community!
              </div>
            )}
            {overallStatus === 'ASSESSMENT_COMPLETED' && (
              <div className="text-cyan-200/60 text-sm mt-2">
                Your assessment has been submitted successfully and is currently under review by our team.
              </div>
            )}
          </div>
        </div>
        <LogoutButton />
      </div>
    );
  }

  if (status === "in_progress") {
    return (
      <div className="flex flex-col items-center gap-4">
        <Link href="/assessment" className="inline-flex items-center justify-center border border-yellow-500 bg-yellow-950/20 text-yellow-400 px-8 py-4 text-xs uppercase tracking-widest hover:bg-yellow-500 hover:text-black transition-colors cyber-bracket">
          &gt; RESUME ASSESSMENT
        </Link>
        <LogoutButton />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <button 
        onClick={handleStart}
        disabled={loading}
        className="inline-flex items-center justify-center border border-red-500 bg-red-950/20 text-red-400 px-8 py-4 text-xs uppercase tracking-widest hover:bg-red-500 hover:text-black transition-colors cyber-bracket disabled:opacity-50"
      >
        {loading ? "INITIALIZING..." : <><Play className="w-4 h-4 mr-2" /> BEGIN ASSESSMENT</>}
      </button>
      <LogoutButton />
    </div>
  );
}
