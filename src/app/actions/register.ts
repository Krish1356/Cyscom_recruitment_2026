"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { RegistrationFormValues, registrationSchema } from "@/lib/validations/registration";
import { DepartmentType } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function submitRegistration(data: RegistrationFormValues) {
  const session = await auth();
  
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  // Validate data on the server
  const parsedData = registrationSchema.parse(data);

  // Check if profile already exists
  const existingProfile = await prisma.applicantProfile.findUnique({
    where: { userId: session.user.id }
  });

  if (existingProfile) {
    throw new Error("You have already registered.");
  }

  // Create Profile and everything in a transaction
  await prisma.$transaction(async (tx) => {
    // 1. Create Profile
    const profile = await tx.applicantProfile.create({
      data: {
        userId: session.user.id,
        registrationNumber: parsedData.registrationNumber.toUpperCase(),
        phoneNumber: parsedData.phoneNumber,
        branch: parsedData.branch,
        year: parsedData.year,
        section: parsedData.section,
        githubUrl: parsedData.githubUrl || null,
        linkedinUrl: parsedData.linkedinUrl || null,
        portfolioUrl: parsedData.portfolioUrl || null,
        previousExperience: parsedData.previousExperience || null,
        programmingExperience: parsedData.programmingExperience || null,
        overallStatus: "APPLIED",
      }
    });
    // 3. Add Departments
    await tx.departmentSelection.createMany({
      data: [
        {
          applicantId: profile.id,
          department: parsedData.department1 as DepartmentType,
          status: "PENDING"
        },
        {
          applicantId: profile.id,
          department: parsedData.department2 as DepartmentType,
          status: "PENDING"
        }
      ]
    });

    // 4. Initial Stage History
    // Since we don't know the exact Admin who triggered it (system), we will skip this or use a System user.
    // For now, let's omit StageHistory creation for the initial application, or create a System Admin user.
  });

  // Revalidate layout/dashboard data
  revalidatePath("/dashboard");
  
  // Redirect to assessment dashboard
  redirect("/dashboard");
}
