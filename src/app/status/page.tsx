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
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="none" className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  Join WhatsApp Comms
                </a>
              </div>
            )}
            
            {!info.showWhatsapp && status === "APPLIED" && (
              <div className="mt-8 pt-8 border-t border-white/10">
                <a 
                  href="/assessment" 
                  className="group inline-flex items-center justify-center px-8 py-4 bg-cyan-950/30 text-cyan-400 border border-cyan-500/30 rounded font-bold tracking-widest hover:bg-cyan-900/50 hover:text-cyan-300 transition-all duration-300 shadow-[0_0_20px_rgba(0,255,255,0.1)] hover:shadow-[0_0_30px_rgba(0,255,255,0.2)] uppercase"
                >
                  Start Assessment
                  <Terminal className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            )}
            
            {!info.showWhatsapp && status !== "APPLIED" && (
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
