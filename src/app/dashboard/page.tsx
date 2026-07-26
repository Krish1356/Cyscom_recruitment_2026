import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { CyberMatrixBackground } from "@/components/CyberMatrixBackground";
import { prisma } from "@/lib/prisma";
import { Shield, LogOut, Settings, Bell, Calendar } from "lucide-react";
import { DashboardClient } from "./DashboardClient";

export default async function DashboardPage() {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect("/login");
  }

  const profile = await prisma.applicantProfile.findUnique({
    where: { userId: session.user.id },
    include: {
      departments: true,
    }
  });

  // If no profile, redirect to the new multi-step registration wizard
  if (!profile) {
    redirect("/register");
  }

  // Check if they have an interview scheduled
  const interview = await prisma.interview.findFirst({
    where: { applicantId: profile.id },
    orderBy: { scheduledAt: 'desc' }
  });

  return (
    <main className="relative min-h-screen bg-[#0D1117] text-white selection:bg-cyan-500/30 overflow-x-hidden">
      {/* Background layer */}
      <div className="fixed inset-0 z-0">
        <CyberMatrixBackground />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0D1117]/90 to-[#0D1117]" />
      </div>
      
      {/* Top Navbar */}
      <nav className="relative z-10 flex items-center justify-between p-6 max-w-7xl w-full mx-auto backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
            <Shield className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="hidden sm:block text-xl font-black tracking-wider text-cyan-400 font-mono">
            PORTAL
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="relative p-2 rounded-full hover:bg-white/5 transition-colors">
            <Bell className="w-5 h-5 text-gray-400" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-cyan-500 rounded-full animate-pulse" />
          </button>
          
          <Link href="/dashboard/settings" className="p-2 rounded-full hover:bg-white/5 transition-colors">
            <Settings className="w-5 h-5 text-gray-400" />
          </Link>
          
          <form action={async () => {
            "use server"
            await signOut({ redirectTo: "/login" })
          }}>
            <button type="submit" className="flex items-center gap-2 px-4 py-2 bg-red-900/20 border border-red-500/30 text-red-400 hover:bg-red-900/40 hover:text-red-300 rounded-lg transition-all text-sm font-medium">
              <LogOut className="w-4 h-4" /> <span className="hidden sm:inline">Logout</span>
            </button>
          </form>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column - Profile & Quick Stats */}
        <div className="lg:col-span-1 space-y-6">
          {/* Welcome Card */}
          <div className="p-6 rounded-2xl bg-[#161B22] border border-gray-800 shadow-xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="flex items-center gap-4 mb-6 relative z-10">
              <div className="w-16 h-16 rounded-full bg-cyan-900/50 border-2 border-cyan-500/30 flex items-center justify-center text-2xl font-bold text-cyan-400 shadow-[0_0_15px_rgba(0,255,255,0.2)]">
                {session.user.name?.charAt(0) || "S"}
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{session.user.name}</h2>
                <p className="text-sm text-cyan-500 font-mono">{profile.registrationNumber}</p>
              </div>
            </div>
            <div className="space-y-2 relative z-10">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Branch</span>
                <span className="text-gray-200 font-medium">{profile.branch}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Year</span>
                <span className="text-gray-200 font-medium">{profile.year}</span>
              </div>
            </div>
          </div>

          {/* Interview Slot Card (If exists) */}
          {interview && (
            <div className="p-6 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 shadow-xl relative overflow-hidden">
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="w-5 h-5 text-cyan-400" />
                <h3 className="text-lg font-bold text-cyan-400">Interview Scheduled</h3>
              </div>
              <div className="space-y-3">
                <div className="bg-[#0D1117] p-4 rounded-lg border border-cyan-500/20">
                  <p className="text-sm text-gray-400 mb-1">Date & Time</p>
                  <p className="text-white font-medium">{new Date(interview.scheduledAt).toLocaleString()}</p>
                </div>
                <div className="bg-[#0D1117] p-4 rounded-lg border border-cyan-500/20">
                  <p className="text-sm text-gray-400 mb-1">Location / Link</p>
                  <p className="text-cyan-400 font-medium break-all">{interview.location}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Client Dashboard (Tracker, Departments, Actions) */}
        <div className="lg:col-span-2">
          <DashboardClient profile={profile} />
        </div>

      </div>
    </main>
  );
}
