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
  Kanban,
  Menu,
  X,
  LayoutGrid
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CyberMatrixBackground } from "@/components/CyberMatrixBackground";

const ALL_NAV_ITEMS = [
  { name: "Dashboard", href: "/cyscom-hq", icon: LayoutDashboard },
  { name: "Recruitment", href: "/cyscom-hq/recruitment", icon: Users },
  { name: "Pipeline Kanban", href: "/cyscom-hq/kanban", icon: Kanban },
  { name: "Interview Slots", href: "/cyscom-hq/interviews", icon: Calendar, superAdminOnly: true },
  { name: "Shortlisted", href: "/cyscom-hq/shortlisted", icon: CheckCircle },
  { name: "Settings", href: "/cyscom-hq/settings", icon: Settings },
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
    <div className="relative min-h-screen bg-[#050608] text-[#F1F0EA] selection:bg-[#67E8F9]/30">
      <CyberMatrixBackground />
      
      <div className="relative z-10 flex h-screen overflow-hidden">
        
        {/* Sidebar */}
        <motion.aside 
          initial={false}
          animate={{ width: collapsed ? 80 : 280 }}
          className={`border-r border-white/5 bg-[#0B1014]/95 backdrop-blur-md flex flex-col absolute md:relative z-40 h-full ${collapsed ? 'hidden md:flex' : 'flex'}`}
        >
          {/* Logo Area */}
          <div className="h-20 flex items-center px-6 border-b border-white/5">
            <div className={`w-8 h-8 rounded border border-[#67E8F9]/30 bg-black flex items-center justify-center shadow-[0_0_10px_rgba(103,232,249,0.1)] flex-shrink-0 overflow-hidden`}>
              <img src="/logo.png" alt="CYSCOM Logo" className="w-full h-full object-contain p-0.5" />
            </div>
            <AnimatePresence>
              {!collapsed && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="ml-3 overflow-hidden whitespace-nowrap flex-1 flex justify-between items-center"
                >
                  <div>
                    <h1 className="font-bold tracking-tight text-[#F1F0EA]">
                      CYSCOM
                    </h1>
                    <p className="text-xs text-[#626A72]">Recruitment 2026</p>
                  </div>
                  <button className="md:hidden p-2 text-gray-400" onClick={() => setCollapsed(true)}>
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto py-6 px-3 flex flex-col gap-1 custom-scrollbar">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/cyscom-hq");
              return (
                <Link 
                  key={item.href} 
                  href={item.href}
                  className={`group relative flex items-center px-3 py-3 rounded-md transition-all duration-300 ${
                    isActive 
                      ? "bg-[#0891B2]/10 text-[#67E8F9] border border-[#67E8F9]/20" 
                      : "text-[#A4A8AE] hover:text-[#F1F0EA] hover:bg-white/5 border border-transparent"
                  }`}
                  title={collapsed ? item.name : undefined}
                >
                  {isActive && (
                    <motion.div 
                      layoutId="sidebar-active"
                      className="absolute left-0 top-1 bottom-1 w-1 rounded-r bg-[#67E8F9] shadow-[0_0_10px_rgba(103,232,249,0.5)]"
                    />
                  )}
                  <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-[#67E8F9]' : 'group-hover:text-[#F1F0EA] transition-colors'}`} />
                  
                  <AnimatePresence>
                    {!collapsed && (
                      <motion.span 
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        className="ml-3 font-medium text-sm whitespace-nowrap"
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
          <div className="p-4 border-t border-white/5 flex flex-col gap-2">
            <Link href="/dashboard" className="flex items-center px-3 py-3 text-red-400 hover:bg-red-500/10 rounded-md transition-colors group">
              <LogOut className="w-5 h-5 flex-shrink-0 group-hover:-translate-x-1 transition-transform" />
              {!collapsed && <span className="ml-3 text-sm font-medium whitespace-nowrap">Exit Dashboard</span>}
            </Link>
          </div>

          {/* Collapse Toggle */}
          <button 
            onClick={() => setCollapsed(!collapsed)}
            className="absolute -right-4 top-24 w-8 h-8 rounded-full bg-[#0B1014] border border-white/10 flex items-center justify-center text-[#A4A8AE] hover:text-[#F1F0EA] hover:bg-white/5 shadow-lg transition-all z-30"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </motion.aside>
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          
          <header className="h-20 flex items-center justify-between px-4 md:px-8 bg-[#0B1014]/50 backdrop-blur-md border-b border-white/5 sticky top-0 z-10">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setCollapsed(false)}
                className="md:hidden p-2 text-[#A4A8AE] hover:text-[#F1F0EA] transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
              </button>
              {/* Search Bar */}
              <div className="relative w-full max-w-sm group hidden md:block">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="w-4 h-4 text-[#626A72]" />
                </div>
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="w-full bg-[#050608] border border-white/10 rounded-md py-2 pl-10 pr-4 text-sm text-[#F1F0EA] placeholder-[#626A72] focus:outline-none focus:border-[#67E8F9]/50 focus:ring-1 focus:ring-[#67E8F9]/50 transition-all"
                />
              </div>
            </div>

            {/* Right side icons */}
            <div className="flex items-center gap-6 ml-auto">
              
              <div className="flex items-center gap-3 border-l border-white/5 pl-6">
                <div className="text-right hidden sm:block">
                  <h2 className="text-xs text-[#626A72] font-medium">{user.role.replace("_", " ")}</h2>
                  <p className="text-sm font-bold text-[#F1F0EA]">{user.name}</p>
                </div>
                <div className="w-10 h-10 rounded-full border border-white/10 bg-[#0B1014] flex items-center justify-center text-[#A4A8AE] cursor-pointer hover:border-white/20 hover:text-[#F1F0EA] transition-colors">
                  <UserIcon className="w-5 h-5" />
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-auto bg-[#050608] relative p-8">
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
