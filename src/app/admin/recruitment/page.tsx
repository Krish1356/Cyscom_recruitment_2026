import { prisma } from "@/lib/prisma";
import { ApplicantTable } from "./ApplicantTable";
import { Activity } from "lucide-react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function RecruitmentPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  const applicants = await prisma.applicantProfile.findMany({
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

  const activeSessions = await prisma.assessmentSession.count({
    where: {
      applicant: {
        departments: {
          some: {
            assessments: {
              some: { status: "IN_PROGRESS" }
            }
          }
        }
      }
    }
  });

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 mb-1">
            Recruitment Management
          </h2>
          <p className="text-sm text-gray-400">Manage applicants, review profiles, and shortlist candidates.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-sm border border-cyan-500/30 px-4 py-2 rounded-lg bg-[#161B22]/80 backdrop-blur-md text-cyan-400 flex items-center shadow-[0_0_15px_rgba(0,191,255,0.1)]">
            <Activity className="w-4 h-4 mr-2 text-cyan-300 animate-pulse" />
            Live Assessments: {activeSessions}
          </div>
          <div className="text-sm border border-gray-700 px-4 py-2 rounded-lg bg-[#0D1117]/80 backdrop-blur-md text-gray-300">
            Total: {applicants.length}
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <ApplicantTable applicants={applicants} />
      </div>
    </div>
  );
}
