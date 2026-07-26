import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { RegistrationForm } from "./RegistrationForm";
import { CyberMatrixBackground } from "@/components/CyberMatrixBackground";

export default async function RegisterPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  // Check if they already have a profile
  const existingProfile = await prisma.applicantProfile.findUnique({
    where: { userId: session.user.id }
  });

  if (existingProfile) {
    // If they have a profile, they shouldn't be registering.
    redirect("/dashboard");
  }

  return (
    <main className="relative min-h-screen py-12 px-4 overflow-hidden">
      <CyberMatrixBackground />
      <div className="relative z-10 container mx-auto">
        <RegistrationForm />
      </div>
    </main>
  );
}
