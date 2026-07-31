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
      const escape = (str: string) => `"${String(str || "").replace(/"/g, '""')}"`;
      
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
    <div className="bg-[#060A13]/80 backdrop-blur-xl border border-cyan-500/30 rounded-none overflow-hidden flex flex-col h-full shadow-[0_0_15px_rgba(0,255,255,0.05)] cyber-bracket font-mono">
      
      {/* Toolbar */}
      <div className="p-4 border-b border-cyan-500/30 flex flex-wrap gap-4 items-center justify-between bg-[#030710]/50">
        <div className="flex flex-1 gap-4 items-center flex-wrap">
          <div className="relative w-full max-w-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-cyan-500/50" />
            </div>
            <input 
              type="text" 
              placeholder="QUERY APPLICANTS..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#030710] border border-cyan-500/50 rounded-none py-2 pl-10 pr-4 text-[10px] uppercase tracking-widest text-cyan-400 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_10px_rgba(0,255,255,0.2)] transition-all placeholder:text-cyan-800"
            />
          </div>
          
          <select
            value={pref1Filter}
            onChange={(e) => setPref1Filter(e.target.value)}
            className="bg-[#030710] border border-cyan-500/50 text-[10px] uppercase tracking-widest text-cyan-400 py-2 px-3 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_10px_rgba(0,255,255,0.2)]"
          >
            <option value="ALL">PREF 1: ALL</option>
            <option value="WEB_DEVELOPMENT">WEB DEV</option>
            <option value="TECHNICAL">TECHNICAL</option>
            <option value="SOCIAL_MEDIA">SOCIAL MEDIA</option>
            <option value="EVENT_MANAGEMENT">EVENT MGMT</option>
            <option value="DESIGN">DESIGN</option>
          </select>

          <select
            value={pref2Filter}
            onChange={(e) => setPref2Filter(e.target.value)}
            className="bg-[#030710] border border-cyan-500/50 text-[10px] uppercase tracking-widest text-cyan-400 py-2 px-3 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_10px_rgba(0,255,255,0.2)]"
          >
            <option value="ALL">PREF 2: ALL</option>
            <option value="NONE">PREF 2: NONE</option>
            <option value="WEB_DEVELOPMENT">WEB DEV</option>
            <option value="TECHNICAL">TECHNICAL</option>
            <option value="SOCIAL_MEDIA">SOCIAL MEDIA</option>
            <option value="EVENT_MANAGEMENT">EVENT MGMT</option>
            <option value="DESIGN">DESIGN</option>
          </select>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-[#030710] border border-cyan-500/50 rounded-none text-[10px] uppercase tracking-widest text-cyan-500 hover:text-cyan-300 hover:border-cyan-400 hover:shadow-[0_0_10px_rgba(0,255,255,0.2)] transition-all">
            <Filter className="w-4 h-4" />
            FILTERS
          </button>
          <button 
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-[#030710] border border-cyan-500/50 rounded-none text-[10px] uppercase tracking-widest text-cyan-500 hover:text-cyan-300 hover:border-cyan-400 hover:shadow-[0_0_10px_rgba(0,255,255,0.2)] transition-all"
          >
            <Download className="w-4 h-4" />
            EXPORT CSV
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#060A13]/90 sticky top-0 z-10 backdrop-blur-md">
              <th className="p-4 font-bold text-[10px] text-cyan-600 uppercase tracking-widest border-b border-cyan-500/30">APPLICANT</th>
              <th className="p-4 font-bold text-[10px] text-cyan-600 uppercase tracking-widest border-b border-cyan-500/30">DEPARTMENTS</th>
              <th className="p-4 font-bold text-[10px] text-cyan-600 uppercase tracking-widest border-b border-cyan-500/30">STATUS</th>
              <th className="p-4 font-bold text-[10px] text-cyan-600 uppercase tracking-widest border-b border-cyan-500/30">APPLIED ON</th>
              <th className="p-4 font-bold text-[10px] text-cyan-600 uppercase tracking-widest border-b border-cyan-500/30 text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cyan-500/20">
            {filtered.map(app => (
              <tr key={app.id} className="hover:bg-cyan-950/20 transition-colors group">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-none border border-cyan-500/50 bg-cyan-950/30 flex items-center justify-center font-bold text-cyan-400 shadow-[inset_0_0_10px_rgba(0,255,255,0.1)]">
                      {app.user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-[12px] uppercase tracking-widest text-cyan-100 group-hover:text-cyan-300 transition-colors">{app.user.name}</p>
                      <p className="text-[10px] text-cyan-600 uppercase tracking-widest">{app.regNo || app.user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex flex-wrap gap-2">
                    {app.departments.map((d: any) => (
                      <span key={d.id} className="px-2 py-1 bg-[#030710] border border-cyan-500/50 rounded-none text-[9px] tracking-widest uppercase text-cyan-400">
                        {d.department}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="p-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-none text-[9px] uppercase tracking-widest font-bold border
                    ${app.overallStatus === 'SHORTLISTED' ? 'bg-green-950/30 text-green-400 border-green-500/50 shadow-[0_0_10px_rgba(34,197,94,0.1)]' : 
                      app.overallStatus === 'REJECTED' ? 'bg-red-950/30 text-red-400 border-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.1)]' : 
                      'bg-amber-950/30 text-amber-400 border-amber-500/50 shadow-[0_0_10px_rgba(245,158,11,0.1)]'}`}>
                    {app.overallStatus === 'SHORTLISTED' ? <CheckCircle className="w-3.5 h-3.5" /> : 
                     app.overallStatus === 'REJECTED' ? <XCircle className="w-3.5 h-3.5" /> : 
                     <Clock className="w-3.5 h-3.5" />}
                    {app.overallStatus.replace("_", " ")}
                  </span>
                  {app.stageHistory && app.stageHistory.length > 0 && (
                    <p className="text-[10px] text-gray-500 mt-1.5 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      by {app.stageHistory[0].admin.user.name?.split(' ')[0]} • {formatDistanceToNow(new Date(app.stageHistory[0].timestamp), { addSuffix: true })}
                    </p>
                  )}
                </td>
                <td className="p-4 text-[10px] text-cyan-600 uppercase tracking-widest">
                  {format(new Date(app.createdAt), "MMM d, yyyy")}
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => setQuickViewId(app.id)}
                      className="p-2 bg-blue-950/30 text-blue-400 rounded-none border border-transparent hover:border-blue-500/50 hover:shadow-[0_0_10px_rgba(59,130,246,0.2)] transition-all"
                      title="Quick Review"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <a 
                      href={`/admin/review/${app.id}`}
                      className="p-2 bg-cyan-950/30 text-cyan-400 rounded-none border border-transparent hover:border-cyan-500/50 hover:shadow-[0_0_10px_rgba(0,255,255,0.2)] transition-all"
                      title="Full Review"
                    >
                      <CalendarIcon className="w-4 h-4" />
                    </a>
                    <button className="p-2 text-cyan-600 hover:text-cyan-400 transition-colors">
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
