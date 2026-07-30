"use server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function getUserStatus() {
  const session = await auth();
  if (!session?.user?.id) return { status: "unauthenticated" };

  const profile = await prisma.applicantProfile.findUnique({
    where: { userId: session.user.id },
    include: { departments: true }
  });

  if (!profile) return { status: "unregistered" };

  const anyAssessment = await prisma.assessment.findFirst({
    where: { departmentSelection: { applicantId: profile.id } }
  });

  const incompleteAssessment = await prisma.assessment.findFirst({
    where: { 
      departmentSelection: { applicantId: profile.id },
      status: { not: "COMPLETED" }
    }
  });

  if (anyAssessment) {
    if (!incompleteAssessment) return { status: "completed" };
    return { status: "in_progress" };
  }

  return { status: "ready" };
}
