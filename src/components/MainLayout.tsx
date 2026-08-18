"use client";

import { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { signOut } from "next-auth/react";

export function MainLayout({ children, session }: { children: ReactNode, session?: any }) {
  return (
    <div className="min-h-screen flex flex-col font-sans text-[#F1F0EA] bg-transparent">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-[rgba(5,6,8,0.7)] backdrop-blur-md border-b border-white/5">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo.png" alt="CYSCOM Logo" width={40} height={40} className="w-10 h-10 object-contain" />
            <span className="text-[#F1F0EA] text-2xl font-orbitron tracking-wider font-bold">CYSCOM</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/#home" className="text-sm font-bold tracking-widest text-[#F1F0EA] hover:text-[#67E8F9] transition-colors relative group">
              HOME
              <span className="absolute -bottom-2 left-0 w-full h-[2px] bg-[#67E8F9] opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
            <Link href="/#divisions" className="text-sm font-bold tracking-widest text-[#626A72] hover:text-[#67E8F9] transition-colors relative group">
              DEPARTMENTS
              <span className="absolute -bottom-2 left-0 w-full h-[2px] bg-[#67E8F9] opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
            <Link href="/#contact" className="text-sm font-bold tracking-widest text-[#626A72] hover:text-[#67E8F9] transition-colors relative group">
              CONTACT
              <span className="absolute -bottom-2 left-0 w-full h-[2px] bg-[#67E8F9] opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {session ? (
              <div className="flex items-center gap-4">
                <span className="hidden md:inline text-xs text-[#626A72] tracking-widest uppercase font-mono">{session.user?.name}</span>
                <Link href="/status" className="text-sm font-bold tracking-widest text-[#626A72] hover:text-[#67E8F9] transition-colors relative group uppercase">
                  STATUS
                  <span className="absolute -bottom-2 left-0 w-full h-[2px] bg-[#67E8F9] opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
                <button onClick={() => signOut({ callbackUrl: "/" })} className="text-sm text-[#626A72] hover:text-[#F1F0EA] transition-colors border-b border-transparent hover:border-[#F1F0EA] uppercase tracking-widest ml-4">
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link 
                  href="/login" 
                  className="px-6 py-2 bg-[#10151A] text-[#F1F0EA] text-xs font-bold tracking-widest rounded-sm border border-white/10 hover:shadow-[0_0_15px_rgba(103,232,249,0.15)] hover:border-[#67E8F9]/50 hover:text-[#67E8F9] transition-all uppercase"
                >
                  Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-20 flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 bg-[#050608]/20 backdrop-blur-sm mt-auto relative z-10">
        <div className="container mx-auto px-6 flex flex-col items-center justify-center gap-4">
          <Image src="/logo.png" alt="CYSCOM Logo" width={32} height={32} className="w-8 h-8 object-contain" />
          <p className="text-xs font-mono text-[#626A72] tracking-widest uppercase flex items-center gap-2">
            &copy; {new Date().getFullYear()} <span className="font-orbitron tracking-wider text-[#A4A8AE] font-bold">CYSCOM</span> VIT Chennai. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
