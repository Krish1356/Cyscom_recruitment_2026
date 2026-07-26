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
      // Create Assessment record
      const assessment = await tx.assessment.create({
        data: {
          departmentSelectionId: dept.id,
          status: "IN_PROGRESS",
          startedAt: new Date(),
          timeRemaining: 300, // 5 minutes per department
        }
      });

      // Find all questions in the question bank for this department
      // To prevent loading thousands of questions, in a real app, you'd pick random N questions.
      // For this implementation, we will just fetch all questions associated with this department.
      const bankQuestions = await tx.questionBank.findMany({
        where: { department: dept.department }
      });

      // Map them to Assessment Questions
      const questionsData = bankQuestions.map(bq => ({
        assessmentId: assessment.id,
        questionBankId: bq.id,
      }));

      if (questionsData.length > 0) {
        await tx.question.createMany({
          data: questionsData
        });
      }
    }
  });

  redirect("/assessment");
}
