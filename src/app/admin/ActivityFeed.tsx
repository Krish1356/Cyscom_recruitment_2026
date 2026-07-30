import { Activity, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export function ActivityFeed({ activities }: { activities: any[] }) {
  return (
    <div className="bg-[#060A13]/80 backdrop-blur-md border border-cyan-500/30 rounded-none flex flex-col h-[500px] cyber-bracket">
      <div className="p-5 border-b border-cyan-500/30 flex items-center gap-2">
        <Activity className="w-5 h-5 text-cyan-400" />
        <h3 className="font-bold tracking-widest text-[10px] uppercase text-cyan-400">ACTIVITY LOG</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
        {activities.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-cyan-600/50">
            <Clock className="w-8 h-8 mb-2 opacity-50" />
            <p className="text-[10px] uppercase tracking-widest">NO LOGS DETECTED</p>
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
                <div className="w-8 h-8 rounded-none bg-[#030710] border-2 border-cyan-500/50 flex items-center justify-center flex-shrink-0 z-10 group-hover:border-cyan-400 transition-colors shadow-[0_0_10px_rgba(0,255,255,0.2)]">
                  <span className="w-2 h-2 bg-cyan-400" />
                </div>
                
                {/* Content */}
                <div className="flex-1 pb-1">
                  <p className="text-[11px] text-cyan-600 uppercase tracking-widest font-mono">
                    <span className="font-bold text-cyan-400">{activity.admin.user.name}</span> EXEC_MOVE <span className="font-bold text-cyan-300">{activity.applicant.user.name}</span>
                  </p>
                  <p className="text-[10px] text-cyan-500/70 mt-0.5 font-mono">
                    [{activity.previousStage}] <span className="text-cyan-400 font-bold mx-1">&gt;</span> [{activity.newStage}]
                  </p>
                  <p className="text-[9px] tracking-widest uppercase text-cyan-600 mt-1 flex items-center gap-1 font-mono">
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
