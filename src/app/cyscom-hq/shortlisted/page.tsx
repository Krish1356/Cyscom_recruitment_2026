import { prisma } from "@/lib/prisma";
import { ApplicantTable } from "../recruitment/ApplicantTable";
import { CheckCircle } from "lucide-react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ShortlistedPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  const applicants = await prisma.applicantProfile.findMany({
    where: {
      overallStatus: "SHORTLISTED"
    },
    include: {
      user: true,
      departments: true,
      stageHistory: {
        orderBy: { timestamp: "desc" },
        take: 1,
        include: { admin: { include: { user: true } } }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  return (
    <div className="h-full flex flex-col font-mono">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold tracking-widest text-cyan-400 mb-1 uppercase">
            SHORTLISTED CANDIDATES
          </h2>
          <p className="text-[10px] uppercase tracking-widest text-cyan-600">Candidates awaiting interview scheduling.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-[10px] border border-cyan-500/50 px-4 py-2 rounded-none bg-[#030710]/80 backdrop-blur-md text-cyan-400 flex items-center shadow-[0_0_15px_rgba(0,255,255,0.1)] tracking-widest uppercase cyber-bracket">
            <CheckCircle className="w-4 h-4 mr-2 text-cyan-400" />
            SYS.COUNT: {applicants.length}
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <ApplicantTable applicants={applicants} />
      </div>
    </div>
  );
}
