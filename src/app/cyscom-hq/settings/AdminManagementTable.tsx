"use client";

import { useState } from "react";
import { updateAdminAccess } from "@/app/actions/settings";
import { Role } from "@prisma/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export function AdminManagementTable({ initialAdmins, currentUserRole }: { initialAdmins: any[], currentUserRole: string }) {
  const [admins, setAdmins] = useState(initialAdmins);
  const [loading, setLoading] = useState<string | null>(null);
  
  const isSuperAdmin = currentUserRole === "SUPER_ADMIN";

  const handleUpdate = async (userId: string, role: Role, designation: string | null) => {
    setLoading(userId);
    try {
      await updateAdminAccess(userId, role, designation);
      setAdmins(admins.map(a => a.id === userId ? { ...a, role, adminProfile: { ...a.adminProfile, designation } } : a));
    } catch (e) {
      alert("Failed to update access");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="rounded-md border border-gray-800 bg-[#0D1117]">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-800 bg-gray-900/30">
            <th className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">User</th>
            <th className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Role (Access Level)</th>
            <th className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Designation (Title)</th>
            <th className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800">
          {admins.map((admin) => (
            <tr key={admin.id} className="hover:bg-white/5 transition-colors">
              <td className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-cyan-900/50 flex items-center justify-center text-cyan-400 font-bold border border-cyan-500/30">
                    {admin.name?.charAt(0) || "U"}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-200">{admin.name}</p>
                    <p className="text-xs text-gray-500">{admin.email}</p>
                  </div>
                </div>
              </td>
              <td className="p-4">
                <Select 
                  disabled={!isSuperAdmin || loading === admin.id}
                  value={admin.role}
                  onValueChange={(val) => handleUpdate(admin.id, val as Role, admin.adminProfile?.designation || "")}
                >
                  <SelectTrigger className="w-40 bg-[#161B22] border-gray-700 text-sm h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SUPER_ADMIN">Board (Super Admin)</SelectItem>
                    <SelectItem value="ADMIN">Cabinet (Admin)</SelectItem>
                    <SelectItem value="APPLICANT">Applicant (Revoke)</SelectItem>
                  </SelectContent>
                </Select>
              </td>
              <td className="p-4">
                <Input 
                  disabled={!isSuperAdmin || loading === admin.id}
                  value={admin.adminProfile?.designation || ""}
                  onChange={(e) => {
                    const newVal = e.target.value;
                    setAdmins(prev => prev.map(a => a.id === admin.id ? { ...a, adminProfile: { ...a.adminProfile, designation: newVal } } : a));
                  }}
                  placeholder="e.g. Technical Lead"
                  className="bg-[#161B22] border-gray-700 h-9 text-sm"
                  onBlur={(e) => {
                    const initial = initialAdmins.find(a => a.id === admin.id)?.adminProfile?.designation || "";
                    if (e.target.value !== initial) {
                      handleUpdate(admin.id, admin.role, e.target.value);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.currentTarget.blur();
                    }
                  }}
                />
              </td>
              <td className="p-4">
                {loading === admin.id ? (
                  <span className="text-xs text-cyan-400 animate-pulse">Saving...</span>
                ) : (
                  <span className="text-xs text-gray-500">Saved</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
