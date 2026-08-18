"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import dynamic from "next/dynamic";
import { MainLayout } from "@/components/MainLayout";
import { AssessmentLaunchOverlay } from "@/components/ui/AssessmentLaunchOverlay";
import { CheckCircle2, Clock, ShieldAlert, Terminal, ArrowRight } from "lucide-react";

// Use the existing 3D Cyber Topology Background from the Homepage
const CyberTopologyCanvas = dynamic(
  () => import("@/components/canvas/CyberTopologyCanvas"),
  { ssr: false }
);

interface StatusClientProps {
  status: string;
  session: any;
}

export function StatusClient({ status, session }: StatusClientProps) {
  const router = useRouter();
  const [isLaunching, setIsLaunching] = useState(false);

  const getStatusInfo = () => {
    switch (status) {
      case "APPLIED":
        return {
          title: "REGISTRATION SECURED",
          desc: "Your dossier has been received. You can now launch the online assessment environment.",
          color: "text-[#67E8F9]",
          borderColor: "border-white/10",
          icon: Clock,
        };
      case "ASSESSMENT_COMPLETED":
        return {
          title: "ASSESSMENTS COMPLETED",
          desc: "You have successfully executed all assessment protocols. Our team is reviewing your submissions.",
          color: "text-emerald-400",
          borderColor: "border-white/10",
          icon: CheckCircle2,
          showWhatsapp: true,
        };
      case "SHORTLISTED":
        return {
          title: "SHORTLISTED FOR INTERVIEW",
          desc: "You have been cleared for Stage 3. Check your registered email for interview scheduling details.",
          color: "text-[#67E8F9]",
          borderColor: "border-white/10",
          icon: ShieldAlert,
          showWhatsapp: true,
        };
      case "SELECTED":
        return {
          title: "ACCESS GRANTED",
          desc: "Welcome to CYSCOM.",
          color: "text-amber-400",
          borderColor: "border-white/10",
          icon: Terminal,
          showWhatsapp: true,
        };
      case "REJECTED":
        return {
          title: "ACCESS DENIED",
          desc: "We are not moving forward with your application at this time. Keep honing your skills.",
          color: "text-red-400",
          borderColor: "border-white/10",
          icon: ShieldAlert,
        };
      default:
        return {
          title: "SYSTEM PROCESSING",
          desc: "Your data is currently being processed by the system.",
          color: "text-gray-400",
          borderColor: "border-white/10",
          icon: Clock,
        };
    }
  };

  const info = getStatusInfo();

  const handleStartAssessmentClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLaunching(true);
  };

  const handleLaunchComplete = () => {
    router.push("/assessment");
  };

  return (
    <div className="relative min-h-screen bg-[#050608] text-[#F1F0EA]">
      {/* Launch Overlay */}
      {isLaunching && (
        <AssessmentLaunchOverlay onComplete={handleLaunchComplete} />
      )}

      {/* Existing 3D Cyber Topology Background from Home */}
      <div className="fixed inset-0 z-[0] pointer-events-none">
        <div className="absolute inset-0 bg-[#050608]" />
        <div className="absolute inset-0">
          <CyberTopologyCanvas />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.04)_0%,rgba(5,6,8,0.8)_60%,rgba(5,6,8,1)_100%)] mix-blend-multiply" />
      </div>

      <MainLayout session={session}>
        <div className="pt-32 pb-24 px-6 min-h-screen flex items-center justify-center relative z-10">
          <div
            className="w-full max-w-xl bg-[#090D12]/90 backdrop-blur-xl border border-white/10 rounded-lg p-8 md:p-12 shadow-2xl text-center relative overflow-hidden transition-all duration-300"
          >
            <div
              className={`inline-flex items-center justify-center p-5 rounded-full bg-white/5 border border-white/10 mb-6 relative ${info.color}`}
            >
              <Image
                src="/logo.png"
                alt="CYSCOM Logo"
                width={56}
                height={56}
                className="w-14 h-14 object-contain relative z-10"
              />
            </div>

            <h1
              className={`text-2xl md:text-3xl font-mono font-bold tracking-wider uppercase mb-3 ${info.color}`}
            >
              {info.title}
            </h1>

            <p className="text-[#A4A8AE] text-sm md:text-base font-mono leading-relaxed mb-8 max-w-md mx-auto">
              {info.desc}
            </p>

            {info.showWhatsapp && (
              <div className="mt-6 pt-6 border-t border-white/10">
                <p className="text-xs font-mono text-[#A4A8AE] mb-4 uppercase tracking-wider">
                  Official Communication Channel
                </p>
                <a
                  href="https://chat.whatsapp.com/L0oAJwzieqaDSsuiKhNuh0?mode=gi_t"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center justify-center px-6 py-3.5 bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/30 rounded-md font-bold tracking-wider hover:bg-[#25D366] hover:text-black transition-colors uppercase font-mono text-xs"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-4 h-4 mr-2.5"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  Join WhatsApp Group
                </a>
              </div>
            )}

            {!info.showWhatsapp && status === "APPLIED" && (
              <div className="mt-6 pt-6 border-t border-white/10">
                <button
                  onClick={handleStartAssessmentClick}
                  disabled={isLaunching}
                  className="group inline-flex items-center justify-center px-8 py-3.5 bg-[#67E8F9] text-[#050608] font-bold rounded-md tracking-wider hover:bg-[#22D3EE] transition-colors font-mono text-sm uppercase shadow-md"
                >
                  <span className="flex items-center gap-2">
                    {isLaunching ? "INITIALIZING..." : "START ASSESSMENT"}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
              </div>
            )}

            {!info.showWhatsapp && status !== "APPLIED" && (
              <div className="mt-6 pt-6 border-t border-white/10">
                <a
                  href="/"
                  className="text-xs font-mono text-[#626A72] hover:text-[#00D9FF] transition-colors uppercase tracking-wider"
                >
                  Return to Home
                </a>
              </div>
            )}
          </div>
        </div>
      </MainLayout>
    </div>
  );
}
