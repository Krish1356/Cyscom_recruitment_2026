"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function submitAssessment(answers: Record<string, string>) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const profile = await prisma.applicantProfile.findUnique({
    where: { userId: session.user.id }
  });

  if (!profile) throw new Error("Profile not found");

  // Validate the first question belongs to an assessment owned by this applicant
  // For robustness, find all assessments currently in progress for this profile
  const activeAssessments = await prisma.assessment.findMany({
    where: {
      departmentSelection: { applicantId: profile.id },
      status: "IN_PROGRESS"
    },
    include: { questions: true }
  });

  if (activeAssessments.length === 0) {
    throw new Error("No active assessments to submit");
  }

  // Validate Timer
  for (const assessment of activeAssessments) {
    if (assessment.startedAt) {
      const deadline = new Date(assessment.startedAt).getTime() + (assessment.timeRemaining || 1800) * 1000 + 10000; // 10s grace period
      if (Date.now() > deadline) {
        // Automatically close it instead of throwing error to prevent deadlocks, 
        // but log it or reject answers
        console.warn(`Assessment ${assessment.id} submitted past deadline`);
      }
    }
  }

  // Create a fast lookup for allowed question IDs
  const allowedQuestionIds = new Set(
    activeAssessments.flatMap(a => a.questions.map(q => q.id))
  );

  // Save answers
  for (const [questionId, answer] of Object.entries(answers)) {
    if (!allowedQuestionIds.has(questionId)) {
      console.warn(`IDOR ATTEMPT: User ${profile.id} attempted to submit unowned question ${questionId}`);
      continue;
    }

    const question = await prisma.question.findUnique({
      where: { id: questionId },
      include: { questionBank: true }
    });
    if (!question) continue;

    if (question.questionBank.type === "MCQ") {
      // Find if correct
      const content = question.questionBank.content as any;
      const isCorrect = content?.answer === answer;
      await prisma.mCQAnswer.upsert({
        where: { questionId },
        update: { selectedOption: answer, isCorrect },
        create: {
          questionId,
          selectedOption: answer,
          isCorrect
        }
      });
    } else {
      await prisma.answer.upsert({
        where: { questionId },
        update: { content: answer },
        create: {
          questionId,
          content: answer
        }
      });
    }
  }

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

  // Check if there are any PENDING assessments (Phase 2 timed assessments)
  const pendingAssessments = await prisma.assessment.count({
    where: {
      departmentSelection: { applicantId: profile.id },
      status: "PENDING"
    }
  });

  // Only update overallStatus if everything is completely done
  if (pendingAssessments === 0) {
    await prisma.applicantProfile.update({
      where: { id: profile.id },
      data: { overallStatus: "ASSESSMENT_COMPLETED" }
    });
  }

  return { success: true };
}

export async function startTimedAssessments() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const profile = await prisma.applicantProfile.findUnique({
    where: { userId: session.user.id }
  });

  if (!profile) throw new Error("Profile not found");

  await prisma.assessment.updateMany({
    where: {
      departmentSelection: { applicantId: profile.id },
      status: "PENDING"
    },
    data: {
      status: "IN_PROGRESS",
      startedAt: new Date()
    }
  });
}
