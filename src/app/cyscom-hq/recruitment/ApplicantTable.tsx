"use client";

import { useState } from "react";
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye, 
  Calendar as CalendarIcon,
  Download
} from "lucide-react";
import { QuickReviewModal } from "../QuickReviewModal";
import { format, formatDistanceToNow } from "date-fns";

export function ApplicantTable({ applicants }: { applicants: any[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [pref1Filter, setPref1Filter] = useState("ALL");
  const [pref2Filter, setPref2Filter] = useState("ALL");
  const [quickViewId, setQuickViewId] = useState<string | null>(null);

  const filtered = applicants.filter(app => {
    const searchStr = `${app.user.name} ${app.user.email} ${app.regNo || ""}`.toLowerCase();
    const matchesSearch = searchStr.includes(searchTerm.toLowerCase());
    
    const pref1 = app.departments[0]?.department || "NONE";
    const pref2 = app.departments[1]?.department || "NONE";

    const matchesPref1 = pref1Filter === "ALL" || pref1 === pref1Filter;
    const matchesPref2 = pref2Filter === "ALL" || pref2 === pref2Filter;

    return matchesSearch && matchesPref1 && matchesPref2;
  });

  const handleExportCSV = () => {
    if (filtered.length === 0) {
      alert("No data to export.");
      return;
    }

    const headers = [
      "Name",
      "Email",
      "Registration Number",
      "Phone",
      "Branch",
      "Year",
      "Pref 1",
      "Pref 2",
      "Status",
      "Applied On"
    ];

    const rows = filtered.map(app => {
      const escape = (str: string) => {
        let val = String(str || "");
        if (/^[=+\-@]/.test(val)) {
          val = `'${val}`;
        }
        return `"${val.replace(/"/g, '""')}"`;
      };
      
      return [
        escape(app.user.name),
        escape(app.user.email),
        escape(app.regNo),
        escape(app.phoneNumber),
        escape(app.branch),
        escape(app.year),
        escape(app.departments[0]?.department || "NONE"),
        escape(app.departments[1]?.department || "NONE"),
        escape(app.overallStatus),
        escape(new Date(app.createdAt).toLocaleString())
      ].join(",");
    });

    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `CYSCOM_Recruitment_Data_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-[#0B1014] border border-white/5 rounded-lg overflow-hidden flex flex-col h-full shadow-lg">
      
      {/* Toolbar */}
      <div className="p-4 border-b border-white/5 flex flex-wrap gap-4 items-center justify-between bg-[#050608]">
        <div className="flex flex-1 gap-4 items-center flex-wrap">
          <div className="relative w-full max-w-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-[#626A72]" />
            </div>
            <input 
              type="text" 
              placeholder="Query applicants..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#0B1014] border border-white/10 rounded-md py-2 pl-10 pr-4 text-sm text-[#F1F0EA] focus:outline-none focus:border-[#67E8F9]/50 transition-all placeholder:text-[#626A72]"
            />
          </div>
          
          <select
            value={pref1Filter}
            onChange={(e) => setPref1Filter(e.target.value)}
            className="bg-[#0B1014] border border-white/10 rounded-md text-sm text-[#A4A8AE] py-2 px-3 focus:outline-none focus:border-[#67E8F9]/50"
          >
            <option value="ALL">Pref 1: All</option>
            <option value="WEB_DEVELOPMENT">Web Dev</option>
            <option value="TECHNICAL">Technical</option>
            <option value="SOCIAL_MEDIA">Social Media</option>
            <option value="EVENT_MANAGEMENT">Event Mgmt</option>
            <option value="DESIGN">Design</option>
            <option value="OUTREACH">Outreach</option>
          </select>

          <select
            value={pref2Filter}
            onChange={(e) => setPref2Filter(e.target.value)}
            className="bg-[#0B1014] border border-white/10 rounded-md text-sm text-[#A4A8AE] py-2 px-3 focus:outline-none focus:border-[#67E8F9]/50"
          >
            <option value="ALL">Pref 2: All</option>
            <option value="NONE">Pref 2: None</option>
            <option value="WEB_DEVELOPMENT">Web Dev</option>
            <option value="TECHNICAL">Technical</option>
            <option value="SOCIAL_MEDIA">Social Media</option>
            <option value="EVENT_MANAGEMENT">Event Mgmt</option>
            <option value="DESIGN">Design</option>
            <option value="OUTREACH">Outreach</option>
          </select>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-md text-sm text-[#F1F0EA] hover:bg-white/10 transition-all">
            <Filter className="w-4 h-4" />
            Filters
          </button>
          <button 
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-md text-sm text-[#F1F0EA] hover:bg-white/10 transition-all"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#0B1014] sticky top-0 z-10">
              <th className="p-4 font-semibold text-xs text-[#626A72] border-b border-white/5">APPLICANT</th>
              <th className="p-4 font-semibold text-xs text-[#626A72] border-b border-white/5">DEPARTMENTS</th>
              <th className="p-4 font-semibold text-xs text-[#626A72] border-b border-white/5">STATUS</th>
              <th className="p-4 font-semibold text-xs text-[#626A72] border-b border-white/5">APPLIED ON</th>
              <th className="p-4 font-semibold text-xs text-[#626A72] border-b border-white/5 text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filtered.map(app => (
              <tr key={app.id} className="hover:bg-white/[0.02] transition-colors group">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center font-bold text-[#F1F0EA]">
                      {app.user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-[#F1F0EA] group-hover:text-[#67E8F9] transition-colors">{app.user.name}</p>
                      <p className="text-xs text-[#626A72]">{app.regNo || app.user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex flex-wrap gap-2">
                    {app.departments.map((d: any) => (
                      <span key={d.id} className="px-2 py-1 bg-white/5 border border-white/10 rounded-md text-xs text-[#A4A8AE]">
                        {d.department}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="p-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border
                    ${app.overallStatus === 'SHORTLISTED' ? 'bg-[#052e16] text-[#4ade80] border-[#4ade80]/20' : 
                      app.overallStatus === 'REJECTED' ? 'bg-[#450a0a] text-[#f87171] border-[#f87171]/20' : 
                      'bg-[#422006] text-[#fbbf24] border-[#fbbf24]/20'}`}>
                    {app.overallStatus === 'SHORTLISTED' ? <CheckCircle className="w-3.5 h-3.5" /> : 
                     app.overallStatus === 'REJECTED' ? <XCircle className="w-3.5 h-3.5" /> : 
                     <Clock className="w-3.5 h-3.5" />}
                    {app.overallStatus.replace("_", " ")}
                  </span>
                  {app.stageHistory && app.stageHistory.length > 0 && (
                    <p className="text-xs text-[#626A72] mt-1.5 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      by {app.stageHistory[0].admin.user.name?.split(' ')[0]} • {formatDistanceToNow(new Date(app.stageHistory[0].timestamp), { addSuffix: true })}
                    </p>
                  )}
                </td>
                <td className="p-4 text-sm text-[#626A72]">
                  {format(new Date(app.createdAt), "MMM d, yyyy")}
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => setQuickViewId(app.id)}
                      className="p-2 bg-[#0891B2]/20 text-[#67E8F9] rounded-md border border-[#67E8F9]/30 hover:bg-[#0891B2]/40 transition-all"
                      title="Quick Review"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <a 
                      href={`/cyscom-hq/review/${app.id}`}
                      className="p-2 bg-white/5 text-[#F1F0EA] rounded-md border border-white/10 hover:bg-white/10 transition-all"
                      title="Full Review"
                    >
                      <CalendarIcon className="w-4 h-4" />
                    </a>
                    <button className="p-2 text-[#626A72] hover:text-[#A4A8AE] transition-colors">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">
                  No applicants found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <QuickReviewModal 
        applicantId={quickViewId || ""} 
        isOpen={!!quickViewId} 
        onClose={() => setQuickViewId(null)} 
      />
    </div>
  );
}
