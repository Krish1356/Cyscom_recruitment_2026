import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AssessmentClient } from "./AssessmentClient";
import { generateAssessments } from "../actions/generateAssessments";

export default async function AssessmentPage() {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect("/login");
  }

  const profile = await prisma.applicantProfile.findUnique({
    where: { userId: session.user.id }
  });

  if (!profile) {
    redirect("/register");
  }

  let assessments = await prisma.assessment.findMany({
    where: {
      departmentSelection: {
        applicantId: profile.id
      }
    },
    include: {
      departmentSelection: true,
      questions: {
        include: {
          questionBank: true
        }
      }
    }
  });

  if (assessments.length === 0) {
    // Generate assessments lazy-load
    assessments = await generateAssessments(profile.id);
  }

  return <AssessmentClient assessments={assessments} />;
}
