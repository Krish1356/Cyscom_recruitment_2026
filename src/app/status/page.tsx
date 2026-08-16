import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { MainLayout } from "@/components/MainLayout";
import { CyberMatrixBackground } from "@/components/CyberMatrixBackground";
import { CheckCircle2, Clock, ShieldAlert, Terminal, MessageSquare } from "lucide-react";

export default async function StatusPage() {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect("/login");
  }

  const profile = await prisma.applicantProfile.findUnique({
    where: { userId: session.user.id }
  });

  if (!profile) {
    redirect("/register");
  }

  const status = profile.overallStatus;
  
  const getStatusInfo = () => {
    switch(status) {
      case "APPLIED":
        return {
          title: "REGISTRATION SECURED",
          desc: "Your dossier has been received. Await further instructions for the assessment phase.",
          color: "text-blue-400",
          icon: Clock
        };
      case "ASSESSMENT_COMPLETED":
        return {
          title: "ASSESSMENTS COMPLETED",
          desc: "You have successfully executed all infiltration protocols. Our analysts are reviewing your performance.",
          color: "text-green-400",
          icon: CheckCircle2,
          showWhatsapp: true
        };
      case "SHORTLISTED":
        return {
          title: "SHORTLISTED FOR INTERVIEW",
          desc: "You have been cleared for Stage 3. Check your comms (email) for interview scheduling details.",
          color: "text-cyan-400",
          icon: ShieldAlert,
          showWhatsapp: true
        };
      case "SELECTED":
        return {
          title: "ACCESS GRANTED",
          desc: "Welcome to CYSCOM.",
          color: "text-yellow-400",
          icon: Terminal,
          showWhatsapp: true
        };
      case "REJECTED":
        return {
          title: "ACCESS DENIED",
          desc: "We are not moving forward with your application at this time. Keep honing your skills.",
          color: "text-red-500",
          icon: ShieldAlert
        };
      default:
        return {
          title: "SYSTEM PROCESSING",
          desc: "Your data is currently being processed by the mainframe.",
          color: "text-gray-400",
          icon: Clock
        };
    }
  };

  const info = getStatusInfo();
  const Icon = info.icon;

  return (
    <div className="relative min-h-screen bg-[#050608] text-[#F1F0EA]">
      <CyberMatrixBackground />
      <MainLayout>
        <div className="pt-32 pb-24 px-6 min-h-screen flex items-center justify-center relative z-10">
          <div className="w-full max-w-2xl bg-black/60 backdrop-blur-md border border-white/10 rounded-lg p-10 shadow-[0_0_50px_rgba(0,255,255,0.05)] text-center">
            
            <div className="inline-flex items-center justify-center p-6 rounded-full bg-black/50 border border-white/5 mb-8 relative">
              <div className="absolute inset-0 rounded-full animate-ping opacity-20 bg-current" style={{ color: "inherit" }} />
              <Icon className={`w-16 h-16 ${info.color}`} />
            </div>

            <h1 className={`text-3xl md:text-5xl font-mono font-bold tracking-widest uppercase mb-4 ${info.color}`}>
              {info.title}
            </h1>
            
            <p className="text-[#A4A8AE] text-lg font-mono leading-relaxed mb-10 max-w-lg mx-auto">
              {info.desc}
            </p>

            {info.showWhatsapp && (
              <div className="mt-8 pt-8 border-t border-white/10">
                <p className="text-sm font-mono text-cyan-500/80 mb-4 uppercase tracking-widest">
                  Secure Communication Channel
                </p>
                <a 
                  href="https://chat.whatsapp.com/L0oAJwzieqaDSsuiKhNuh0?mode=gi_t" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group inline-flex items-center justify-center px-8 py-4 bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/30 rounded font-bold tracking-widest hover:bg-[#25D366] hover:text-black transition-all duration-300 shadow-[0_0_20px_rgba(37,211,102,0.1)] hover:shadow-[0_0_30px_rgba(37,211,102,0.4)] uppercase"
                >
                  <MessageSquare className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                  Join WhatsApp Comms
                </a>
              </div>
            )}
            
            {!info.showWhatsapp && (
              <div className="mt-8 pt-8 border-t border-white/10">
                <a href="/" className="text-xs font-mono text-[#626A72] hover:text-[#00D9FF] transition-colors uppercase tracking-widest">
                  Return to Command Center
                </a>
              </div>
            )}
            
          </div>
        </div>
      </MainLayout>
    </div>
  );
}
