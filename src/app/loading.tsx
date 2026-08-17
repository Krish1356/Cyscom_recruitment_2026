export default function Loading() {
  return (
    <div className="fixed inset-0 z-[200] bg-[#030507] flex flex-col items-center justify-center font-mono">
      <div className="w-16 h-16 rounded-md bg-[#050608] border border-white/10 flex items-center justify-center mb-6 shadow-sm overflow-hidden animate-pulse">
        <img src="/logo.png" alt="CYSCOM" width={40} height={40} className="object-contain opacity-50" />
      </div>
      <div className="text-[10px] text-[#A4A8AE] uppercase tracking-widest animate-pulse">
        Establishing Secure Connection...
      </div>
    </div>
  );
}
