"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getUserStatus } from "@/app/actions/getUserStatus";
import { startAssessment } from "@/app/actions/dashboard";
import { Play, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export function RecruitmentAction() {
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getUserStatus().then(res => setStatus(res.status));
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
      <div className="flex flex-col items-center gap-4">
        <div className="inline-flex items-center justify-center border border-green-500/50 bg-green-950/20 text-green-400 px-8 py-4 text-xs uppercase tracking-widest cyber-bracket">
          &gt; DOSSIER SUBMITTED. AWAITING CLEARANCE.
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
