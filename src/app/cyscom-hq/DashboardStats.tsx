export function DashboardStats({ total, pending, shortlisted, rejected }: { total: number, pending: number, shortlisted: number, rejected: number }) {
  const stats = [
    { name: "Total Applications", value: total, color: "text-[#F1F0EA]", border: "border-[#67E8F9]/30" },
    { name: "Pending Review", value: pending, color: "text-[#A4A8AE]", border: "border-white/10" },
    { name: "Shortlisted", value: shortlisted, color: "text-[#67E8F9]", border: "border-[#67E8F9]/50" },
    { name: "Rejected", value: rejected, color: "text-[#626A72]", border: "border-white/5" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div key={stat.name} className={`relative overflow-hidden bg-[#0B1014] rounded-lg border border-white/5 hover:${stat.border} p-6 group transition-all duration-300`}>
          <div className="relative z-10">
            <p className="text-[#626A72] text-sm font-medium mb-3">{stat.name}</p>
            <h4 className={`text-4xl font-bold tracking-tight text-[#F1F0EA] group-hover:${stat.color} transition-colors`}>{stat.value}</h4>
          </div>
        </div>
      ))}
    </div>
  );
}
