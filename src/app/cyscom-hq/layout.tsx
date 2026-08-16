import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import AdminLayoutClient from "./AdminLayoutClient";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { adminProfile: true }
  });

  if (!user || user.role !== "SUPER_ADMIN") {
    redirect("/"); // Or show unauthorized
  }

  // Pass user details down to the client layout
  const userData = {
    name: user.name || "Admin User",
    role: user.role,
    designation: user.adminProfile?.designation || (user.role === "SUPER_ADMIN" ? "Super Admin" : "Admin")
  };

  return (
    <AdminLayoutClient user={userData}>
      {children}
    </AdminLayoutClient>
  );
}
