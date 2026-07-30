"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { PipelineStageName } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function updateApplicantStage(applicantId: string, newStage: PipelineStageName) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { adminProfile: true }
  });

  if (!user || (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN")) {
    throw new Error("Unauthorized: Admins only");
  }

  const applicant = await prisma.applicantProfile.findUnique({
    where: { id: applicantId }
  });

  if (!applicant) throw new Error("Applicant not found");

  // If Admin doesn't have an adminProfile (e.g. bootstrapped), create one temporarily
  let adminProfileId = user.adminProfile?.id;
  if (!adminProfileId) {
    const newAdmin = await prisma.adminUser.create({
      data: { userId: user.id }
    });
    adminProfileId = newAdmin.id;
  }

  await prisma.$transaction(async (tx) => {
    // Update stage
    await tx.applicantProfile.update({
      where: { id: applicantId },
      data: { overallStatus: newStage }
    });

    // Record in history
    await tx.stageHistory.create({
      data: {
        applicantId,
        previousStage: applicant.overallStatus,
        newStage,
        adminId: adminProfileId!
      }
    });
  });

  revalidatePath("/admin");
}

export async function getApplicantQuickReview(applicantId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id }
  });

  if (!user || (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN")) {
    throw new Error("Unauthorized: Admins only");
  }

  const applicant = await prisma.applicantProfile.findUnique({
    where: { id: applicantId },
    include: {
      user: true,
      departments: {
        include: {
          assessments: {
            include: {
              questions: {
                include: { answer: true, mcqAnswer: true, questionBank: true }
              }
            }
          }
        }
      },
      assessmentSession: {
        include: { events: true }
      }
    }
  });

  if (!applicant) throw new Error("Applicant not found");

  return applicant;
}

export async function shortlistCandidate(applicantId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { adminProfile: true }
  });

  if (!user || (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN")) {
    throw new Error("Unauthorized: Admins only");
  }

  const applicant = await prisma.applicantProfile.findUnique({
    where: { id: applicantId }
  });

  if (!applicant) throw new Error("Applicant not found");

  let adminProfileId = user.adminProfile?.id;
  if (!adminProfileId) {
    const newAdmin = await prisma.adminUser.create({
      data: { userId: user.id }
    });
    adminProfileId = newAdmin.id;
  }

  await prisma.$transaction(async (tx) => {
    await tx.applicantProfile.update({
      where: { id: applicantId },
      data: { overallStatus: PipelineStageName.SHORTLISTED }
    });

    await tx.stageHistory.create({
      data: {
        applicantId,
        previousStage: applicant.overallStatus,
        newStage: PipelineStageName.SHORTLISTED,
        adminId: adminProfileId!
      }
    });
  });

  revalidatePath("/admin");
}
