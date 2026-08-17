import { prisma } from "@/lib/prisma";
import { DepartmentType } from "@prisma/client";

export async function generateAssessments(applicantId: string) {
  const selections = await prisma.departmentSelection.findMany({
    where: { applicantId }
  });

  if (selections.length === 0) return [];

  for (const selection of selections) {
    // 1. Create General (Untimed) Assessment
    const existingGeneral = await prisma.assessment.findFirst({
      where: { departmentSelectionId: selection.id, status: { not: "PENDING" } }
    });
    
    if (!existingGeneral) {
      const generalAssessment = await prisma.assessment.create({
        data: {
          departmentSelectionId: selection.id,
          status: "IN_PROGRESS", // Immediately unlocked
          timeRemaining: null // Untimed
        }
      });

      const genQuestions = await prisma.questionBank.findMany({
        where: { department: selection.department, type: "GENERAL" }
      });
      
      const profileLinkQuestion = genQuestions.find(q => q.title === "Profile Links");
      const otherQuestions = genQuestions.filter(q => q.title !== "Profile Links");
      
      // Randomize and select up to 5 remaining questions
      const selectedGen = otherQuestions.sort(() => 0.5 - Math.random()).slice(0, 5);
      
      if (profileLinkQuestion) {
        await prisma.question.create({ data: { assessmentId: generalAssessment.id, questionBankId: profileLinkQuestion.id } });
      }

      for (const q of selectedGen) {
        await prisma.question.create({ data: { assessmentId: generalAssessment.id, questionBankId: q.id } });
      }
    }

    // 2. Create Timed Assessment (Only for WEB_DEVELOPMENT or TECHNICAL)
    if (selection.department === "WEB_DEVELOPMENT" || selection.department === "TECHNICAL") {
      const existingTimed = await prisma.assessment.findFirst({
        where: { departmentSelectionId: selection.id, timeRemaining: { not: null } }
      });
      
      if (!existingTimed) {
        const timeLimit = selection.department === "WEB_DEVELOPMENT" ? 30 : 90;
        
        const timedAssessment = await prisma.assessment.create({
          data: {
            departmentSelectionId: selection.id,
            status: "PENDING", // Locked until Phase 2 starts
            timeRemaining: timeLimit
          }
        });

        const timedQuestions = await prisma.questionBank.findMany({
          where: { department: selection.department, type: "TIMED" }
        });
        const selectedTimed = timedQuestions.sort(() => 0.5 - Math.random()).slice(0, 5);
        for (const q of selectedTimed) {
          await prisma.question.create({ data: { assessmentId: timedAssessment.id, questionBankId: q.id } });
        }
      }
    }
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
