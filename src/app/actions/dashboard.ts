"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { DepartmentType } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateDepartments(dept1: DepartmentType, dept2: DepartmentType) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  if (dept1 === dept2) {
    throw new Error("Departments must be different");
  }

  const profile = await prisma.applicantProfile.findUnique({
    where: { userId: session.user.id },
    include: { departments: true }
  });

  if (!profile) throw new Error("Profile not found");

  // Check if assessment has already started, if so, block editing
  const existingAssessments = await prisma.assessment.findFirst({
    where: {
      departmentSelection: {
        applicantId: profile.id
      }
    }
  });

  if (existingAssessments || profile.overallStatus !== "APPLIED") {
    throw new Error("Cannot edit departments after assessment has started.");
  }

  // Update
  await prisma.$transaction(async (tx) => {
    // Delete old
    await tx.departmentSelection.deleteMany({
      where: { applicantId: profile.id }
    });

    // Create new
    await tx.departmentSelection.createMany({
      data: [
        { applicantId: profile.id, department: dept1, status: "PENDING" },
        { applicantId: profile.id, department: dept2, status: "PENDING" }
      ]
    });
  });

  revalidatePath("/dashboard");
}

export async function startAssessment() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const profile = await prisma.applicantProfile.findUnique({
    where: { userId: session.user.id },
    include: { departments: true }
  });

  if (!profile) throw new Error("Profile not found");

  // Verify no assessments currently exist for this user to prevent double-starts
  const existing = await prisma.assessment.findFirst({
    where: {
      departmentSelection: {
        applicantId: profile.id
      }
    }
  });

  if (existing) {
    redirect("/assessment");
  }

  // Create an AssessmentSession
  await prisma.assessmentSession.create({
    data: {
      applicantId: profile.id,
      // We will capture IP and UserAgent inside the assessment route middleware or client
    }
  });

  // Create Assessments for each department
  await prisma.$transaction(async (tx) => {
    for (const dept of profile.departments) {
      // Fetch all questions for this department
      const bankQuestions = await tx.questionBank.findMany({
        where: { department: dept.department }
      });

      const untimedQuestions = bankQuestions.filter(q => q.difficulty === 1);
      const timedQuestions = bankQuestions.filter(q => q.difficulty === 2);

      // Create UNTIMED Assessment if there are general questions
      if (untimedQuestions.length > 0) {
        const untimedAssessment = await tx.assessment.create({
          data: {
            departmentSelectionId: dept.id,
            status: "IN_PROGRESS",
            startedAt: new Date(),
            timeRemaining: null,
          }
        });
        await tx.question.createMany({
          data: untimedQuestions.map(bq => ({
            assessmentId: untimedAssessment.id,
            questionBankId: bq.id,
          }))
        });
      }

      // Create TIMED Assessment if there are technical questions
      if (timedQuestions.length > 0) {
        let timeRemaining: number | null = null;
        if (dept.department === "WEB_DEVELOPMENT") timeRemaining = 30;
        else if (dept.department === "TECHNICAL") timeRemaining = 90;

        const timedAssessment = await tx.assessment.create({
          data: {
            departmentSelectionId: dept.id,
            status: "PENDING", // PENDING so timer hasn't started yet!
            startedAt: null,
            timeRemaining: timeRemaining,
          }
        });
        await tx.question.createMany({
          data: timedQuestions.map(bq => ({
            assessmentId: timedAssessment.id,
            questionBankId: bq.id,
          }))
        });
      }
    }
  });

  redirect("/assessment");
}
