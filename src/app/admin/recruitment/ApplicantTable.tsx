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
  const [quickViewId, setQuickViewId] = useState<string | null>(null);

  const filtered = applicants.filter(app => {
    const searchStr = `${app.user.name} ${app.user.email} ${app.regNo || ""}`.toLowerCase();
    return searchStr.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="bg-[#161B22]/80 backdrop-blur-xl border border-cyan-900/30 rounded-2xl overflow-hidden flex flex-col h-full shadow-[0_0_30px_rgba(0,191,255,0.03)]">
      
      {/* Toolbar */}
      <div className="p-4 border-b border-cyan-900/30 flex flex-wrap gap-4 items-center justify-between bg-[#0D1117]/50">
        <div className="relative w-full max-w-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-cyan-500/50" />
          </div>
          <input 
            type="text" 
            placeholder="Search applicants by name, email, or reg no..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#0D1117] border border-cyan-900/50 rounded-lg py-2 pl-10 pr-4 text-sm text-gray-200 focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_10px_rgba(0,191,255,0.2)] transition-all"
          />
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-[#0D1117] border border-cyan-900/50 rounded-lg text-sm text-gray-300 hover:text-cyan-300 hover:border-cyan-500/50 transition-colors">
            <Filter className="w-4 h-4" />
            Filters
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#0D1117] border border-cyan-900/50 rounded-lg text-sm text-gray-300 hover:text-cyan-300 hover:border-cyan-500/50 transition-colors">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#0D1117]/80 sticky top-0 z-10 backdrop-blur-md">
              <th className="p-4 font-semibold text-xs text-cyan-300 uppercase tracking-wider border-b border-cyan-900/30">Applicant</th>
              <th className="p-4 font-semibold text-xs text-cyan-300 uppercase tracking-wider border-b border-cyan-900/30">Departments</th>
              <th className="p-4 font-semibold text-xs text-cyan-300 uppercase tracking-wider border-b border-cyan-900/30">Status</th>
              <th className="p-4 font-semibold text-xs text-cyan-300 uppercase tracking-wider border-b border-cyan-900/30">Applied On</th>
              <th className="p-4 font-semibold text-xs text-cyan-300 uppercase tracking-wider border-b border-cyan-900/30 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cyan-900/20">
            {filtered.map(app => (
              <tr key={app.id} className="hover:bg-cyan-950/20 transition-colors group">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-900 to-blue-900 flex items-center justify-center font-bold text-cyan-100 shadow-inner">
                      {app.user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-200 group-hover:text-cyan-300 transition-colors">{app.user.name}</p>
                      <p className="text-xs text-gray-500">{app.regNo || app.user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex flex-wrap gap-2">
                    {app.departments.map((d: any) => (
                      <span key={d.id} className="px-2 py-1 bg-[#0D1117] border border-cyan-800/50 rounded text-xs text-cyan-200/70">
                        {d.department}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="p-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border
                    ${app.overallStatus === 'SHORTLISTED' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 
                      app.overallStatus === 'REJECTED' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 
                      'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
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
                <td className="p-4 text-sm text-gray-400">
                  {format(new Date(app.createdAt), "MMM d, yyyy")}
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => setQuickViewId(app.id)}
                      className="p-2 bg-blue-900/30 text-blue-400 rounded-lg hover:bg-blue-600/30 hover:text-blue-300 transition-colors"
                      title="Quick Review"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <a 
                      href={`/admin/review/${app.id}`}
                      className="p-2 bg-cyan-900/30 text-cyan-400 rounded-lg hover:bg-cyan-600/30 hover:text-cyan-300 transition-colors"
                      title="Full Review"
                    >
                      <CalendarIcon className="w-4 h-4" />
                    </a>
                    <button className="p-2 text-gray-500 hover:text-gray-300 transition-colors">
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
