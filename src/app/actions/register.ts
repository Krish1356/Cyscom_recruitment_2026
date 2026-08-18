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
    return { error: "Unauthorized" };
  }

  if (
    !session.user.email?.endsWith("@vitstudent.ac.in") && 
    session.user.email !== "krishpatel1352006@gmail.com" &&
    session.user.email !== "krishmpatel18@gmail.com" &&
    session.user.email !== "krishmittalpatel034@gmail.com" &&
    session.user.email !== "chitwansbagga@gmail.com" &&
    session.user.email !== "education.anayy@gmail.com" &&
    session.user.email !== "niharamariam2005@gmail.com" &&
    session.user.email !== "krish2256patel@gmail.com" &&
    session.user.email !== "chitwansingh06@gmail.com" &&
    session.user.email !== "m.akshitha537@gmail.com" &&
    session.user.email !== "shahvijval@gmail.com" &&
    session.user.email !== "aakansh15.gupta@gmail.com"
  ) {
    return { error: "Only @vitstudent.ac.in emails are allowed to register for recruitment." };
  }

  // Validate data on the server
  const parsedData = registrationSchema.parse(data);

  // Check if profile already exists
  const existingProfile = await prisma.applicantProfile.findUnique({
    where: { userId: session.user.id }
  });

  if (existingProfile) {
    return { error: "You have already registered." };
  }

  const existingReg = await prisma.applicantProfile.findUnique({
    where: { registrationNumber: parsedData.registrationNumber.toUpperCase() }
  });

  if (existingReg) {
    return { error: `Registration number ${parsedData.registrationNumber.toUpperCase()} is already in use by another account.` };
  }

  // Create Profile and everything in a transaction
  await prisma.$transaction(async (tx) => {
    // 1. Create Profile
    const profile = await tx.applicantProfile.create({
      data: {
        user: { connect: { id: session.user.id } },
        registrationNumber: parsedData.registrationNumber.toUpperCase(),
        phoneNumber: parsedData.phoneNumber,
        branch: parsedData.branch,
        year: parsedData.year,
        section: "",
        githubUrl: "",
        linkedinUrl: "",
        portfolioUrl: "",
        previousExperience: "",
        programmingExperience: "",
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
  revalidatePath("/status");

  // Redirect to status page
  redirect("/status");
}
