import { MainLayout } from "@/components/MainLayout";
import { RegistrationForm } from "./RegistrationForm";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function RegisterPage() {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect("/login");
  }

  const profile = await prisma.applicantProfile.findUnique({
    where: { userId: session.user.id }
  });

  if (profile) {
    redirect("/status");
  }

  return (
    <div className="min-h-screen bg-[#050608]">
      <MainLayout session={session}>
        <div className="pt-32 pb-24 px-6 relative z-10 flex items-center justify-center min-h-[90vh]">
          {/* Subtle grid background */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,217,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,217,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_10%,transparent_100%)] pointer-events-none" />
          
          <RegistrationForm />
        </div>
      </MainLayout>
    </div>
  );
}
