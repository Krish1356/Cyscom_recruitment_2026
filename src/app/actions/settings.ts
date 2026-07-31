"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function getAdmins() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id }
  });

  if (user?.role !== "SUPER_ADMIN" && user?.role !== "ADMIN") {
    throw new Error("Unauthorized: Admins only");
  }

  // Fetch all admins and super admins
  return prisma.user.findMany({
    where: {
      role: { in: ["ADMIN", "SUPER_ADMIN"] }
    },
    include: {
      adminProfile: true
    },
    orderBy: { createdAt: "desc" }
  });
}

export async function updateAdminAccess(userId: string, role: Role, designation: string | null) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const currentUser = await prisma.user.findUnique({
    where: { id: session.user.id }
  });

  if (currentUser?.role !== "SUPER_ADMIN") {
    throw new Error("Unauthorized: Super Admins only");
  }

  // Update user role
  await prisma.user.update({
    where: { id: userId },
    data: { role }
  });

  // Ensure admin profile exists and update designation
  await prisma.adminUser.upsert({
    where: { userId },
    update: { designation },
    create: { userId, designation }
  });

  revalidatePath("/admin/settings");
}
