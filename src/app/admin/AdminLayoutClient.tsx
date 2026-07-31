"use client";

import { useState } from "react";
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  CheckCircle, 
  Building2, 
  BarChart, 
  CalendarDays, 
  Settings,
  Search,
  ChevronLeft,
  ChevronRight,
  LogOut,
  User as UserIcon,
  Kanban
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CyberMatrixBackground } from "@/components/CyberMatrixBackground";

const ALL_NAV_ITEMS = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Recruitment", href: "/admin/recruitment", icon: Users },
  { name: "Pipeline Kanban", href: "/admin/kanban", icon: Kanban },
  { name: "Interview Slots", href: "/admin/interviews", icon: Calendar, superAdminOnly: true },
  { name: "Shortlisted", href: "/admin/shortlisted", icon: CheckCircle },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayoutClient({
  children,
  user,
}: {
  children: React.ReactNode;
  user: { name: string; role: string; designation: string };
}) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  
  const navItems = ALL_NAV_ITEMS.filter(item => user.role === "SUPER_ADMIN" || !item.superAdminOnly);

  return (
    <div className="relative min-h-screen bg-[#030710] text-cyan-500 font-mono selection:bg-cyan-500/30">
      <CyberMatrixBackground />
      
      <div className="relative z-10 flex h-screen overflow-hidden">
        
        {/* Sidebar */}
        <motion.aside 
          initial={false}
          animate={{ width: collapsed ? 80 : 280 }}
          className="border-r border-cyan-500/30 bg-[#060A13]/90 backdrop-blur-md flex flex-col relative z-20 shadow-[0_0_15px_rgba(0,255,255,0.05)]"
        >
          {/* Logo Area */}
          <div className="h-20 flex items-center px-6 border-b border-cyan-500/30">
            <div className={`w-8 h-8 rounded-none border border-cyan-400 bg-black flex items-center justify-center shadow-[0_0_10px_rgba(0,255,255,0.2)] flex-shrink-0 overflow-hidden`}>
              <img src="/logo.png" alt="CYSCOM Logo" className="w-full h-full object-contain p-0.5" />
            </div>
            <AnimatePresence>
              {!collapsed && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="ml-3 overflow-hidden whitespace-nowrap"
                >
                  <h1 className="font-bold text-lg tracking-widest text-cyan-400">
                    CABINET
                  </h1>
                  <p className="text-[10px] text-cyan-600 uppercase tracking-widest">CYSCOM VIT</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto py-6 px-3 flex flex-col gap-1 custom-scrollbar">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/admin");
              return (
                <Link 
                  key={item.href} 
                  href={item.href}
                  className={`group relative flex items-center px-3 py-3 transition-all duration-300 ${
                    isActive 
                      ? "bg-cyan-950/40 text-cyan-400 shadow-[inset_1px_0_0_0_rgba(0,255,255,0.8)] border border-cyan-500/20" 
                      : "text-cyan-700 hover:text-cyan-400 hover:bg-cyan-900/10 border border-transparent"
                  }`}
                  title={collapsed ? item.name : undefined}
                >
                  {isActive && (
                    <motion.div 
                      layoutId="sidebar-active"
                      className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-400 shadow-[0_0_10px_rgba(0,255,255,0.5)]"
                    />
                  )}
                  <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-cyan-400' : 'group-hover:text-cyan-300 transition-colors'}`} />
                  
                  <AnimatePresence>
                    {!collapsed && (
                      <motion.span 
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        className="ml-3 font-medium text-[11px] tracking-widest uppercase whitespace-nowrap"
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-cyan-500/30 flex flex-col gap-2">
            <Link href="/dashboard" className="flex items-center px-3 py-3 text-red-500 hover:bg-red-950/30 border border-transparent hover:border-red-500/30 transition-colors group">
              <LogOut className="w-5 h-5 flex-shrink-0 group-hover:-translate-x-1 transition-transform" />
              {!collapsed && <span className="ml-3 text-[11px] font-bold tracking-widest uppercase whitespace-nowrap">EXIT CABINET</span>}
            </Link>
          </div>

          {/* Collapse Toggle */}
          <button 
            onClick={() => setCollapsed(!collapsed)}
            className="absolute -right-4 top-24 w-8 h-8 bg-[#060A13] border border-cyan-500/50 flex items-center justify-center text-cyan-400 hover:bg-cyan-950 shadow-[0_0_10px_rgba(0,255,255,0.2)] transition-all z-30"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </motion.aside>
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          
          {/* Top Navbar */}
          <header className="h-20 flex items-center justify-between px-8 bg-[#060A13]/50 backdrop-blur-md border-b border-cyan-500/30 sticky top-0 z-10">
            {/* Search Bar */}
            <div className="relative w-96 group hidden md:block">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="w-4 h-4 text-cyan-600" />
              </div>
              <input 
                type="text" 
                placeholder="Query Database..." 
                className="w-full bg-[#060A13] border border-cyan-500/30 rounded-none py-2 pl-10 pr-4 text-[11px] uppercase tracking-widest text-cyan-400 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_10px_rgba(0,255,255,0.2)] transition-all"
              />
            </div>

            {/* Right side icons */}
            <div className="flex items-center gap-6 ml-auto">
              
              <div className="flex items-center gap-3 border-l border-cyan-500/30 pl-6">
                <div className="text-right hidden sm:block">
                  <h2 className="text-[10px] text-cyan-600 tracking-widest uppercase">SYS.ADMIN</h2>
                  <p className="text-sm font-bold tracking-widest text-cyan-400 uppercase">{user.name}</p>
                </div>
                <div className="w-10 h-10 border border-cyan-500/50 bg-cyan-950/50 flex items-center justify-center text-cyan-400 shadow-[0_0_10px_rgba(0,255,255,0.1)] cursor-pointer hover:border-cyan-400 transition-colors">
                  <UserIcon className="w-5 h-5" />
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-auto bg-[#030710] relative p-8">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="h-full"
            >
              {children}
            </motion.div>
          </main>
          
        </div>
      </div>
    </div>
  );
}
