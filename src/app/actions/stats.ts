"use server";

import { prisma } from "@/lib/prisma";

export async function getRegistrationCount() {
  try {
    const count = await prisma.applicantProfile.count();
    return count;
  } catch (error) {
    console.error("Error fetching registration count:", error);
    return 0;
  }
}
