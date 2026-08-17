import { prisma } from "@/lib/prisma";
import { DepartmentType } from "@prisma/client";

export async function generateAssessments(applicantId: string) {
  const selections = await prisma.departmentSelection.findMany({
    where: { applicantId }
  });

  if (selections.length === 0) return [];

  const createdAssessments = [];

  for (const selection of selections) {
    // Check if assessment already exists
    const existing = await prisma.assessment.findFirst({
      where: { departmentSelectionId: selection.id }
    });
    if (existing) continue;

    const assessment = await prisma.assessment.create({
      data: {
        departmentSelectionId: selection.id,
        status: "PENDING",
        timeRemaining: 1800 // 30 minutes
      }
    });

    // Assign questions
    const qb = await prisma.questionBank.findMany({
      where: { department: selection.department }
    });

    // Randomize and select 5 questions (or all if less)
    const selected = qb.sort(() => 0.5 - Math.random()).slice(0, 5);

    for (const q of selected) {
      await prisma.question.create({
        data: {
          assessmentId: assessment.id,
          questionBankId: q.id
        }
      });
    }
    
    // Create one Technical CTF question as well if it's not a technical department?
    // According to requirements, there should be a CTF. If there's a CTF department in QuestionBank, we can pull from it.

    createdAssessments.push(assessment);
  }

  // Fetch complete assessment data to return
  return prisma.assessment.findMany({
    where: { departmentSelection: { applicantId } },
    include: {
      departmentSelection: true,
      questions: { include: { questionBank: true } }
    }
  });
}
