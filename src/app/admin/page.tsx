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
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 mb-1">
            Overview
          </h1>
          <p className="text-gray-400 text-sm">Welcome back, {user.name?.split(" ")[0]}. Here's what's happening today.</p>
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
          <div className="bg-[#161B22]/50 border border-cyan-900/30 rounded-2xl p-6 h-96 flex flex-col justify-center items-center text-center shadow-[0_0_20px_rgba(0,191,255,0.02)] relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <h3 className="text-lg font-medium text-cyan-300 mb-2 z-10">Analytics Engine</h3>
            <p className="text-gray-500 text-sm max-w-sm z-10">Interactive charts and conversion funnels will be unlocked in Phase 3 of the CYSCOM Cabinet Portal rollout.</p>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <ActivityFeed activities={recentActivities} />
        </div>
      </div>
    </div>
  );
}
