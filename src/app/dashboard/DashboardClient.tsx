"use client";

import { useState } from "react";
import { DepartmentType } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit2, Play, Save, X, AlertTriangle, CheckCircle2, Circle, Clock, CheckCircle } from "lucide-react";
import { updateDepartments, startAssessment } from "../actions/dashboard";
import { motion } from "framer-motion";

type ProfileWithDepts = {
  id: string;
  overallStatus: string;
  departments: { department: DepartmentType }[];
};

const STAGES = [
  { id: "APPLIED", label: "Application Received" },
  { id: "ASSESSMENT_COMPLETED", label: "Assessment Completed" },
  { id: "SHORTLISTED", label: "Shortlisted for Interview" },
  { id: "INTERVIEW_SCHEDULED", label: "Interview Scheduled" },
  { id: "INTERVIEW_COMPLETED", label: "Interview Completed" },
  { id: "SELECTED", label: "Final Selection" },
];

export function DashboardClient({ profile }: { profile: ProfileWithDepts }) {
  const [isEditing, setIsEditing] = useState(false);
  const [dept1, setDept1] = useState<DepartmentType>(profile.departments[0]?.department);
  const [dept2, setDept2] = useState<DepartmentType>(profile.departments[1]?.department);
  const [error, setError] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(false);

  const canEdit = profile.overallStatus === "APPLIED";
  const isRejected = profile.overallStatus === "REJECTED";

  const DEPARTMENTS = [
    { value: DepartmentType.TECHNICAL, label: "Technical" },
    { value: DepartmentType.WEB_DEVELOPMENT, label: "Web Development" },
    { value: DepartmentType.DESIGN, label: "Design" },
    { value: DepartmentType.SOCIAL_MEDIA, label: "Social Media" },
    { value: DepartmentType.EVENT_MANAGEMENT, label: "Event Management" }
  ];

  const handleSave = async () => {
    setError(null);
    if (dept1 === dept2) {
      setError("Please select two different departments.");
      return;
    }
    try {
      await updateDepartments(dept1, dept2);
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message || "Failed to update departments");
    }
  };

  const handleStart = async () => {
    setIsStarting(true);
    try {
      await startAssessment();
    } catch (err: any) {
      setError(err.message || "Failed to start assessment");
      setIsStarting(false);
    }
  };

  // Determine current stage index
  const currentIndex = isRejected ? -1 : STAGES.findIndex(s => s.id === profile.overallStatus) >= 0 
    ? STAGES.findIndex(s => s.id === profile.overallStatus) 
    : 0;

  return (
    <div className="space-y-8">
      {error && (
        <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-lg flex items-center gap-3 text-red-200 text-sm font-mono">
          <AlertTriangle className="w-5 h-5 text-red-400" />
          {error}
        </div>
      )}

      {/* Tracking Timeline Card */}
      <div className="p-8 rounded-2xl bg-[#161B22] border border-gray-800 shadow-xl relative overflow-hidden">
        <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-2">
          <ActivityIcon className="w-5 h-5 text-cyan-400" /> Application Status
        </h3>

        {isRejected ? (
          <div className="p-6 bg-red-900/10 border border-red-500/30 rounded-xl text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h4 className="text-xl font-bold text-red-400 mb-2">Application Update</h4>
            <p className="text-gray-400">We appreciate your interest in CYSCOM, but we will not be moving forward with your application at this time.</p>
          </div>
        ) : (
          <div className="relative">
            {/* Connecting Line */}
            <div className="absolute left-[15px] top-4 bottom-4 w-0.5 bg-gray-800" />

            <div className="space-y-8 relative">
              {STAGES.map((stage, idx) => {
                const isCompleted = idx <= currentIndex;
                const isCurrent = idx === currentIndex;
                
                return (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    key={stage.id} 
                    className="flex items-center gap-6"
                  >
                    {/* Node */}
                    <div className="relative z-10 w-8 h-8 rounded-full flex items-center justify-center bg-[#161B22]">
                      {isCompleted ? (
                        <CheckCircle className="w-8 h-8 text-cyan-400 drop-shadow-[0_0_10px_rgba(0,255,255,0.5)]" />
                      ) : (
                        <Circle className="w-8 h-8 text-gray-700" />
                      )}
                    </div>
                    
                    {/* Content */}
                    <div className={`flex-1 p-4 rounded-xl border ${isCurrent ? 'bg-cyan-500/10 border-cyan-500/30 shadow-[0_0_20px_rgba(0,255,255,0.1)]' : 'bg-[#0D1117] border-gray-800'}`}>
                      <h4 className={`font-semibold ${isCompleted ? 'text-white' : 'text-gray-500'}`}>{stage.label}</h4>
                      {isCurrent && (
                        <p className="text-sm text-cyan-400 mt-1 font-mono">Current Stage</p>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Applied Departments Card */}
      <div className="p-8 rounded-2xl bg-[#161B22] border border-gray-800 shadow-xl relative overflow-hidden">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <LayoutGridIcon className="w-5 h-5 text-purple-400" /> Preferences
          </h3>
          {canEdit && !isEditing && (
            <button 
              onClick={() => setIsEditing(true)}
              className="text-sm text-gray-400 hover:text-white flex items-center gap-1 transition-colors"
            >
              <Edit2 className="w-4 h-4" /> Edit
            </button>
          )}
        </div>

        {isEditing ? (
          <div className="space-y-4 bg-[#0D1117] p-6 rounded-xl border border-gray-800">
            <div className="space-y-2">
              <label className="text-sm text-gray-400">First Preference</label>
              <Select value={dept1} onValueChange={(v) => setDept1(v as DepartmentType)}>
                <SelectTrigger className="bg-[#161B22] border-gray-700 text-white">
                  <SelectValue placeholder="Select Department" />
                </SelectTrigger>
                <SelectContent>
                  {DEPARTMENTS.map(d => <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Second Preference</label>
              <Select value={dept2} onValueChange={(v) => setDept2(v as DepartmentType)}>
                <SelectTrigger className="bg-[#161B22] border-gray-700 text-white">
                  <SelectValue placeholder="Select Department" />
                </SelectTrigger>
                <SelectContent>
                  {DEPARTMENTS.map(d => <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-3 pt-2">
              <Button onClick={handleSave} className="bg-cyan-600 hover:bg-cyan-500 text-white flex-1">
                <Save className="w-4 h-4 mr-2" /> Save Changes
              </Button>
              <Button onClick={() => { setIsEditing(false); setError(null); }} variant="outline" className="border-gray-700 hover:bg-gray-800 flex-1">
                <X className="w-4 h-4 mr-2" /> Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[#0D1117] border border-gray-800 relative overflow-hidden group hover:border-purple-500/30 transition-colors">
              <div className="text-xs text-gray-500 mb-1 uppercase tracking-wider font-semibold">Priority 1</div>
              <div className="text-lg font-bold text-white">
                {DEPARTMENTS.find(d => d.value === profile.departments[0]?.department)?.label}
              </div>
            </div>
            {profile.departments[1] && (
              <div className="p-4 rounded-xl bg-[#0D1117] border border-gray-800 relative overflow-hidden group hover:border-purple-500/30 transition-colors">
                <div className="text-xs text-gray-500 mb-1 uppercase tracking-wider font-semibold">Priority 2</div>
                <div className="text-lg font-bold text-white">
                  {DEPARTMENTS.find(d => d.value === profile.departments[1]?.department)?.label}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Assessment Card */}
      {profile.overallStatus === "APPLIED" && (
        <div className="p-8 rounded-2xl bg-gradient-to-br from-cyan-900/20 to-blue-900/20 border border-cyan-500/30 shadow-[0_0_30px_rgba(0,255,255,0.05)] relative overflow-hidden text-center">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 to-blue-500" />
          <h3 className="text-2xl font-bold text-white mb-2">Online Assessment</h3>
          <p className="text-gray-400 mb-6 max-w-md mx-auto">
            Your application is complete! The next step is a 60-minute technical assessment covering aptitude and domain-specific questions.
          </p>
          <Button 
            onClick={handleStart} 
            disabled={isStarting}
            className="bg-cyan-500 hover:bg-cyan-400 text-[#0D1117] font-bold px-8 py-6 rounded-xl text-lg shadow-[0_0_20px_rgba(0,255,255,0.3)] hover:scale-105 transition-all"
          >
            {isStarting ? "Starting..." : <><Play className="w-5 h-5 mr-2" /> Start Assessment</>}
          </Button>
        </div>
      )}
    </div>
  );
}

// Simple icons
function ActivityIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  )
}

function LayoutGridIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="7" height="7" x="3" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="14" rx="1" />
      <rect width="7" height="7" x="3" y="14" rx="1" />
    </svg>
  )
}
