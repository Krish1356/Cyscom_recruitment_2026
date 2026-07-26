"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function submitAssessment() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const profile = await prisma.applicantProfile.findUnique({
    where: { userId: session.user.id }
  });

  if (!profile) throw new Error("Profile not found");

  // Mark all IN_PROGRESS assessments as COMPLETED
  await prisma.assessment.updateMany({
    where: {
      departmentSelection: { applicantId: profile.id },
      status: "IN_PROGRESS"
    },
    data: {
      status: "COMPLETED",
      completedAt: new Date(),
    }
  });

  // Update profile overallStatus
  await prisma.applicantProfile.update({
    where: { id: profile.id },
    data: { overallStatus: "ASSESSMENT_COMPLETED" }
  });

  return { success: true };
}
