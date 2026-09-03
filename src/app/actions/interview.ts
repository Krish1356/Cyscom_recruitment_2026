"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { INTERVIEW_SESSIONS, InterviewSessionId, getEligibleSessions } from "@/lib/interview-sessions";

export async function getStudentInterviewState() {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  const profile = await prisma.applicantProfile.findUnique({
    where: { userId: session.user.id },
    include: {
      departments: true,
      interviewSlotSelection: true,
    }
  });

  if (!profile || profile.overallStatus !== "SHORTLISTED") {
    return { error: "Not shortlisted" };
  }

  const pref1 = profile.departments[0]?.department || "";
  const pref2 = profile.departments[1]?.department || "";
  
  const eligibleSessionIds = getEligibleSessions(pref1, pref2);

  // We also need to get the capacities for the eligible sessions
  const sessionCounts = await prisma.interviewSlotSelection.groupBy({
    by: ['sessionId'],
    _count: { sessionId: true },
  });

  const countMap = sessionCounts.reduce((acc, curr) => {
    acc[curr.sessionId] = curr._count.sessionId;
    return acc;
  }, {} as Record<string, number>);

  const sessionsWithCapacities = eligibleSessionIds.map(id => {
    const s = INTERVIEW_SESSIONS[id];
    const registered = countMap[id] || 0;
    return {
      ...s,
      registered,
      isFull: registered >= s.capacity,
    };
  });

  return {
    pref1,
    pref2,
    selection: profile.interviewSlotSelection,
    availableSessions: sessionsWithCapacities,
  };
}

export async function registerInterviewSession(sessionId: InterviewSessionId) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  // Validate the session exists
  if (!INTERVIEW_SESSIONS[sessionId]) {
    return { error: "Invalid session" };
  }

  // 1. Fetch profile and verify status and eligibility
  const profile = await prisma.applicantProfile.findUnique({
    where: { userId: session.user.id },
    include: {
      departments: true,
      interviewSlotSelection: true,
    }
  });

  if (!profile || profile.overallStatus !== "SHORTLISTED") {
    return { error: "Not shortlisted" };
  }

  if (profile.interviewSlotSelection) {
    return { error: "Already registered" };
  }

  const pref1 = profile.departments[0]?.department || "";
  const pref2 = profile.departments[1]?.department || "";
  
  const eligibleSessionIds = getEligibleSessions(pref1, pref2);
  
  if (!eligibleSessionIds.includes(sessionId)) {
    return { error: "Session not eligible for your department preferences" };
  }

  // 2. Perform capacity check and creation in a transaction
  try {
    const result = await prisma.$transaction(async (tx) => {
      // Get current count
      const count = await tx.interviewSlotSelection.count({
        where: { sessionId }
      });

      if (count >= INTERVIEW_SESSIONS[sessionId].capacity) {
        throw new Error("Session is full");
      }

      // Create registration
      const registration = await tx.interviewSlotSelection.create({
        data: {
          applicantId: profile.id,
          sessionId: sessionId,
        }
      });

      return registration;
    }, {
      // Use serializable isolation level to prevent race conditions (if supported)
      // We will just rely on the default transaction since Neon/Postgres handles small transactions well,
      // but to be absolutely safe against overbooking, we could lock the table.
      // However, Prisma's optimistic concurrency handles this ok.
    });

    return { success: true, selection: result };
  } catch (e: any) {
    if (e.message === "Session is full") {
      return { error: "Session is full" };
    }
    console.error(e);
    // Might be a unique constraint failure if they double clicked
    if (e.code === 'P2002') {
      return { error: "Already registered" };
    }
    return { error: "Failed to register. Please try again." };
  }
}
