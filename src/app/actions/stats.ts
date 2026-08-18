"use server";

import { prisma } from "@/lib/prisma";

export async function getRegistrationCount() {
  try {
    const rawCount = await prisma.applicantProfile.count({
      where: {
        createdAt: {
          // Reset baseline to 0 from this point onwards
          gte: new Date('2026-08-18T16:00:00Z'),
        }
      }
    });
    
    // Artificial 1.6x multiplier for public landing page
    const scaledCount = Math.round(rawCount * 1.6);
    return scaledCount;
  } catch (error) {
    console.error("Error fetching registration count:", error);
    return 0;
  }
}
