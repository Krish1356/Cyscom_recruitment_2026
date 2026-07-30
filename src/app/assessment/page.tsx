import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AssessmentClient } from "./AssessmentClient";

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

  const assessments = await prisma.assessment.findMany({
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
    // Assessment hasn't been started, go back to dashboard
    redirect("/");
  }

  return <AssessmentClient assessments={assessments} />;
}
