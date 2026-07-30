import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { DashboardStats } from "./DashboardStats";
import { ActivityFeed } from "./ActivityFeed";

export default async function AdminDashboard() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user || (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN")) {
    redirect("/dashboard");
  }

  const [totalApps, pending, shortlisted, rejected, recentActivities] = await Promise.all([
    prisma.applicantProfile.count(),
    prisma.applicantProfile.count({ where: { overallStatus: "UNDER_REVIEW" } }),
    prisma.applicantProfile.count({ where: { overallStatus: "SHORTLISTED" } }),
    prisma.applicantProfile.count({ where: { overallStatus: "REJECTED" } }),
    prisma.stageHistory.findMany({
      take: 10,
      orderBy: { timestamp: "desc" },
      include: {
        admin: { include: { user: true } },
        applicant: { include: { user: true } }
      }
    })
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-widest text-cyan-400 uppercase mb-1">
            OVERVIEW
          </h1>
          <p className="text-cyan-600 text-[11px] uppercase tracking-widest">SYS.MSG: Welcome back, {user.name?.split(" ")[0]}. Overview initiated.</p>
        </div>
      </div>

      <DashboardStats 
        total={totalApps} 
        pending={pending} 
        shortlisted={shortlisted} 
        rejected={rejected} 
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* We will add charts here in Phase 3 */}
          <div className="bg-[#060A13]/80 border border-cyan-500/30 p-6 h-96 flex flex-col justify-center items-center text-center shadow-[0_0_15px_rgba(0,255,255,0.05)] relative overflow-hidden group cyber-bracket">
            <div className="absolute inset-0 bg-cyan-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <h3 className="text-lg font-bold tracking-widest uppercase text-cyan-400 mb-2 z-10">ANALYTICS ENGINE OFFLINE</h3>
            <p className="text-cyan-600 text-[11px] tracking-widest uppercase max-w-sm z-10">Interactive charts and conversion funnels will be unlocked in Phase 3 of the CYSCOM Cabinet Portal rollout.</p>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <ActivityFeed activities={recentActivities} />
        </div>
      </div>
    </div>
  );
}
