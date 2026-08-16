import { signIn } from "@/auth";
import { AlertCircle, Lock } from "lucide-react";
import Image from "next/image";
import { MainLayout } from "@/components/MainLayout";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="min-h-screen bg-[#050608]">
      <MainLayout>
        <div className="pt-32 pb-24 px-6 relative z-10 flex items-center justify-center min-h-[90vh]">
          {/* Subtle grid background */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,217,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,217,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_10%,transparent_100%)] pointer-events-none" />

          <div className="z-10 w-full max-w-md p-8 md:p-12 rounded-sm bg-[#10151A] border border-white/5 shadow-2xl relative overflow-hidden">
            
            {/* Subtle Glass gradient */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            <div className="flex flex-col items-center mb-10">
              <div className="w-16 h-16 rounded-md bg-[#050608] border border-white/10 flex items-center justify-center mb-6 shadow-sm">
                <Lock className="w-8 h-8 text-[#F1F0EA]" />
              </div>
              <h2 className="text-xs font-mono tracking-[0.2em] text-[#626A72] mb-2 uppercase">Recruitment 2026</h2>
              <h1 className="text-3xl font-bold tracking-tight text-[#F1F0EA]">AUTHENTICATION</h1>
              <p className="text-[#626A72] font-mono mt-3 text-xs text-center">
                Access restricted to authorized personnel. Use your VIT email to proceed.
              </p>
            </div>

            {error === "AccessDenied" && (
              <div className="mb-8 p-4 rounded-sm bg-red-500/10 border border-red-500/20 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <p className="text-xs font-mono text-[#A4A8AE]">
                  Access Denied. You must use a valid <strong className="text-[#F1F0EA] font-bold">@vitstudent.ac.in</strong> email address to access the recruitment portal.
                </p>
              </div>
            )}

            <form
              action={async () => {
                "use server";
                await signIn("google", { redirectTo: "/" });
              }}
              className="flex flex-col w-full"
            >
              <button
                type="submit"
                className="group relative flex items-center justify-center w-full px-4 py-4 bg-[#050608] text-[#F1F0EA] border border-white/10 rounded-sm font-bold text-xs tracking-widest hover:border-[#67E8F9] hover:text-[#67E8F9] hover:shadow-[0_0_15px_rgba(103,232,249,0.15)] transition-all uppercase"
              >
                <svg
                  className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Authenticate with Google
              </button>
            </form>
          </div>
        </div>
      </MainLayout>
    </div>
  );
}
