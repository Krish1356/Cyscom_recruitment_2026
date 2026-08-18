"use server";

import { prisma } from "@/lib/prisma";

export async function getRegistrationCount() {
  try {
    const count = await prisma.applicantProfile.count({
      where: {
        createdAt: {
          // Reset baseline to 0 from this point onwards
          gte: new Date('2026-08-18T16:00:00Z'),
        }
      }
    });
    return count;
  } catch (error) {
    console.error("Error fetching registration count:", error);
    return 0;
  }
}
