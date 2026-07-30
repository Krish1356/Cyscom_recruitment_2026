export function DashboardStats({ total, pending, shortlisted, rejected }: { total: number, pending: number, shortlisted: number, rejected: number }) {
  const stats = [
    { name: "Total Applications", value: total, color: "text-blue-400", border: "border-blue-500/30" },
    { name: "Pending Review", value: pending, color: "text-amber-400", border: "border-amber-500/30" },
    { name: "Shortlisted", value: shortlisted, color: "text-green-400", border: "border-green-500/30" },
    { name: "Rejected", value: rejected, color: "text-red-400", border: "border-red-500/30" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div key={stat.name} className={`relative overflow-hidden bg-[#060A13]/80 backdrop-blur-md rounded-none border border-cyan-900/30 hover:${stat.border} p-6 group transition-all duration-300 cyber-bracket`}>
          <div className="relative z-10">
            <p className="text-cyan-600 text-[10px] uppercase tracking-widest font-bold mb-3">{stat.name}</p>
            <h4 className={`text-4xl font-bold tracking-tight text-cyan-500 group-hover:${stat.color} transition-colors`}>{stat.value}</h4>
          </div>
        </div>
      ))}
    </div>
  );
}
