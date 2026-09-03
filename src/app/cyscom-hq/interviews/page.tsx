import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { INTERVIEW_SESSIONS } from "@/lib/interview-sessions";
import { InterviewSlotsClient } from "./InterviewSlotsClient";

export const dynamic = "force-dynamic";

export default async function AdminInterviewSlotsPage() {
  const session = await auth();
  if (!session || session.user.role !== "SUPER_ADMIN") {
    redirect("/cyscom-hq");
  }

  // Fetch all registrations
  const registrations = await prisma.interviewSlotSelection.findMany({
    include: {
      applicant: {
        include: {
          user: { select: { name: true, email: true } },
          departments: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Calculate capacities
  const sessionCounts = registrations.reduce((acc, curr) => {
    acc[curr.sessionId] = (acc[curr.sessionId] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const sessionsWithCapacities = Object.values(INTERVIEW_SESSIONS).map((s) => ({
    ...s,
    registered: sessionCounts[s.id] || 0,
  }));

  // Flatten registration data for the client
  const flattenedRegistrations = registrations.map((r) => ({
    id: r.id,
    applicantId: r.applicantId,
    name: r.applicant.user.name,
    email: r.applicant.user.email,
    regNo: r.applicant.registrationNumber,
    phone: r.applicant.phoneNumber,
    pref1: r.applicant.departments[0]?.department || "NONE",
    pref2: r.applicant.departments[1]?.department || "NONE",
    sessionId: r.sessionId,
    sessionLabel: INTERVIEW_SESSIONS[r.sessionId as keyof typeof INTERVIEW_SESSIONS]?.label || r.sessionId,
    createdAt: r.createdAt.toISOString(),
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold font-orbitron tracking-wider text-[#F1F0EA]">
            INTERVIEW SLOTS
          </h1>
          <p className="text-sm text-[#A4A8AE] font-mono mt-1">
            Manage Phase 3 Interview Session allocations and capacities.
          </p>
        </div>
      </div>

      <InterviewSlotsClient
        sessions={sessionsWithCapacities}
        registrations={flattenedRegistrations}
      />
    </div>
  );
}
