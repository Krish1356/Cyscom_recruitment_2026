import { Calendar } from "lucide-react";

export default function InterviewsPage() {
  return (
    <div className="h-full flex flex-col items-center justify-center">
      <div className="bg-[#0B1014]/60 backdrop-blur-md border border-white/5 p-12 rounded-lg text-center max-w-lg shadow-[0_0_30px_rgba(103,232,249,0.05)]">
        <div className="w-20 h-20 rounded-full bg-cyan-950/30 border border-cyan-500/30 flex items-center justify-center mx-auto mb-6 text-cyan-400">
          <Calendar className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-bold font-mono tracking-widest text-cyan-50 mb-4 uppercase">Coming Soon</h1>
        <p className="text-cyan-100/60 font-mono leading-relaxed">
          The interview slot management system is currently under development and will be deployed in the next recruitment phase.
        </p>
      </div>
    </div>
  );
}
