import { getAdmins } from "@/app/actions/settings";
import { AdminManagementTable } from "./AdminManagementTable";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Shield } from "lucide-react";

export default async function SettingsPage() {
  const session = await auth();
  
  // Guard the page - only ADMIN or SUPER_ADMIN can access
  // @ts-ignore
  if (!session?.user || (session.user.role !== "SUPER_ADMIN" && session.user.role !== "ADMIN")) {
    redirect("/cyscom-hq");
  }

  const admins = await getAdmins();

  return (
    <div className="flex flex-col h-full bg-[#0D1117] rounded-xl border border-gray-800 shadow-xl overflow-hidden p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
          <Shield className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-100">Role-Based Access Control</h2>
          <p className="text-sm text-gray-400">Manage Board (Super Admin) and Cabinet (Admin) privileges.</p>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto">
        {/* @ts-ignore */}
        <AdminManagementTable initialAdmins={admins} currentUserRole={session.user.role} />
      </div>
    </div>
  );
}
