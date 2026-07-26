import { Activity, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export function ActivityFeed({ activities }: { activities: any[] }) {
  return (
    <div className="bg-[#161B22]/80 backdrop-blur-md border border-cyan-900/30 rounded-2xl flex flex-col h-[500px]">
      <div className="p-5 border-b border-cyan-900/30 flex items-center gap-2">
        <Activity className="w-5 h-5 text-cyan-400" />
        <h3 className="font-semibold text-gray-200">Recent Activity Feed</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
        {activities.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-500">
            <Clock className="w-8 h-8 mb-2 opacity-50" />
            <p>No recent activity</p>
          </div>
        ) : (
          <div className="space-y-6">
            {activities.map((activity, idx) => (
              <div key={activity.id} className="relative flex gap-4 group">
                {/* Timeline line */}
                {idx !== activities.length - 1 && (
                  <div className="absolute left-[15px] top-8 bottom-[-24px] w-[2px] bg-cyan-900/30 group-hover:bg-cyan-500/30 transition-colors" />
                )}
                
                {/* Dot */}
                <div className="w-8 h-8 rounded-full bg-[#0D1117] border-2 border-cyan-500/50 flex items-center justify-center flex-shrink-0 z-10 group-hover:border-cyan-400 transition-colors shadow-[0_0_10px_rgba(0,191,255,0.2)]">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                </div>
                
                {/* Content */}
                <div className="flex-1 pb-1">
                  <p className="text-sm text-gray-300">
                    <span className="font-semibold text-cyan-300">{activity.admin.user.name}</span> moved <span className="font-medium text-gray-100">{activity.applicant.user.name}</span>
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {activity.previousStage} <span className="text-cyan-500 font-bold mx-1">→</span> {activity.newStage}
                  </p>
                  <p className="text-[10px] text-gray-500 mt-1 flex items-center gap-1">
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
