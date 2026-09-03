"use client";

import { useState } from "react";
import { Download, Users, Search, Filter } from "lucide-react";

export function InterviewSlotsClient({ sessions, registrations }: { sessions: any[], registrations: any[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSession, setSelectedSession] = useState<string>("ALL");

  const filteredRegistrations = registrations.filter(r => {
    const matchesSearch = 
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      r.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.regNo.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSession = selectedSession === "ALL" || r.sessionId === selectedSession;
    
    return matchesSearch && matchesSession;
  });

  const downloadCSV = () => {
    const headers = ["Reg No", "Name", "Email", "Phone", "Preference 1", "Preference 2", "Session ID", "Session Label"];
    
    const csvContent = [
      headers.join(","),
      ...filteredRegistrations.map(r => 
        [
          `"${r.regNo}"`,
          `"${r.name}"`,
          `"${r.email}"`,
          `"${r.phone || ""}"`,
          `"${r.pref1}"`,
          `"${r.pref2}"`,
          `"${r.sessionId}"`,
          `"${r.sessionLabel}"`
        ].join(",")
      )
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `interview_slots_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 font-mono">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {sessions.map(s => {
          const isFull = s.registered >= s.capacity;
          const percentage = Math.min(100, Math.round((s.registered / s.capacity) * 100));
          
          return (
            <div key={s.id} className="bg-[#10151A] border border-white/10 rounded-sm p-4 relative overflow-hidden group hover:border-[#67E8F9]/50 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xs font-bold text-[#F1F0EA]">{s.id}</h3>
                  <p className="text-[10px] text-[#A4A8AE] mt-1">{s.date}</p>
                </div>
                <div className={`text-[10px] px-2 py-1 rounded-sm border ${
                  isFull ? "bg-red-500/10 border-red-500/20 text-red-400" : "bg-[#67E8F9]/10 border-[#67E8F9]/20 text-[#67E8F9]"
                }`}>
                  {isFull ? "FULL" : "AVAILABLE"}
                </div>
              </div>
              
              <div className="flex items-end gap-2 mb-2">
                <span className="text-2xl font-bold font-orbitron text-[#F1F0EA]">{s.registered}</span>
                <span className="text-xs text-[#626A72] mb-1">/ {s.capacity}</span>
              </div>
              
              <div className="w-full bg-[#050608] h-1.5 rounded-full overflow-hidden border border-white/5">
                <div 
                  className={`h-full ${isFull ? 'bg-red-500' : 'bg-[#67E8F9]'}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Controls & Table */}
      <div className="bg-[#10151A] border border-white/10 rounded-sm overflow-hidden">
        <div className="p-4 border-b border-white/10 flex flex-col sm:flex-row gap-4 justify-between items-center bg-[#0B1014]/50">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#626A72]" />
              <input 
                type="text" 
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#050608] border border-white/10 rounded-sm py-2 pl-9 pr-4 text-xs text-[#F1F0EA] placeholder-[#626A72] focus:outline-none focus:border-[#67E8F9]/50 transition-all"
              />
            </div>
            
            <div className="relative">
              <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#626A72]" />
              <select
                value={selectedSession}
                onChange={(e) => setSelectedSession(e.target.value)}
                className="bg-[#050608] border border-white/10 rounded-sm py-2 pl-9 pr-8 text-xs text-[#F1F0EA] appearance-none focus:outline-none focus:border-[#67E8F9]/50 transition-all cursor-pointer"
              >
                <option value="ALL">All Sessions</option>
                {sessions.map(s => (
                  <option key={s.id} value={s.id}>{s.id}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={downloadCSV}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-[#67E8F9]/10 text-[#67E8F9] border border-[#67E8F9]/30 hover:bg-[#67E8F9] hover:text-[#050608] transition-colors rounded-sm text-xs font-bold tracking-wider uppercase"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[#626A72] bg-[#050608] border-b border-white/10 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-medium">Student</th>
                <th className="px-6 py-4 font-medium">Contact</th>
                <th className="px-6 py-4 font-medium">Preferences</th>
                <th className="px-6 py-4 font-medium">Session</th>
                <th className="px-6 py-4 font-medium">Registered At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredRegistrations.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-[#626A72]">
                    <Users className="w-8 h-8 mx-auto mb-3 opacity-50" />
                    No registrations found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredRegistrations.map((r) => (
                  <tr key={r.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-[#F1F0EA] mb-1">{r.name}</div>
                      <div className="text-[#A4A8AE] text-[10px]">{r.regNo}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-[#A4A8AE]">{r.email}</div>
                      <div className="text-[#626A72] text-[10px] mt-1">{r.phone || "N/A"}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded-sm text-[10px] text-[#A4A8AE]">
                          {r.pref1}
                        </span>
                        <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded-sm text-[10px] text-[#A4A8AE]">
                          {r.pref2}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#67E8F9]/10 border border-[#67E8F9]/20 rounded-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#67E8F9]"></span>
                        <span className="text-[#67E8F9] font-bold text-[10px] tracking-wider">{r.sessionId}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[#626A72] text-[10px]">
                      {new Date(r.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
