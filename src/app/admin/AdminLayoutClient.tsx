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
  Bell, 
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
  { name: "Departments", href: "/admin/departments", icon: Building2, superAdminOnly: true },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart, superAdminOnly: true },
  { name: "Events", href: "/admin/events", icon: CalendarDays },
  { name: "Notifications", href: "/admin/notifications", icon: Bell },
  { name: "Settings", href: "/admin/settings", icon: Settings, superAdminOnly: true },
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
    <div className="relative min-h-screen bg-[#0D1117] text-white font-sans selection:bg-cyan-500/30">
      <CyberMatrixBackground />
      
      <div className="relative z-10 flex h-screen overflow-hidden">
        
        {/* Sidebar */}
        <motion.aside 
          initial={false}
          animate={{ width: collapsed ? 80 : 280 }}
          className="border-r border-cyan-900/30 bg-[#0D1117]/80 backdrop-blur-xl flex flex-col relative z-20 shadow-[4px_0_24px_rgba(0,191,255,0.05)]"
        >
          {/* Logo Area */}
          <div className="h-20 flex items-center px-6 border-b border-cyan-900/30">
            <div className={`w-8 h-8 rounded bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-bold shadow-[0_0_15px_rgba(0,191,255,0.4)] flex-shrink-0`}>
              C
            </div>
            <AnimatePresence>
              {!collapsed && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="ml-3 overflow-hidden whitespace-nowrap"
                >
                  <h1 className="font-bold text-lg tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
                    CABINET
                  </h1>
                  <p className="text-[10px] text-cyan-200/50 uppercase tracking-widest">CYSCOM VIT Chennai</p>
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
                  className={`group relative flex items-center px-3 py-3 rounded-xl transition-all duration-300 ${
                    isActive 
                      ? "bg-cyan-950/40 text-cyan-400 shadow-[inset_0_0_0_1px_rgba(0,191,255,0.2)]" 
                      : "text-gray-400 hover:text-gray-100 hover:bg-white/5"
                  }`}
                  title={collapsed ? item.name : undefined}
                >
                  {isActive && (
                    <motion.div 
                      layoutId="sidebar-active"
                      className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-400 rounded-r-full shadow-[0_0_10px_rgba(0,191,255,0.5)]"
                    />
                  )}
                  <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-cyan-400' : 'group-hover:text-cyan-300 transition-colors'}`} />
                  
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
          <div className="p-4 border-t border-cyan-900/30 flex flex-col gap-2">
            <Link href="/dashboard" className="flex items-center px-3 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors group">
              <LogOut className="w-5 h-5 flex-shrink-0 group-hover:-translate-x-1 transition-transform" />
              {!collapsed && <span className="ml-3 text-sm font-medium whitespace-nowrap">Exit Cabinet</span>}
            </Link>
          </div>

          {/* Collapse Toggle */}
          <button 
            onClick={() => setCollapsed(!collapsed)}
            className="absolute -right-4 top-24 w-8 h-8 bg-[#0D1117] border border-cyan-900/50 rounded-full flex items-center justify-center text-cyan-400 hover:bg-cyan-950 hover:border-cyan-500/50 shadow-lg transition-all z-30"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </motion.aside>
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          
          {/* Top Navbar */}
          <header className="h-20 border-b border-cyan-900/30 bg-[#0D1117]/60 backdrop-blur-md flex items-center justify-between px-8 z-10">
            {/* Search Bar */}
            <div className="relative w-96 group hidden md:block">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="w-4 h-4 text-gray-500 group-focus-within:text-cyan-400 transition-colors" />
              </div>
              <input 
                type="text" 
                placeholder="Search applicants, roles, settings..." 
                className="w-full bg-[#161B22]/50 border border-gray-800 rounded-full py-2 pl-10 pr-4 text-sm text-gray-200 focus:outline-none focus:border-cyan-500/50 focus:bg-[#161B22] focus:shadow-[0_0_15px_rgba(0,191,255,0.1)] transition-all placeholder-gray-600"
              />
            </div>

            {/* Right side icons */}
            <div className="flex items-center gap-6 ml-auto">
              <button className="relative text-gray-400 hover:text-cyan-400 transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full shadow-[0_0_5px_rgba(239,68,68,0.8)]" />
              </button>
              
              <div className="flex items-center gap-3 border-l border-gray-800 pl-6">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-gray-200">{user.name}</p>
                  <p className="text-xs text-cyan-500">{user.designation}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-900 to-blue-900 border border-cyan-500/30 flex items-center justify-center shadow-inner cursor-pointer hover:border-cyan-400 transition-colors">
                  <UserIcon className="w-5 h-5 text-cyan-100" />
                </div>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-auto bg-[#0D1117]/40 relative p-8">
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
