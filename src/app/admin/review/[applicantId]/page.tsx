import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ReviewClient } from "./ReviewClient";

export default async function ReviewPage({ params }: { params: Promise<{ applicantId: string }> }) {
  const { applicantId } = await params;

  const applicant = await prisma.applicantProfile.findUnique({
    where: { id: applicantId },
    include: {
      user: true,
      departments: {
        include: {
          scores: true,
          assessments: {
            include: {
              questions: {
                include: {
                  questionBank: true,
                  answer: true,
                  codingSubmission: true,
                }
              }
            }
          }
        }
      },
      assessmentSession: {
        include: {
          events: true
        }
      }
    }
  });

  if (!applicant) {
    redirect("/admin");
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold font-mono text-cyan-300">Assessment Review</h2>
          <p className="text-sm text-cyan-100/60 font-mono mt-1">
            Reviewing {applicant.user.name} ({applicant.registrationNumber})
          </p>
        </div>
        <a href="/admin" className="font-mono text-sm border border-cyan-500/30 px-4 py-2 rounded bg-black/50 text-cyan-400 hover:bg-cyan-900/50">
          &larr; Back to Pipeline
        </a>
      </div>
      
      <div className="flex-1 overflow-auto">
        <ReviewClient applicant={applicant} />
      </div>
    </div>
  );
}
