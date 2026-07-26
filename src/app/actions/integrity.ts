"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function logIntegrityEvent(eventType: string, details?: string) {
  const session = await auth();
  if (!session?.user?.id) return;

  const profile = await prisma.applicantProfile.findUnique({
    where: { userId: session.user.id },
    include: { assessmentSession: true }
  });

  if (!profile || !profile.assessmentSession) return;

  await prisma.integrityEvent.create({
    data: {
      sessionId: profile.assessmentSession.id,
      eventType,
      details
    }
  });
}
