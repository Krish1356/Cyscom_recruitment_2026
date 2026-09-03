import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { StatusClient } from "./StatusClient";

export default async function StatusPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const profile = await prisma.applicantProfile.findUnique({
    where: { userId: session.user.id },
    include: { interviewSlotSelection: true }
  });

  if (!profile) {
    redirect("/register");
  }

  return <StatusClient status={profile.overallStatus} session={session} hasInterviewSlot={!!profile.interviewSlotSelection} selectedSlotId={profile.interviewSlotSelection?.sessionId} />;
}
