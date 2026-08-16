import { Activity, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export function ActivityFeed({ activities }: { activities: any[] }) {
  return (
    <div className="bg-[#0B1014] border border-white/5 rounded-lg flex flex-col h-[500px]">
      <div className="p-5 border-b border-white/5 flex items-center gap-2">
        <Activity className="w-5 h-5 text-[#67E8F9]" />
        <h3 className="font-semibold text-sm text-[#F1F0EA]">Activity Log</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
        {activities.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-[#626A72]">
            <Clock className="w-8 h-8 mb-2 opacity-50" />
            <p className="text-sm">No activity recorded</p>
          </div>
        ) : (
          <div className="space-y-6">
            {activities.map((activity, idx) => (
              <div key={activity.id} className="relative flex gap-4 group">
                {/* Timeline line */}
                {idx !== activities.length - 1 && (
                  <div className="absolute left-[15px] top-8 bottom-[-24px] w-[2px] bg-white/5 group-hover:bg-[#67E8F9]/20 transition-colors" />
                )}
                
                {/* Dot */}
                <div className="w-8 h-8 rounded-full bg-[#050608] border border-white/10 flex items-center justify-center flex-shrink-0 z-10 group-hover:border-[#67E8F9]/50 transition-colors">
                  <span className="w-2 h-2 rounded-full bg-[#67E8F9]" />
                </div>
                
                {/* Content */}
                <div className="flex-1 pb-1">
                  <p className="text-sm text-[#A4A8AE]">
                    <span className="font-bold text-[#F1F0EA]">{activity.admin.user.name}</span> moved <span className="font-bold text-[#F1F0EA]">{activity.applicant.user.name}</span>
                  </p>
                  <p className="text-xs text-[#626A72] mt-0.5">
                    {activity.previousStage} <span className="text-[#67E8F9] mx-1">&rarr;</span> {activity.newStage}
                  </p>
                  <p className="text-xs text-[#626A72] mt-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
